<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\LeagueGroupEntry;
use App\Services\LeagueFormatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class LeagueGroupController extends Controller
{
    public function store(Request $request, League $league, LeagueFormatService $leagueFormatService): RedirectResponse
    {
        $validated = $request->validate([
            'group_count' => ['required', 'integer', 'min:2'],
            'interval' => ['required', 'integer', 'min:0'],
            'schedule' => ['nullable', 'array'],
            'schedule.*.round' => ['required_with:schedule', 'integer', 'min:1'],
            'schedule.*.scheduled_at' => ['required_with:schedule', 'date'],
        ]);

        $entries = $league->entries()->orderBy('seed')->get();

        if ($league->participant_total !== null && $entries->count() !== $league->participant_total) {
            throw ValidationException::withMessages(['group_count' => 'Participant total must match the number of league entries before groups are generated.']);
        }

        $options = collect($leagueFormatService->divisionOptions($entries->count()));
        $valid = $options->contains(fn ($option) => $option['group_count'] === (int) $validated['group_count']);

        if (! $valid) {
            throw ValidationException::withMessages(['group_count' => 'Selected group count is not valid for this participant total.']);
        }

        $leagueFormatService->createGroups($league, $entries, (int) $validated['group_count']);
        
        $scheduleMap = collect($validated['schedule'] ?? [])->keyBy('round')->map->scheduled_at;
        $leagueFormatService->generateGroupMatches($league->fresh(), $scheduleMap, (int) $validated['interval']);

        return back()->with('success', 'Groups and round-robin matches generated.');
    }

    public function update(Request $request, League $league, LeagueGroupEntry $groupEntry): RedirectResponse
    {
        abort_unless($groupEntry->group->league_id === $league->id, 404);

        $validated = $request->validate([
            'manual_advance_rank' => ['nullable', 'integer', 'min:1'],
        ]);

        $groupEntry->update($validated);

        return back()->with('success', 'Manual rank updated.');
    }
}
