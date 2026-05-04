<?php

namespace Tests\Feature;

use App\Models\League;
use Database\Seeders\CompletedBasketballLeagueSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CompletedBasketballLeagueSeederTest extends TestCase
{
    use RefreshDatabase;

    public function test_completed_basketball_seeder_creates_a_renderable_bracket(): void
    {
        $this->seed(CompletedBasketballLeagueSeeder::class);

        $league = League::where('name', 'Basketball 3 on 3 Tournament Jasa Raharja')
            ->with('teams', 'entries.team', 'matches')
            ->firstOrFail();

        $this->assertSame('bracket', $league->start_stage);
        $this->assertSame('completed', $league->status);
        $this->assertSame('completed', $league->stage);
        $this->assertSame(16, $league->participant_total);
        $this->assertCount(14, $league->teams);
        $this->assertCount(14, $league->entries);
        $this->assertTrue($league->entries->every(fn ($entry) => $entry->team_id !== null));
        $this->assertSame(8, $league->matches->where('stage', 'upper')->where('round', 1)->count());
        $this->assertSame(4, $league->matches->where('stage', 'upper')->where('round', 2)->count());
        $this->assertSame(2, $league->matches->where('stage', 'upper')->where('round', 3)->count());
        $this->assertSame(1, $league->matches->where('stage', 'upper')->where('round', 4)->count());
        $this->assertSame(1, $league->matches->where('stage', 'third_place')->count());
        $this->assertNotNull($league->upper_champion_entry_id);
        $this->assertNotNull($league->third_place_match_id);

        $roundOne = $league->matches
            ->where('stage', 'upper')
            ->where('round', 1)
            ->map(fn ($match) => [$match->home_label, $match->away_label, $match->home_score, $match->away_score])
            ->values()
            ->all();

        $this->assertContains(['Akuntansi', null, 1, 0], $roundOne);
        $this->assertContains(['Keuangan', null, 1, 0], $roundOne);
        $this->assertContains(['Manajemen Risiko', 'Teknologi Informasi dan Komunikasi', 1, 3], $roundOne);

        $roundTwo = $league->matches
            ->where('stage', 'upper')
            ->where('round', 2)
            ->map(fn ($match) => [$match->home_label, $match->away_label, $match->home_score, $match->away_score])
            ->values()
            ->all();

        $this->assertContains(['Akuntansi', 'Teknologi Informasi dan Komunikasi', 0, 21], $roundTwo);
        $this->assertContains(['Pelayanan dan TJSL', 'Satuan Pengawasan Intern', 6, 3], $roundTwo);
        $this->assertContains(['Kepatuhan dan Hukum', 'Strategi Transformasi dan Korporasi', 3, 6], $roundTwo);
        $this->assertContains(['Sekretariat Perusahaan', 'Keuangan', 2, 1], $roundTwo);

        $thirdPlace = $league->matches->firstWhere('stage', 'third_place');
        $this->assertSame('Teknologi Informasi dan Komunikasi', $thirdPlace?->home_label);
        $this->assertSame('Sekretariat Perusahaan', $thirdPlace?->away_label);
        $this->assertSame(5, $thirdPlace?->home_score);
        $this->assertSame(4, $thirdPlace?->away_score);
    }
}
