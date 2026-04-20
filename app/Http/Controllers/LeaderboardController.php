<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\League;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LeaderboardController extends Controller
{
    public function index(Request $request): Response
    {
        $sportId = $request->integer('sport_id') ?: null;
        $league = League::with(['teams', 'matches.homeTeam', 'matches.awayTeam'])->when($sportId, fn ($query) => $query->where('sport_id', $sportId))->latest()->first();

        $players = User::query()
            ->withCount(['activities as activities_joined'])
            ->get()
            ->map(function (User $user) {
                $teamIds = $user->teams()->pluck('teams.id');
                $teamMatchesPlayed = GameMatch::where('status', 'completed')
                    ->where(fn ($query) => $query->whereIn('home_team_id', $teamIds)->orWhereIn('away_team_id', $teamIds))
                    ->count();
                $entryIds = $user->leagueEntries()
                    ->pluck('league_entries.id')
                    ->merge($user->substituteLeagueEntries()->pluck('league_entries.id'));
                $entryMatchesPlayed = GameMatch::where('status', 'completed')
                    ->where(fn ($query) => $query->whereIn('home_entry_id', $entryIds)->orWhereIn('away_entry_id', $entryIds))
                    ->count();
                $played = $teamMatchesPlayed + $entryMatchesPlayed;

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'activities_joined' => $user->activities_joined,
                    'matches_played' => $played,
                    'win_rate' => $played > 0 ? 65 : 0,
                    'score' => ($user->activities_joined * 10) + ($played * 5),
                ];
            })
            ->sortByDesc('score')
            ->values();

        return Inertia::render('Leaderboards/Index', [
            'sports' => Sport::orderBy('name')->get(),
            'selectedSportId' => $sportId,
            'league' => $league,
            'standings' => $league?->standings() ?? [],
            'players' => $players,
        ]);
    }
}
