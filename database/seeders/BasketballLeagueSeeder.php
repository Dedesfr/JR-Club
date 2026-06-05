<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\Team;
use App\Models\User;
use Database\Seeders\Concerns\UsesSeededRoster;
use Illuminate\Database\Seeder;

class BasketballLeagueSeeder extends Seeder
{
    use UsesSeededRoster;

    public function run(): void
    {
        $admin = $this->seededAdmin();

        $basketball = $this->seededSport(
            'Basketball',
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
            playersPerTeam: 3,
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

    private function seedLeague(User $admin, Sport $sport, SportCategory $category, string $name, string $description, int $playersPerTeam): void
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
                'participant_total' => 4,
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

        $sourceTeams = $this->seededBadmintonTeams(4);

        if ($sourceTeams->count() < 4) {
            throw new \RuntimeException('Expected at least 4 seeded badminton teams for basketball seeding.');
        }

        $teams = $sourceTeams->map(function (Team $sourceTeam) use ($admin, $sport, $playersPerTeam) {
            $team = Team::query()->updateOrCreate(
                ['name' => $sourceTeam->name],
                [
                    'created_by' => $admin->id,
                    'logo_path' => $sourceTeam->logo_path,
                ],
            );

            $team->sports()->syncWithoutDetaching([$sport->id]);

            $players = $sourceTeam->members
                ->filter(fn ($member) => $member->pivot?->role !== 'substitute')
                ->take($playersPerTeam)
                ->values();

            if ($players->count() < $playersPerTeam) {
                throw new \RuntimeException("Team {$sourceTeam->name} does not have enough seeded members for basketball seeding.");
            }

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
