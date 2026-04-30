<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class UpcomingBadmintonChampionshipSeeder extends Seeder
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

        $startDate = Carbon::create(2026, 5, 7)->toDateString();
        $description = 'Start Competition: 7 Mei 2026. Time: 17.00 - 20.00. Location: Grand Sport Centre, Kuningan.';

        foreach ([
            ['name' => 'JR Men Double Championship', 'code' => 'MD', 'category_name' => 'Ganda Putra', 'gender_rule' => 'male'],
            ['name' => 'JR Women Double Championship', 'code' => 'WD', 'category_name' => 'Ganda Putri', 'gender_rule' => 'female'],
            ['name' => 'Mix Double Championship', 'code' => 'XD', 'category_name' => 'Ganda Campuran', 'gender_rule' => 'mixed'],
        ] as $leagueDefinition) {
            $category = SportCategory::query()->firstOrCreate(
                ['sport_id' => $badminton->id, 'code' => $leagueDefinition['code']],
                [
                    'name' => $leagueDefinition['category_name'],
                    'entry_type' => 'double',
                    'player_count' => 2,
                    'gender_rule' => $leagueDefinition['gender_rule'],
                    'sort_order' => match ($leagueDefinition['code']) {
                        'MD' => 3,
                        'WD' => 4,
                        default => 5,
                    },
                    'is_active' => true,
                ],
            );

            $league = League::query()->updateOrCreate(
                ['name' => $leagueDefinition['name']],
                [
                    'sport_id' => $badminton->id,
                    'sport_category_id' => $category->id,
                    'category' => $leagueDefinition['code'],
                    'entry_type' => 'double',
                    'description' => $description,
                    'start_date' => $startDate,
                    'end_date' => $startDate,
                    'status' => 'upcoming',
                    'stage' => 'setup',
                    'start_stage' => 'group',
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
        }
    }
}
