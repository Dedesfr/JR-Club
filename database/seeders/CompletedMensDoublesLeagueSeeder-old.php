<?php

namespace Database\Seeders;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\User;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class CompletedMensDoublesLeagueSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()
            ->where('role', 'admin')
            ->firstOrCreate(
                ['email' => 'admin@jasaraharja.co.id'],
                [
                    'name' => 'JR Club Admin',
                    'password' => 'password',
                    'role' => 'admin',
                    'gender' => 'male',
                ],
            );

        $badminton = Sport::query()->firstOrCreate(
            ['name' => 'Badminton'],
            [
                'icon' => 'sports_tennis',
                'max_players_per_team' => 2,
                'description' => 'Singles and doubles court sessions.',
            ],
        );

        $league = League::query()->updateOrCreate(
            ['name' => 'JR Men Doubles Finals Seed'],
            [
                'sport_id' => $badminton->id,
                'category' => 'MD',
                'entry_type' => 'double',
                'description' => 'Completed ganda putra league with group stage, upper bracket, and lower bracket results.',
                'start_date' => now()->subWeeks(4)->toDateString(),
                'end_date' => now()->toDateString(),
                'status' => 'upcoming',
                'stage' => 'setup',
                'participant_total' => 16,
                'sets_to_win' => 2,
                'points_per_set' => 15,
                'advance_upper_count' => 4,
                'advance_lower_count' => 4,
                'created_by' => $admin->id,
                'upper_champion_entry_id' => null,
                'lower_champion_entry_id' => null,
            ],
        );

        $league->matches()->delete();
        $league->groups()->delete();
        $league->entries()->delete();
        $league->update([
            'status' => 'upcoming',
            'stage' => 'setup',
            'upper_champion_entry_id' => null,
            'lower_champion_entry_id' => null,
        ]);

        $players = collect(range(1, 32))->map(function (int $number) {
            $paddedNumber = str_pad((string) $number, 2, '0', STR_PAD_LEFT);

            return User::query()->updateOrCreate(
                ['email' => "completed-md-player-{$paddedNumber}@jasaraharja.co.id"],
                [
                    'name' => "Completed MD Player {$paddedNumber}",
                    'password' => 'password',
                    'role' => 'member',
                    'gender' => 'male',
                ],
            );
        });

        $players->chunk(2)->values()->each(function (Collection $pair, int $index) use ($league) {
            $seed = $index + 1;

            $league->entries()->create([
                'group_name' => 'Final Putra '.str_pad((string) $seed, 2, '0', STR_PAD_LEFT),
                'player1_id' => $pair->values()[0]->id,
                'player2_id' => $pair->values()[1]->id,
                'seed' => $seed,
            ]);
        });

        $formatService = app(LeagueFormatService::class);
        $bracketService = app(BracketService::class);

        $league = $league->fresh();
        $formatService->createGroups($league, $league->entries()->orderBy('seed')->get(), 2);
        $formatService->generateGroupMatches($league->fresh());

        $this->completeMatches($league->fresh()->matches()->where('stage', 'group')->get());
        $formatService->recomputeGroupPoints($league->fresh());

        $league->fresh()->groups()->with('groupEntries')->get()->each(function ($group) {
            $group->groupEntries()
                ->orderBy('points', 'desc')
                ->orderBy('seed')
                ->get()
                ->values()
                ->each(fn ($groupEntry, int $index) => $groupEntry->update(['manual_advance_rank' => $index + 1]));
        });

        $standings = collect($formatService->standings($league->fresh()));
        $rankedEntries = $standings
            ->flatMap(fn ($group) => $group['entries'])
            ->map(fn ($row) => $row['entry']);

        $groupCount = $league->fresh()->groups()->count();
        $groupSize = (int) ($rankedEntries->count() / max(1, $groupCount));
        $upperEntries = $rankedEntries
            ->chunk(max(1, $groupSize))
            ->flatMap(fn ($group) => $group->slice(0, 4))
            ->values();
        $lowerEntries = $rankedEntries
            ->chunk(max(1, $groupSize))
            ->flatMap(fn ($group) => $group->slice(4, 4))
            ->values();

        $bracketService->seedBrackets($league->fresh(), $upperEntries, $lowerEntries);

        $this->completeBracket($league->fresh(), 'upper', $bracketService);
        $this->completeBracket($league->fresh(), 'lower', $bracketService);
    }

    private function completeBracket(League $league, string $stage, BracketService $bracketService): void
    {
        $rounds = $league->matches()
            ->where('stage', $stage)
            ->orderBy('round')
            ->pluck('round')
            ->unique()
            ->values();

        foreach ($rounds as $round) {
            $matches = $league->matches()
                ->where('stage', $stage)
                ->where('round', $round)
                ->orderBy('id')
                ->get();

            foreach ($matches as $match) {
                $match = $match->fresh(['league', 'nextMatch']);

                if ($match->status === 'completed' || $match->home_entry_id === null || $match->away_entry_id === null) {
                    continue;
                }

                $winnerEntryId = min($match->home_entry_id, $match->away_entry_id);
                $homeWins = $winnerEntryId === $match->home_entry_id;

                $this->recordStraightSets($match, $homeWins);
                $bracketService->advanceWinner($match->fresh(['league', 'nextMatch']), $winnerEntryId);
            }
        }
    }

    private function completeMatches(Collection $matches): void
    {
        foreach ($matches as $match) {
            $homeWins = $match->home_entry_id < $match->away_entry_id;
            $this->recordStraightSets($match, $homeWins);
        }
    }

    private function recordStraightSets(GameMatch $match, bool $homeWins): void
    {
        $match->sets()->delete();

        foreach ([1, 2] as $setNumber) {
            MatchSet::query()->create([
                'match_id' => $match->id,
                'set_number' => $setNumber,
                'home_points' => $homeWins ? 15 : 11 + $setNumber,
                'away_points' => $homeWins ? 11 + $setNumber : 15,
            ]);
        }

        $match->update([
            'home_score' => $homeWins ? 2 : 0,
            'away_score' => $homeWins ? 0 : 2,
            'status' => 'completed',
        ]);
    }
}
