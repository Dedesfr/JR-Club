<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Find all teams with duplicate names
        $duplicateNames = DB::table('teams')
            ->select('name')
            ->groupBy('name')
            ->havingRaw('COUNT(*) > 1')
            ->pluck('name');

        foreach ($duplicateNames as $name) {
            $teams = DB::table('teams')
                ->where('name', $name)
                ->orderBy('id')
                ->get(['id']);

            $canonicalId = $teams->first()->id;
            $duplicateIds = $teams->skip(1)->pluck('id')->all();

            foreach ($duplicateIds as $duplicateId) {
                // Merge team_sports: copy sport associations not already on canonical
                $existingSportIds = DB::table('team_sports')
                    ->where('team_id', $canonicalId)
                    ->pluck('sport_id')
                    ->all();

                $sportsToMove = DB::table('team_sports')
                    ->where('team_id', $duplicateId)
                    ->whereNotIn('sport_id', $existingSportIds)
                    ->get();

                foreach ($sportsToMove as $row) {
                    DB::table('team_sports')->insert([
                        'team_id'    => $canonicalId,
                        'sport_id'   => $row->sport_id,
                        'logo_path'  => $row->logo_path ?? null,
                        'created_at' => $row->created_at,
                        'updated_at' => $row->updated_at,
                    ]);
                }

                DB::table('team_sports')->where('team_id', $duplicateId)->delete();

                // Merge team_members: move members not already on canonical
                $existingMemberIds = DB::table('team_members')
                    ->where('team_id', $canonicalId)
                    ->pluck('user_id')
                    ->all();

                DB::table('team_members')
                    ->where('team_id', $duplicateId)
                    ->whereNotIn('user_id', $existingMemberIds)
                    ->update(['team_id' => $canonicalId]);

                DB::table('team_members')->where('team_id', $duplicateId)->delete();

                // Merge team_sport_members (new table, may be empty on first run)
                if (DB::getSchemaBuilder()->hasTable('team_sport_members')) {
                    $existingSquadKeys = DB::table('team_sport_members')
                        ->where('team_id', $canonicalId)
                        ->get(['sport_id', 'user_id'])
                        ->map(fn ($r) => "{$r->sport_id}:{$r->user_id}")
                        ->all();

                    $squadToMove = DB::table('team_sport_members')
                        ->where('team_id', $duplicateId)
                        ->get();

                    foreach ($squadToMove as $row) {
                        $key = "{$row->sport_id}:{$row->user_id}";
                        if (! in_array($key, $existingSquadKeys, true)) {
                            DB::table('team_sport_members')->insert([
                                'team_id'    => $canonicalId,
                                'sport_id'   => $row->sport_id,
                                'user_id'    => $row->user_id,
                                'created_at' => $row->created_at,
                                'updated_at' => $row->updated_at,
                            ]);
                        }
                    }

                    DB::table('team_sport_members')->where('team_id', $duplicateId)->delete();
                }

                // Merge league_teams: move registrations not already on canonical
                $existingLeagueIds = DB::table('league_teams')
                    ->where('team_id', $canonicalId)
                    ->pluck('league_id')
                    ->all();

                DB::table('league_teams')
                    ->where('team_id', $duplicateId)
                    ->whereNotIn('league_id', $existingLeagueIds)
                    ->update(['team_id' => $canonicalId]);

                DB::table('league_teams')->where('team_id', $duplicateId)->delete();

                // Update league_entries
                DB::table('league_entries')
                    ->where('team_id', $duplicateId)
                    ->update(['team_id' => $canonicalId]);

                // Update matches
                DB::table('matches')
                    ->where('home_team_id', $duplicateId)
                    ->update(['home_team_id' => $canonicalId]);

                DB::table('matches')
                    ->where('away_team_id', $duplicateId)
                    ->update(['away_team_id' => $canonicalId]);

                // Delete the duplicate team row
                DB::table('teams')->where('id', $duplicateId)->delete();
            }
        }
    }

    public function down(): void
    {
        // Deduplication is irreversible — original duplicate rows are gone.
    }
};
