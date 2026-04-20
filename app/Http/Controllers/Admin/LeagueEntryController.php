<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\LeagueEntry;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class LeagueEntryController extends Controller
{
    public function store(Request $request, League $league): RedirectResponse
    {
        if (! $league->isBadminton()) {
            throw ValidationException::withMessages(['league' => 'Entries are only available for badminton leagues.']);
        }

        $validated = $request->validate([
            'group_name' => [Rule::requiredIf(fn () => $league->entry_type === 'double'), 'nullable', 'string', 'max:255'],
            'player1_id' => ['required', 'exists:users,id'],
            'player2_id' => ['nullable', 'exists:users,id', 'different:player1_id'],
            'substitute_ids' => ['nullable', 'array'],
            'substitute_ids.*' => ['integer', 'exists:users,id', 'distinct'],
        ]);

        $player1 = User::findOrFail($validated['player1_id']);
        $player2 = isset($validated['player2_id']) ? User::findOrFail($validated['player2_id']) : null;
        $substitutes = User::query()
            ->whereIn('id', $validated['substitute_ids'] ?? [])
            ->get();

        $this->assertCategoryRules($league, $player1, $player2, $substitutes);

        $entry = $league->entries()->create([
            'group_name' => $league->entry_type === 'double' ? ($validated['group_name'] ?? null) : null,
            'player1_id' => $validated['player1_id'],
            'player2_id' => $validated['player2_id'] ?? null,
            'substitute_id' => $substitutes->first()?->id,
            'seed' => (int) $league->entries()->max('seed') + 1,
        ]);

        $entry->substitutes()->sync($substitutes->pluck('id')->all());

        return back()->with('success', 'Entry added.');
    }

    public function destroy(League $league, LeagueEntry $entry): RedirectResponse
    {
        abort_unless($entry->league_id === $league->id, 404);

        $entry->delete();

        return back()->with('success', 'Entry removed.');
    }

    private function assertCategoryRules(League $league, User $player1, ?User $player2, $substitutes): void
    {
        $valid = match ($league->category) {
            'MS' => $player1->gender === 'male' && $player2 === null,
            'WS' => $player1->gender === 'female' && $player2 === null,
            'MD' => $player1->gender === 'male' && $player2?->gender === 'male',
            'WD' => $player1->gender === 'female' && $player2?->gender === 'female',
            'XD' => collect([$player1->gender, $player2?->gender])->sort()->values()->all() === ['female', 'male'],
            default => false,
        };

        if (! $valid) {
            throw ValidationException::withMessages(['player1_id' => 'Selected players do not match the league category rules.']);
        }

        $participantIds = collect([$player1->id, $player2?->id])->filter();

        if ($substitutes->pluck('id')->intersect($participantIds)->isNotEmpty()) {
            throw ValidationException::withMessages(['substitute_ids' => 'Substitutes must be different from the selected players.']);
        }

        if (in_array($league->category, ['MS', 'MD'], true) && $substitutes->contains(fn (User $substitute) => $substitute->gender !== 'male')) {
            throw ValidationException::withMessages(['substitute_ids' => 'Substitutes must satisfy the league gender rule.']);
        }

        if (in_array($league->category, ['WS', 'WD'], true) && $substitutes->contains(fn (User $substitute) => $substitute->gender !== 'female')) {
            throw ValidationException::withMessages(['substitute_ids' => 'Substitutes must satisfy the league gender rule.']);
        }
    }
}
