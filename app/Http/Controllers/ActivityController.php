<?php

namespace App\Http\Controllers;

use App\Jobs\SendPushNotification;
use App\Models\Activity;
use App\Models\Sport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ActivityController extends Controller
{
    public function index(Request $request): Response
    {
        $sport = $request->string('sport')->toString();

        $activities = Activity::query()
            ->with(['sport', 'participants:id,name'])
            ->withCount('participants')
            ->when($sport, fn ($query) => $query->whereHas('sport', fn ($sportQuery) => $sportQuery->where('name', $sport)))
            ->orderBy('scheduled_at')
            ->get();

        return Inertia::render('Activities/Index', [
            'sports' => Sport::orderBy('name')->get(),
            'activities' => $activities,
            'selectedSport' => $sport,
            'canManage' => $request->user()->can('admin'),
        ]);
    }

    public function show(Activity $activity): Response
    {
        return Inertia::render('Activities/Show', [
            'activity' => $activity->load(['sport', 'participants:id,name,email']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        Gate::authorize('admin');

        $activity = Activity::create($request->validate([
            'sport_id' => ['required', 'exists:sports,id'],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['required', 'string', 'max:255'],
            'scheduled_at' => ['required', 'date'],
            'max_participants' => ['required', 'integer', 'min:2'],
        ]) + ['created_by' => $request->user()->id, 'status' => 'open']);

        SendPushNotification::dispatch('New activity', "{$activity->title} is open for registration.");

        return back()->with('success', 'Activity created.');
    }

    public function update(Request $request, Activity $activity): RedirectResponse
    {
        Gate::authorize('admin');

        $activity->update($request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'location' => ['sometimes', 'string', 'max:255'],
            'scheduled_at' => ['sometimes', 'date'],
            'max_participants' => ['sometimes', 'integer', 'min:2'],
            'status' => ['sometimes', 'in:open,full,completed,cancelled'],
        ]));

        if ($activity->status === 'cancelled') {
            SendPushNotification::dispatch('Activity cancelled', "{$activity->title} has been cancelled.");
        }

        return back()->with('success', 'Activity updated.');
    }

    public function destroy(Activity $activity): RedirectResponse
    {
        Gate::authorize('admin');

        $activity->delete();

        return redirect()->route('activities.index')->with('success', 'Activity deleted.');
    }

    public function join(Request $request, Activity $activity): RedirectResponse
    {
        abort_if(in_array($activity->status, ['full', 'completed', 'cancelled'], true), 422);

        $activity->participants()->syncWithoutDetaching([
            $request->user()->id => ['joined_at' => now()],
        ]);

        if ($activity->participants()->count() >= $activity->max_participants) {
            $activity->update(['status' => 'full']);
        }

        return back()->with('success', 'Joined activity.');
    }

    public function leave(Request $request, Activity $activity): RedirectResponse
    {
        $activity->participants()->detach($request->user()->id);

        if ($activity->status === 'full') {
            $activity->update(['status' => 'open']);
        }

        return back()->with('success', 'Left activity.');
    }
}
