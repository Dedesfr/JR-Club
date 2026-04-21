<?php

namespace App\Services;

use App\Models\GameMatch;
use App\Models\League;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BracketService
{
    public function seedBrackets(League $league, Collection $upperEntries, Collection $lowerEntries, \Illuminate\Support\Collection $scheduleMap = null, int $intervalMinutes = 0): array
    {
        return DB::transaction(function () use ($league, $upperEntries, $lowerEntries, $scheduleMap, $intervalMinutes) {
            $league->matches()->whereIn('stage', ['upper', 'lower', 'third_place', 'lower_third_place'])->delete();

            $roundOffsets = [];
            $upper = $this->seedBracket($league, 'upper', $upperEntries->values(), $scheduleMap, $intervalMinutes, $roundOffsets);
            $lower = $this->seedBracket($league, 'lower', $lowerEntries->values(), $scheduleMap, $intervalMinutes, $roundOffsets);

            $maxRounds = max(
                $upperEntries->isEmpty() ? 0 : (int) log($this->nextPowerOfTwo($upperEntries->count()), 2),
                $lowerEntries->isEmpty() ? 0 : (int) log($this->nextPowerOfTwo($lowerEntries->count()), 2)
            );
            $thirdPlaceRound = $maxRounds + 1;
            
            if (!isset($roundOffsets[$thirdPlaceRound])) {
                $roundOffsets[$thirdPlaceRound] = 0;
            }

            $thirdPlaceScheduledAt = $scheduleMap && $scheduleMap->has($thirdPlaceRound) ? \Carbon\Carbon::parse($scheduleMap->get($thirdPlaceRound)) : now()->addDays($maxRounds);

            // 2.1 Generate third-place match if upper bracket has semifinals
            if ($upperEntries->count() >= 3) { // Requires at least 3 entries to have semifinals and a meaningful 3rd place match
                $time = $thirdPlaceScheduledAt->copy()->addMinutes($roundOffsets[$thirdPlaceRound]);
                $roundOffsets[$thirdPlaceRound] += $intervalMinutes;

                $thirdPlaceMatch = GameMatch::create([
                    'league_id' => $league->id,
                    'scheduled_at' => $time,
                    'status' => 'scheduled',
                    'stage' => 'third_place',
                    'round' => $thirdPlaceRound, // Special round for 3rd place
                ]);
                $league->update(['third_place_match_id' => $thirdPlaceMatch->id]);
            }

            // Generate lower third-place match if lower bracket has semifinals
            if ($lowerEntries->count() >= 3) {
                $time = $thirdPlaceScheduledAt->copy()->addMinutes($roundOffsets[$thirdPlaceRound]);
                $roundOffsets[$thirdPlaceRound] += $intervalMinutes;

                $lowerThirdPlaceMatch = GameMatch::create([
                    'league_id' => $league->id,
                    'scheduled_at' => $time,
                    'status' => 'scheduled',
                    'stage' => 'lower_third_place',
                    'round' => $thirdPlaceRound,
                ]);
                $league->update(['lower_third_place_match_id' => $lowerThirdPlaceMatch->id]);
            }

            $league->update(['stage' => 'upper']);

            return compact('upper', 'lower');
        });
    }

    public function advanceWinner(GameMatch $match, int $winnerEntryId): void
    {
        $match->update(['status' => 'completed']);
        $league = $match->league;

        if ($match->next_match_id === null && $match->stage !== 'third_place' && $match->stage !== 'lower_third_place') {
            $column = $match->stage === 'lower' ? 'lower_champion_entry_id' : 'upper_champion_entry_id';
            $league->update([$column => $winnerEntryId]);

            $league = $league->fresh();
            if (($league->advance_upper_count === 0 || $league->upper_champion_entry_id) && ($league->advance_lower_count === 0 || $league->lower_champion_entry_id)) {
                $league->update(['stage' => 'completed', 'status' => 'completed']);
            }

            return;
        }

        if ($match->nextMatch) {
            $nextMatch = $match->nextMatch;
            
            // 2.2 Populate third-place match with the losing upper-bracket semifinalist
            // We know it's a semifinal if the next match is the final (next_match_id exists, but its next_match_id is null)
            if ($nextMatch->next_match_id === null) {
                $loserEntryId = $match->home_entry_id === $winnerEntryId ? $match->away_entry_id : $match->home_entry_id;
                
                if ($loserEntryId) {
                    if ($match->stage === 'upper' && $league->third_place_match_id) {
                        $thirdPlaceMatch = $league->thirdPlaceMatch;
                        
                        if ($thirdPlaceMatch) {
                            if ($thirdPlaceMatch->home_entry_id === null) {
                                $thirdPlaceMatch->update(['home_entry_id' => $loserEntryId]);
                            } else {
                                $thirdPlaceMatch->update(['away_entry_id' => $loserEntryId]);
                            }
                        }
                    } elseif ($match->stage === 'lower' && $league->lower_third_place_match_id) {
                        $lowerThirdPlaceMatch = $league->lowerThirdPlaceMatch;
                        
                        if ($lowerThirdPlaceMatch) {
                            if ($lowerThirdPlaceMatch->home_entry_id === null) {
                                $lowerThirdPlaceMatch->update(['home_entry_id' => $loserEntryId]);
                            } else {
                                $lowerThirdPlaceMatch->update(['away_entry_id' => $loserEntryId]);
                            }
                        }
                    }
                }
            }

            $column = $match->bracket_slot === 'away' ? 'away_entry_id' : 'home_entry_id';
            $nextMatch->update([$column => $winnerEntryId]);
        }
    }


    public function adjustSlots(GameMatch $match, ?int $homeEntryId, ?int $awayEntryId): void
    {
        if ($match->sets()->exists()) {
            throw new \InvalidArgumentException('Cannot adjust slots for matches that already have scores.');
        }

        if ($homeEntryId !== null && $homeEntryId === $awayEntryId) {
            throw new \InvalidArgumentException('Home and away entries cannot be the same.');
        }

        DB::transaction(function () use ($match, $homeEntryId, $awayEntryId) {
            $leagueId = $match->league_id;
            
            if ($homeEntryId !== null && $homeEntryId !== $match->home_entry_id) {
                $existingHome = GameMatch::where('league_id', $leagueId)->where('stage', $match->stage)->where('home_entry_id', $homeEntryId)->first();
                if ($existingHome) {
                    $existingHome->update(['home_entry_id' => $match->home_entry_id]);
                }
                $existingAway = GameMatch::where('league_id', $leagueId)->where('stage', $match->stage)->where('away_entry_id', $homeEntryId)->first();
                if ($existingAway) {
                    $existingAway->update(['away_entry_id' => $match->home_entry_id]);
                }
            }

            if ($awayEntryId !== null && $awayEntryId !== $match->away_entry_id) {
                $existingHome = GameMatch::where('league_id', $leagueId)->where('stage', $match->stage)->where('home_entry_id', $awayEntryId)->first();
                if ($existingHome) {
                    $existingHome->update(['home_entry_id' => $match->away_entry_id]);
                }
                $existingAway = GameMatch::where('league_id', $leagueId)->where('stage', $match->stage)->where('away_entry_id', $awayEntryId)->first();
                if ($existingAway) {
                    $existingAway->update(['away_entry_id' => $match->away_entry_id]);
                }
            }

            $match->update([
                'home_entry_id' => $homeEntryId,
                'away_entry_id' => $awayEntryId,
            ]);
        });
    }

    private function seedBracket(League $league, string $stage, Collection $entries, \Illuminate\Support\Collection $scheduleMap = null, int $intervalMinutes = 0, array &$roundOffsets = []): Collection
    {
        if ($entries->isEmpty()) {
            return collect();
        }

        $slotCount = $this->nextPowerOfTwo($entries->count());
        $roundCount = (int) log($slotCount, 2);
        $rounds = [];

        for ($round = $roundCount; $round >= 1; $round--) {
            // Note: $round goes from $roundCount down to 1.
            // We want Round 1 (first round) to map to index 1 of the schedule, and Final to $roundCount.
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

            $matchCount = 2 ** ($roundCount - $round);
            for ($index = 0; $index < $matchCount; $index++) {
                $time = $scheduledAt->copy()->addMinutes($roundOffsets[$round]);
                $roundOffsets[$round] += $intervalMinutes;

                $nextMatch = $round < $roundCount ? $rounds[$round + 1][intdiv($index, 2)] : null;
                $rounds[$round][$index] = GameMatch::create([
                    'league_id' => $league->id,
                    'scheduled_at' => $time,
                    'status' => 'scheduled',
                    'stage' => $stage,
                    'round' => $round,
                    'next_match_id' => $nextMatch?->id,
                    'bracket_slot' => $nextMatch ? ($index % 2 === 0 ? 'home' : 'away') : null,
                ]);
            }
        }

        // Do not auto-assign entries to slots. Users will manually assign them.
        /*
        $slotValues = $this->seedSlots($entries, $slotCount)->values();
        foreach ($rounds[1] as $index => $match) {
            $match->update([
                'home_entry_id' => $slotValues[$index * 2]?->id,
                'away_entry_id' => $slotValues[$index * 2 + 1]?->id,
            ]);
        }
        */

        $this->resolveByes(collect($rounds[1]));

        return collect($rounds)
            ->sortKeys()
            ->map(fn ($matches, $round) => [
                'round' => (int) $round,
                'matches' => collect($matches)->values()->all(),
            ])
            ->values();
    }

    private function resolveByes(Collection $matches): void
    {
        $pending = $matches;

        while ($pending->isNotEmpty()) {
            $advanced = collect();

            foreach ($pending as $match) {
                $match = $match->fresh(['nextMatch']);

                if ($match->status === 'completed') {
                    continue;
                }

                $participants = collect([$match->home_entry_id, $match->away_entry_id])->filter();

                if ($participants->count() !== 1) {
                    continue;
                }

                $winnerEntryId = $participants->first();
                $this->advanceWinner($match, $winnerEntryId);

                if ($match->nextMatch !== null) {
                    $advanced->push($match->nextMatch);
                }
            }

            $pending = $advanced->unique('id')->values();
        }
    }

    private function seedSlots(Collection $entries, int $slotCount): Collection
    {
        $byeCount = $slotCount - $entries->count();
        $slots = collect();

        foreach ($entries as $index => $entry) {
            $slots->push($entry);

            if ($byeCount > 0 && $index < $entries->count() - 1) {
                $slots->push(null);
                $byeCount--;
            }
        }

        while ($slots->count() < $slotCount) {
            $slots->push(null);
        }

        return $slots;
    }

    private function nextPowerOfTwo(int $value): int
    {
        $power = 1;

        while ($power < $value) {
            $power *= 2;
        }

        return max($power, 2);
    }
}
