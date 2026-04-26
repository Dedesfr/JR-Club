<?php

namespace Tests\Feature;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Storage;
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
            'interval' => 15,
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
            'interval' => 15,
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

    public function test_admin_can_add_a_group_picture_for_doubles_entry(): void
    {
        Storage::fake('public');

        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);

        $this->actingAs($admin)->post(route('admin.leagues.store'), [
            'name' => 'JR Doubles Cup',
            'sport_id' => $sport->id,
            'category' => 'MD',
            'start_date' => now()->toDateString(),
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'advance_upper_count' => 0,
            'advance_lower_count' => 0,
        ])->assertRedirect();

        $league = League::firstOrFail();

        $player1 = User::factory()->create(['gender' => 'male']);
        $player2 = User::factory()->create(['gender' => 'male']);

        $this->actingAs($admin)->post(route('admin.leagues.entries.store', $league), [
            'group_name' => 'Garuda Pair',
            'player1_id' => $player1->id,
            'player2_id' => $player2->id,
            'group_picture' => UploadedFile::fake()->image('garuda-pair.jpg'),
        ])->assertRedirect();

        $entry = $league->entries()->firstOrFail();

        $this->assertSame('Garuda Pair', $entry->group_name);
        $this->assertNotNull($entry->group_picture_path);
        Storage::disk('public')->assertExists($entry->group_picture_path);
    }

    public function test_admin_can_create_league_with_sport_bound_category(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $sport = Sport::create(['name' => 'Basketball', 'icon' => 'sports_basketball', 'max_players_per_team' => 5]);
        $category = SportCategory::create([
            'sport_id' => $sport->id,
            'code' => '3V3',
            'name' => '3 vs 3',
            'entry_type' => 'team',
            'player_count' => 3,
            'gender_rule' => 'open',
        ]);

        $this->actingAs($admin)->post(route('admin.leagues.store'), [
            'name' => 'JR Basketball 3x3',
            'sport_id' => $sport->id,
            'sport_category_id' => $category->id,
            'description' => 'Basketball category test',
            'start_date' => now()->toDateString(),
            'participant_total' => 4,
            'sets_to_win' => 1,
            'points_per_set' => 21,
            'advance_upper_count' => 0,
            'advance_lower_count' => 0,
        ])->assertRedirect();

        $league = League::firstOrFail();

        $this->assertSame($category->id, $league->sport_category_id);
        $this->assertSame('3V3', $league->category);
        $this->assertSame('team', $league->entry_type);
        $this->assertTrue($league->isTeamBased());
    }

    public function test_admin_can_manage_team_participants_for_team_based_league(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $sport = Sport::create(['name' => 'Basketball', 'icon' => 'sports_basketball', 'max_players_per_team' => 5]);
        $category = SportCategory::create([
            'sport_id' => $sport->id,
            'code' => '5V5',
            'name' => '5 vs 5',
            'entry_type' => 'team',
            'player_count' => 5,
            'gender_rule' => 'open',
        ]);
        $league = League::create([
            'name' => 'JR Basketball 5x5',
            'sport_id' => $sport->id,
            'sport_category_id' => $category->id,
            'category' => $category->code,
            'entry_type' => $category->entry_type,
            'start_date' => now()->toDateString(),
            'status' => 'upcoming',
            'stage' => 'setup',
            'created_by' => $admin->id,
        ]);
        $players = User::factory()->count(5)->create();

        $this->actingAs($admin)->post(route('admin.leagues.teams.store', $league), [
            'name' => 'Court Kings',
            'player_ids' => $players->pluck('id')->all(),
        ])->assertRedirect();

        $team = Team::where('name', 'Court Kings')->firstOrFail();
        $this->assertTrue($league->teams()->whereKey($team->id)->exists());
        $this->assertSame($players->pluck('id')->sort()->values()->all(), $team->members()->pluck('users.id')->sort()->values()->all());

        $this->actingAs($admin)->delete(route('admin.leagues.teams.destroy', [$league, $team]))->assertRedirect();

        $this->assertFalse($league->teams()->whereKey($team->id)->exists());
    }

    public function test_admin_can_run_team_based_league_through_group_and_bracket_flow(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $sport = Sport::create(['name' => 'Basketball', 'icon' => 'sports_basketball', 'max_players_per_team' => 3]);
        $category = SportCategory::create([
            'sport_id' => $sport->id,
            'code' => '3V3',
            'name' => '3 vs 3',
            'entry_type' => 'team',
            'player_count' => 3,
            'gender_rule' => 'open',
        ]);
        $league = League::create([
            'name' => 'JR Basketball 3x3 Flow',
            'sport_id' => $sport->id,
            'sport_category_id' => $category->id,
            'category' => $category->code,
            'entry_type' => $category->entry_type,
            'start_date' => now()->toDateString(),
            'status' => 'upcoming',
            'stage' => 'setup',
            'start_stage' => 'group',
            'participant_total' => 4,
            'sets_to_win' => 1,
            'points_per_set' => 21,
            'created_by' => $admin->id,
        ]);

        foreach (range(1, 4) as $teamNumber) {
            $players = User::factory()->count(3)->create();
            $this->actingAs($admin)->post(route('admin.leagues.teams.store', $league), [
                'name' => "Hoop Squad {$teamNumber}",
                'player_ids' => $players->pluck('id')->all(),
            ])->assertRedirect();
        }

        $this->assertSame(4, $league->entries()->count());

        $this->actingAs($admin)->post(route('admin.leagues.groups.store', $league), [
            'group_count' => 2,
            'interval' => 15,
        ])->assertRedirect();

        $league->refresh();
        $this->assertSame('group', $league->stage);
        $this->assertSame(2, $league->groups()->count());
        $this->assertSame(2, GameMatch::where('league_id', $league->id)->where('stage', 'group')->count());

        foreach ($league->groups()->with('groupEntries')->get() as $group) {
            foreach ($group->groupEntries as $index => $groupEntry) {
                $this->actingAs($admin)->patch(route('admin.leagues.groups.update', [$league, $groupEntry]), [
                    'manual_advance_rank' => $index + 1,
                ])->assertRedirect();
            }
        }

        $this->actingAs($admin)->post(route('admin.leagues.brackets.store', $league), [
            'advance_upper_count' => 1,
            'advance_lower_count' => 0,
            'interval' => 15,
        ])->assertRedirect();

        $this->assertSame(1, GameMatch::where('league_id', $league->id)->where('stage', 'upper')->count());
    }

    public function test_admin_can_seed_bracket_start_league_without_groups(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin', 'gender' => 'male']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);

        $this->actingAs($admin)->post(route('admin.leagues.store'), [
            'name' => 'JR Knockout Cup',
            'sport_id' => $sport->id,
            'category' => 'MS',
            'description' => 'Direct bracket test',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addWeek()->toDateString(),
            'start_stage' => 'bracket',
            'participant_total' => 4,
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'advance_upper_count' => 4,
            'advance_lower_count' => 0,
        ])->assertRedirect();

        $league = League::firstOrFail();

        $players = collect(range(1, 4))->map(fn ($index) => User::factory()->create([
            'name' => "Knockout Player {$index}",
            'email' => "knockout{$index}@example.com",
            'gender' => 'male',
        ]));

        foreach ($players as $player) {
            $this->actingAs($admin)->post(route('admin.leagues.entries.store', $league), [
                'player1_id' => $player->id,
            ])->assertRedirect();
        }

        $this->actingAs($admin)->post(route('admin.leagues.brackets.store', $league), [
            'advance_upper_count' => 4,
            'advance_lower_count' => 0,
            'interval' => 15,
        ])->assertRedirect();

        $league->refresh();

        $this->assertSame('bracket', $league->start_stage);
        $this->assertSame('upper', $league->stage);
        $this->assertSame(0, $league->groups()->count());
        $this->assertSame(0, GameMatch::where('league_id', $league->id)->where('stage', 'group')->count());
        $this->assertSame(3, GameMatch::where('league_id', $league->id)->where('stage', 'upper')->count());

        $firstRoundMatch = GameMatch::where('league_id', $league->id)->where('stage', 'upper')->where('round', 1)->firstOrFail();
        $this->assertNull($firstRoundMatch->home_entry_id);
        $this->assertNull($firstRoundMatch->away_entry_id);
    }

    public function test_admin_can_update_a_doubles_entry_and_replace_group_picture(): void
    {
        Storage::fake('public');

        /** @var User $admin */
        $admin = User::factory()->create(['role' => 'admin']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);

        $this->actingAs($admin)->post(route('admin.leagues.store'), [
            'name' => 'JR Doubles Cup',
            'sport_id' => $sport->id,
            'category' => 'MD',
            'start_date' => now()->toDateString(),
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'advance_upper_count' => 0,
            'advance_lower_count' => 0,
        ])->assertRedirect();

        $league = League::firstOrFail();
        $player1 = User::factory()->create(['gender' => 'male']);
        $player2 = User::factory()->create(['gender' => 'male']);
        $replacement1 = User::factory()->create(['gender' => 'male']);
        $replacement2 = User::factory()->create(['gender' => 'male']);
        $substitute = User::factory()->create(['gender' => 'male']);

        $this->actingAs($admin)->post(route('admin.leagues.entries.store', $league), [
            'group_name' => 'Garuda Pair',
            'player1_id' => $player1->id,
            'player2_id' => $player2->id,
            'group_picture' => UploadedFile::fake()->image('garuda-pair.jpg'),
        ])->assertRedirect();

        $entry = $league->entries()->firstOrFail();
        $oldPath = $entry->group_picture_path;

        $this->actingAs($admin)->patch(route('admin.leagues.entries.update', [$league, $entry]), [
            'group_name' => 'Rajawali Pair',
            'player1_id' => $replacement1->id,
            'player2_id' => $replacement2->id,
            'substitute_ids' => [$substitute->id],
            'group_picture' => UploadedFile::fake()->image('rajawali-pair.jpg'),
        ])->assertRedirect();

        $entry->refresh()->load('substitutes');

        $this->assertSame('Rajawali Pair', $entry->group_name);
        $this->assertSame($replacement1->id, $entry->player1_id);
        $this->assertSame($replacement2->id, $entry->player2_id);
        $this->assertSame([$substitute->id], $entry->substitutes->pluck('id')->all());
        $this->assertNotSame($oldPath, $entry->group_picture_path);
        Storage::disk('public')->assertMissing($oldPath);
        Storage::disk('public')->assertExists($entry->group_picture_path);
    }
}
