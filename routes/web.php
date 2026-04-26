<?php

use App\Http\Controllers\ActivityController;
use App\Http\Controllers\Admin\ActivityController as AdminActivityController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\LeagueBracketController as AdminLeagueBracketController;
use App\Http\Controllers\Admin\LeagueController as AdminLeagueController;
use App\Http\Controllers\Admin\LeagueEntryController as AdminLeagueEntryController;
use App\Http\Controllers\Admin\LeagueGroupController as AdminLeagueGroupController;
use App\Http\Controllers\Admin\LeagueMatchController as AdminLeagueMatchController;
use App\Http\Controllers\Admin\SportController as AdminSportController;
use App\Http\Controllers\Admin\TeamController as AdminTeamController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\LeaderboardController;
use App\Http\Controllers\LeagueController;
use App\Http\Controllers\MatchController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProfileShowController;
use App\Http\Controllers\PushSubscriptionController;
use App\Http\Controllers\TeamController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Admin\ParticipantImportExportController as AdminParticipantImportExportController;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;

// if (App::environment('local')) {
//     URL::forceScheme('https');
// }


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
    Route::get('/leaderboards/leagues', [LeaderboardController::class, 'leagues'])->name('leaderboards.leagues');
    Route::get('/profile/show', [ProfileShowController::class, 'me'])->name('profile.show');
    Route::get('/members/{user}', [ProfileShowController::class, 'public'])->name('profile.public');
    Route::post('/push-subscription', [PushSubscriptionController::class, 'store'])->name('push-subscription.store');

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::prefix('admin')->name('admin.')->middleware('can:admin')->group(function () {
        Route::get('/', AdminDashboardController::class)->name('dashboard');

        Route::get('/leagues', [AdminLeagueController::class, 'index'])->name('leagues.index');
        Route::get('/leagues/create', [AdminLeagueController::class, 'create'])->name('leagues.create');
        Route::post('/leagues', [AdminLeagueController::class, 'store'])->name('leagues.store');
        Route::get('/leagues/{league}', [AdminLeagueController::class, 'show'])->name('leagues.show');
        Route::patch('/leagues/{league}', [AdminLeagueController::class, 'update'])->name('leagues.update');
        Route::delete('/leagues/{league}', [AdminLeagueController::class, 'destroy'])->name('leagues.destroy');
        Route::post('/leagues/{league}/teams', [AdminLeagueController::class, 'storeTeam'])->name('leagues.teams.store');
        Route::delete('/leagues/{league}/teams/{team}', [AdminLeagueController::class, 'destroyTeam'])->name('leagues.teams.destroy');
        
        Route::get('/leagues/participants/template', [AdminParticipantImportExportController::class, 'template'])->name('leagues.participants.template');
        Route::post('/leagues/{league}/participants/import', [AdminParticipantImportExportController::class, 'import'])->name('leagues.participants.import');
        Route::get('/leagues/{league}/participants/export', [AdminParticipantImportExportController::class, 'export'])->name('leagues.participants.export');
        
        Route::post('/leagues/{league}/entries', [AdminLeagueEntryController::class, 'store'])->name('leagues.entries.store');
        Route::patch('/leagues/{league}/entries/{entry}', [AdminLeagueEntryController::class, 'update'])->name('leagues.entries.update');
        Route::delete('/leagues/{league}/entries/{entry}', [AdminLeagueEntryController::class, 'destroy'])->name('leagues.entries.destroy');
        Route::post('/leagues/{league}/groups', [AdminLeagueGroupController::class, 'store'])->name('leagues.groups.store');
        Route::patch('/leagues/{league}/groups/{groupEntry}', [AdminLeagueGroupController::class, 'update'])->name('leagues.groups.update');
        Route::post('/leagues/{league}/brackets', [AdminLeagueBracketController::class, 'store'])->name('leagues.brackets.store');
        Route::post('/leagues/{league}/bracket/adjust', [AdminLeagueBracketController::class, 'adjust'])->name('leagues.brackets.adjust');

        Route::patch('/matches/{match}/schedule', [AdminLeagueMatchController::class, 'updateSchedule'])->name('matches.schedule.update');
        Route::post('/matches/{match}/substitutions', [AdminLeagueMatchController::class, 'substitute'])->name('matches.substitutions.store');
        Route::post('/matches/{match}/documents', [AdminLeagueMatchController::class, 'uploadDocuments'])->name('matches.documents.store');
        Route::delete('/matches/{match}/documents/{document}', [AdminLeagueMatchController::class, 'destroyDocument'])->name('matches.documents.destroy');
        
        Route::post('/matches/{match}/sets', [AdminLeagueMatchController::class, 'store'])->name('matches.sets.store');
        Route::post('/matches/{match}/complete', [AdminLeagueMatchController::class, 'complete'])->name('matches.complete');

        Route::get('/sports', [AdminSportController::class, 'index'])->name('sports.index');
        Route::get('/sports/{sport}/edit', [AdminSportController::class, 'edit'])->name('sports.edit');
        Route::patch('/sports/{sport}', [AdminSportController::class, 'update'])->name('sports.update');
        Route::post('/sports/{sport}/categories', [AdminSportController::class, 'storeCategory'])->name('sports.categories.store');
        Route::patch('/sports/{sport}/categories/{category}', [AdminSportController::class, 'updateCategory'])->name('sports.categories.update');
        Route::delete('/sports/{sport}/categories/{category}', [AdminSportController::class, 'destroyCategory'])->name('sports.categories.destroy');

        Route::get('/activities', [AdminActivityController::class, 'index'])->name('activities.index');
        Route::get('/activities/{activity}/edit', [AdminActivityController::class, 'edit'])->name('activities.edit');
        Route::patch('/activities/{activity}', [AdminActivityController::class, 'update'])->name('activities.update');

        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
        Route::get('/users/{user}/edit', [AdminUserController::class, 'edit'])->name('users.edit');
        Route::patch('/users/{user}', [AdminUserController::class, 'update'])->name('users.update');

        Route::get('/teams', [AdminTeamController::class, 'index'])->name('teams.index');
        Route::get('/teams/{team}/edit', [AdminTeamController::class, 'edit'])->name('teams.edit');
        Route::patch('/teams/{team}', [AdminTeamController::class, 'update'])->name('teams.update');
    });
});

require __DIR__.'/auth.php';
