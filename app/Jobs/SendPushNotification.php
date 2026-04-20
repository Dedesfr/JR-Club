<?php

namespace App\Jobs;

use App\Models\User;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class SendPushNotification implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public string $title,
        public string $body,
        public ?int $userId = null,
    ) {
    }

    public function handle(): void
    {
        User::query()
            ->whereNotNull('push_subscription')
            ->when($this->userId, fn ($query) => $query->whereKey($this->userId))
            ->each(fn (User $user) => Log::info('Push notification queued', [
                'user_id' => $user->id,
                'title' => $this->title,
                'body' => $this->body,
                'endpoint' => $user->push_subscription['endpoint'] ?? null,
            ]));
    }
}
