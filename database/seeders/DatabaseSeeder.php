<?php

namespace Database\Seeders;

use App\Models\Activity;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\User;
use Carbon\Carbon;
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
            ['Basketball', 'sports_basketball', 5, 'Indoor half-court and tournament games.'],
            ['Mini Soccer', 'sports_soccer', 5, 'High-energy five-a-side matches.'],
            ['Badminton', 'sports_tennis', 2, 'Singles and doubles court sessions.'],
            ['Other', 'sports_other', 6, 'Branch team other.'],
        ])->map(fn ($sport) => Sport::create([
            'name' => $sport[0],
            'icon' => $sport[1],
            'max_players_per_team' => $sport[2],
            'description' => $sport[3],
        ]));

        $this->seedSportCategories($sports);

        Activity::create([
            'sport_id' => $sports->firstWhere('name', 'Badminton')->id,
            'created_by' => $admin->id,
            'title' => 'After Work Smash',
            'description' => 'Weekly badminton session every Thursday from 17.00 to 20.00 at Grand Sport Centre, Kuningan.',
            'location' => 'Grand Sport Centre, Kuningan',
            'scheduled_at' => now()->next(Carbon::THURSDAY)->setTime(17, 0),
            'max_participants' => 12,
        ])->participants()->attach($members->pluck('id')->mapWithKeys(fn ($id) => [$id => ['joined_at' => now()]])->all());

        Activity::create([
            'sport_id' => $sports->firstWhere('name', 'Padel')->id,
            'created_by' => $admin->id,
            'title' => 'Padel Midweek Mood Booster',
            'description' => 'Weekly padel session every Wednesday from 18.00 to 20.00 at Castle Padel Court.',
            'location' => 'Castle Padel Court',
            'scheduled_at' => now()->next(Carbon::WEDNESDAY)->setTime(18, 0),
            'max_participants' => 6,
        ])->participants()->attach($members->take(2)->pluck('id')->mapWithKeys(fn ($id) => [$id => ['joined_at' => now()]])->all());

        $this->call(MensDoublesLeagueSeeder::class);
        $this->call(CompletedMensDoublesLeagueSeeder::class);
        $this->call(GroupStageMensDoublesLeagueSeeder::class);
        $this->call(BasketballLeagueSeeder::class);
    }

    private function seedSportCategories($sports): void
    {
        $definitions = [
            'Badminton' => [
                ['MS', 'Single Putra', 'single', 1, 'male'],
                ['WS', 'Single Putri', 'single', 1, 'female'],
                ['MD', 'Ganda Putra', 'double', 2, 'male'],
                ['WD', 'Ganda Putri', 'double', 2, 'female'],
                ['XD', 'Ganda Campuran', 'double', 2, 'mixed'],
            ],
            'Basketball' => [
                ['3V3', '3 vs 3', 'team', 3, 'open'],
                ['5V5', '5 vs 5', 'team', 5, 'open'],
            ],
        ];

        foreach ($definitions as $sportName => $categories) {
            $sport = $sports->firstWhere('name', $sportName);

            if (! $sport) {
                continue;
            }

            foreach ($categories as $index => [$code, $name, $entryType, $playerCount, $genderRule]) {
                SportCategory::updateOrCreate(
                    ['sport_id' => $sport->id, 'code' => $code],
                    [
                        'name' => $name,
                        'entry_type' => $entryType,
                        'player_count' => $playerCount,
                        'gender_rule' => $genderRule,
                        'sort_order' => $index + 1,
                        'is_active' => true,
                    ],
                );
            }
        }
    }
}
