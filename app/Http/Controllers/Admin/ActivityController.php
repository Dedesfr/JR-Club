<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Branch;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Activities/Index', [
            'activities' => Activity::with(['sport', 'branch'])
                ->manageableBy(request()->user())
                ->latest('scheduled_at')
                ->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Activities/Create', [
            'sports' => Sport::orderBy('name')->get(),
            'branches' => auth()->user()?->isPusatAdmin() ? Branch::orderBy('name')->get(['id', 'name', 'is_global']) : [],
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date'],
            'max_participants' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'string', 'max:50'],
            'sport_id' => ['required', 'exists:sports,id'],
            'branch_id' => ['nullable', 'exists:branch,id'],
        ]);

        if (! $request->user()->isPusatAdmin()) {
            unset($validated['branch_id']);
        }

        Activity::create($validated + ['created_by' => $request->user()->id]);

        return redirect()->route('admin.activities.index')->with('success', 'Activity created.');
    }

    public function edit(Activity $activity): Response
    {
        $this->authorize('view', $activity);

        return Inertia::render('Admin/Activities/Edit', [
            'activity' => $activity->load('sport', 'participants', 'branch'),
            'sports' => Sport::orderBy('name')->get(),
            'users' => User::query()
                ->when(! request()->user()->isPusatAdmin(), fn ($query) => $query->where('branch_id', request()->user()->branch_id))
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'branch_id']),
        ]);
    }

    public function addParticipant(Request $request, Activity $activity): RedirectResponse
    {
        $this->authorize('update', $activity);

        $data = $request->validate(['user_id' => ['required', 'exists:users,id']]);
        $activity->participants()->syncWithoutDetaching([$data['user_id'] => ['joined_at' => now()]]);

        return back()->with('success', 'Participant added.');
    }

    public function removeParticipant(Activity $activity, User $user): RedirectResponse
    {
        $this->authorize('update', $activity);

        $activity->participants()->detach($user->id);

        return back()->with('success', 'Participant removed.');
    }

    public function update(Request $request, Activity $activity): RedirectResponse
    {
        $this->authorize('update', $activity);

        $activity->update($request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date'],
            'max_participants' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'string', 'max:50'],
            'sport_id' => ['required', 'exists:sports,id'],
        ]));

        return redirect()->route('admin.activities.index')->with('success', 'Activity updated.');
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        $this->authorize('delete', $activity);

        $activity->delete();

        return redirect()->route('admin.activities.index')->with('success', 'Activity deleted.');
    }
}
