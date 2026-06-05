<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('team_sport_members', function (Blueprint $table) {
            $table->id();
            $table->foreignId('team_id')->constrained()->cascadeOnDelete();
            $table->foreignId('sport_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['team_id', 'sport_id', 'user_id']);
        });

        // Backfill squads from existing rosters before teams are deduplicated by name.
        // At this point every team still maps to exactly one sport (just migrated from
        // teams.sport_id), so each team's roster is recorded as that sport's squad.
        // The later deduplicate-by-name migration then consolidates these squads onto
        // the surviving team, preserving which members played which sport.
        $rows = DB::table('team_sports')
            ->join('team_members', 'team_members.team_id', '=', 'team_sports.team_id')
            ->select('team_sports.team_id', 'team_sports.sport_id', 'team_members.user_id')
            ->get()
            ->map(fn ($row) => [
                'team_id' => $row->team_id,
                'sport_id' => $row->sport_id,
                'user_id' => $row->user_id,
                'created_at' => now(),
                'updated_at' => now(),
            ])
            ->all();

        foreach (array_chunk($rows, 500) as $chunk) {
            DB::table('team_sport_members')->insertOrIgnore($chunk);
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('team_sport_members');
    }
};
