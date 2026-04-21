<?php

namespace Tests\Feature;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\LeagueEntry;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class AdminLeagueOpsTest extends TestCase
{
    use RefreshDatabase;

    private User $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->admin = User::factory()->create(['role' => 'admin']);
    }

    public function test_adjust_endpoint_success()
    {
        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM', 'description' => 'Test', 'created_by' => $this->admin->id]);
        $league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'upper',
            'start_date' => now(),
            'end_date' => now()->addDays(7),
            'created_by' => $this->admin->id,
        ]);

        $entry1 = LeagueEntry::create(['league_id' => $league->id, 'status' => 'approved', 'player1_id' => User::factory()->create()->id]);
        $entry2 = LeagueEntry::create(['league_id' => $league->id, 'status' => 'approved', 'player1_id' => User::factory()->create()->id]);

        $matchA = GameMatch::create(['league_id' => $league->id, 'status' => 'scheduled', 'stage' => 'upper', 'round' => 1, 'scheduled_at' => now(), 'home_entry_id' => $entry1->id]);
        $matchB = GameMatch::create(['league_id' => $league->id, 'status' => 'scheduled', 'stage' => 'upper', 'round' => 1, 'scheduled_at' => now(), 'home_entry_id' => $entry2->id]);

        $response = $this->actingAs($this->admin)->post(route('admin.leagues.brackets.adjust', $league), [
            'match_id' => $matchA->id,
            'home_entry_id' => $entry2->id,
        ]);

        $response->assertSessionHas('success');
        
        $matchA->refresh();
        $matchB->refresh();
        
        $this->assertEquals($entry2->id, $matchA->home_entry_id);
        $this->assertEquals($entry1->id, $matchB->home_entry_id);
    }

    public function test_adjust_endpoint_rejected_when_scored()
    {
        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM', 'description' => 'Test', 'created_by' => $this->admin->id]);
        $league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'upper',
            'start_date' => now(),
            'end_date' => now()->addDays(7),
            'created_by' => $this->admin->id,
        ]);

        $matchA = GameMatch::create(['league_id' => $league->id, 'status' => 'scheduled', 'stage' => 'upper', 'round' => 1, 'scheduled_at' => now()]);
        $matchB = GameMatch::create(['league_id' => $league->id, 'status' => 'scheduled', 'stage' => 'upper', 'round' => 1, 'scheduled_at' => now()]);

        MatchSet::create(['match_id' => $matchA->id, 'set_number' => 1, 'home_points' => 21, 'away_points' => 10]);

        $response = $this->actingAs($this->admin)->post(route('admin.leagues.brackets.adjust', $league), [
            'match_id' => $matchA->id,
            'home_entry_id' => null,
            'away_entry_id' => null,
        ]);

        $response->assertSessionHasErrors(['error']);
    }

    public function test_substitute_endpoint_success()
    {
        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM', 'description' => 'Test', 'created_by' => $this->admin->id]);
        $league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'upper',
            'start_date' => now(),
            'end_date' => now()->addDays(7),
            'created_by' => $this->admin->id,
        ]);

        $player1 = User::factory()->create();
        $sub = User::factory()->create();

        $entry = LeagueEntry::create([
            'league_id' => $league->id, 
            'status' => 'approved', 
            'player1_id' => $player1->id
        ]);
        
        $entry->substitutes()->attach($sub->id);

        $match = GameMatch::create(['league_id' => $league->id, 'status' => 'scheduled', 'stage' => 'upper', 'round' => 1, 'scheduled_at' => now(), 'home_entry_id' => $entry->id]);

        $response = $this->actingAs($this->admin)->post(route('admin.matches.substitutions.store', $match), [
            'entry_id' => $entry->id,
            'original_player_id' => $player1->id,
            'substitute_id' => $sub->id,
            'reason' => 'Injury',
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('match_substitutions', [
            'match_id' => $match->id,
            'entry_id' => $entry->id,
            'original_player_id' => $player1->id,
            'substitute_id' => $sub->id,
            'reason' => 'Injury',
        ]);
    }

    public function test_substitute_endpoint_non_declared_rejected()
    {
        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM', 'description' => 'Test', 'created_by' => $this->admin->id]);
        $league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'upper',
            'start_date' => now(),
            'end_date' => now()->addDays(7),
            'created_by' => $this->admin->id,
        ]);

        $player1 = User::factory()->create();
        $stranger = User::factory()->create();

        $entry = LeagueEntry::create([
            'league_id' => $league->id, 
            'status' => 'approved', 
            'player1_id' => $player1->id
        ]);

        $match = GameMatch::create(['league_id' => $league->id, 'status' => 'scheduled', 'stage' => 'upper', 'round' => 1, 'scheduled_at' => now(), 'home_entry_id' => $entry->id]);

        $response = $this->actingAs($this->admin)->post(route('admin.matches.substitutions.store', $match), [
            'entry_id' => $entry->id,
            'original_player_id' => $player1->id,
            'substitute_id' => $stranger->id,
            'reason' => 'Injury',
        ]);

        $response->assertSessionHasErrors(['substitute_id']);
        $this->assertDatabaseMissing('match_substitutions', [
            'match_id' => $match->id,
            'substitute_id' => $stranger->id,
        ]);
    }

    public function test_photo_upload_happy()
    {
        Storage::fake('public');
        
        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM', 'description' => 'Test', 'created_by' => $this->admin->id]);
        $league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'upper',
            'start_date' => now(),
            'end_date' => now()->addDays(7),
            'created_by' => $this->admin->id,
        ]);

        $match = GameMatch::create(['league_id' => $league->id, 'status' => 'scheduled', 'stage' => 'upper', 'round' => 1, 'scheduled_at' => now()]);

        $file = UploadedFile::fake()->image('photo.jpg');

        $response = $this->actingAs($this->admin)->post(route('admin.matches.documents.store', $match), [
            'documents' => [$file],
        ]);

        $response->assertSessionHas('success');
        $this->assertDatabaseHas('match_documents', [
            'match_id' => $match->id,
            'original_name' => 'photo.jpg',
        ]);
        
        $document = $match->documents()->first();
        Storage::disk('public')->assertExists($document->path);
    }
}
