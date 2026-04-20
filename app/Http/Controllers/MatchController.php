<?php

namespace App\Http\Controllers;

use App\Events\MatchScoreUpdated;
use App\Jobs\SendPushNotification;
use App\Models\GameMatch;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class MatchController extends Controller
{
    public function show(GameMatch $match): Response
    {
        return Inertia::render('Matches/Show', [
            'match' => $match->load(['league.sport', 'homeTeam', 'awayTeam']),
            'canManage' => request()->user()->can('admin'),
        ]);
    }

    public function start(GameMatch $match): RedirectResponse
    {
        Gate::authorize('admin');
        $match->update(['status' => 'live']);
        SendPushNotification::dispatch('Match starting', "{$match->homeTeam->name} vs {$match->awayTeam->name} is live.");
        broadcast(new MatchScoreUpdated($match->fresh(['homeTeam', 'awayTeam'])));

        return back();
    }

    public function updateScore(Request $request, GameMatch $match): RedirectResponse
    {
        Gate::authorize('admin');

        $match->update($request->validate([
            'home_score' => ['required', 'integer', 'min:0'],
            'away_score' => ['required', 'integer', 'min:0'],
        ]) + ['status' => 'live']);

        broadcast(new MatchScoreUpdated($match->fresh(['homeTeam', 'awayTeam'])));

        return back();
    }

    public function end(GameMatch $match): RedirectResponse
    {
        Gate::authorize('admin');
        $match->update(['status' => 'completed']);
        SendPushNotification::dispatch('Match result', "{$match->homeTeam->name} {$match->home_score} - {$match->away_score} {$match->awayTeam->name}");
        broadcast(new MatchScoreUpdated($match->fresh(['homeTeam', 'awayTeam'])));

        return back();
    }
}
