<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\LeagueGroupEntry;
use App\Services\LeagueFormatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Validation\ValidationException;

class LeagueGroupController extends Controller
{
    public function store(Request $request, League $league, LeagueFormatService $leagueFormatService): RedirectResponse
    {
        $this->authorize('update', $league);

        if ($league->group_locked) {
            return back()->withErrors(['group_count' => 'Groups are locked for this league.']);
        }

        $validated = $request->validate([
            'group_count' => ['required', 'integer', 'min:2'],
            'interval' => ['required', 'integer', 'min:0'],
            'schedule' => ['nullable', 'array'],
            'schedule.*.round' => ['required_with:schedule', 'integer', 'min:1'],
            'schedule.*.scheduled_at' => ['required_with:schedule', 'date'],
        ]);

        $isRegeneration = $league->groups()->exists() || $league->matches()->where('stage', 'group')->exists();
        $entries = $league->entries()->orderBy('seed')->get();

        if ($league->participant_total !== null && $entries->count() !== $league->participant_total) {
            throw ValidationException::withMessages(['group_count' => 'Participant total must match the number of league entries before groups are generated.']);
        }

        $options = collect($leagueFormatService->divisionOptions($entries->count()));
        $valid = $options->contains(fn ($option) => $option['group_count'] === (int) $validated['group_count']);

        if (! $valid) {
            throw ValidationException::withMessages(['group_count' => 'Selected group count is not valid for this participant total.']);
        }

        if ($isRegeneration) {
            $entries = $this->reshuffleEntries($entries);
        }

        $leagueFormatService->createGroups($league, $entries, (int) $validated['group_count']);
        
        $scheduleMap = collect($validated['schedule'] ?? [])->keyBy('round')->map->scheduled_at;
        $leagueFormatService->generateGroupMatches($league->fresh(), $scheduleMap, (int) $validated['interval']);

        return back()->with('success', 'Groups and round-robin matches generated.');
    }

    public function lock(League $league): RedirectResponse
    {
        $this->authorize('update', $league);

        if (! $league->group_locked) {
            $league->update(['group_locked' => true]);
        }

        return back()->with('success', 'Groups locked.');
    }

    public function updateSchedule(Request $request, League $league, LeagueFormatService $leagueFormatService): RedirectResponse
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'interval' => ['required', 'integer', 'min:0'],
            'schedule' => ['required', 'array', 'min:1'],
            'schedule.*.round' => ['required', 'integer', 'min:1'],
            'schedule.*.scheduled_at' => ['required', 'date'],
        ]);

        if (! $league->matches()->where('stage', 'group')->exists()) {
            throw ValidationException::withMessages(['schedule' => 'Generate group matches before updating their schedule.']);
        }

        $scheduleMap = collect($validated['schedule'])->keyBy('round')->map->scheduled_at;
        $leagueFormatService->updateGroupMatchSchedule($league->fresh(), $scheduleMap, (int) $validated['interval']);

        return back()->with('success', 'Group match schedule updated.');
    }

    public function update(Request $request, League $league, LeagueGroupEntry $groupEntry): RedirectResponse
    {
        $this->authorize('update', $league);
        abort_unless($groupEntry->group->league_id === $league->id, 404);

        $validated = $request->validate([
            'manual_advance_rank' => ['nullable', 'integer', 'min:1'],
        ]);

        $groupEntry->update($validated);

        return back()->with('success', 'Manual rank updated.');
    }

    private function reshuffleEntries(Collection $entries): Collection
    {
        $reshuffled = $entries->shuffle()->values();

        if ($entries->count() > 1 && $reshuffled->pluck('id')->all() === $entries->pluck('id')->all()) {
            return $entries->reverse()->values();
        }

        return $reshuffled;
    }
}
