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

        $bracketService->seedBrackets($league->fresh(), $upperEntries, $lowerEntries, $scheduleMap, (int) $validated['interval'], ($league->start_stage ?? 'group') === 'group');

        return back()->with('success', 'Brackets seeded.');
    }

    private function entriesForBracket(League $league, LeagueFormatService $leagueFormatService, array $validated): array
    {
        if (($league->start_stage ?? 'group') === 'bracket') {
            $entries = $league->entries()->orderBy('seed')->orderBy('id')->get();

            if ($entries->isEmpty()) {
                throw ValidationException::withMessages(['advance_upper_count' => 'Register league entries before seeding brackets.']);
            }

            if ($league->participant_total !== null && $entries->count() !== $league->participant_total) {
                throw ValidationException::withMessages(['advance_upper_count' => 'Participant total must match the number of league entries before brackets are seeded.']);
            }

            return [$entries, collect()];
        }

        $rankedEntries = collect($leagueFormatService->standings($league))
            ->flatMap(fn ($group) => $group['entries'])
            ->map(fn ($row) => $row['entry']);

        $perGroup = $league->groups()->count();

        return [
            $this->slicePerGroup($rankedEntries, $perGroup, 0, (int) $validated['advance_upper_count']),
            $this->slicePerGroup($rankedEntries, $perGroup, (int) $validated['advance_upper_count'], (int) $validated['advance_lower_count']),
        ];
    }

    private function slicePerGroup(Collection $rankedEntries, int $groupCount, int $offset, int $take): Collection
    {
        if ($take === 0) {
            return collect();
        }

        return $rankedEntries
            ->chunk(max(1, (int) ($rankedEntries->count() / max(1, $groupCount))))
            ->flatMap(fn ($group) => $group->slice($offset, $take))
            ->values();
    }
}
