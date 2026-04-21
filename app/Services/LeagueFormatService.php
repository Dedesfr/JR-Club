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

    public function generateGroupMatches(League $league, \Illuminate\Support\Collection $scheduleMap = null, int $intervalMinutes = 0): void
    {
        DB::transaction(function () use ($league, $scheduleMap, $intervalMinutes) {
            $league->matches()->where('stage', 'group')->delete();

            $roundOffsets = [];

            $league->groups()->with('entries')->get()->each(function (LeagueGroup $group) use ($league, $scheduleMap, $intervalMinutes, &$roundOffsets) {
                $entries = $group->entries->values();
                $round = 1;

                // Implement a round-robin scheduling algorithm to properly assign rounds
                $numEntries = $entries->count();
                $isOdd = $numEntries % 2 !== 0;
                
                // If odd number of teams, add a dummy "bye" team
                $teams = $entries->toArray();
                if ($isOdd) {
                    $teams[] = null;
                    $numEntries++;
                }

                $totalRounds = $numEntries - 1;
                $matchesPerRound = $numEntries / 2;

                for ($r = 0; $r < $totalRounds; $r++) {
                    for ($i = 0; $i < $matchesPerRound; $i++) {
                        $home = $teams[$i];
                        $away = $teams[$numEntries - 1 - $i];

                        // Skip matches involving the dummy "bye" team
                        if ($home !== null && $away !== null) {
                            $scheduledAt = now();
                            if ($scheduleMap && $scheduleMap->has($round)) {
                                $scheduledAt = \Carbon\Carbon::parse($scheduleMap->get($round));
                            } elseif ($league->start_date) {
                                $scheduledAt = $league->start_date->copy()->addDays($round - 1);
                            } else {
                                $scheduledAt = now()->addDays($round - 1);
                            }

                            if (!isset($roundOffsets[$round])) {
                                $roundOffsets[$round] = 0;
                            }
                            
                            $time = $scheduledAt->copy()->addMinutes($roundOffsets[$round]);
                            $roundOffsets[$round] += $intervalMinutes;

                            GameMatch::create([
                                'league_id' => $league->id,
                                'league_group_id' => $group->id,
                                'home_entry_id' => $home['id'],
                                'away_entry_id' => $away['id'],
                                'scheduled_at' => $time,
                                'status' => 'scheduled',
                                'stage' => 'group',
                                'round' => $round,
                            ]);
                        }
                    }

                    // Rotate teams for next round, keeping the first team fixed
                    $teams = array_merge(
                        [$teams[0]],
                        [array_pop($teams)],
                        array_slice($teams, 1, $numEntries - 2)
                    );
                    $round++;
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
            ->with(['groupEntries.entry.player1', 'groupEntries.entry.player2', 'groupEntries.entry.substitutes', 'matches.sets'])
            ->orderBy('position')
            ->get()
            ->map(function (LeagueGroup $group) {
                $stats = [];
                foreach ($group->groupEntries as $ge) {
                    $stats[$ge->entry->id] = ['played' => 0, 'won' => 0, 'lost' => 0, 'score' => 0];
                }

                foreach ($group->matches->where('status', 'completed') as $match) {
                    if (isset($stats[$match->home_entry_id])) {
                        $stats[$match->home_entry_id]['played']++;
                        if ($match->winner_entry_id === $match->home_entry_id) {
                            $stats[$match->home_entry_id]['won']++;
                        } elseif ($match->home_score !== $match->away_score) {
                            $stats[$match->home_entry_id]['lost']++;
                        }

                        if ($match->sets) {
                            foreach ($match->sets as $set) {
                                $stats[$match->home_entry_id]['score'] += $set->home_points;
                            }
                        }
                    }

                    if (isset($stats[$match->away_entry_id])) {
                        $stats[$match->away_entry_id]['played']++;
                        if ($match->winner_entry_id === $match->away_entry_id) {
                            $stats[$match->away_entry_id]['won']++;
                        } elseif ($match->home_score !== $match->away_score) {
                            $stats[$match->away_entry_id]['lost']++;
                        }

                        if ($match->sets) {
                            foreach ($match->sets as $set) {
                                $stats[$match->away_entry_id]['score'] += $set->away_points;
                            }
                        }
                    }
                }

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
                            'played' => $stats[$groupEntry->entry->id]['played'] ?? 0,
                            'won' => $stats[$groupEntry->entry->id]['won'] ?? 0,
                            'lost' => $stats[$groupEntry->entry->id]['lost'] ?? 0,
                            'score' => $stats[$groupEntry->entry->id]['score'] ?? 0,
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
