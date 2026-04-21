<?php

namespace Tests\Unit;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\LeagueEntry;
use App\Models\User;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Services\BracketService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Collection;
use Tests\TestCase;

class BracketServiceTest extends TestCase
{
    use RefreshDatabase;

    private BracketService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(BracketService::class);
    }

    public function test_third_place_generation_for_four_entry_brackets()
    {
        $user = User::factory()->create();
        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM', 'description' => 'Test', 'created_by' => $user->id]);
        $league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'registration',
            'start_date' => now(),
            'end_date' => now()->addDays(7),
            'created_by' => $user->id,
        ]);

        $entries = collect();
        for ($i = 1; $i <= 4; $i++) {
            $user1 = User::factory()->create();
            $entries->push(LeagueEntry::create([
                'league_id' => $league->id,
                'status' => 'approved',
                'player1_id' => $user1->id
            ]));
        }

        $this->service->seedBrackets($league, $entries, collect());

        $league->refresh();
        
        $this->assertNotNull($league->third_place_match_id);
        $this->assertEquals('upper', $league->stage);

        $thirdPlaceMatch = $league->thirdPlaceMatch;
        $this->assertNotNull($thirdPlaceMatch);
        $this->assertEquals('third_place', $thirdPlaceMatch->stage);
        $this->assertEquals(3, $thirdPlaceMatch->round);
        $this->assertNull($thirdPlaceMatch->home_entry_id);
        $this->assertNull($thirdPlaceMatch->away_entry_id);
    }

    public function test_adjust_rejects_scored_matches()
    {
        $user = User::factory()->create();
        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM2', 'description' => 'Test', 'created_by' => $user->id]);
        $league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'upper',
            'start_date' => now(),
            'end_date' => now()->addDays(7),
            'created_by' => $user->id,
        ]);

        $matchA = GameMatch::create(['league_id' => $league->id, 'status' => 'scheduled', 'stage' => 'upper', 'round' => 1, 'scheduled_at' => now()]);

        // Add a score to matchA
        MatchSet::create([
            'match_id' => $matchA->id,
            'set_number' => 1,
            'home_points' => 21,
            'away_points' => 10,
        ]);

        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Cannot adjust slots for matches that already have scores.');

        $this->service->adjustSlots($matchA, 1, 2);
    }

    public function test_adjust_succeeds_on_unscored_matches()
    {
        $user = User::factory()->create();
        $sport = Sport::create(['name' => 'Badminton', 'code' => 'BDM3', 'description' => 'Test', 'created_by' => $user->id]);
        $league = League::create([
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'status' => 'active',
            'stage' => 'upper',
            'start_date' => now(),
            'end_date' => now()->addDays(7),
            'created_by' => $user->id,
        ]);

        $entry1 = LeagueEntry::create(['league_id' => $league->id, 'status' => 'approved', 'player1_id' => User::factory()->create()->id]);
        $entry2 = LeagueEntry::create(['league_id' => $league->id, 'status' => 'approved', 'player1_id' => User::factory()->create()->id]);
        $entry3 = LeagueEntry::create(['league_id' => $league->id, 'status' => 'approved', 'player1_id' => User::factory()->create()->id]);
        $entry4 = LeagueEntry::create(['league_id' => $league->id, 'status' => 'approved', 'player1_id' => User::factory()->create()->id]);

        $matchA = GameMatch::create([
            'league_id' => $league->id, 
            'scheduled_at' => now(),
            'status' => 'scheduled', 
            'stage' => 'upper', 
            'round' => 1,
            'home_entry_id' => $entry1->id,
            'away_entry_id' => $entry2->id,
        ]);
        
        $matchB = GameMatch::create([
            'league_id' => $league->id, 
            'scheduled_at' => now(),
            'status' => 'scheduled', 
            'stage' => 'upper', 
            'round' => 1,
            'home_entry_id' => $entry3->id,
            'away_entry_id' => $entry4->id,
        ]);

        // Adjust matchA to have entry3 as home and entry4 as away
        $this->service->adjustSlots($matchA, $entry3->id, $entry4->id);

        $matchA->refresh();
        $matchB->refresh();

        $this->assertEquals($entry3->id, $matchA->home_entry_id);
        $this->assertEquals($entry4->id, $matchA->away_entry_id);
        
        // Ensure that the entries that were previously in matchB (entry3 and entry4) 
        // were swapped out properly in the logic. However, adjustSlots logic right now
        // just removes them from other matches and sets matchA. Wait, adjustSlots in BracketService
        // updates existing matches by swapping entries. Let's see what it does.
        // In BracketService:
        // if existingHome, update it with match->home_entry_id...
        // So matchB had home=entry3, away=entry4.
        // We adjusted matchA home to entry3. The old matchA home was entry1. So matchB home becomes entry1.
        // We adjusted matchA away to entry4. The old matchA away was entry2. So matchB away becomes entry2.
        $this->assertEquals($entry1->id, $matchB->home_entry_id);
        $this->assertEquals($entry2->id, $matchB->away_entry_id);
    }
}
