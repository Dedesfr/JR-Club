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

            $groupRounds = $league->groups()
                ->with('entries')
                ->orderBy('position')
                ->get()
                ->map(fn (LeagueGroup $group) => [
                    'group' => $group,
                    'rounds' => $this->groupStageRounds($group->entries->values()),
                ]);

            $balancedGroupRounds = $this->balanceGroupRoundWeeks($groupRounds);

            $balancedGroupRounds->each(function (array $groupSchedule) use ($league, $scheduleMap, $intervalMinutes, &$roundOffsets) {
                $group = $groupSchedule['group'];

                foreach ($groupSchedule['rounds'] as $roundIndex => $matches) {
                    $round = $roundIndex + 1;

                    foreach ($matches as [$home, $away]) {
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
                            'home_entry_id' => $home->id,
                            'away_entry_id' => $away->id,
                            'scheduled_at' => $time,
                            'status' => 'scheduled',
                            'stage' => 'group',
                            'round' => $round,
                        ]);
                    }
                }
            });
        });
    }

    private function balanceGroupRoundWeeks(Collection $groupRounds): Collection
    {
        $weeklyTotals = [];

        return $groupRounds->map(function (array $groupSchedule) use (&$weeklyTotals) {
            $rounds = $this->orderRoundsForWeeklyBalance($groupSchedule['rounds'], $weeklyTotals);

            foreach ($rounds as $index => $matches) {
                $weeklyTotals[$index] = ($weeklyTotals[$index] ?? 0) + count($matches);
            }

            return [
                'group' => $groupSchedule['group'],
                'rounds' => $rounds,
            ];
        });
    }

    private function orderRoundsForWeeklyBalance(array $rounds, array $weeklyTotals): array
    {
        if ($weeklyTotals === []) {
            return $rounds;
        }

        $roundCount = count($rounds);
        $totalMatches = array_sum($weeklyTotals) + array_sum(array_map('count', $rounds));
        $targetPerWeek = intdiv($totalMatches, $roundCount);
        $remainingRounds = array_values($rounds);
        $orderedRounds = [];

        for ($week = 0; $week < $roundCount; $week++) {
            $currentTotal = $weeklyTotals[$week] ?? 0;
            $targetMatches = $targetPerWeek - $currentTotal;
            $bestIndex = 0;
            $bestScore = null;

            foreach ($remainingRounds as $index => $matches) {
                $score = abs(count($matches) - $targetMatches);

                if ($bestScore === null || $score < $bestScore) {
                    $bestIndex = $index;
                    $bestScore = $score;
                }
            }

            $orderedRounds[] = $remainingRounds[$bestIndex];
            array_splice($remainingRounds, $bestIndex, 1);
        }

        return $orderedRounds;
    }

    private function groupStageRounds(Collection $entries): array
    {
        $originalCount = $entries->count();

        if ($originalCount < 2) {
            return [];
        }

        $teams = $entries->values()->all();

        if ($originalCount % 2 === 1) {
            $teams[] = null;
        }

        $slotCount = count($teams);
        $rounds = [];

        for ($round = 0; $round < $slotCount - 1; $round++) {
            $matches = [];

            for ($index = 0; $index < intdiv($slotCount, 2); $index++) {
                $home = $teams[$index];
                $away = $teams[$slotCount - 1 - $index];

                if ($home !== null && $away !== null) {
                    $matches[] = [$home, $away];
                }
            }

            $rounds[] = $matches;
            $last = array_pop($teams);
            $teams = array_merge([$teams[0]], [$last], array_slice($teams, 1));
        }

        if ($originalCount % 2 === 0) {
            return $this->appendBalancedByeRound($rounds, $originalCount);
        }

        return $rounds;
    }

    private function appendBalancedByeRound(array $rounds, int $entryCount): array
    {
        $totalMatches = intdiv($entryCount * ($entryCount - 1), 2);
        $extraRoundTarget = intdiv($totalMatches, $entryCount);

        if ($extraRoundTarget < 1) {
            $rounds[] = [];

            return $rounds;
        }

        $moves = $this->findDisjointMatchesForExtraRound($rounds, $extraRoundTarget);

        if ($moves === null) {
            $rounds[] = [];

            return $rounds;
        }

        $extraRound = [];
        foreach ($moves as $move) {
            $extraRound[] = $rounds[$move['round']][$move['match']];
        }

        usort($moves, fn (array $a, array $b) => [$b['round'], $b['match']] <=> [$a['round'], $a['match']]);
        foreach ($moves as $move) {
            array_splice($rounds[$move['round']], $move['match'], 1);
        }

        $rounds[] = $extraRound;

        return $rounds;
    }

    private function findDisjointMatchesForExtraRound(array $rounds, int $needed, int $startRound = 0, array $usedEntryIds = []): ?array
    {
        if ($needed === 0) {
            return [];
        }

        for ($roundIndex = $startRound; $roundIndex < count($rounds); $roundIndex++) {
            foreach ($rounds[$roundIndex] as $matchIndex => [$home, $away]) {
                if (isset($usedEntryIds[$home->id], $usedEntryIds[$away->id])) {
                    continue;
                }

                if (isset($usedEntryIds[$home->id]) || isset($usedEntryIds[$away->id])) {
                    continue;
                }

                $nextUsedEntryIds = $usedEntryIds + [$home->id => true, $away->id => true];
                $nextMoves = $this->findDisjointMatchesForExtraRound($rounds, $needed - 1, $roundIndex + 1, $nextUsedEntryIds);

                if ($nextMoves !== null) {
                    array_unshift($nextMoves, ['round' => $roundIndex, 'match' => $matchIndex]);

                    return $nextMoves;
                }
            }
        }

        return null;
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
