<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\GameMatch;
use App\Models\League;
use App\Models\Sport;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => 'JR Club Admin',
            'email' => 'admin@jasaraharja.co.id',
            'password' => 'password',
            'role' => 'admin',
            'gender' => 'male',
        ]);

        $members = collect([
            ['Budi Santoso', 'budi@jasaraharja.co.id', 'male'],
            ['Siti Rahmawati', 'siti@jasaraharja.co.id', 'female'],
            ['Andi Wijaya', 'andi@jasaraharja.co.id', 'male'],
            ['Maya Putri', 'maya@jasaraharja.co.id', 'female'],
        ])->map(fn ($member) => User::factory()->create([
            'name' => $member[0],
            'email' => $member[1],
            'password' => 'password',
            'role' => 'member',
            'gender' => $member[2],
        ]));

        $sports = collect([
            ['Padel', 'sports_tennis', 2, 'Fast doubles sessions after work.'],
            ['Basketball', 'sports_basketball', 5, 'Indoor half-court and league games.'],
            ['Futsal', 'sports_soccer', 5, 'High-energy five-a-side matches.'],
            ['Badminton', 'sports_tennis', 2, 'Singles and doubles court sessions.'],
            ['Volleyball', 'sports_volleyball', 6, 'Branch team volleyball.'],
        ])->map(fn ($sport) => Sport::create([
            'name' => $sport[0],
            'icon' => $sport[1],
            'max_players_per_team' => $sport[2],
            'description' => $sport[3],
        ]));

        Activity::create([
            'sport_id' => $sports->firstWhere('name', 'Padel')->id,
            'created_by' => $admin->id,
            'title' => 'After Work Smash',
            'description' => 'Friendly padel session for all skill levels.',
            'location' => 'Senayan Padel Court',
            'scheduled_at' => now()->addHours(6),
            'max_participants' => 6,
        ])->participants()->attach($members->take(2)->pluck('id')->mapWithKeys(fn ($id) => [$id => ['joined_at' => now()]])->all());

        Activity::create([
            'sport_id' => $sports->firstWhere('name', 'Futsal')->id,
            'created_by' => $admin->id,
            'title' => 'Friday Night League',
            'description' => 'Open futsal run before the league cycle starts.',
            'location' => 'Kuningan Arena',
            'scheduled_at' => now()->addDay()->setTime(20, 0),
            'max_participants' => 12,
        ])->participants()->attach($members->pluck('id')->mapWithKeys(fn ($id) => [$id => ['joined_at' => now()]])->all());

        $futsal = $sports->firstWhere('name', 'Futsal');
        $teams = collect(['Jabar Titans', 'Jatim Spartans', 'JKT Knights', 'Sumut Mavericks'])
            ->map(fn ($name) => Team::create(['name' => $name, 'sport_id' => $futsal->id, 'created_by' => $admin->id]));

        foreach ($teams as $index => $team) {
            $team->members()->attach($members[$index % $members->count()]->id, [
                'role' => $index === 0 ? 'captain' : 'member',
                'joined_at' => now(),
            ]);
        }

        $league = League::create([
            'name' => 'JR Premier League',
            'sport_id' => $futsal->id,
            'description' => 'The ultimate branch competition for the season.',
            'start_date' => now()->toDateString(),
            'end_date' => now()->addMonths(2)->toDateString(),
            'status' => 'active',
            'created_by' => $admin->id,
        ]);

        $league->teams()->attach($teams->pluck('id')->mapWithKeys(fn ($id) => [$id => ['registered_at' => now()]])->all());

        GameMatch::create([
            'league_id' => $league->id,
            'home_team_id' => $teams[0]->id,
            'away_team_id' => $teams[3]->id,
            'scheduled_at' => now()->subDays(2),
            'status' => 'completed',
            'home_score' => 3,
            'away_score' => 1,
        ]);

        GameMatch::create([
            'league_id' => $league->id,
            'home_team_id' => $teams[1]->id,
            'away_team_id' => $teams[2]->id,
            'scheduled_at' => now()->addHour(),
            'status' => 'live',
            'home_score' => 1,
            'away_score' => 1,
        ]);

        $this->call(MensDoublesLeagueSeeder::class);
        $this->call(CompletedMensDoublesLeagueSeeder::class);
    }
}
