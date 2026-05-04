<?php

namespace Database\Seeders;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Database\Seeders\Concerns\UsesSeededRoster;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class CompletedMensDoublesLeagueSeeder extends Seeder
{
    use UsesSeededRoster;

    public function run(): void
    {
        $admin = $this->seededAdmin();

        $badminton = $this->seededSport(
            'Badminton',
            [
                'icon' => 'sports_tennis',
                'max_players_per_team' => 2,
                'description' => 'Singles and doubles court sessions.',
            ],
        );

        $category = SportCategory::firstOrCreate(
            ['sport_id' => $badminton->id, 'code' => 'MD'],
            ['name' => 'Ganda Putra', 'entry_type' => 'double', 'player_count' => 2, 'gender_rule' => 'male', 'sort_order' => 3],
        );

        $league = League::query()->updateOrCreate(
            ['name' => 'JR Men Doubles Finals Seed'],
            [
                'sport_id' => $badminton->id,
                'sport_category_id' => $category->id,
                'category' => 'MD',
                'entry_type' => 'double',
                'description' => 'Completed ganda putra tournament with group stage, upper bracket, and lower bracket results.',
                'start_date' => now()->subWeeks(8)->toDateString(),
                'end_date' => now()->toDateString(),
                'status' => 'upcoming',
                'stage' => 'setup',
                'participant_total' => 16,
                'group_count' => 2,
                'group_size' => 8,
                'sets_to_win' => 2,
                'points_per_set' => 15,
                'advance_upper_count' => 4,
                'advance_lower_count' => 4,
                'created_by' => $admin->id,
                'upper_champion_entry_id' => null,
                'lower_champion_entry_id' => null,
                'third_place_match_id' => null,
                'lower_third_place_match_id' => null,
            ],
        );

        $league->matches()->delete();
        $league->groups()->delete();
        $league->entries()->delete();
        $league->update([
            'status' => 'upcoming',
            'stage' => 'setup',
            'group_count' => 2,
            'group_size' => 8,
            'upper_champion_entry_id' => null,
            'lower_champion_entry_id' => null,
            'third_place_match_id' => null,
            'lower_third_place_match_id' => null,
        ]);

        $this->mensDoublesEntriesFromSeededTeams()->each(function (array $entry) use ($league) {
            $leagueEntry = $league->entries()->create([
                'team_id' => $entry['team']->id,
                'group_name' => $entry['team']->name,
                'player1_id' => $entry['player1_id'],
                'player2_id' => $entry['player2_id'],
                'substitute_id' => $entry['substitute_id'],
                'seed' => $entry['seed'],
            ]);

            $leagueEntry->substitutes()->sync($entry['substitute_ids']);
        });

        $formatService = app(LeagueFormatService::class);
        $bracketService = app(BracketService::class);

        $league = $league->fresh();
        $formatService->createGroups($league, $league->entries()->orderBy('seed')->get(), 2);
        $this->renameGroups($league->fresh());
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

        $league = $league->fresh();
        $this->assignBracketEntries($league, 'upper', $upperEntries);
        $this->assignBracketEntries($league, 'lower', $lowerEntries);

        $this->completeBracket($league->fresh(), 'upper', $bracketService);
        $this->completeBracket($league->fresh(), 'lower', $bracketService);

        $this->completeThirdPlaceMatches($league->fresh());

        $league->fresh()->update(['status' => 'completed', 'stage' => 'completed']);
    }

    private function assignBracketEntries(League $league, string $stage, Collection $entries): void
    {
        $firstRoundMatches = $league->matches()
            ->where('stage', $stage)
            ->where('round', 1)
            ->orderBy('id')
            ->get();

        $entries = $entries->values();

        foreach ($firstRoundMatches as $index => $match) {
            $match->update([
                'home_entry_id' => $entries[$index * 2]?->id,
                'away_entry_id' => $entries[$index * 2 + 1]?->id,
            ]);
        }
    }

    private function completeThirdPlaceMatches(League $league): void
    {
        $matches = $league->matches()
            ->whereIn('stage', ['third_place', 'lower_third_place'])
            ->get();

        foreach ($matches as $match) {
            if ($match->status === 'completed' || $match->home_entry_id === null || $match->away_entry_id === null) {
                continue;
            }

            $homeWins = $match->home_entry_id < $match->away_entry_id;
            $this->recordStraightSets($match, $homeWins);
        }
    }

    private function renameGroups(League $league): void
    {
        $groupNames = ['Group A', 'Group B'];

        $league->groups()
            ->orderBy('position')
            ->get()
            ->values()
            ->each(fn ($group, int $index) => $group->update(['name' => $groupNames[$index] ?? 'Grup '.($index + 1)]));
    }

    private function completeBracket(League $league, string $stage, BracketService $bracketService): void
    {
        $rounds = $league->matches()
            ->where('stage', $stage)
            ->reorder('round', 'asc')
            ->pluck('round')
            ->unique()
            ->values();

        foreach ($rounds as $round) {
            $matches = $league->matches()
                ->where('stage', $stage)
                ->where('round', $round)
                ->reorder('id', 'asc')
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
