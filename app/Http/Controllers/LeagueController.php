<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\Sport;
use App\Models\Team;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class LeagueController extends Controller
{
    public function index(Request $request): Response
    {
        $leagues = League::with([
            'sport',
            'teams',
            'entries.player1',
            'entries.player2',
            'entries.substitutes',
            'matches.homeTeam',
            'matches.awayTeam',
            'matches.homeEntry.player1',
            'matches.homeEntry.player2',
            'matches.homeEntry.substitutes',
            'matches.awayEntry.player1',
            'matches.awayEntry.player2',
            'matches.awayEntry.substitutes',
        ])->latest()->get();
        $activeLeague = $leagues->first();

        return Inertia::render('Leagues/Index', [
            'leagues' => $leagues,
            'activeLeague' => $activeLeague,
            'sports' => Sport::orderBy('name')->get(),
            'teams' => Team::with('sport')->orderBy('name')->get(),
            'canManage' => $request->user()->can('admin'),
        ]);
    }

    public function show(League $league): Response
    {
        $league->load([
            'sport',
            'teams',
            'entries.player1',
            'entries.player2',
            'entries.substitutes',
            'groups.groupEntries.entry.player1',
            'groups.groupEntries.entry.player2',
            'groups.groupEntries.entry.substitutes',
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

        return Inertia::render('Leagues/Show', [
            'league' => $league,
            'standings' => $league->standings(),
            'upperBracket' => $league->matches->where('stage', 'upper')->groupBy('round')->sortKeys()->values(),
            'lowerBracket' => $league->matches->where('stage', 'lower')->groupBy('round')->sortKeys()->values(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('admin');

        League::create($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_id' => ['required', 'exists:sports,id'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['required', 'in:upcoming,active,completed'],
        ]) + ['created_by' => $request->user()->id]);

        return back()->with('success', 'League created.');
    }

    public function update(Request $request, League $league): RedirectResponse
    {
        Gate::authorize('admin');

        $league->update($request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['nullable', 'date'],
            'status' => ['sometimes', 'in:upcoming,active,completed'],
        ]));

        return back()->with('success', 'League updated.');
    }

    public function destroy(League $league): RedirectResponse
    {
        Gate::authorize('admin');
        $league->delete();

        return back()->with('success', 'League deleted.');
    }

    public function registerTeam(Request $request, League $league): RedirectResponse
    {
        Gate::authorize('admin');

        $team = Team::findOrFail($request->validate(['team_id' => ['required', 'exists:teams,id']])['team_id']);

        if ($team->sport_id !== $league->sport_id) {
            throw ValidationException::withMessages(['team_id' => 'Team sport must match league sport.']);
        }

        $league->teams()->syncWithoutDetaching([$team->id => ['registered_at' => now()]]);

        return back()->with('success', 'Team registered.');
    }

    public function scheduleMatch(Request $request, League $league): RedirectResponse
    {
        Gate::authorize('admin');

        GameMatch::create($request->validate([
            'home_team_id' => ['required', 'exists:teams,id', 'different:away_team_id'],
            'away_team_id' => ['required', 'exists:teams,id'],
            'scheduled_at' => ['required', 'date'],
        ]) + ['league_id' => $league->id, 'status' => 'scheduled']);

        return back()->with('success', 'Match scheduled.');
    }
}
