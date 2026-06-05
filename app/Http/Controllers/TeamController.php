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
            'teams' => Team::with(['sports', 'members:id,name,email'])->withCount('members')->visibleTo($user)->latest()->get(),
            'sports' => Sport::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
            'myTeams' => $user ? $user->teams()->with('sports')->visibleTo($user)->get() : [],
            'canManage' => $user?->can('admin') ?? false,
        ]);
    }

    public function show(Team $team): Response
    {
        abort_unless(Team::query()->visibleTo(request()->user())->whereKey($team->id)->exists(), 404);

        return Inertia::render('Teams/Show', [
            'team' => $team->load(['sports', 'members:id,name,email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('admin');

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_ids' => ['array'],
            'sport_ids.*' => ['exists:sports,id'],
        ]);

        $team = Team::create(['name' => $validated['name'], 'created_by' => $request->user()->id]);
        $team->sports()->sync($validated['sport_ids'] ?? []);

        return back()->with('success', 'Team created.');
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
        Gate::authorize('admin');
        $this->authorize('update', $team);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_ids' => ['array'],
            'sport_ids.*' => ['exists:sports,id'],
        ]);

        $team->update(['name' => $validated['name']]);
        $team->sports()->sync($validated['sport_ids'] ?? []);

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
