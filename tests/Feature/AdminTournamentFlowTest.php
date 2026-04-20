<?php

namespace Tests\Feature;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminTournamentFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_complete_a_badminton_tournament_flow_with_two_champions(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin', 'gender' => 'male']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);

        $this->actingAs($admin)->post(route('admin.leagues.store'), [
            'name' => 'JR Smash Cup',
            'sport_id' => $sport->id,
            'category' => 'MS',
            'description' => 'Admin flow test',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addWeek()->toDateString(),
            'participant_total' => 8,
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'advance_upper_count' => 1,
            'advance_lower_count' => 1,
        ])->assertRedirect();

        $league = League::firstOrFail();

        $players = collect(range(1, 8))->map(fn ($index) => User::factory()->create([
            'name' => "Player {$index}",
            'email' => "player{$index}@example.com",
            'gender' => 'male',
        ]));

        foreach ($players as $player) {
            $this->actingAs($admin)->post(route('admin.leagues.entries.store', $league), [
                'player1_id' => $player->id,
            ])->assertRedirect();
        }

        $this->actingAs($admin)->post(route('admin.leagues.groups.store', $league), [
            'group_count' => 2,
        ])->assertRedirect();

        $league->refresh()->load('groups.groupEntries');

        foreach ($league->groups as $group) {
            foreach ($group->groupEntries()->orderBy('seed')->get()->values() as $index => $groupEntry) {
                $this->actingAs($admin)->patch(route('admin.leagues.groups.update', [$league, $groupEntry]), [
                    'manual_advance_rank' => $index + 1,
                ])->assertRedirect();
            }
        }

        $this->actingAs($admin)->post(route('admin.leagues.brackets.store', $league), [
            'advance_upper_count' => 1,
            'advance_lower_count' => 1,
        ])->assertRedirect();

        $upperFinal = GameMatch::where('league_id', $league->id)->where('stage', 'upper')->whereNull('next_match_id')->firstOrFail();
        $lowerFinal = GameMatch::where('league_id', $league->id)->where('stage', 'lower')->whereNull('next_match_id')->firstOrFail();

        foreach ([$upperFinal, $lowerFinal] as $match) {
            $this->actingAs($admin)->post(route('admin.matches.sets.store', $match), ['home_points' => 21, 'away_points' => 17])->assertRedirect();
            $this->actingAs($admin)->post(route('admin.matches.sets.store', $match), ['home_points' => 21, 'away_points' => 19])->assertRedirect();
        }

        $league->refresh();

        $this->assertSame('completed', $league->stage);
        $this->assertNotNull($league->upper_champion_entry_id);
        $this->assertNotNull($league->lower_champion_entry_id);
    }
}
