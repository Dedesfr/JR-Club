<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\Sport;
use App\Models\Team;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->string('search')->trim();

        return Inertia::render('Admin/Teams/Index', [
            'teams' => Team::with(['sports', 'branch'])->withCount('members')
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
            'sports' => Sport::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'branch_id' => ['nullable', 'exists:branch,id'],
            'sport_ids' => ['array'],
            'sport_ids.*' => ['exists:sports,id'],
        ]);

        if (! $request->user()->isPusatAdmin()) {
            unset($validated['branch_id']);
        }

        $team = Team::create([
            'name' => $validated['name'],
            'branch_id' => $validated['branch_id'] ?? null,
            'created_by' => $request->user()->id,
        ]);
        $team->sports()->sync($validated['sport_ids'] ?? []);

        return redirect()->route('admin.teams.index')->with('success', 'Team created.');
    }

    public function edit(Team $team): Response
    {
        $this->authorize('view', $team);

        $team->load(['members', 'sports', 'branch']);

        // sport_id => [user_id, ...]
        $sportSquads = DB::table('team_sport_members')
            ->where('team_id', $team->id)
            ->get(['sport_id', 'user_id'])
            ->groupBy('sport_id')
            ->map(fn ($rows) => $rows->pluck('user_id')->all());

        // sport_id => logo_path (from team_sports pivot)
        $sportLogos = DB::table('team_sports')
            ->where('team_id', $team->id)
            ->whereNotNull('logo_path')
            ->pluck('logo_path', 'sport_id');

        return Inertia::render('Admin/Teams/Edit', [
            'team' => $team,
            'sport_squads' => $sportSquads,
            'sport_logos' => $sportLogos,
            'users' => User::query()
                ->when(! request()->user()->isPusatAdmin(), fn ($query) => $query->where('branch_id', request()->user()->branch_id))
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'branch_id']),
            'sports' => Sport::orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Team $team): RedirectResponse
    {
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

        // Also remove from all sport squads for this team
        DB::table('team_sport_members')
            ->where('team_id', $team->id)
            ->where('user_id', $user->id)
            ->delete();

        return back()->with('success', 'Member removed.');
    }

    public function assignSportMember(Team $team, Sport $sport, User $user): RedirectResponse
    {
        // User must be in the global roster first
        abort_unless($team->members()->where('users.id', $user->id)->exists(), 422, 'User is not in the team roster.');
        // Sport must belong to this team
        abort_unless($team->sports()->where('sports.id', $sport->id)->exists(), 422, 'Sport is not registered for this team.');

        DB::table('team_sport_members')->insertOrIgnore([
            'team_id' => $team->id,
            'sport_id' => $sport->id,
            'user_id' => $user->id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('success', 'Member assigned to squad.');
    }

    public function removeSportMember(Team $team, Sport $sport, User $user): RedirectResponse
    {
        DB::table('team_sport_members')
            ->where('team_id', $team->id)
            ->where('sport_id', $sport->id)
            ->where('user_id', $user->id)
            ->delete();

        return back()->with('success', 'Member removed from squad.');
    }

    public function uploadSportLogo(Request $request, Team $team, Sport $sport): RedirectResponse
    {
        abort_unless($team->sports()->where('sports.id', $sport->id)->exists(), 422, 'Sport is not registered for this team.');

        $request->validate([
            'logo' => ['required', 'image', 'max:2048'],
        ]);

        $old = DB::table('team_sports')
            ->where('team_id', $team->id)
            ->where('sport_id', $sport->id)
            ->value('logo_path');

        if ($old) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $old), '/'));
        }

        $path = $request->file('logo')->store('team-sport-logos', 'public');

        DB::table('team_sports')
            ->where('team_id', $team->id)
            ->where('sport_id', $sport->id)
            ->update(['logo_path' => '/storage/'.$path, 'updated_at' => now()]);

        return back()->with('success', 'Logo uploaded.');
    }
}
