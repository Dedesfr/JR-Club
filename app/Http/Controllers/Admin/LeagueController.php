<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Branch;
use App\Models\LeagueAward;
use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\Team;
use App\Models\User;
use App\Services\LeagueFormatService;
use App\Support\MatchFormat;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class LeagueController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Admin/Leagues/Index', [
            'leagues' => League::with(['sport', 'branch'])
                ->manageableBy(request()->user())
                ->withCount(['teams', 'entries', 'matches'])
                ->latest()
                ->get(),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('Admin/Leagues/Create', [
            'sports' => Sport::with(['categories' => fn ($query) => $query->where('is_active', true)])->orderBy('name')->get(),
            'branches' => auth()->user()?->isPusatAdmin() ? Branch::orderBy('name')->get(['id', 'name', 'is_global']) : [],
            'matchFormats' => MatchFormat::options(),
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
            'match_format' => ['nullable', MatchFormat::rule()],
            'advance_upper_count' => ['required', 'integer', 'min:0'],
            'advance_lower_count' => ['required', 'integer', 'min:0'],
            'banner' => ['nullable', 'image', 'max:5120'],
            'branch_id' => ['nullable', 'exists:branch,id'],
        ]);

        if (! $request->user()->isPusatAdmin()) {
            unset($validated['branch_id']);
        }

        $sportCategory = $this->sportCategory($validated);

        $bannerPath = null;
        if ($request->hasFile('banner')) {
            $path = $request->file('banner')->store('league-banners', 'public');
            $bannerPath = '/storage/' . $path;
        }

        $league = League::create(array_merge($validated, [
            'created_by' => $request->user()->id,
            'status' => $validated['status'] ?? 'upcoming',
            'start_stage' => $validated['start_stage'] ?? 'group',
            'sport_category_id' => $sportCategory?->id,
            'category' => $sportCategory?->code ?? ($validated['category'] ?? null),
            'entry_type' => $sportCategory?->entry_type ?? $this->entryType($validated['category'] ?? null),
            'stage' => 'setup',
            'banner_path' => $bannerPath,
        ]));

        return redirect()->route('admin.leagues.show', $league);
    }

    public function show(League $league): Response
    {
        $this->authorize('view', $league);

        $league->load([
            'branch',
            'sport',
            'sportCategory',
            'awards',
            'teams.members',
            'entries.player1',
            'entries.player2',
            'entries.substitute',
            'entries.substitutes',
            'entries.players',
            'entries.team.members',
            'groups.groupEntries.entry.player1',
            'groups.groupEntries.entry.player2',
            'groups.groupEntries.entry.players',
            'groups.groupEntries.entry.substitutes',
            'groups.groupEntries.entry.team.members',
            'groups.matches.homeEntry.player1',
            'groups.matches.homeEntry.player2',
            'groups.matches.homeEntry.players',
            'groups.matches.homeEntry.substitutes',
            'groups.matches.homeEntry.team',
            'groups.matches.awayEntry.player1',
            'groups.matches.awayEntry.player2',
            'groups.matches.awayEntry.players',
            'groups.matches.awayEntry.substitutes',
            'groups.matches.awayEntry.team',
            'matches.homeTeam',
            'matches.awayTeam',
            'matches.homeEntry.player1',
            'matches.homeEntry.player2',
            'matches.homeEntry.players',
            'matches.homeEntry.substitutes',
            'matches.homeEntry.team',
            'matches.awayEntry.player1',
            'matches.awayEntry.player2',
            'matches.awayEntry.players',
            'matches.awayEntry.substitutes',
            'matches.awayEntry.team',
            'matches.sets',
            'matches.substitutions',
            'matches.documents',
            'upperChampion.player1',
            'upperChampion.player2',
            'upperChampion.players',
            'upperChampion.substitutes',
            'lowerChampion.player1',
            'lowerChampion.player2',
            'lowerChampion.players',
            'lowerChampion.substitutes',
            'thirdPlaceMatch.homeEntry.player1',
            'thirdPlaceMatch.homeEntry.player2',
            'thirdPlaceMatch.homeEntry.players',
            'thirdPlaceMatch.homeEntry.substitutes',
            'thirdPlaceMatch.awayEntry.player1',
            'thirdPlaceMatch.awayEntry.player2',
            'thirdPlaceMatch.awayEntry.players',
            'thirdPlaceMatch.awayEntry.substitutes',
            'thirdPlaceMatch.sets',
            'lowerThirdPlaceMatch.homeEntry.player1',
            'lowerThirdPlaceMatch.homeEntry.player2',
            'lowerThirdPlaceMatch.homeEntry.players',
            'lowerThirdPlaceMatch.homeEntry.substitutes',
            'lowerThirdPlaceMatch.awayEntry.player1',
            'lowerThirdPlaceMatch.awayEntry.player2',
            'lowerThirdPlaceMatch.awayEntry.players',
            'lowerThirdPlaceMatch.awayEntry.substitutes',
            'lowerThirdPlaceMatch.sets',
        ]);

        return Inertia::render('Admin/Leagues/Show', [
            'league' => $league,
            'users' => User::query()
                ->when(! request()->user()->isPusatAdmin(), fn ($query) => $query->where('branch_id', request()->user()->branch_id))
                ->orderBy('name')
                ->get(['id', 'name', 'email', 'gender', 'role', 'branch_id']),
            'teams' => $this->teamsForLeague($league),
            'divisionOptions' => $league->participant_total ? app(LeagueFormatService::class)->divisionOptions($league->participant_total) : [],
            'standings' => $league->standings(),
            'upperBracket' => $league->matches->where('stage', 'upper')->groupBy('round')->sortKeys()->values(),
            'lowerBracket' => $league->matches->where('stage', 'lower')->groupBy('round')->sortKeys()->values(),
            'matchFormats' => MatchFormat::options(),
        ]);
    }

    public function update(Request $request, League $league): RedirectResponse
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'documentation_url' => ['nullable', 'url', 'max:2048'],
            'start_date' => ['sometimes', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'status' => ['sometimes', 'in:upcoming,active,completed'],
            'sport_category_id' => ['sometimes', 'nullable', 'exists:sport_categories,id'],
            'start_stage' => ['sometimes', 'in:group,bracket'],
            'participant_total' => ['nullable', 'integer', 'min:2'],
            'sets_to_win' => ['sometimes', 'integer', 'min:1'],
            'points_per_set' => ['sometimes', 'integer', 'min:1'],
            'match_format' => ['sometimes', 'nullable', MatchFormat::rule()],
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

        return back()->with('success', 'Tournament updated.');
    }

    public function destroy(League $league): RedirectResponse
    {
        $this->authorize('delete', $league);

        $league->delete();

        return redirect()->route('admin.leagues.index')->with('success', 'Tournament deleted.');
    }

    public function uploadBanner(Request $request, League $league): RedirectResponse
    {
        $this->authorize('update', $league);

        $request->validate(['banner' => ['required', 'image', 'max:5120']]);

        if ($league->banner_path && str_starts_with($league->banner_path, '/storage/')) {
            Storage::disk('public')->delete(ltrim(str_replace('/storage/', '', $league->banner_path), '/'));
        }

        $path = $request->file('banner')->store('league-banners', 'public');
        $league->update(['banner_path' => '/storage/' . $path]);

        return redirect()->route('admin.leagues.show', $league)->with('success', 'Banner uploaded.');
    }

    public function storeAward(Request $request, League $league): RedirectResponse
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'winner_label' => ['required', 'string', 'max:255'],
        ]);

        $league->awards()->create([
            'title' => $validated['title'],
            'winner_label' => $validated['winner_label'],
            'sort_order' => ((int) $league->awards()->max('sort_order')) + 1,
        ]);

        return back()->with('success', 'Award added.');
    }

    public function destroyAward(League $league, LeagueAward $award): RedirectResponse
    {
        $this->authorize('update', $league);
        abort_unless($award->league_id === $league->id, 404);

        $award->delete();

        return back()->with('success', 'Award removed.');
    }

    public function storeTeam(Request $request, League $league): RedirectResponse
    {
        $this->authorize('update', $league);

        $validated = $request->validate([
            'team_id' => ['nullable', 'exists:teams,id'],
            'name' => ['nullable', 'string', 'max:255'],
            'player_ids' => ['nullable', 'array'],
            'player_ids.*' => ['integer', 'exists:users,id', 'distinct'],
            'substitute_ids' => ['nullable', 'array'],
            'substitute_ids.*' => ['integer', 'exists:users,id', 'distinct'],
        ]);

        if (! empty($validated['team_id'])) {
            $team = Team::query()->with('members')->findOrFail($validated['team_id']);
            $this->authorize('view', $team);

            $playerIds = collect($validated['player_ids'] ?? [])->filter()->values();
            $requiredPlayers = $league->sportCategory?->player_count;

            if ($playerIds->isNotEmpty()) {
                if ($requiredPlayers !== null && $playerIds->count() !== $requiredPlayers) {
                    return back()->withErrors(['player_ids' => "Select exactly {$requiredPlayers} players."]);
                }

                $memberIds = $team->members->pluck('id');
                if ($playerIds->diff($memberIds)->isNotEmpty()) {
                    return back()->withErrors(['player_ids' => 'All selected players must be members of the team.']);
                }
            }
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
                ['name' => $validated['name'], 'branch_id' => $league->branch_id],
                ['created_by' => $request->user()->id, 'branch_id' => $league->branch_id],
            );

            $team->sports()->syncWithoutDetaching([$league->sport_id]);

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

        if (! $team->sports()->where('sports.id', $league->sport_id)->exists()) {
            return back()->withErrors(['team_id' => 'Team sport must match league sport.']);
        }

        $league->teams()->syncWithoutDetaching([$team->id => ['registered_at' => now()]]);

        $playerIds = collect($validated['player_ids'] ?? [])->filter()->values();
        $player1Id = $playerIds->first()
            ?? $team->members()->wherePivot('role', '!=', 'substitute')->orderBy('users.id')->value('users.id')
            ?? $request->user()->id;

        $entry = $league->entries()->updateOrCreate(
            ['team_id' => $team->id],
            [
                'group_name' => $team->name,
                'player1_id' => $player1Id,
                'seed' => (int) $league->entries()->max('seed') + 1,
            ],
        );

        if ($playerIds->isNotEmpty()) {
            $entry->players()->sync(
                $playerIds->mapWithKeys(fn (int $id, int $index) => [$id => ['sort_order' => $index]])->all()
            );
        }

        return back()->with('success', 'Team registered.');
    }

    public function destroyTeam(League $league, Team $team): RedirectResponse
    {
        $this->authorize('update', $league);
        $this->authorize('view', $team);

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

    private function teamsForLeague(League $league): \Illuminate\Support\Collection
    {
        $sportId = $league->sport_id;

        // Sport squad members (team_sport_members) for this sport
        $squadByTeam = DB::table('team_sport_members')
            ->join('users', 'users.id', '=', 'team_sport_members.user_id')
            ->where('team_sport_members.sport_id', $sportId)
            ->select('team_sport_members.team_id', 'users.id', 'users.name', 'users.gender')
            ->get()
            ->groupBy('team_id');

        // Sport logo per team (from team_sports pivot)
        $logoByTeam = DB::table('team_sports')
            ->where('sport_id', $sportId)
            ->whereNotNull('logo_path')
            ->pluck('logo_path', 'team_id');

        return Team::query()
            ->whereHas('sports', fn ($q) => $q->where('sports.id', $sportId))
            ->manageableBy(request()->user())
            ->with('members:id,name,gender')
            ->orderBy('name')
            ->get(['id', 'name', 'logo_path'])
            ->map(function (Team $team) use ($squadByTeam, $logoByTeam) {
                $squad = $squadByTeam->get($team->id);
                $hasSquad = $squad && $squad->isNotEmpty();

                return [
                    'id' => $team->id,
                    'name' => $team->name,
                    'logo_path' => $team->logo_path,
                    'sport_logo' => $logoByTeam->get($team->id),
                    'has_squad' => $hasSquad,
                    // Use sport squad if configured, otherwise fall back to global roster
                    'members' => $hasSquad
                        ? $squad->map(fn ($u) => ['id' => $u->id, 'name' => $u->name, 'gender' => $u->gender])->values()->all()
                        : $team->members->map(fn ($m) => ['id' => $m->id, 'name' => $m->name, 'gender' => $m->gender ?? null])->all(),
                ];
            });
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
