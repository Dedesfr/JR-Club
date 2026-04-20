<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Activity;
use App\Models\Sport;
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

    public function edit(Activity $activity): Response
    {
        return Inertia::render('Admin/Activities/Edit', [
            'activity' => $activity,
            'sports' => Sport::orderBy('name')->get(),
        ]);
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
}
