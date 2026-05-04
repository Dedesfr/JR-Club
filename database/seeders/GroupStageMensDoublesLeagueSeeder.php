<?php

namespace Database\Seeders;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Services\LeagueFormatService;
use Database\Seeders\Concerns\UsesSeededRoster;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class GroupStageMensDoublesLeagueSeeder extends Seeder
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
            ['name' => 'JR Men Doubles Group Stage'],
            [
                'sport_id' => $badminton->id,
                'sport_category_id' => $category->id,
                'category' => 'MD',
                'entry_type' => 'double',
                'description' => 'Completed ganda putra tournament group stage, waiting for bracket seeding.',
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

        $league->update(['status' => 'active', 'stage' => 'group']);
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
