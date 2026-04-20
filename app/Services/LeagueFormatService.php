<?php

namespace App\Services;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\LeagueGroup;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class LeagueFormatService
{
    public function divisionOptions(int $total): array
    {
        $options = [];

        for ($groupCount = 2; $groupCount <= $total; $groupCount++) {
            if ($total % $groupCount !== 0) {
                continue;
            }

            $groupSize = (int) ($total / $groupCount);

            if ($groupSize < 2) {
                continue;
            }

            $options[] = [
                'group_count' => $groupCount,
                'group_size' => $groupSize,
            ];
        }

        return $options;
    }

    public function createGroups(League $league, Collection $entries, int $groupCount): Collection
    {
        return DB::transaction(function () use ($league, $entries, $groupCount) {
            $league->matches()->where('stage', 'group')->delete();
            $league->groups()->each(function (LeagueGroup $group) {
                $group->delete();
            });

            $groups = collect(range(1, $groupCount))->map(function (int $position) use ($league) {
                return $league->groups()->create([
                    'name' => 'Group '.chr(64 + $position),
                    'position' => $position,
                ]);
            });

            $orderedEntries = $entries->values();
            $direction = 1;
            $index = 0;

            foreach ($orderedEntries as $seed => $entry) {
                $group = $groups[$index];
                $group->entries()->attach($entry->id, [
                    'seed' => $seed + 1,
                    'points' => 0,
                ]);

                if ($direction === 1 && $index === $groupCount - 1) {
                    $direction = -1;
                } elseif ($direction === -1 && $index === 0) {
                    $direction = 1;
                } else {
                    $index += $direction;
                }
            }

            $league->update([
                'group_count' => $groupCount,
                'group_size' => (int) ($entries->count() / $groupCount),
                'stage' => 'group',
            ]);

            return $league->groups()
                ->with(['entries.player1', 'entries.player2', 'entries.substitutes'])
                ->orderBy('position')
                ->get();
        });
    }

    public function generateGroupMatches(League $league): void
    {
        DB::transaction(function () use ($league) {
            $league->matches()->where('stage', 'group')->delete();

            $league->groups()->with('entries')->get()->each(function (LeagueGroup $group) use ($league) {
                $entries = $group->entries->values();

                for ($i = 0; $i < $entries->count(); $i++) {
                    for ($j = $i + 1; $j < $entries->count(); $j++) {
                        GameMatch::create([
                            'league_id' => $league->id,
                            'league_group_id' => $group->id,
                            'home_entry_id' => $entries[$i]->id,
                            'away_entry_id' => $entries[$j]->id,
                            'scheduled_at' => now(),
                            'status' => 'scheduled',
                            'stage' => 'group',
                            'round' => 1,
                        ]);
                    }
                }
            });
        });
    }

    public function recomputeGroupPoints(League $league): void
    {
        $league->groups()->with(['groupEntries', 'matches.sets'])->get()->each(function (LeagueGroup $group) {
            $points = $group->groupEntries->mapWithKeys(fn ($groupEntry) => [$groupEntry->league_entry_id => 0]);

            foreach ($group->matches->where('status', 'completed') as $match) {
                if ($match->winner_entry_id !== null && $points->has($match->winner_entry_id)) {
                    $points->put($match->winner_entry_id, $points->get($match->winner_entry_id, 0) + 1);
                }
            }

            foreach ($group->groupEntries as $groupEntry) {
                $groupEntry->update([
                    'points' => $points[$groupEntry->league_entry_id] ?? 0,
                ]);
            }
        });
    }

    public function standings(League $league): array
    {
        if (! $league->isBadminton()) {
            return $this->teamStandings($league);
        }

        $this->recomputeGroupPoints($league);

        return $league->groups()
            ->with(['groupEntries.entry.player1', 'groupEntries.entry.player2', 'groupEntries.entry.substitutes'])
            ->orderBy('position')
            ->get()
            ->map(function (LeagueGroup $group) {
                return [
                    'group' => $group->name,
                    'entries' => $group->groupEntries
                        ->sortBy([
                            ['points', 'desc'],
                            [fn ($entry) => $entry->manual_advance_rank ?? PHP_INT_MAX, 'asc'],
                            ['seed', 'asc'],
                        ])
                        ->values()
                        ->map(fn ($groupEntry) => [
                            'id' => $groupEntry->id,
                            'points' => $groupEntry->points,
                            'manual_advance_rank' => $groupEntry->manual_advance_rank,
                            'entry' => $groupEntry->entry,
                        ])
                        ->all(),
                ];
            })
            ->all();
    }

    private function teamStandings(League $league): array
    {
        $rows = $league->teams->mapWithKeys(fn ($team) => [$team->id => [
            'team' => $team,
            'played' => 0,
            'won' => 0,
            'drawn' => 0,
            'lost' => 0,
            'goals_for' => 0,
            'goals_against' => 0,
            'points' => 0,
        ]])->all();

        foreach ($league->matches->where('status', 'completed') as $match) {
            foreach ([
                [$match->home_team_id, $match->home_score, $match->away_score],
                [$match->away_team_id, $match->away_score, $match->home_score],
            ] as [$teamId, $for, $against]) {
                if (! isset($rows[$teamId])) {
                    continue;
                }

                $rows[$teamId]['played']++;
                $rows[$teamId]['goals_for'] += $for;
                $rows[$teamId]['goals_against'] += $against;

                if ($for > $against) {
                    $rows[$teamId]['won']++;
                    $rows[$teamId]['points'] += 3;
                } elseif ($for === $against) {
                    $rows[$teamId]['drawn']++;
                    $rows[$teamId]['points']++;
                } else {
                    $rows[$teamId]['lost']++;
                }
            }
        }

        return collect($rows)->sortByDesc('points')->values()->all();
    }
}
