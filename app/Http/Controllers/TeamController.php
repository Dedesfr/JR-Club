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
        $user = $request->user();

        return Inertia::render('Teams/Index', [
            'teams' => Team::with(['sport', 'members:id,name'])->withCount('members')->visibleTo($user)->latest()->get(),
            'sports' => Sport::orderBy('name')->get(),
            'myTeams' => $user ? $user->teams()->with('sport')->visibleTo($user)->get() : [],
            'canManage' => $user?->can('admin') ?? false,
        ]);
    }

    public function show(Team $team): Response
    {
        abort_unless(Team::query()->visibleTo(request()->user())->whereKey($team->id)->exists(), 404);

        return Inertia::render('Teams/Show', [
            'team' => $team->load(['sport', 'members:id,name']),
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
        $this->authorize('update', $team);

        $team->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_id' => ['required', 'exists:sports,id'],
        ]));

        return back()->with('success', 'Team updated.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        Gate::authorize('admin');
        $this->authorize('delete', $team);
        $team->delete();

        return back()->with('success', 'Team deleted.');
    }

    public function addMember(Request $request, Team $team): RedirectResponse
    {
        Gate::authorize('admin');
        $this->authorize('update', $team);

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
        $this->authorize('update', $team);
        $team->members()->detach($user->id);

        return back()->with('success', 'Roster updated.');
    }
}
