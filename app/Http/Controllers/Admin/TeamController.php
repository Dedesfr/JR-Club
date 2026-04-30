<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Teams/Index', ['teams' => Team::with('sport')->withCount('members')->orderBy('name')->paginate(10)]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Teams/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        Team::create($request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]) + ['created_by' => $request->user()->id]);

        return redirect()->route('admin.teams.index')->with('success', 'Team created.');
    }

    public function edit(Team $team): Response
    {
        return Inertia::render('Admin/Teams/Edit', [
            'team' => $team->load('members'),
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
        $team->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]));

        return back()->with('success', 'Team updated.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        $team->delete();

        return redirect()->route('admin.teams.index')->with('success', 'Team deleted.');
    }

    public function addMember(Request $request, Team $team): RedirectResponse
    {
        $validated = $request->validate([
            'user_id' => ['required', 'exists:users,id'],
        ]);

        $team->members()->syncWithoutDetaching([
            $validated['user_id'] => ['role' => 'member', 'joined_at' => now()],
        ]);

        return back()->with('success', 'Member added.');
    }

    public function removeMember(Team $team, User $user): RedirectResponse
    {
        $team->members()->detach($user->id);

        return back()->with('success', 'Member removed.');
    }
}
