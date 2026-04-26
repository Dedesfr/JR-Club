<?php

namespace Tests\Feature;

use App\Models\League;
use App\Models\Sport;
use Database\Seeders\BasketballLeagueSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BasketballLeagueSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_basketball_seeder_creates_3v3_and_5v5_leagues(): void
    {
        $this->seed(BasketballLeagueSeeder::class);

        $basketball = Sport::where('name', 'Basketball')->firstOrFail();

        $this->assertDatabaseHas('sport_categories', [
            'sport_id' => $basketball->id,
            'code' => '3V3',
            'entry_type' => 'team',
            'player_count' => 3,
        ]);

        $this->assertDatabaseHas('sport_categories', [
            'sport_id' => $basketball->id,
            'code' => '5V5',
            'entry_type' => 'team',
            'player_count' => 5,
        ]);

        $threeVsThree = League::where('name', 'JR Basketball 3V3 Challenge')->with('teams.members', 'entries.team', 'matches')->firstOrFail();
        $fiveVsFive = League::where('name', 'JR Basketball 5V5 League')->with('teams.members', 'entries.team', 'matches')->firstOrFail();

        $this->assertSame('3V3', $threeVsThree->category);
        $this->assertSame('team', $threeVsThree->entry_type);
        $this->assertSame('group', $threeVsThree->start_stage);
        $this->assertSame('completed', $threeVsThree->stage);
        $this->assertSame('completed', $threeVsThree->status);
        $this->assertNotNull($threeVsThree->upper_champion_entry_id);
        $this->assertCount(4, $threeVsThree->teams);
        $this->assertCount(4, $threeVsThree->entries);
        $this->assertTrue($threeVsThree->entries->every(fn ($entry) => $entry->team_id !== null));
        $this->assertSame(2, $threeVsThree->groups()->count());
        $this->assertSame(2, $threeVsThree->matches->where('stage', 'group')->count());
        $this->assertSame(1, $threeVsThree->matches->where('stage', 'upper')->count());
        $this->assertTrue($threeVsThree->matches->every(fn ($match) => $match->status === 'completed'));
        $this->assertTrue($threeVsThree->teams->every(fn ($team) => $team->members->count() === 3));

        $this->assertSame('5V5', $fiveVsFive->category);
        $this->assertSame('team', $fiveVsFive->entry_type);
        $this->assertSame('bracket', $fiveVsFive->start_stage);
        $this->assertSame('completed', $fiveVsFive->stage);
        $this->assertSame('completed', $fiveVsFive->status);
        $this->assertNotNull($fiveVsFive->upper_champion_entry_id);
        $this->assertCount(4, $fiveVsFive->teams);
        $this->assertCount(4, $fiveVsFive->entries);
        $this->assertTrue($fiveVsFive->entries->every(fn ($entry) => $entry->team_id !== null));
        $this->assertCount(4, $fiveVsFive->matches);
        $this->assertSame(2, $fiveVsFive->matches->where('stage', 'upper')->where('round', 1)->count());
        $this->assertSame(1, $fiveVsFive->matches->where('stage', 'upper')->where('round', 2)->count());
        $this->assertSame(1, $fiveVsFive->matches->where('stage', 'third_place')->count());
        $this->assertTrue($fiveVsFive->matches->every(fn ($match) => $match->status === 'completed'));
        $this->assertTrue($fiveVsFive->teams->every(fn ($team) => $team->members->count() === 5));
    }
}
