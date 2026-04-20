<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GameMatch extends Model
{
    use HasFactory;

    protected $table = 'matches';

    protected $fillable = [
        'league_id',
        'league_group_id',
        'home_team_id',
        'away_team_id',
        'home_entry_id',
        'away_entry_id',
        'scheduled_at',
        'status',
        'stage',
        'round',
        'bracket_slot',
        'next_match_id',
        'home_score',
        'away_score',
    ];

    protected $appends = ['home_label', 'away_label', 'winner_entry_id'];

    protected function casts(): array
    {
        return [
            'scheduled_at' => 'datetime',
            'round' => 'integer',
        ];
    }

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function homeTeam()
    {
        return $this->belongsTo(Team::class, 'home_team_id');
    }

    public function awayTeam()
    {
        return $this->belongsTo(Team::class, 'away_team_id');
    }

    public function homeEntry()
    {
        return $this->belongsTo(LeagueEntry::class, 'home_entry_id');
    }

    public function awayEntry()
    {
        return $this->belongsTo(LeagueEntry::class, 'away_entry_id');
    }

    public function group()
    {
        return $this->belongsTo(LeagueGroup::class, 'league_group_id');
    }

    public function nextMatch()
    {
        return $this->belongsTo(self::class, 'next_match_id');
    }

    public function sets()
    {
        return $this->hasMany(MatchSet::class, 'match_id')->orderBy('set_number');
    }

    public function isEntryMatch(): bool
    {
        return $this->home_entry_id !== null || $this->away_entry_id !== null;
    }

    public function getHomeLabelAttribute(): ?string
    {
        return $this->homeEntry?->label ?? $this->homeTeam?->name;
    }

    public function getAwayLabelAttribute(): ?string
    {
        return $this->awayEntry?->label ?? $this->awayTeam?->name;
    }

    public function getWinnerEntryIdAttribute(): ?int
    {
        if ($this->isEntryMatch()) {
            if ($this->home_score === $this->away_score) {
                return null;
            }

            return $this->home_score > $this->away_score ? $this->home_entry_id : $this->away_entry_id;
        }

        return null;
    }
}
