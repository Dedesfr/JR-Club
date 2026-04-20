<?php

use App\Jobs\SendPushNotification;
use App\Models\Activity;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Artisan::command('jrclub:activity-reminders', function () {
    Activity::query()
        ->whereIn('status', ['open', 'full'])
        ->whereBetween('scheduled_at', [now(), now()->addHour()])
        ->each(fn (Activity $activity) => SendPushNotification::dispatch(
            'Activity reminder',
            "{$activity->title} starts at {$activity->scheduled_at->format('H:i')}."
        ));
})->purpose('Queue push reminders for activities starting within one hour');

Schedule::command('jrclub:activity-reminders')->everyFifteenMinutes();
