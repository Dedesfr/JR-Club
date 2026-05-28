<?php

namespace App\Providers;

use App\Models\Activity;
use App\Models\League;
use App\Models\Team;
use App\Policies\ActivityPolicy;
use App\Policies\LeaguePolicy;
use App\Policies\TeamPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Gate::before(fn ($user) => $user->isPusatAdmin() ? true : null);

        Gate::define('admin', fn ($user) => $user->role === 'admin');
        Gate::policy(League::class, LeaguePolicy::class);
        Gate::policy(Activity::class, ActivityPolicy::class);
        Gate::policy(Team::class, TeamPolicy::class);

        Vite::prefetch(concurrency: 3);
    }
}
