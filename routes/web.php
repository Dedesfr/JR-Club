<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileShowController;
use App\Http\Controllers\PushSubscriptionController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::redirect('/', '/activities');

Route::get('/dashboard', function () {
    return redirect()->route('activities.index');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::resource('activities', ActivityController::class);
    Route::post('/activities/{activity}/join', [ActivityController::class, 'join'])->name('activities.join');
    Route::delete('/activities/{activity}/leave', [ActivityController::class, 'leave'])->name('activities.leave');

    Route::resource('teams', TeamController::class);
    Route::post('/teams/{team}/members', [TeamController::class, 'addMember'])->name('teams.members.store');
    Route::delete('/teams/{team}/members/{user}', [TeamController::class, 'removeMember'])->name('teams.members.destroy');

    Route::resource('leagues', LeagueController::class);
    Route::post('/leagues/{league}/teams', [LeagueController::class, 'registerTeam'])->name('leagues.teams.store');
    Route::post('/leagues/{league}/matches', [LeagueController::class, 'scheduleMatch'])->name('leagues.matches.store');

    Route::get('/matches/{match}', [MatchController::class, 'show'])->name('matches.show');
    Route::post('/matches/{match}/start', [MatchController::class, 'start'])->name('matches.start');
    Route::patch('/matches/{match}/score', [MatchController::class, 'updateScore'])->name('matches.score');
    Route::post('/matches/{match}/end', [MatchController::class, 'end'])->name('matches.end');

    Route::get('/leaderboards', [LeaderboardController::class, 'index'])->name('leaderboards.index');
    Route::get('/profile/show', [ProfileShowController::class, 'me'])->name('profile.show');
    Route::get('/members/{user}', [ProfileShowController::class, 'public'])->name('profile.public');
    Route::post('/push-subscription', [PushSubscriptionController::class, 'store'])->name('push-subscription.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
