<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Sport;
use App\Models\User;
use Database\Seeders\Concerns\UsesSeededRoster;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

/**
 * Standalone seeder to manually verify the add-racket-match-formats change.
 *
 * Creates one league per distinct completion code path, each with two empty
 * scheduled matches. Open a match (admin Leagues > Matches tab, or the public
 * /matches/{id} page while logged in as admin) and record set scores to exercise
 * the real validateSetScore + recomputeMatchOutcome logic.
 *
 * Run on its own: php artisan db:seed --class=RacketMatchFormatsSeeder
 *
 * Format keys below are the literal MatchFormat registry keys (see
 * app/Support/MatchFormat.php) — NOT the prose keys in the proposal/spec.
 */
class RacketMatchFormatsSeeder extends Seeder
{
    use UsesSeededRoster;

    public function run(): void
    {
        $admin = $this->seededAdmin();
        $players = $this->players();

        $padel = $this->seededSport('Padel', [
            'icon' => 'sports_tennis',
            'max_players_per_team' => 2,
            'description' => 'Fast doubles sessions after work.',
        ]);

        $tenisMeja = $this->seededSport('Tenis Meja', [
            'icon' => 'sports_tennis',
            'max_players_per_team' => 2,
            'description' => 'Table tennis singles and doubles.',
        ]);

        // [name, sport, match_format, sets_to_win, points_per_set, verify hint]
        $leagues = [
            [
                'Verify — Tenis Meja Best of Five (deuce)',
                $tenisMeja->id,
                'tenis_meja_best_of_five',
                3,
                11,
                'first_to_win + deuce: 11-9 accepted, 11-10 rejected, 12-10 accepted; completes at 3 sets won.',
            ],
            [
                'Verify — Padel Best of Three (all sets)',
                $padel->id,
                'padel_best_of_three',
                3,
                21,
                'all_sets: stays live until all 3 sets recorded; winner = more sets won.',
            ],
            [
                'Verify — Padel Americano (single block)',
                $padel->id,
                'padel_americano',
                1,
                21,
                'single_block: completes after one block to 21; no second set allowed.',
            ],
            [
                'Verify — Badminton Custom (regression)',
                $padel->id,
                null,
                2,
                21,
                'null format: first_to_win, completes as soon as one side reaches 2 sets.',
            ],
        ];

        foreach ($leagues as [$name, $sportId, $matchFormat, $setsToWin, $pointsPerSet, $hint]) {
            $this->seedLeague($admin->id, $players, $name, $sportId, $matchFormat, $setsToWin, $pointsPerSet, $hint);
        }
    }

    /** Four distinct users to satisfy the NOT NULL player1_id on entries. */
    private function players(): Collection
    {
        $players = User::query()->orderBy('id')->limit(4)->get();

        if ($players->count() < 4) {
            throw new \RuntimeException('Need at least 4 users seeded before running RacketMatchFormatsSeeder.');
        }

        return $players->values();
    }

    private function seedLeague(int $adminId, Collection $players, string $name, int $sportId, ?string $matchFormat, int $setsToWin, int $pointsPerSet, string $hint): void
    {
        $league = League::query()->updateOrCreate(
            ['name' => $name],
            [
                'sport_id' => $sportId,
                'sport_category_id' => null,
                'category' => null,
                'entry_type' => 'double',
                'match_format' => $matchFormat,
                'description' => $hint,
                'start_date' => now()->toDateString(),
                'end_date' => now()->addWeeks(2)->toDateString(),
                'status' => 'active',
                'stage' => 'setup',
                'participant_total' => 4,
                'group_count' => 0,
                'group_size' => 0,
                'sets_to_win' => $setsToWin,
                'points_per_set' => $pointsPerSet,
                'created_by' => $adminId,
            ],
        );

        // Idempotent: rebuild children so re-seeding gives fresh, unscored matches.
        $league->matches()->delete();
        $league->entries()->delete();

        $entries = collect(['Team A', 'Team B', 'Team C', 'Team D'])
            ->map(fn (string $label, int $index) => $league->entries()->create([
                'group_name' => $label,
                'player1_id' => $players[$index]->id,
                'seed' => $index + 1,
            ]));

        // Two empty scheduled matches (A vs B, C vs D). Null stage renders under
        // the "Tournament Match" group in the admin Matches tab.
        foreach ([[0, 1], [2, 3]] as [$home, $away]) {
            $league->matches()->create([
                'home_entry_id' => $entries[$home]->id,
                'away_entry_id' => $entries[$away]->id,
                'scheduled_at' => now()->addDay(),
                'status' => 'scheduled',
                'stage' => null,
                'home_score' => 0,
                'away_score' => 0,
            ]);
        }
    }
}
