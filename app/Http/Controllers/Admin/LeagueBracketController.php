<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LeagueBracketController extends Controller
{
    public function store(Request $request, League $league, BracketService $bracketService, LeagueFormatService $leagueFormatService): RedirectResponse
    {
        $validated = $request->validate([
            'advance_upper_count' => ['required', 'integer', 'min:0'],
            'advance_lower_count' => ['required', 'integer', 'min:0'],
            'upper_entry_ids' => ['nullable', 'array'],
            'upper_entry_ids.*' => ['integer', 'exists:league_entries,id'],
            'lower_entry_ids' => ['nullable', 'array'],
            'lower_entry_ids.*' => ['integer', 'exists:league_entries,id'],
        ]);

        $league->update([
            'advance_upper_count' => $validated['advance_upper_count'],
            'advance_lower_count' => $validated['advance_lower_count'],
        ]);

        $rankedEntries = collect($leagueFormatService->standings($league))
            ->flatMap(fn ($group) => $group['entries'])
            ->map(fn ($row) => $row['entry']);

        $perGroup = $league->groups()->count();
        $upperEntries = collect($validated['upper_entry_ids'] ?? [])->isNotEmpty()
            ? $league->entries()->whereIn('id', $validated['upper_entry_ids'])->orderBy('seed')->get()
            : $this->slicePerGroup($rankedEntries, $perGroup, 0, (int) $validated['advance_upper_count']);

        $lowerEntries = collect($validated['lower_entry_ids'] ?? [])->isNotEmpty()
            ? $league->entries()->whereIn('id', $validated['lower_entry_ids'])->orderBy('seed')->get()
            : $this->slicePerGroup($rankedEntries, $perGroup, (int) $validated['advance_upper_count'], (int) $validated['advance_lower_count']);

        $bracketService->seedBrackets($league->fresh(), $upperEntries, $lowerEntries);

        return back()->with('success', 'Brackets seeded.');
    }

    private function slicePerGroup($rankedEntries, int $groupCount, int $offset, int $take)
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
