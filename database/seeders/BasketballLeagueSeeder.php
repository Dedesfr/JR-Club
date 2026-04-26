<?php

namespace Database\Seeders;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\MatchSet;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\Team;
use App\Models\User;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

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
                'description' => 'Indoor half-court and league games.',
            ],
        );

        $threeVsThree = $this->category($basketball, '3V3', '3 vs 3', 3, 1);
        $fiveVsFive = $this->category($basketball, '5V5', '5 vs 5', 5, 2);

        $this->seedLeague(
            admin: $admin,
            sport: $basketball,
            category: $threeVsThree,
            name: 'JR Basketball 3V3 Challenge',
            description: 'Fast-paced half-court basketball league for 3-player teams.',
            teamNames: ['Asphalt Hawks', 'Blue Rim', 'Metro Ballers', 'Skyline Three'],
            playersPerTeam: 3,
            emailPrefix: 'basketball-3v3',
            startStage: 'group',
        );

        $this->seedLeague(
            admin: $admin,
            sport: $basketball,
            category: $fiveVsFive,
            name: 'JR Basketball 5V5 League',
            description: 'Full-team basketball league for 5-player squads.',
            teamNames: ['Jasa Hoopers', 'Garuda Court', 'Nusantara Dunk', 'Raharja Five'],
            playersPerTeam: 5,
            emailPrefix: 'basketball-5v5',
            startStage: 'bracket',
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

    private function seedLeague(User $admin, Sport $sport, SportCategory $category, string $name, string $description, array $teamNames, int $playersPerTeam, string $emailPrefix, string $startStage): void
    {
        $league = League::query()->updateOrCreate(
            ['name' => $name],
            [
                'sport_id' => $sport->id,
                'sport_category_id' => $category->id,
                'category' => $category->code,
                'entry_type' => $category->entry_type,
                'description' => $description,
                'start_date' => now()->toDateString(),
                'end_date' => now()->addWeeks(6)->toDateString(),
                'status' => 'active',
                'stage' => $startStage === 'bracket' ? 'upper' : 'group',
                'start_stage' => $startStage,
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
            $team = Team::query()->updateOrCreate(
                ['name' => $teamName, 'sport_id' => $sport->id],
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

        $entries = $league->entries()->orderBy('seed')->get();

        if ($startStage === 'bracket') {
            $this->completeBracketStartLeague($league->fresh(), $entries);
        } else {
            $this->completeGroupStartLeague($league->fresh(), $entries);
        }
    }

    private function completeGroupStartLeague(League $league, Collection $entries): void
    {
        $formatService = app(LeagueFormatService::class);
        $bracketService = app(BracketService::class);

        $formatService->createGroups($league, $entries, 2);
        $formatService->generateGroupMatches($league->fresh());

        $league->fresh()->matches()->where('stage', 'group')->get()->each(fn (GameMatch $match) => $this->recordStraightSets($match, true));
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
        $upperEntries = $standings
            ->flatMap(fn ($group) => $group['entries'])
            ->pluck('entry')
            ->chunk(2)
            ->map(fn ($group) => $group->first())
            ->values();

        $bracketService->seedBrackets($league->fresh(), $upperEntries, collect(), null, 0, true);
        $this->completeBracket($league->fresh(), 'upper', $bracketService);
        $league->fresh()->update(['status' => 'completed', 'stage' => 'completed']);
    }

    private function completeBracketStartLeague(League $league, Collection $entries): void
    {
        $bracketService = app(BracketService::class);

        $bracketService->seedBrackets($league, $entries, collect(), null, 0, true);
        $this->completeBracket($league->fresh(), 'upper', $bracketService);
        $this->completeThirdPlaceMatches($league->fresh());
        $league->fresh()->update(['status' => 'completed', 'stage' => 'completed']);
    }

    private function completeBracket(League $league, string $stage, BracketService $bracketService): void
    {
        $rounds = $league->matches()
            ->where('stage', $stage)
            ->reorder('round')
            ->pluck('round')
            ->unique()
            ->values();

        foreach ($rounds as $round) {
            $league->matches()
                ->where('stage', $stage)
                ->where('round', $round)
                ->reorder('id')
                ->get()
                ->each(function (GameMatch $match) use ($bracketService) {
                    $match = $match->fresh(['league', 'nextMatch']);

                    if ($match->status === 'completed' || $match->home_entry_id === null || $match->away_entry_id === null) {
                        return;
                    }

                    $winnerEntryId = min($match->home_entry_id, $match->away_entry_id);
                    $this->recordStraightSets($match, $winnerEntryId === $match->home_entry_id);
                    $bracketService->advanceWinner($match->fresh(['league', 'nextMatch']), $winnerEntryId);
                });
        }
    }

    private function completeThirdPlaceMatches(League $league): void
    {
        $league->matches()
            ->whereIn('stage', ['third_place', 'lower_third_place'])
            ->get()
            ->each(function (GameMatch $match) {
                if ($match->home_entry_id === null || $match->away_entry_id === null || $match->status === 'completed') {
                    return;
                }

                $this->recordStraightSets($match, $match->home_entry_id < $match->away_entry_id);
            });
    }

    private function recordStraightSets(GameMatch $match, bool $homeWins): void
    {
        MatchSet::query()->updateOrCreate(
            ['match_id' => $match->id, 'set_number' => 1],
            [
                'home_points' => $homeWins ? 21 : 16,
                'away_points' => $homeWins ? 16 : 21,
            ],
        );

        $match->update([
            'home_score' => $homeWins ? 1 : 0,
            'away_score' => $homeWins ? 0 : 1,
            'status' => 'completed',
        ]);
    }
}
