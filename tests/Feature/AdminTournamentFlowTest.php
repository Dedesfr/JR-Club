<?php

namespace Tests\Feature;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\Sport;
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
