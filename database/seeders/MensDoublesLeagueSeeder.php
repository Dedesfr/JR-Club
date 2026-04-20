<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Database\Seeder;

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

        $league = League::query()->updateOrCreate(
            ['name' => 'JR Men Doubles Championship'],
            [
                'sport_id' => $badminton->id,
                'category' => 'MD',
                'entry_type' => 'double',
                'description' => 'Seeded ganda putra league with 16 doubles entries.',
                'start_date' => now()->toDateString(),
                'end_date' => now()->addWeeks(4)->toDateString(),
                'status' => 'upcoming',
                'stage' => 'setup',
                'participant_total' => 16,
                'sets_to_win' => 2,
                'points_per_set' => 15,
                'advance_upper_count' => 4,
                'advance_lower_count' => 4,
                'created_by' => $admin->id,
            ],
        );

        $league->matches()->delete();
        $league->groups()->delete();
        $league->entries()->delete();

        $players = collect(range(1, 32))->map(function (int $number) {
            $paddedNumber = str_pad((string) $number, 2, '0', STR_PAD_LEFT);

            return User::query()->updateOrCreate(
                ['email' => "md-player-{$paddedNumber}@jasaraharja.co.id"],
                [
                    'name' => "MD Player {$paddedNumber}",
                    'password' => 'password',
                    'role' => 'member',
                    'gender' => 'male',
                ],
            );
        });

        $players->chunk(2)->values()->each(function ($pair, int $index) use ($league) {
            $seed = $index + 1;

            $league->entries()->create([
                'group_name' => 'JR Putra '.str_pad((string) $seed, 2, '0', STR_PAD_LEFT),
                'player1_id' => $pair->values()[0]->id,
                'player2_id' => $pair->values()[1]->id,
                'seed' => $seed,
            ]);
        });
    }
}
