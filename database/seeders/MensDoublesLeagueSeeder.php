<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class MensDoublesLeagueSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()
            ->where('role', 'admin')
            ->firstOrCreate(
                ['email' => 'admin@jasaraharja.co.id'],
                [
                    'name' => 'JR Club Admin',
                    'password' => 'password',
                    'role' => 'admin',
                    'gender' => 'male',
                ],
            );

        $badminton = Sport::query()->firstOrCreate(
            ['name' => 'Badminton'],
            [
                'icon' => 'sports_tennis',
                'max_players_per_team' => 2,
                'description' => 'Singles and doubles court sessions.',
            ],
        );

        $category = SportCategory::firstOrCreate(
            ['sport_id' => $badminton->id, 'code' => 'MD'],
            ['name' => 'Ganda Putra', 'entry_type' => 'double', 'player_count' => 2, 'gender_rule' => 'male', 'sort_order' => 3],
        );

        $league = League::query()->updateOrCreate(
            ['name' => 'JR Men Doubles Championship'],
            [
                'sport_id' => $badminton->id,
                'sport_category_id' => $category->id,
                'category' => 'MD',
                'entry_type' => 'double',
                'description' => 'Seeded ganda putra league with 16 doubles entries.',
                'start_date' => now()->toDateString(),
                'end_date' => now()->addWeeks(8)->toDateString(),
                'status' => 'upcoming',
                'stage' => 'setup',
                'participant_total' => 16,
                'group_count' => 2,
                'group_size' => 8,
                'sets_to_win' => 2,
                'points_per_set' => 15,
                'advance_upper_count' => 4,
                'advance_lower_count' => 4,
                'upper_champion_entry_id' => null,
                'lower_champion_entry_id' => null,
                'third_place_match_id' => null,
                'lower_third_place_match_id' => null,
                'created_by' => $admin->id,
            ],
        );

        $league->matches()->delete();
        $league->groups()->delete();
        $league->entries()->delete();
        $league->update([
            'status' => 'upcoming',
            'stage' => 'setup',
            'group_count' => 2,
            'group_size' => 8,
            'upper_champion_entry_id' => null,
            'lower_champion_entry_id' => null,
            'third_place_match_id' => null,
            'lower_third_place_match_id' => null,
        ]);

        $playerNames = $this->playerNames();
        $groupNames = $this->groupNames();

        $players = collect(range(1, 32))->map(function (int $number) use ($playerNames) {
            $paddedNumber = str_pad((string) $number, 2, '0', STR_PAD_LEFT);

            return User::query()->updateOrCreate(
                ['email' => "md-player-{$paddedNumber}@jasaraharja.co.id"],
                [
                    'name' => $playerNames[$number - 1],
                    'password' => 'password',
                    'role' => 'member',
                    'gender' => 'male',
                ],
            );
        });

        $players->chunk(2)->values()->each(function (Collection $pair, int $index) use ($groupNames, $league) {
            $seed = $index + 1;

            $league->entries()->create([
                'group_name' => $groupNames[$index],
                'player1_id' => $pair->values()[0]->id,
                'player2_id' => $pair->values()[1]->id,
                'seed' => $seed,
            ]);
        });
    }

    private function playerNames(): array
    {
        return [
            'Adi Saputra',
            'Bima Pratama',
            'Cahyo Nugroho',
            'Dimas Setiawan',
            'Eko Prabowo',
            'Fajar Ramadhan',
            'Gilang Maulana',
            'Hendra Wijaya',
            'Ilham Hidayat',
            'Joko Susanto',
            'Kurniawan Putra',
            'Lukman Hakim',
            'Muhammad Rizki',
            'Nanda Prakoso',
            'Oki Permana',
            'Pandu Mahesa',
            'Raka Saputro',
            'Rizal Firmansyah',
            'Surya Darmawan',
            'Teguh Prasetyo',
            'Umar Farhan',
            'Vino Aditya',
            'Wahyu Kurnia',
            'Yoga Pranata',
            'Yusuf Maulana',
            'Zaki Ramadhan',
            'Bagas Pamungkas',
            'Daffa Alfarizi',
            'Fikri Ramadhan',
            'Haikal Akbar',
            'Iqbal Maulana',
            'Rangga Saputra',
        ];
    }

    private function groupNames(): array
    {
        return [
            'Garuda Perkasa',
            'Rajawali Selatan',
            'Komodo Jaya',
            'Cendrawasih Prima',
            'Elang Nusantara',
            'Merapi Smash',
            'Rinjani Putra',
            'Bromo Kilat',
            'Mandalika Rally',
            'Papandayan Force',
            'Andalas Power',
            'Mataram United',
            'Sriwijaya Drive',
            'Mahameru Fighters',
            'Sagara Juara',
            'Jayawijaya Squad',
        ];
    }
}
