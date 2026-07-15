<?php

namespace Tests\Feature\Admin;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeagueBracketPresetTest extends TestCase
{
    use RefreshDatabase;

    private function bracketLeagueWithEntries(User $admin, Sport $sport, int $entryCount = 4): League
    {
        $league = League::create([
            'name' => 'JR Preset Cup',
            'sport_id' => $sport->id,
            'category' => 'MS',
            'entry_type' => 'single',
            'start_date' => now()->toDateString(),
            'status' => 'upcoming',
            'stage' => 'setup',
            'start_stage' => 'bracket',
            'participant_total' => $entryCount,
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'advance_upper_count' => $entryCount,
            'advance_lower_count' => 0,
            'created_by' => $admin->id,
        ]);

        foreach (range(1, $entryCount) as $index) {
            $player = User::factory()->create([
                'name' => "Preset Player {$index}",
                'email' => "preset{$index}@example.com",
                'gender' => 'male',
            ]);

            $this->actingAs($admin)->post(route('admin.leagues.entries.store', $league), [
                'player1_id' => $player->id,
            ])->assertRedirect();
        }

        return $league->fresh();
    }

    public function test_update_preset_persists_settings(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'gender' => 'male']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);
        $league = $this->bracketLeagueWithEntries($admin, $sport);

        $entryIds = $league->entries()->orderBy('id')->pluck('id')->all();
        $slots = [$entryIds[3], $entryIds[2], $entryIds[1], $entryIds[0]];

        $this->actingAs($admin)->patch(route('admin.leagues.brackets.preset.update', $league), [
            'bracket_preset_enabled' => true,
            'bracket_preset_reveal_at' => 5,
            'bracket_preset_slots' => $slots,
        ])->assertRedirect();

        $league->refresh();

        $this->assertTrue($league->bracket_preset_enabled);
        $this->assertSame(5, $league->bracket_preset_reveal_at);
        $this->assertSame($slots, $league->bracket_preset_slots);
    }

    public function test_update_preset_persists_for_group_start_leagues(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'gender' => 'male']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);

        $league = League::create([
            'name' => 'JR Group Cup',
            'sport_id' => $sport->id,
            'category' => 'MS',
            'entry_type' => 'single',
            'start_date' => now()->toDateString(),
            'status' => 'upcoming',
            'stage' => 'setup',
            'start_stage' => 'group',
            'participant_total' => 4,
            'created_by' => $admin->id,
        ]);

        // Group-start leagues also progress to a bracket, so the preset applies to them too.
        $this->actingAs($admin)->patch(route('admin.leagues.brackets.preset.update', $league), [
            'bracket_preset_enabled' => true,
            'bracket_preset_reveal_at' => 3,
        ])->assertRedirect()->assertSessionHasNoErrors();

        $league->refresh();

        $this->assertTrue($league->bracket_preset_enabled);
        $this->assertSame(3, $league->bracket_preset_reveal_at);
    }

    public function test_update_preset_rejects_duplicate_slot_entries(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'gender' => 'male']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);
        $league = $this->bracketLeagueWithEntries($admin, $sport);

        $entryIds = $league->entries()->orderBy('id')->pluck('id')->all();

        $this->actingAs($admin)->patch(route('admin.leagues.brackets.preset.update', $league), [
            'bracket_preset_enabled' => true,
            'bracket_preset_reveal_at' => 2,
            'bracket_preset_slots' => [$entryIds[0], $entryIds[0], $entryIds[1], null],
        ])->assertSessionHasErrors('bracket_preset_slots');

        $this->assertFalse($league->fresh()->bracket_preset_enabled);
    }

    public function test_nth_seed_reveals_preset_and_resets_counter(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'gender' => 'male']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);
        $league = $this->bracketLeagueWithEntries($admin, $sport);

        $entryIds = $league->entries()->orderBy('id')->pluck('id')->all();
        $slots = [$entryIds[3], $entryIds[2], $entryIds[1], $entryIds[0]];

        $this->actingAs($admin)->patch(route('admin.leagues.brackets.preset.update', $league), [
            'bracket_preset_enabled' => true,
            'bracket_preset_reveal_at' => 2,
            'bracket_preset_slots' => $slots,
        ])->assertRedirect();

        $seedPayload = ['advance_upper_count' => 4, 'advance_lower_count' => 0, 'interval' => 15];

        // First (non-Nth) seed: counter increments but not reset, normal seeding.
        $this->actingAs($admin)->post(route('admin.leagues.brackets.store', $league), $seedPayload)->assertRedirect();
        $this->assertSame(1, $league->fresh()->bracket_seed_count);

        // Second (Nth) seed: preset layout applied, counter resets to 0.
        $this->actingAs($admin)->post(route('admin.leagues.brackets.store', $league), $seedPayload)->assertRedirect();
        $this->assertSame(0, $league->fresh()->bracket_seed_count);

        $roundOne = GameMatch::where('league_id', $league->id)
            ->where('stage', 'upper')
            ->where('round', 1)
            ->orderBy('id')
            ->get();

        $this->assertSame($slots[0], $roundOne[0]->home_entry_id);
        $this->assertSame($slots[1], $roundOne[0]->away_entry_id);
        $this->assertSame($slots[2], $roundOne[1]->home_entry_id);
        $this->assertSame($slots[3], $roundOne[1]->away_entry_id);
    }

    public function test_non_nth_seed_uses_normal_seeding(): void
    {
        $admin = User::factory()->create(['role' => 'admin', 'gender' => 'male']);
        $sport = Sport::create(['name' => 'Badminton', 'icon' => 'sports_tennis', 'max_players_per_team' => 2]);
        $league = $this->bracketLeagueWithEntries($admin, $sport);

        $entryIds = $league->entries()->orderBy('id')->pluck('id')->all();
        $slots = [$entryIds[3], $entryIds[2], $entryIds[1], $entryIds[0]];

        $this->actingAs($admin)->patch(route('admin.leagues.brackets.preset.update', $league), [
            'bracket_preset_enabled' => true,
            'bracket_preset_reveal_at' => 5,
            'bracket_preset_slots' => $slots,
        ])->assertRedirect();

        $this->actingAs($admin)->post(route('admin.leagues.brackets.store', $league), [
            'advance_upper_count' => 4,
            'advance_lower_count' => 0,
            'interval' => 15,
        ])->assertRedirect();

        $this->assertSame(1, $league->fresh()->bracket_seed_count);

        $roundOne = GameMatch::where('league_id', $league->id)
            ->where('stage', 'upper')
            ->where('round', 1)
            ->orderBy('id')
            ->get();

        // Normal seeding places entries in registration order, not the reversed preset.
        $this->assertSame($entryIds[0], $roundOne[0]->home_entry_id);
        $this->assertSame($entryIds[1], $roundOne[0]->away_entry_id);
    }
}
