<?php

namespace Database\Seeders;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\User;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class CompletedMensDoublesLeagueSeeder extends Seeder
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
            ['name' => 'JR Men Doubles Finals Seed'],
            [
                'sport_id' => $badminton->id,
                'category' => 'MD',
                'entry_type' => 'double',
                'description' => 'Completed ganda putra league with group stage, upper bracket, and lower bracket results.',
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
        $bracketService = app(BracketService::class);

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

        $standings = collect($formatService->standings($league->fresh()));
        $rankedEntries = $standings
            ->flatMap(fn ($group) => $group['entries'])
            ->map(fn ($row) => $row['entry']);

        $groupCount = $league->fresh()->groups()->count();
        $groupSize = (int) ($rankedEntries->count() / max(1, $groupCount));
        $upperEntries = $rankedEntries
            ->chunk(max(1, $groupSize))
            ->flatMap(fn ($group) => $group->slice(0, 4))
            ->values();
        $lowerEntries = $rankedEntries
            ->chunk(max(1, $groupSize))
            ->flatMap(fn ($group) => $group->slice(4, 4))
            ->values();

        $bracketService->seedBrackets($league->fresh(), $upperEntries, $lowerEntries);

        $league = $league->fresh();
        $this->assignBracketEntries($league, 'upper', $upperEntries);
        $this->assignBracketEntries($league, 'lower', $lowerEntries);

        $this->completeBracket($league->fresh(), 'upper', $bracketService);
        $this->completeBracket($league->fresh(), 'lower', $bracketService);

        $this->completeThirdPlaceMatches($league->fresh());

        $league->fresh()->update(['status' => 'completed', 'stage' => 'completed']);
    }

    private function assignBracketEntries(League $league, string $stage, Collection $entries): void
    {
        $firstRoundMatches = $league->matches()
            ->where('stage', $stage)
            ->where('round', 1)
            ->orderBy('id')
            ->get();

        $entries = $entries->values();

        foreach ($firstRoundMatches as $index => $match) {
            $match->update([
                'home_entry_id' => $entries[$index * 2]?->id,
                'away_entry_id' => $entries[$index * 2 + 1]?->id,
            ]);
        }
    }

    private function completeThirdPlaceMatches(League $league): void
    {
        $matches = $league->matches()
            ->whereIn('stage', ['third_place', 'lower_third_place'])
            ->get();

        foreach ($matches as $match) {
            if ($match->status === 'completed' || $match->home_entry_id === null || $match->away_entry_id === null) {
                continue;
            }

            $homeWins = $match->home_entry_id < $match->away_entry_id;
            $this->recordStraightSets($match, $homeWins);
        }
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

    private function completeBracket(League $league, string $stage, BracketService $bracketService): void
    {
        $rounds = $league->matches()
            ->where('stage', $stage)
            ->reorder('round', 'asc')
            ->pluck('round')
            ->unique()
            ->values();

        foreach ($rounds as $round) {
            $matches = $league->matches()
                ->where('stage', $stage)
                ->where('round', $round)
                ->reorder('id', 'asc')
                ->get();

            foreach ($matches as $match) {
                $match = $match->fresh(['league', 'nextMatch']);

                if ($match->status === 'completed' || $match->home_entry_id === null || $match->away_entry_id === null) {
                    continue;
                }

                $winnerEntryId = min($match->home_entry_id, $match->away_entry_id);
                $homeWins = $winnerEntryId === $match->home_entry_id;

                $this->recordStraightSets($match, $homeWins);
                $bracketService->advanceWinner($match->fresh(['league', 'nextMatch']), $winnerEntryId);
            }
        }
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
