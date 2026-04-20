<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\Sport;
use App\Models\User;
use App\Services\LeagueFormatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeagueController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Leagues/Index', [
            'leagues' => League::with('sport')
                ->withCount(['teams', 'entries', 'matches'])
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Leagues/Create', [
            'sports' => Sport::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_id' => ['required', 'exists:sports,id'],
            'category' => ['required', 'in:MS,WS,MD,WD,XD'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['nullable', 'in:upcoming,active,completed'],
            'participant_total' => ['nullable', 'integer', 'min:2'],
            'sets_to_win' => ['required', 'integer', 'min:1'],
            'points_per_set' => ['required', 'integer', 'min:1'],
            'advance_upper_count' => ['required', 'integer', 'min:0'],
            'advance_lower_count' => ['required', 'integer', 'min:0'],
        ]);

        $league = League::create($validated + [
            'created_by' => $request->user()->id,
            'status' => $validated['status'] ?? 'upcoming',
            'entry_type' => $this->entryType($validated['category']),
            'stage' => 'setup',
        ]);

        return redirect()->route('admin.leagues.show', $league);
    }

    public function show(League $league): Response
    {
        $league->load([
            'sport',
            'teams',
            'entries.player1',
            'entries.player2',
            'entries.substitute',
            'entries.substitutes',
            'groups.groupEntries.entry.player1',
            'groups.groupEntries.entry.player2',
            'groups.groupEntries.entry.substitutes',
            'groups.matches.homeEntry.player1',
            'groups.matches.homeEntry.player2',
            'groups.matches.homeEntry.substitutes',
            'groups.matches.awayEntry.player1',
            'groups.matches.awayEntry.player2',
            'groups.matches.awayEntry.substitutes',
            'matches.homeTeam',
            'matches.awayTeam',
            'matches.homeEntry.player1',
            'matches.homeEntry.player2',
            'matches.homeEntry.substitutes',
            'matches.awayEntry.player1',
            'matches.awayEntry.player2',
            'matches.awayEntry.substitutes',
            'matches.sets',
            'upperChampion.player1',
            'upperChampion.player2',
            'upperChampion.substitutes',
            'lowerChampion.player1',
            'lowerChampion.player2',
            'lowerChampion.substitutes',
        ]);

        return Inertia::render('Admin/Leagues/Show', [
            'league' => $league,
            'users' => User::query()->orderBy('name')->get(['id', 'name', 'email', 'gender', 'role']),
            'divisionOptions' => $league->participant_total ? app(LeagueFormatService::class)->divisionOptions($league->participant_total) : [],
            'standings' => $league->standings(),
            'upperBracket' => $league->matches->where('stage', 'upper')->groupBy('round')->sortKeys()->values(),
            'lowerBracket' => $league->matches->where('stage', 'lower')->groupBy('round')->sortKeys()->values(),
        ]);
    }

    public function update(Request $request, League $league): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['sometimes', 'in:upcoming,active,completed'],
            'participant_total' => ['nullable', 'integer', 'min:2'],
            'sets_to_win' => ['sometimes', 'integer', 'min:1'],
            'points_per_set' => ['sometimes', 'integer', 'min:1'],
            'advance_upper_count' => ['sometimes', 'integer', 'min:0'],
            'advance_lower_count' => ['sometimes', 'integer', 'min:0'],
        ]);

        $league->update($validated);

        return back()->with('success', 'League updated.');
    }

    public function destroy(League $league): RedirectResponse
    {
        $league->delete();

        return redirect()->route('admin.leagues.index')->with('success', 'League deleted.');
    }

    private function entryType(?string $category): ?string
    {
        return match ($category) {
            'MS', 'WS' => 'single',
            'MD', 'WD', 'XD' => 'double',
            default => null,
        };
    }
}
