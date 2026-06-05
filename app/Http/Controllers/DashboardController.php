<?php

namespace App\Http\Controllers;

use App\Models\GameMatch;
use App\Models\League;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(Request $request): Response
    {
        $user = $request->user();

        $entryIds = $user->leagueEntries()->pluck('id');

        $upcomingMatches = GameMatch::with(['league.sport', 'homeEntry.player1', 'homeEntry.player2', 'awayEntry.player1', 'awayEntry.player2', 'homeTeam', 'awayTeam'])
            ->where('status', 'scheduled')
            ->where(function ($query) use ($entryIds) {
                $query->whereIn('home_entry_id', $entryIds)
                    ->orWhereIn('away_entry_id', $entryIds);
            })
            ->orderBy('scheduled_at')
            ->limit(5)
            ->get();

        $recentResults = GameMatch::with(['league.sport', 'homeEntry.player1', 'homeEntry.player2', 'awayEntry.player1', 'awayEntry.player2', 'homeTeam', 'awayTeam'])
            ->where('status', 'completed')
            ->where(function ($query) use ($entryIds) {
                $query->whereIn('home_entry_id', $entryIds)
                    ->orWhereIn('away_entry_id', $entryIds);
            })
            ->orderByDesc('updated_at')
            ->limit(5)
            ->get();

        $teams = $user->teams()->with('sports')->get();

        $ongoingLeagues = League::with('sport')
            ->whereIn('id', function ($query) use ($entryIds) {
                $query->select('league_id')
                    ->from('league_entries')
                    ->whereIn('id', $entryIds);
            })
            ->whereNotIn('status', ['completed'])
            ->orderBy('start_date')
            ->get();

        return Inertia::render('Dashboard', [
            'upcomingMatches' => $upcomingMatches,
            'recentResults' => $recentResults,
            'teams' => $teams,
            'ongoingLeagues' => $ongoingLeagues,
        ]);
    }
}
