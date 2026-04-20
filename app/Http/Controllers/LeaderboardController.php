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
            'players' => $players,
        ]);
    }

    public function leagues(Request $request): Response
    {
        $sportId = $request->integer('sport_id') ?: null;
        $leagueId = $request->integer('league_id') ?: null;
        
        $leaguesQuery = League::query()->orderByDesc('created_at');
        if ($sportId) {
            $leaguesQuery->where('sport_id', $sportId);
        }
        $leagues = $leaguesQuery->get(['id', 'name']);
        
        if (!$leagueId && $leagues->isNotEmpty()) {
            $leagueId = $leagues->first()->id;
        }

        $league = null;
        $upperBracket = [];
        $lowerBracket = [];

        if ($leagueId) {
            $league = League::with([
                'teams', 
                'matches.homeTeam', 
                'matches.awayTeam',
                'matches.homeEntry.player1',
                'matches.homeEntry.player2',
                'matches.homeEntry.substitutes',
                'matches.awayEntry.player1',
                'matches.awayEntry.player2',
                'matches.awayEntry.substitutes',
                'matches.sets',
                'upperChampion.player1',
                'upperChampion.player2',
                'upperChampion.substitutes',
                'lowerChampion.player1',
                'lowerChampion.player2',
                'lowerChampion.substitutes',
            ])->find($leagueId);

            if ($league) {
                $upperBracket = $league->matches->where('stage', 'upper')->groupBy('round')->sortKeys()->values();
                $lowerBracket = $league->matches->where('stage', 'lower')->groupBy('round')->sortKeys()->values();
            }
        }

        return Inertia::render('Leaderboards/Leagues', [
            'sports' => Sport::orderBy('name')->get(),
            'selectedSportId' => $sportId,
            'leagues' => $leagues,
            'selectedLeagueId' => $leagueId,
            'league' => $league,
            'standings' => $league?->standings() ?? [],
            'upperBracket' => $upperBracket,
            'lowerBracket' => $lowerBracket,
        ]);
    }
}
