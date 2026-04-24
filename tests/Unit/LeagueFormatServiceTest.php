<?php

namespace Tests\Unit;

use App\Models\League;
use App\Models\LeagueEntry;
use App\Models\Sport;
use App\Models\User;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeagueFormatServiceTest extends TestCase
{
    use RefreshDatabase;

    public function test_division_options_return_valid_pairs(): void
    {
        $options = app(LeagueFormatService::class)->divisionOptions(16);

        $this->assertContains(['group_count' => 2, 'group_size' => 8], $options);
        $this->assertContains(['group_count' => 4, 'group_size' => 4], $options);
        $this->assertContains(['group_count' => 8, 'group_size' => 2], $options);
    }

    public function test_create_groups_and_group_matches_generate_expected_pairings(): void
    {
        $league = $this->makeBadmintonLeague();
        $entries = $this->makeEntries($league, 8);
        $service = app(LeagueFormatService::class);

        $service->createGroups($league, $entries, 2);
        $service->generateGroupMatches($league->fresh());

        $league->refresh();

        $this->assertSame(2, $league->groups()->count());
        $this->assertSame(4, $league->groups()->first()->entries()->count());
        $this->assertSame(12, $league->matches()->where('stage', 'group')->count());
    }

    public function test_even_eight_entry_groups_use_extra_round_without_self_matches(): void
    {
        $league = $this->makeBadmintonLeague('Sixteen Entry League');
        $league->update(['participant_total' => 16]);
        $entries = $this->makeEntries($league, 16);
        $service = app(LeagueFormatService::class);

        $service->createGroups($league, $entries, 2);
        $service->generateGroupMatches($league->fresh());

        $groups = $league->fresh()->groups()->with('matches')->get();
        $weeklyCounts = $league->matches()
            ->where('stage', 'group')
            ->get()
            ->groupBy('round')
            ->map->count()
            ->values()
            ->all();

        $this->assertSame(56, $league->matches()->where('stage', 'group')->count());
        $this->assertSame([7, 7, 7, 7, 7, 7, 7, 7], $weeklyCounts);

        foreach ($groups as $group) {
            $matches = $group->matches;
            $roundCounts = $matches->groupBy('round')->map->count()->sort()->values()->all();
            $pairKeys = $matches
                ->map(fn ($match) => collect([$match->home_entry_id, $match->away_entry_id])->sort()->implode('-'))
                ->unique();

            $this->assertSame([3, 3, 3, 3, 4, 4, 4, 4], $roundCounts);
            $this->assertSame(28, $matches->count());
            $this->assertSame(28, $pairKeys->count());
            $this->assertSame(0, $matches->filter(fn ($match) => $match->home_entry_id === $match->away_entry_id)->count());
        }
    }

    public function test_brackets_support_shapes_for_four_five_and_eight_entries(): void
    {
        foreach ([4 => [2, 1], 5 => [4, 2, 1], 8 => [4, 2, 1]] as $count => $expectedRounds) {
            $league = $this->makeBadmintonLeague("League {$count}");
            $entries = $this->makeEntries($league, $count);

            app(BracketService::class)->seedBrackets($league, $entries, collect());

            $rounds = $league->fresh()->matches()->where('stage', 'upper')->orderBy('round')->get()->groupBy('round')->map->count()->values()->all();

            $this->assertSame($expectedRounds, $rounds);
        }
    }

    private function makeBadmintonLeague(string $name = 'Badminton League'): League
    {
        $admin = User::factory()->create(['role' => 'admin', 'gender' => 'male']);
        $sport = Sport::create(['name' => fake()->unique()->word(), 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);

        return League::create([
            'name' => $name,
            'sport_id' => $sport->id,
            'category' => 'MS',
            'entry_type' => 'single',
            'description' => 'Test league',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addWeek()->toDateString(),
            'status' => 'active',
            'stage' => 'setup',
            'participant_total' => 8,
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'created_by' => $admin->id,
        ]);
    }

    private function makeEntries(League $league, int $count)
    {
        return collect(range(1, $count))->map(function ($seed) use ($league) {
            $user = User::factory()->create([
                'gender' => 'male',
                'email' => "player{$seed}-{$league->id}@example.com",
            ]);

            return LeagueEntry::create([
                'league_id' => $league->id,
                'player1_id' => $user->id,
                'seed' => $seed,
            ]);
        });
    }
}
