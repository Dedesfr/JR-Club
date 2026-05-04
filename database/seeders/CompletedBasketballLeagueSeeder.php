<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class CompletedBasketballLeagueSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@jasaraharja.co.id'],
            [
                'name' => 'JR Club Admin',
                'password' => 'password',
                'role' => 'admin',
                'gender' => 'male',
            ],
        );

        $basketball = Sport::query()->firstOrCreate(
            ['name' => 'Basketball'],
            [
                'icon' => 'sports_basketball',
                'max_players_per_team' => 5,
                'description' => 'Indoor half-court and tournament games.',
            ],
        );

        $category = SportCategory::query()->updateOrCreate(
            ['sport_id' => $basketball->id, 'code' => '3V3'],
            [
                'name' => '3 vs 3',
                'entry_type' => 'team',
                'player_count' => 3,
                'gender_rule' => 'open',
                'sort_order' => 1,
                'is_active' => true,
            ],
        );

        $league = League::query()->updateOrCreate(
            ['name' => 'Basketball 3 on 3 Tournament Jasa Raharja'],
            [
                'sport_id' => $basketball->id,
                'sport_category_id' => $category->id,
                'category' => $category->code,
                'entry_type' => $category->entry_type,
                'description' => 'Completed basketball 3 on 3 tournament seeded from final event results.',
                'start_date' => now()->subWeeks(6)->toDateString(),
                'end_date' => now()->subWeeks(5)->toDateString(),
                'status' => 'completed',
                'stage' => 'completed',
                'start_stage' => 'bracket',
                'participant_total' => 16,
                'sets_to_win' => 1,
                'points_per_set' => 21,
                'advance_upper_count' => 0,
                'advance_lower_count' => 0,
                'created_by' => $admin->id,
            ],
        );

        $league->matches()->delete();
        $league->groups()->delete();
        $league->teams()->detach();
        $league->entries()->delete();
        $league->update([
            'status' => 'completed',
            'stage' => 'completed',
            'upper_champion_entry_id' => null,
            'lower_champion_entry_id' => null,
            'third_place_match_id' => null,
            'lower_third_place_match_id' => null,
        ]);

        $teams = $this->seedTeams($basketball, $admin);

        $league->teams()->sync(
            $teams->pluck('id')->mapWithKeys(fn (int $id) => [$id => ['registered_at' => now()]])->all(),
        );

        $entries = $teams->values()->mapWithKeys(function (Team $team, int $index) use ($league) {
            $players = $team->members()->orderByPivot('role')->orderBy('users.id')->get();

            $entry = $league->entries()->create([
                'team_id' => $team->id,
                'group_name' => $team->name,
                'player1_id' => $players[0]->id,
                'player2_id' => $players[1]->id ?? null,
                'seed' => $index + 1,
            ]);

            return [$team->name => $entry];
        });

        $matches = collect($this->matchDefinitions())->map(fn (array $definition) => $this->createCompletedMatch($league, $entries, $definition));

        $champion = $entries['Pelayanan dan TJSL'];
        $thirdPlaceMatch = $matches->first(fn ($match) => $match->stage === 'third_place');

        $league->update([
            'status' => 'completed',
            'stage' => 'completed',
            'upper_champion_entry_id' => $champion->id,
            'third_place_match_id' => $thirdPlaceMatch?->id,
        ]);

        $league->awards()->delete();
        $league->awards()->createMany([
            ['title' => 'Man of The Match', 'winner_label' => 'M. Nugroho - Divisi Pelayanan', 'sort_order' => 1],
            ['title' => 'Three Points Contest', 'winner_label' => 'Dillan - Divisi Keuangan', 'sort_order' => 2],
            ['title' => 'Free Throw Contest', 'winner_label' => 'Reno Vancasavio - Divisi STK', 'sort_order' => 3],
        ]);
    }

    private function seedTeams(Sport $sport, User $admin): Collection
    {
        return collect($this->teamDefinitions())
            ->mapWithKeys(function (array $definition) use ($sport, $admin) {
                $team = Team::query()->updateOrCreate(
                    ['name' => $definition['name'], 'sport_id' => $sport->id],
                    [
                        'created_by' => $admin->id,
                        'logo_path' => $this->resolveTeamLogoPath($definition['name']),
                    ],
                );

                $members = collect($definition['players'])
                    ->filter(fn (string $name) => $name !== '-')
                    ->values()
                    ->mapWithKeys(function (string $name, int $index) use ($definition) {
                        $user = User::query()->updateOrCreate(
                            ['email' => $this->buildEmail($name, $definition['name'])],
                            [
                                'name' => $name,
                                'password' => 'password',
                                'role' => 'member',
                                'gender' => null,
                            ],
                        );

                        return [
                            $user->id => [
                                'role' => $index === 0 ? 'captain' : 'member',
                                'joined_at' => now(),
                            ],
                        ];
                    });

                $team->members()->sync($members->all());

                return [$definition['name'] => $team];
            });
    }

    private function teamDefinitions(): array
    {
        return [
            ['name' => 'Human Capital', 'players' => ['Ramadhani', 'Dimas Hadi', 'Dodo', 'Adit', 'Ikhsan']],
            ['name' => 'Satuan Pengawasan Intern', 'players' => ['Dana', 'Bagus', 'Aryo', 'Heri', '-']],
            ['name' => 'Umum', 'players' => ['Reza', 'Yoga', 'Patra', 'Rahman', 'Affif']],
            ['name' => 'Sekretariat Perusahaan', 'players' => ['Ridho', 'Komang', 'Ananda', 'Erik', '-']],
            ['name' => 'Pelayanan dan TJSL', 'players' => ['Yoko', 'Barkah', 'Augy', 'Subhi', 'Miqdad']],
            ['name' => 'Akuntansi', 'players' => ['Gibran', 'Yogie', 'Dzauqy', 'Hanafi', 'Hilman']],
            ['name' => 'Keuangan', 'players' => ['Bisma', 'Ficko', 'Dillan', 'Rizki', 'Fahmie']],
            ['name' => 'Strategi Transformasi dan Korporasi', 'players' => ['Radito', 'Reno', 'Prima', 'Vierdy', 'Aldi']],
            ['name' => 'Kepatuhan dan Hukum', 'players' => ['Harwan', 'Tomo', 'Fikri', 'Aldino', 'Dayat']],
            ['name' => 'Manajemen Risiko', 'players' => ['Ujang', 'Guntur', 'Deny', 'Agung', '-']],
            ['name' => 'Asuransi', 'players' => ['Bayu', 'Aqsa', 'Nofrizal', 'Reza', 'Agha']],
            ['name' => 'Teknologi Informasi dan Komunikasi', 'players' => ['Barma', 'Arnold', 'Aby', 'Fadjrin', '-']],
            ['name' => 'Investasi', 'players' => ['Yuniar Ahmadani', 'IGN Budi Kuncara', 'Agung Rizka R', 'Ferhat Husein', 'Fatkhur Haris']],
            ['name' => 'Aktuaria Perusahaan', 'players' => ['Michael', 'Arif K', 'Indra Fauzan', 'Dany Aryanto', '-']],
        ];
    }

    private function matchDefinitions(): array
    {
        return [
            ['round' => 1, 'home' => 'Manajemen Risiko', 'away' => 'Teknologi Informasi dan Komunikasi', 'home_score' => 1, 'away_score' => 3],
            ['round' => 1, 'home' => 'Akuntansi', 'away' => null, 'home_score' => 1, 'away_score' => 0],
            ['round' => 1, 'home' => 'Umum', 'away' => 'Pelayanan dan TJSL', 'home_score' => 1, 'away_score' => 6],
            ['round' => 1, 'home' => 'Aktuaria Perusahaan', 'away' => 'Satuan Pengawasan Intern', 'home_score' => 0, 'away_score' => 21],
            ['round' => 1, 'home' => 'Human Capital', 'away' => 'Strategi Transformasi dan Korporasi', 'home_score' => 3, 'away_score' => 4],
            ['round' => 1, 'home' => 'Keuangan', 'away' => null, 'home_score' => 1, 'away_score' => 0],
            ['round' => 1, 'home' => 'Sekretariat Perusahaan', 'away' => 'Asuransi', 'home_score' => 21, 'away_score' => 0],
            ['round' => 1, 'home' => 'Kepatuhan dan Hukum', 'away' => 'Investasi', 'home_score' => 21, 'away_score' => 0],
            ['round' => 2, 'home' => 'Akuntansi', 'away' => 'Teknologi Informasi dan Komunikasi', 'home_score' => 0, 'away_score' => 21],
            ['round' => 2, 'home' => 'Pelayanan dan TJSL', 'away' => 'Satuan Pengawasan Intern', 'home_score' => 6, 'away_score' => 3],
            ['round' => 2, 'home' => 'Kepatuhan dan Hukum', 'away' => 'Strategi Transformasi dan Korporasi', 'home_score' => 3, 'away_score' => 6],
            ['round' => 2, 'home' => 'Sekretariat Perusahaan', 'away' => 'Keuangan', 'home_score' => 2, 'away_score' => 1],
            ['round' => 3, 'home' => 'Teknologi Informasi dan Komunikasi', 'away' => 'Pelayanan dan TJSL', 'home_score' => 4, 'away_score' => 6],
            ['round' => 3, 'home' => 'Strategi Transformasi dan Korporasi', 'away' => 'Sekretariat Perusahaan', 'home_score' => 5, 'away_score' => 2],
            ['round' => 4, 'home' => 'Pelayanan dan TJSL', 'away' => 'Strategi Transformasi dan Korporasi', 'home_score' => 3, 'away_score' => 1],
            ['round' => 4, 'stage' => 'third_place', 'home' => 'Teknologi Informasi dan Komunikasi', 'away' => 'Sekretariat Perusahaan', 'home_score' => 5, 'away_score' => 4],
        ];
    }

    private function createCompletedMatch(League $league, Collection $entries, array $definition)
    {
        $match = $league->matches()->create([
            'home_team_id' => $definition['home'] ? $entries[$definition['home']]->team_id : null,
            'away_team_id' => $definition['away'] ? $entries[$definition['away']]->team_id : null,
            'home_entry_id' => $definition['home'] ? $entries[$definition['home']]->id : null,
            'away_entry_id' => $definition['away'] ? $entries[$definition['away']]->id : null,
            'scheduled_at' => now()->subWeeks(6)->addDays($definition['round'] - 1),
            'status' => 'completed',
            'stage' => $definition['stage'] ?? 'upper',
            'round' => $definition['round'],
            'home_score' => $definition['home_score'],
            'away_score' => $definition['away_score'],
        ]);

        MatchSet::query()->create([
            'match_id' => $match->id,
            'set_number' => 1,
            'home_points' => $definition['home_score'],
            'away_points' => $definition['away_score'],
        ]);

        return $match;
    }

    private function buildEmail(string $memberName, string $teamKey): string
    {
        return sprintf('%s.%s@jasaraharja.co.id', Str::slug($teamKey), Str::slug($memberName));
    }

    private function resolveTeamLogoPath(string $teamName): ?string
    {
        $matches = glob(public_path('images/team-logo/'.$teamName.'.*')) ?: [];

        if ($matches === []) {
            return null;
        }

        return '/images/team-logo/'.basename($matches[0]);
    }
}
