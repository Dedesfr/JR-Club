<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameMatch;
use App\Models\League;
use App\Models\LeagueEntry;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __invoke(): Response
    {
        return Inertia::render('Admin/Dashboard', [
            'kpis' => [
                'activeLeagues' => League::whereIn('status', ['active', 'upcoming'])->count(),
                'registeredEntries' => LeagueEntry::count(),
                'upcomingMatches' => GameMatch::where('status', 'scheduled')->count(),
                'liveMatches' => GameMatch::where('status', 'live')->count(),
            ],
            'recentLeagues' => League::with('sport')->latest()->take(5)->get(),
        ]);
    }
}
