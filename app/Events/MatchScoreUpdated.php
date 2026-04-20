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

    public function __construct(public GameMatch $match) {}

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
            'stage' => $this->match->stage,
            'home_score' => $this->match->home_score,
            'away_score' => $this->match->away_score,
            'home_team' => $this->match->home_label,
            'away_team' => $this->match->away_label,
            'sets' => $this->match->sets->map(fn ($set) => [
                'set_number' => $set->set_number,
                'home_points' => $set->home_points,
                'away_points' => $set->away_points,
            ])->all(),
            'current_set' => $this->match->sets->last()?->set_number,
            'winner_entry_id' => $this->match->winner_entry_id,
            'next_match_id' => $this->match->next_match_id,
        ];
    }
}
