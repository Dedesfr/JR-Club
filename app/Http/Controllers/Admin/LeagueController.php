<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\Team;
use App\Models\User;
use App\Services\LeagueFormatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeagueController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Leagues/Index', [
            'leagues' => League::with('sport')
                ->withCount(['teams', 'entries', 'matches'])
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Leagues/Create', [
            'sports' => Sport::with(['categories' => fn ($query) => $query->where('is_active', true)])->orderBy('name')->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'sport_id' => ['required', 'exists:sports,id'],
            'sport_category_id' => ['nullable', 'exists:sport_categories,id'],
            'category' => ['nullable', 'string', 'max:50'],
            'description' => ['nullable', 'string'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['nullable', 'in:upcoming,active,completed'],
            'start_stage' => ['nullable', 'in:group,bracket'],
            'participant_total' => ['nullable', 'integer', 'min:2'],
            'sets_to_win' => ['required', 'integer', 'min:1'],
            'points_per_set' => ['required', 'integer', 'min:1'],
            'advance_upper_count' => ['required', 'integer', 'min:0'],
            'advance_lower_count' => ['required', 'integer', 'min:0'],
        ]);

        $sportCategory = $this->sportCategory($validated);

        $league = League::create(array_merge($validated, [
            'created_by' => $request->user()->id,
            'status' => $validated['status'] ?? 'upcoming',
            'start_stage' => $validated['start_stage'] ?? 'group',
            'sport_category_id' => $sportCategory?->id,
            'category' => $sportCategory?->code ?? ($validated['category'] ?? null),
            'entry_type' => $sportCategory?->entry_type ?? $this->entryType($validated['category'] ?? null),
            'stage' => 'setup',
        ]));

        return redirect()->route('admin.leagues.show', $league);
    }

    public function show(League $league): Response
    {
        $league->load([
            'sport',
            'sportCategory',
            'teams.members',
            'entries.player1',
            'entries.player2',
            'entries.substitute',
            'entries.substitutes',
            'entries.team.members',
            'groups.groupEntries.entry.player1',
            'groups.groupEntries.entry.player2',
            'groups.groupEntries.entry.substitutes',
            'groups.groupEntries.entry.team.members',
            'groups.matches.homeEntry.player1',
            'groups.matches.homeEntry.player2',
            'groups.matches.homeEntry.substitutes',
            'groups.matches.homeEntry.team',
            'groups.matches.awayEntry.player1',
            'groups.matches.awayEntry.player2',
            'groups.matches.awayEntry.substitutes',
            'groups.matches.awayEntry.team',
            'matches.homeTeam',
            'matches.awayTeam',
            'matches.homeEntry.player1',
            'matches.homeEntry.player2',
            'matches.homeEntry.substitutes',
            'matches.homeEntry.team',
            'matches.awayEntry.player1',
            'matches.awayEntry.player2',
            'matches.awayEntry.substitutes',
            'matches.awayEntry.team',
            'matches.sets',
            'matches.substitutions',
            'matches.documents',
            'upperChampion.player1',
            'upperChampion.player2',
            'upperChampion.substitutes',
            'lowerChampion.player1',
            'lowerChampion.player2',
            'lowerChampion.substitutes',
            'thirdPlaceMatch.homeEntry.player1',
            'thirdPlaceMatch.homeEntry.player2',
            'thirdPlaceMatch.homeEntry.substitutes',
            'thirdPlaceMatch.awayEntry.player1',
            'thirdPlaceMatch.awayEntry.player2',
            'thirdPlaceMatch.awayEntry.substitutes',
            'thirdPlaceMatch.sets',
            'lowerThirdPlaceMatch.homeEntry.player1',
            'lowerThirdPlaceMatch.homeEntry.player2',
            'lowerThirdPlaceMatch.homeEntry.substitutes',
            'lowerThirdPlaceMatch.awayEntry.player1',
            'lowerThirdPlaceMatch.awayEntry.player2',
            'lowerThirdPlaceMatch.awayEntry.substitutes',
            'lowerThirdPlaceMatch.sets',
        ]);

        return Inertia::render('Admin/Leagues/Show', [
            'league' => $league,
            'users' => User::query()->orderBy('name')->get(['id', 'name', 'email', 'gender', 'role']),
            'teams' => Team::query()
                ->where('sport_id', $league->sport_id)
                ->withCount('members')
                ->orderBy('name')
                ->get(['id', 'name', 'sport_id']),
            'divisionOptions' => $league->participant_total ? app(LeagueFormatService::class)->divisionOptions($league->participant_total) : [],
            'standings' => $league->standings(),
            'upperBracket' => $league->matches->where('stage', 'upper')->groupBy('round')->sortKeys()->values(),
            'lowerBracket' => $league->matches->where('stage', 'lower')->groupBy('round')->sortKeys()->values(),
        ]);
    }

    public function update(Request $request, League $league): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['sometimes', 'in:upcoming,active,completed'],
            'sport_category_id' => ['sometimes', 'nullable', 'exists:sport_categories,id'],
            'start_stage' => ['sometimes', 'in:group,bracket'],
            'participant_total' => ['nullable', 'integer', 'min:2'],
            'sets_to_win' => ['sometimes', 'integer', 'min:1'],
            'points_per_set' => ['sometimes', 'integer', 'min:1'],
            'advance_upper_count' => ['sometimes', 'integer', 'min:0'],
            'advance_lower_count' => ['sometimes', 'integer', 'min:0'],
        ]);

        if (array_key_exists('sport_category_id', $validated)) {
            $sportCategory = $this->sportCategory($validated + ['sport_id' => $league->sport_id]);
            $validated['sport_category_id'] = $sportCategory?->id;
            $validated['category'] = $sportCategory?->code;
            $validated['entry_type'] = $sportCategory?->entry_type;
        }

        $league->update($validated);

        return back()->with('success', 'League updated.');
    }

    public function destroy(League $league): RedirectResponse
    {
        $league->delete();

        return redirect()->route('admin.leagues.index')->with('success', 'League deleted.');
    }

    public function storeTeam(Request $request, League $league): RedirectResponse
    {
        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'player_ids' => ['nullable', 'array'],
            'player_ids.*' => ['integer', 'exists:users,id', 'distinct'],
            'substitute_ids' => ['nullable', 'array'],
            'substitute_ids.*' => ['integer', 'exists:users,id', 'distinct'],
        ]);

        if (! empty($validated['team_id'])) {
            $team = Team::query()->findOrFail($validated['team_id']);
        } else {
            $playerIds = collect($validated['player_ids'] ?? [])->filter()->values();
            $requiredPlayers = $league->sportCategory?->player_count;

            if (blank($validated['name'] ?? null)) {
                return back()->withErrors(['name' => 'Team name is required.']);
            }

            if ($requiredPlayers !== null && $playerIds->count() !== $requiredPlayers) {
                return back()->withErrors(['player_ids' => "Select exactly {$requiredPlayers} players for this category."]);
            }

            $substituteIds = collect($validated['substitute_ids'] ?? [])->filter()->values();

            if ($substituteIds->intersect($playerIds)->isNotEmpty()) {
                return back()->withErrors(['substitute_ids' => 'Substitutes must be different from the selected players.']);
            }

            $team = Team::query()->updateOrCreate(
                ['name' => $validated['name'], 'sport_id' => $league->sport_id],
                ['created_by' => $request->user()->id],
            );

            $members = $playerIds->mapWithKeys(fn (int $playerId, int $index) => [
                $playerId => [
                    'role' => $index === 0 ? 'captain' : 'member',
                    'joined_at' => now(),
                ],
            ]);

            $substitutes = $substituteIds->mapWithKeys(fn (int $playerId) => [
                $playerId => [
                    'role' => 'substitute',
                    'joined_at' => now(),
                ],
            ]);

            $team->members()->sync($members->union($substitutes)->all());
        }

        if ($team->sport_id !== $league->sport_id) {
            return back()->withErrors(['team_id' => 'Team sport must match league sport.']);
        }

        $league->teams()->syncWithoutDetaching([$team->id => ['registered_at' => now()]]);
        $league->entries()->updateOrCreate(
            ['team_id' => $team->id],
            [
                'group_name' => $team->name,
                'player1_id' => $team->members()->wherePivot('role', '!=', 'substitute')->orderBy('users.id')->value('users.id') ?? $request->user()->id,
                'seed' => (int) $league->entries()->max('seed') + 1,
            ],
        );

        return back()->with('success', 'Team registered.');
    }

    public function destroyTeam(League $league, Team $team): RedirectResponse
    {
        $league->teams()->detach($team->id);
        $league->entries()->where('team_id', $team->id)->delete();

        return back()->with('success', 'Team removed.');
    }

    private function entryType(?string $category): ?string
    {
        return match ($category) {
            'MS', 'WS' => 'single',
            'MD', 'WD', 'XD' => 'double',
            default => null,
        };
    }

    private function sportCategory(array $validated): ?SportCategory
    {
        if (empty($validated['sport_category_id'])) {
            return null;
        }

        return SportCategory::query()
            ->where('sport_id', $validated['sport_id'])
            ->where('is_active', true)
            ->findOrFail($validated['sport_category_id']);
    }
}
