<?php

namespace Tests\Feature\Admin;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\LeagueEntry;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class LeagueMatchTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;
    private League $league;
    private GameMatch $match;

    protected function setUp(): void
    {
        parent::setUp();

        $this->admin = User::factory()->create(['role' => 'admin']);

        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM', 'description' => 'Test', 'created_by' => $this->admin->id]);

        $this->league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'group',
            'start_date' => now(),
            'sets_to_win' => 2,
            'created_by' => $this->admin->id,
        ]);

        $entry1 = LeagueEntry::create(['league_id' => $this->league->id, 'status' => 'approved', 'player1_id' => User::factory()->create()->id]);
        $entry2 = LeagueEntry::create(['league_id' => $this->league->id, 'status' => 'approved', 'player1_id' => User::factory()->create()->id]);

        $this->match = GameMatch::create([
            'league_id' => $this->league->id,
            'status' => 'live',
            'stage' => 'group',
            'scheduled_at' => now(),
            'home_entry_id' => $entry1->id,
            'away_entry_id' => $entry2->id,
            'home_score' => 0,
            'away_score' => 0,
        ]);
    }

    public function test_lock_prevents_adding_sets(): void
    {
        $this->match->update(['locked' => true, 'status' => 'completed']);

        $response = $this->actingAs($this->admin)
            ->post(route('admin.matches.sets.store', $this->match), [
                'home_points' => 21,
                'away_points' => 15,
            ]);

        $response->assertSessionHasErrors('locked');
        $this->assertDatabaseCount('match_sets', 0);
    }

    public function test_lock_prevents_editing_sets(): void
    {
        $set = MatchSet::create(['match_id' => $this->match->id, 'set_number' => 1, 'home_points' => 21, 'away_points' => 15]);
        $this->match->update(['locked' => true, 'status' => 'completed']);

        $response = $this->actingAs($this->admin)
            ->patch(route('admin.matches.sets.update', [$this->match, $set]), [
                'home_points' => 15,
                'away_points' => 21,
            ]);

        $response->assertSessionHasErrors('locked');
        $this->assertEquals(21, $set->fresh()->home_points);
    }

    public function test_lock_prevents_deleting_sets(): void
    {
        $set = MatchSet::create(['match_id' => $this->match->id, 'set_number' => 1, 'home_points' => 21, 'away_points' => 15]);
        $this->match->update(['locked' => true, 'status' => 'completed']);

        $response = $this->actingAs($this->admin)
            ->delete(route('admin.matches.sets.destroy', [$this->match, $set]));

        $response->assertSessionHasErrors('locked');
        $this->assertDatabaseHas('match_sets', ['id' => $set->id]);
    }

    public function test_lock_toggle(): void
    {
        $this->match->update(['status' => 'completed']);

        $this->actingAs($this->admin)
            ->post(route('admin.matches.lock', $this->match))
            ->assertSessionHas('success');

        $this->assertTrue($this->match->fresh()->isLocked());

        $this->actingAs($this->admin)
            ->post(route('admin.matches.unlock', $this->match))
            ->assertSessionHas('success');

        $this->assertFalse($this->match->fresh()->isLocked());
    }

    public function test_locking_scheduled_match_is_rejected(): void
    {
        $this->match->update(['status' => 'scheduled']);

        $this->actingAs($this->admin)
            ->post(route('admin.matches.lock', $this->match))
            ->assertSessionHasErrors('status');

        $this->assertFalse($this->match->fresh()->isLocked());
    }

    public function test_destroy_set_renumbers_remaining(): void
    {
        $set1 = MatchSet::create(['match_id' => $this->match->id, 'set_number' => 1, 'home_points' => 21, 'away_points' => 15]);
        $set2 = MatchSet::create(['match_id' => $this->match->id, 'set_number' => 2, 'home_points' => 21, 'away_points' => 18]);
        $set3 = MatchSet::create(['match_id' => $this->match->id, 'set_number' => 3, 'home_points' => 21, 'away_points' => 10]);

        $this->actingAs($this->admin)
            ->delete(route('admin.matches.sets.destroy', [$this->match, $set1]))
            ->assertSessionHas('success');

        $this->assertDatabaseMissing('match_sets', ['id' => $set1->id]);
        $this->assertEquals(1, $set2->fresh()->set_number);
        $this->assertEquals(2, $set3->fresh()->set_number);
    }

    public function test_edit_set_recomputes_match_score(): void
    {
        $set1 = MatchSet::create(['match_id' => $this->match->id, 'set_number' => 1, 'home_points' => 21, 'away_points' => 15]);
        $set2 = MatchSet::create(['match_id' => $this->match->id, 'set_number' => 2, 'home_points' => 18, 'away_points' => 21]);
        $this->match->update(['home_score' => 1, 'away_score' => 1, 'status' => 'live']);

        $this->actingAs($this->admin)
            ->patch(route('admin.matches.sets.update', [$this->match, $set2]), [
                'home_points' => 21,
                'away_points' => 10,
            ])
            ->assertSessionHas('success');

        $fresh = $this->match->fresh();
        $this->assertEquals(2, $fresh->home_score);
        $this->assertEquals(0, $fresh->away_score);
        $this->assertEquals('completed', $fresh->status);
    }
}
