<?php

namespace App\Services;

use App\Models\GameMatch;
use App\Models\League;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class BracketService
{
    public function seedBrackets(League $league, Collection $upperEntries, Collection $lowerEntries): array
    {
        return DB::transaction(function () use ($league, $upperEntries, $lowerEntries) {
            $league->matches()->whereIn('stage', ['upper', 'lower'])->delete();

            $upper = $this->seedBracket($league, 'upper', $upperEntries->values());
            $lower = $this->seedBracket($league, 'lower', $lowerEntries->values());

            $league->update(['stage' => 'upper']);

            return compact('upper', 'lower');
        });
    }

    public function advanceWinner(GameMatch $match, int $winnerEntryId): void
    {
        $match->update(['status' => 'completed']);

        if ($match->next_match_id === null) {
            $column = $match->stage === 'lower' ? 'lower_champion_entry_id' : 'upper_champion_entry_id';
            $match->league()->update([$column => $winnerEntryId]);

            $league = $match->league->fresh();
            if (($league->advance_upper_count === 0 || $league->upper_champion_entry_id) && ($league->advance_lower_count === 0 || $league->lower_champion_entry_id)) {
                $league->update(['stage' => 'completed', 'status' => 'completed']);
            }

            return;
        }

        $nextMatch = $match->nextMatch;
        $column = $match->bracket_slot === 'away' ? 'away_entry_id' : 'home_entry_id';
        $nextMatch->update([$column => $winnerEntryId]);
    }

    private function seedBracket(League $league, string $stage, Collection $entries): Collection
    {
        if ($entries->isEmpty()) {
            return collect();
        }

        $slotCount = $this->nextPowerOfTwo($entries->count());
        $roundCount = (int) log($slotCount, 2);
        $rounds = [];

        for ($round = $roundCount; $round >= 1; $round--) {
            $matchCount = 2 ** ($roundCount - $round);
            for ($index = 0; $index < $matchCount; $index++) {
                $nextMatch = $round < $roundCount ? $rounds[$round + 1][intdiv($index, 2)] : null;
                $rounds[$round][$index] = GameMatch::create([
                    'league_id' => $league->id,
                    'scheduled_at' => now(),
                    'status' => 'scheduled',
                    'stage' => $stage,
                    'round' => $round,
                    'next_match_id' => $nextMatch?->id,
                    'bracket_slot' => $nextMatch ? ($index % 2 === 0 ? 'home' : 'away') : null,
                ]);
            }
        }

        $slotValues = $this->seedSlots($entries, $slotCount)->values();
        foreach ($rounds[1] as $index => $match) {
            $match->update([
                'home_entry_id' => $slotValues[$index * 2]?->id,
                'away_entry_id' => $slotValues[$index * 2 + 1]?->id,
            ]);
        }

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
