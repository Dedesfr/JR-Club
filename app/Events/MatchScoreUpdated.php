<?php

namespace App\Events;

use App\Models\GameMatch;
use Illuminate\Broadcasting\Channel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class MatchScoreUpdated implements ShouldBroadcast
{
    use Dispatchable, SerializesModels;

    public function __construct(public GameMatch $match)
    {
    }

    public function broadcastOn(): Channel
    {
        return new Channel('matches.'.$this->match->id);
    }

    public function broadcastAs(): string
    {
        return 'score.updated';
    }

    public function broadcastWith(): array
    {
        return [
            'id' => $this->match->id,
            'status' => $this->match->status,
            'home_score' => $this->match->home_score,
            'away_score' => $this->match->away_score,
            'home_team' => $this->match->homeTeam?->name,
            'away_team' => $this->match->awayTeam?->name,
        ];
    }
}
