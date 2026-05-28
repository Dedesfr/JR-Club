<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();

        return Inertia::render('Admin/Teams/Index', [
            'teams' => Team::with(['sport', 'branch'])->withCount('members')
                ->manageableBy($request->user())
                ->when($search, fn ($q) => $q->where('name', 'like', "%{$search}%"))
                ->orderBy('name')
                ->paginate(10)
                ->withQueryString(),
            'search' => $search->toString(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Teams/Create', [
            'branches' => auth()->user()?->isPusatAdmin() ? Branch::orderBy('name')->get(['id', 'name', 'is_global']) : [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'branch_id' => ['nullable', 'exists:branch,id'],
        ]);

        if (! $request->user()->isPusatAdmin()) {
            unset($validated['branch_id']);
        }

        Team::create($validated + ['created_by' => $request->user()->id]);

        return redirect()->route('admin.teams.index')->with('success', 'Team created.');
    }

    public function edit(Team $team): Response
    {
        $this->authorize('view', $team);

        return Inertia::render('Admin/Teams/Edit', [
            'team' => $team->load('members', 'branch'),
            'users' => User::query()
                ->when(! request()->user()->isPusatAdmin(), fn ($query) => $query->where('branch_id', request()->user()->branch_id))
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'branch_id']),
        ]);
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
        $this->authorize('update', $team);

        $team->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
        ]));

        return back()->with('success', 'Team updated.');
    }

    public function destroy(Team $team): RedirectResponse
    {
        $this->authorize('delete', $team);

        $team->delete();

        return redirect()->route('admin.teams.index')->with('success', 'Team deleted.');
    }

    public function addMember(Request $request, Team $team): RedirectResponse
    {
        $this->authorize('update', $team);

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
        $this->authorize('update', $team);

        $team->members()->detach($user->id);

        return back()->with('success', 'Member removed.');
    }
}
