<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sport;
use App\Models\SportCategory;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
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
        return Inertia::render('Admin/Sports/Edit', ['sport' => $sport->load('categories')]);
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

    public function storeCategory(Request $request, Sport $sport): RedirectResponse
    {
        $validated = $this->validateCategory($request, $sport);

        $sport->categories()->create($validated);

        return back()->with('success', 'Sport category added.');
    }

    public function updateCategory(Request $request, Sport $sport, SportCategory $category): RedirectResponse
    {
        abort_unless($category->sport_id === $sport->id, 404);

        $category->update($this->validateCategory($request, $sport, $category));

        return back()->with('success', 'Sport category updated.');
    }

    public function destroyCategory(Sport $sport, SportCategory $category): RedirectResponse
    {
        abort_unless($category->sport_id === $sport->id, 404);

        if ($category->leagues()->exists()) {
            return back()->withErrors(['category' => 'Cannot delete a category that is already used by leagues.']);
        }

        $category->delete();

        return back()->with('success', 'Sport category deleted.');
    }

    private function validateCategory(Request $request, Sport $sport, ?SportCategory $category = null): array
    {
        return $request->validate([
            'code' => [
                'required',
                'string',
                'max:50',
                Rule::unique('sport_categories', 'code')
                    ->where('sport_id', $sport->id)
                    ->ignore($category?->id),
            ],
            'name' => ['required', 'string', 'max:255'],
            'entry_type' => ['required', 'in:single,double,team'],
            'player_count' => ['required', 'integer', 'min:1'],
            'gender_rule' => ['required', 'in:male,female,mixed,open'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_active' => ['nullable', 'boolean'],
        ]);
    }
}
