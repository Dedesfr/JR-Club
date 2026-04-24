<?php

namespace Database\Seeders;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\User;
use App\Services\LeagueFormatService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class GroupStageMensDoublesLeagueSeeder extends Seeder
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

        $league = League::query()->updateOrCreate(
            ['name' => 'JR Men Doubles Group Stage'],
            [
                'sport_id' => $badminton->id,
                'category' => 'MD',
                'entry_type' => 'double',
                'description' => 'Completed ganda putra league group stage, waiting for bracket seeding.',
                'start_date' => now()->subWeeks(8)->toDateString(),
                'end_date' => now()->toDateString(),
                'status' => 'upcoming',
                'stage' => 'setup',
                'participant_total' => 16,
                'group_count' => 2,
                'group_size' => 8,
                'sets_to_win' => 2,
                'points_per_set' => 15,
                'advance_upper_count' => 4,
                'advance_lower_count' => 4,
                'created_by' => $admin->id,
                'upper_champion_entry_id' => null,
                'lower_champion_entry_id' => null,
                'third_place_match_id' => null,
                'lower_third_place_match_id' => null,
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
        $groupNames = $this->entryGroupNames();

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

        $formatService = app(LeagueFormatService::class);

        $league = $league->fresh();
        $formatService->createGroups($league, $league->entries()->orderBy('seed')->get(), 2);
        $this->renameGroups($league->fresh());
        $formatService->generateGroupMatches($league->fresh());

        $this->completeMatches($league->fresh()->matches()->where('stage', 'group')->get());
        $formatService->recomputeGroupPoints($league->fresh());

        $league->fresh()->groups()->with('groupEntries')->get()->each(function ($group) {
            $group->groupEntries()
                ->orderBy('points', 'desc')
                ->orderBy('seed')
                ->get()
                ->values()
                ->each(fn ($groupEntry, int $index) => $groupEntry->update(['manual_advance_rank' => $index + 1]));
        });

        $league->update(['status' => 'active', 'stage' => 'group']);
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

    private function entryGroupNames(): array
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

    private function renameGroups(League $league): void
    {
        $groupNames = ['Grup Garuda', 'Grup Rajawali'];

        $league->groups()
            ->orderBy('position')
            ->get()
            ->values()
            ->each(fn ($group, int $index) => $group->update(['name' => $groupNames[$index] ?? 'Grup '.($index + 1)]));
    }

    private function completeMatches(Collection $matches): void
    {
        foreach ($matches as $match) {
            $homeWins = $match->home_entry_id < $match->away_entry_id;
            $this->recordStraightSets($match, $homeWins);
        }
    }

    private function recordStraightSets(GameMatch $match, bool $homeWins): void
    {
        $match->sets()->delete();

        foreach ([1, 2] as $setNumber) {
            MatchSet::query()->create([
                'match_id' => $match->id,
                'set_number' => $setNumber,
                'home_points' => $homeWins ? 15 : 11 + $setNumber,
                'away_points' => $homeWins ? 11 + $setNumber : 15,
            ]);
        }

        $match->update([
            'home_score' => $homeWins ? 2 : 0,
            'away_score' => $homeWins ? 0 : 2,
            'status' => 'completed',
        ]);
    }
}
