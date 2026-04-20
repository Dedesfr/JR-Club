<?php

namespace App\Http\Controllers;

use App\Models\Sport;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render('Teams/Index', [
            'teams' => Team::with(['sport', 'members:id,name,email'])->withCount('members')->latest()->get(),
            'sports' => Sport::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            'myTeams' => $request->user()->teams()->with('sport')->get(),
            'canManage' => $request->user()->can('admin'),
        ]);
    }

    public function show(Team $team): Response
    {
        return Inertia::render('Teams/Show', [
            'team' => $team->load(['sport', 'members:id,name,email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('admin');

        Team::create($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_id' => ['required', 'exists:sports,id'],
        ]) + ['created_by' => $request->user()->id]);

        return back()->with('success', 'Team created.');
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
        Gate::authorize('admin');

        $team->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_id' => ['required', 'exists:sports,id'],
        ]));

        return back()->with('success', 'Team updated.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        Gate::authorize('admin');
        $team->delete();

        return back()->with('success', 'Team deleted.');
    }

    public function addMember(Request $request, Team $team): RedirectResponse
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
            'role' => ['required', 'in:member,captain'],
        ]);

        $team->members()->syncWithoutDetaching([
            $validated['user_id'] => ['role' => $validated['role'], 'joined_at' => now()],
        ]);

        return back()->with('success', 'Roster updated.');
    }

    public function removeMember(Team $team, User $user): RedirectResponse
    {
        Gate::authorize('admin');
        $team->members()->detach($user->id);

        return back()->with('success', 'Roster updated.');
    }
}
