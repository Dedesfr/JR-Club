<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sport;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SportController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Sports/Index', ['sports' => Sport::orderBy('name')->paginate(10)]);
    }

    public function edit(Sport $sport): Response
    {
        return Inertia::render('Admin/Sports/Edit', ['sport' => $sport]);
    }

    public function update(Request $request, Sport $sport): RedirectResponse
    {
        $sport->update($request->validate([
            'name' => ['required', 'string', 'max:255'],
            'icon' => ['required', 'string', 'max:255'],
            'max_players_per_team' => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
        ]));

        return redirect()->route('admin.sports.index')->with('success', 'Sport updated.');
    }
}
