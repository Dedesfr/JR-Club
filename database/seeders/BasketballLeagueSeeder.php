<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;

class BasketballLeagueSeeder extends Seeder
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

        $basketball = Sport::query()->firstOrCreate(
            ['name' => 'Basketball'],
            [
                'icon' => 'sports_basketball',
                'max_players_per_team' => 5,
                'description' => 'Indoor half-court and tournament games.',
            ],
        );

        $threeVsThree = $this->category($basketball, '3V3', '3 vs 3', 3, 1);

        $this->removeLeague('JR Basketball 5V5 Tournament');

        $this->seedLeague(
            admin: $admin,
            sport: $basketball,
            category: $threeVsThree,
            name: 'JR Basketball 3V3 Challenge',
            description: 'Fast-paced half-court basketball tournament for 3-player teams.',
            teamNames: ['Divisi Asuransi', 'Divisi Pelayanan', 'Divisi Human Capital (HC)', 'Divisi Umum'],
            playersPerTeam: 3,
            emailPrefix: 'basketball-3v3',
        );
    }

    private function category(Sport $sport, string $code, string $name, int $playerCount, int $sortOrder): SportCategory
    {
        return SportCategory::query()->updateOrCreate(
            ['sport_id' => $sport->id, 'code' => $code],
            [
                'name' => $name,
                'entry_type' => 'team',
                'player_count' => $playerCount,
                'gender_rule' => 'open',
                'sort_order' => $sortOrder,
                'is_active' => true,
            ],
        );
    }

    private function seedLeague(User $admin, Sport $sport, SportCategory $category, string $name, string $description, array $teamNames, int $playersPerTeam, string $emailPrefix): void
    {
        $league = League::query()->updateOrCreate(
            ['name' => $name],
            [
                'sport_id' => $sport->id,
                'sport_category_id' => $category->id,
                'category' => $category->code,
                'entry_type' => $category->entry_type,
                'description' => $description,
                'start_date' => now()->addWeek()->toDateString(),
                'end_date' => now()->addWeeks(6)->toDateString(),
                'status' => 'upcoming',
                'stage' => 'setup',
                'start_stage' => 'group',
                'participant_total' => count($teamNames),
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

        $teams = collect($teamNames)->map(function (string $teamName, int $teamIndex) use ($admin, $sport, $playersPerTeam, $emailPrefix) {
            $team = Team::query()->where('name', $teamName)->firstOrCreate(
                ['name' => $teamName],
                ['created_by' => $admin->id],
            );

            $players = collect(range(1, $playersPerTeam))->map(function (int $playerNumber) use ($teamIndex, $teamName, $emailPrefix) {
                $globalNumber = ($teamIndex * 10) + $playerNumber;

                return User::query()->updateOrCreate(
                    ['email' => sprintf('%s-%02d@jasaraharja.co.id', $emailPrefix, $globalNumber)],
                    [
                        'name' => $teamName.' Player '.$playerNumber,
                        'password' => 'password',
                        'role' => 'member',
                        'gender' => $playerNumber % 2 === 0 ? 'female' : 'male',
                    ],
                );
            });

            $team->members()->sync($players->mapWithKeys(fn (User $player, int $index) => [
                $player->id => [
                    'role' => $index === 0 ? 'captain' : 'member',
                    'joined_at' => now(),
                ],
            ])->all());

            return $team;
        });

        $league->teams()->sync($teams->pluck('id')->mapWithKeys(fn (int $id) => [$id => ['registered_at' => now()]])->all());
        $teams->values()->each(function (Team $team, int $index) use ($league) {
            $league->entries()->updateOrCreate(
                ['team_id' => $team->id],
                [
                    'group_name' => $team->name,
                    'player1_id' => $team->members()->wherePivot('role', '!=', 'substitute')->orderBy('users.id')->value('users.id'),
                    'seed' => $index + 1,
                ],
            );
        });
    }

    private function removeLeague(string $name): void
    {
        $league = League::query()->where('name', $name)->first();

        if (! $league) {
            return;
        }

        $league->matches()->delete();
        $league->groups()->delete();
        $league->teams()->detach();
        $league->entries()->delete();
        $league->delete();
    }
}
