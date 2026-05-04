<?php

namespace Database\Seeders;

use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use Database\Seeders\Concerns\UsesSeededRoster;
use Illuminate\Database\Seeder;

class MensDoublesLeagueSeeder extends Seeder
{
    use UsesSeededRoster;

    public function run(): void
    {
        $admin = $this->seededAdmin();

        $badminton = $this->seededSport(
            'Badminton',
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
                'description' => 'Seeded ganda putra tournament with 16 doubles entries.',
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

        $this->mensDoublesEntriesFromSeededTeams()->each(function (array $entry) use ($league) {
            $leagueEntry = $league->entries()->create([
                'team_id' => $entry['team']->id,
                'group_name' => $entry['team']->name,
                'player1_id' => $entry['player1_id'],
                'player2_id' => $entry['player2_id'],
                'substitute_id' => $entry['substitute_id'],
                'seed' => $entry['seed'],
            ]);

            $leagueEntry->substitutes()->sync($entry['substitute_ids']);
        });
    }
}
