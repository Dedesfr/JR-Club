<?php

namespace App\Http\Controllers\Admin;

use App\Events\MatchScoreUpdated;
use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\MatchSet;
use App\Services\BracketService;
use App\Services\LeagueFormatService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LeagueMatchController extends Controller
{
    public function store(Request $request, GameMatch $match, LeagueFormatService $leagueFormatService, BracketService $bracketService): RedirectResponse
    {
        $validated = $request->validate([
            'home_points' => ['required', 'integer', 'min:0'],
            'away_points' => ['required', 'integer', 'min:0', 'different:home_points'],
        ]);

        MatchSet::updateOrCreate(
            ['match_id' => $match->id, 'set_number' => $match->sets()->count() + 1],
            $validated,
        );

        $match->refresh();
        $homeSets = $match->sets->where('home_points', '>', 0)->filter(fn ($set) => $set->home_points > $set->away_points)->count();
        $awaySets = $match->sets->where('away_points', '>', 0)->filter(fn ($set) => $set->away_points > $set->home_points)->count();

        $status = max($homeSets, $awaySets) >= $match->league->sets_to_win ? 'completed' : 'live';

        $match->update([
            'home_score' => $homeSets,
            'away_score' => $awaySets,
            'status' => $status,
        ]);

        if ($status === 'completed') {
            if ($match->stage === 'group') {
                $leagueFormatService->recomputeGroupPoints($match->league->fresh());
            }

            if (in_array($match->stage, ['upper', 'lower'], true) && $match->winner_entry_id !== null) {
                $bracketService->advanceWinner($match->fresh('league', 'nextMatch'), $match->winner_entry_id);
            }
        }

        broadcast(new MatchScoreUpdated($match->fresh(['homeTeam', 'awayTeam', 'homeEntry.player1', 'homeEntry.player2', 'homeEntry.substitutes', 'awayEntry.player1', 'awayEntry.player2', 'awayEntry.substitutes', 'sets', 'league'])));

        return back()->with('success', 'Set recorded.');
    }

    public function complete(GameMatch $match): RedirectResponse
    {
        $match->update(['status' => 'completed']);

        broadcast(new MatchScoreUpdated($match->fresh(['homeTeam', 'awayTeam', 'homeEntry.player1', 'homeEntry.player2', 'homeEntry.substitutes', 'awayEntry.player1', 'awayEntry.player2', 'awayEntry.substitutes', 'sets', 'league'])));

        return back()->with('success', 'Match completed.');
    }
}
