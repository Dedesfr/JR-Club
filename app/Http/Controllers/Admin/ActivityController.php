<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
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
            'activities' => Activity::with('sport')->latest('scheduled_at')->paginate(10),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Activities/Create', [
            'sports' => Sport::orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Activity::create($request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date'],
            'max_participants' => ['required', 'integer', 'min:1'],
            'status' => ['required', 'string', 'max:50'],
            'sport_id' => ['required', 'exists:sports,id'],
        ]));

        return redirect()->route('admin.activities.index')->with('success', 'Activity created.');
    }

    public function edit(Activity $activity): Response
    {
        return Inertia::render('Admin/Activities/Edit', [
            'activity' => $activity->load('sport', 'participants'),
            'sports' => Sport::orderBy('name')->get(),
            'users' => User::orderBy('name')->get(['id', 'name', 'email']),
        ]);
    }

    public function addParticipant(Request $request, Activity $activity): RedirectResponse
    {
        $data = $request->validate(['user_id' => ['required', 'exists:users,id']]);
        $activity->participants()->syncWithoutDetaching([$data['user_id'] => ['joined_at' => now()]]);

        return back()->with('success', 'Participant added.');
    }

    public function removeParticipant(Activity $activity, User $user): RedirectResponse
    {
        $activity->participants()->detach($user->id);

        return back()->with('success', 'Participant removed.');
    }

    public function update(Request $request, Activity $activity): RedirectResponse
    {
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
        $activity->delete();

        return redirect()->route('admin.activities.index')->with('success', 'Activity deleted.');
    }
}
