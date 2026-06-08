<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class LeagueBracketController extends Controller
{
    public function adjust(Request $request, League $league, BracketService $bracketService)
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'match_id' => ['required', 'exists:matches,id'],
            'home_entry_id' => ['nullable', 'exists:league_entries,id'],
            'away_entry_id' => ['nullable', 'exists:league_entries,id'],
        ]);

        $match = $league->matches()->findOrFail($validated['match_id']);

        try {
            $bracketService->adjustSlots($match, $validated['home_entry_id'] ?? null, $validated['away_entry_id'] ?? null);
        } catch (\InvalidArgumentException $e) {
            return back()->withErrors(['error' => $e->getMessage()]);
        }

        return back()->with('success', 'Bracket slots adjusted successfully.');
    }

    public function store(Request $request, League $league, BracketService $bracketService, LeagueFormatService $leagueFormatService): RedirectResponse
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'advance_upper_count' => ['required', 'integer', 'min:0'],
            'advance_lower_count' => ['required', 'integer', 'min:0'],
            'interval' => ['required', 'integer', 'min:0'],
            'schedule' => ['nullable', 'array'],
            'schedule.*.round' => ['required_with:schedule', 'integer', 'min:1'],
            'schedule.*.scheduled_at' => ['required_with:schedule', 'date'],
        ]);

        $league->update([
            'advance_upper_count' => $validated['advance_upper_count'],
            'advance_lower_count' => $validated['advance_lower_count'],
        ]);

        [$upperEntries, $lowerEntries] = $this->entriesForBracket($league->fresh(), $leagueFormatService, $validated);

        $scheduleMap = collect($validated['schedule'] ?? [])->keyBy('round')->map->scheduled_at;

        $bracketService->seedBrackets($league->fresh(), $upperEntries, $lowerEntries, $scheduleMap, (int) $validated['interval'], true);

        return back()->with('success', 'Brackets seeded.');
    }

    public function updateSchedule(Request $request, League $league, BracketService $bracketService): RedirectResponse
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'interval' => ['required', 'integer', 'min:0'],
            'schedule' => ['required', 'array', 'min:1'],
            'schedule.*.round' => ['required', 'integer', 'min:1'],
            'schedule.*.scheduled_at' => ['required', 'date'],
        ]);

        if (! $league->matches()->whereIn('stage', ['upper', 'lower', 'third_place', 'lower_third_place'])->exists()) {
            throw ValidationException::withMessages(['schedule' => 'Seed bracket matches before updating their schedule.']);
        }

        $scheduleMap = collect($validated['schedule'])->keyBy('round')->map->scheduled_at;
        $bracketService->updateBracketSchedule($league->fresh(), $scheduleMap, (int) $validated['interval']);

        return back()->with('success', 'Bracket match schedule updated.');
    }

    private function entriesForBracket(League $league, LeagueFormatService $leagueFormatService, array $validated): array
    {
        if (($league->start_stage ?? 'group') === 'bracket') {
            $limit = (int) $validated['advance_upper_count'];
            $query = $league->entries()->orderBy('seed')->orderBy('id');
            $entries = $limit > 0 ? $query->limit($limit)->get() : $query->get();

            if ($entries->isEmpty()) {
                throw ValidationException::withMessages(['advance_upper_count' => 'Register league entries before seeding brackets.']);
            }

            return [$entries, collect()];
        }

        $standingGroups = collect($leagueFormatService->standings($league));

        return [
            $this->slicePerGroup($standingGroups, 0, (int) $validated['advance_upper_count']),
            $this->slicePerGroup($standingGroups, (int) $validated['advance_upper_count'], (int) $validated['advance_lower_count']),
        ];
    }

    private function slicePerGroup(Collection $standingGroups, int $offset, int $take): Collection
    {
        if ($take === 0) {
            return collect();
        }

        $selectedByGroup = $standingGroups
            ->map(fn ($group) => collect($group['entries'] ?? [])->slice($offset, $take)->values())
            ->filter(fn (Collection $entries) => $entries->isNotEmpty())
            ->shuffle()
            ->values();

        $groupCount = $selectedByGroup->count();

        if ($groupCount <= 1) {
            return $selectedByGroup
                ->flatMap(fn (Collection $groupEntries) => $groupEntries->map(fn ($row) => $row['entry']))
                ->values();
        }

        $ordered = collect();
        $shift = random_int(1, $groupCount - 1);

        for ($rankIndex = 0; $rankIndex < $take; $rankIndex++) {
            if ($rankIndex + 1 < $take) {
                foreach ($selectedByGroup as $groupIndex => $groupEntries) {
                    $primary = $groupEntries->get($rankIndex);
                    $opponent = $selectedByGroup->get(($groupIndex + $shift) % $groupCount)?->get($rankIndex + 1);

                    if ($primary) {
                        $ordered->push($primary['entry']);
                    }

                    if ($opponent) {
                        $ordered->push($opponent['entry']);
                    }
                }

                $rankIndex++;

                continue;
            }

            foreach (collect(range(0, $groupCount - 1))->shuffle() as $groupIndex) {
                $row = $selectedByGroup->get($groupIndex)?->get($rankIndex);

                if ($row) {
                    $ordered->push($row['entry']);
                }
            }
        }

        return $ordered->values();
    }

}
