<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class League extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'sport_id',
        'description',
        'start_date',
        'end_date',
        'status',
        'created_by',
    ];

    protected function casts(): array
    {
        return ['start_date' => 'date', 'end_date' => 'date'];
    }

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function teams()
    {
        return $this->belongsToMany(Team::class, 'league_teams')
            ->withPivot('registered_at')
            ->withTimestamps();
    }

    public function matches()
    {
        return $this->hasMany(GameMatch::class, 'league_id');
    }

    public function standings(): array
    {
        $rows = $this->teams->mapWithKeys(fn (Team $team) => [$team->id => [
            'team' => $team,
            'played' => 0,
            'won' => 0,
            'drawn' => 0,
            'lost' => 0,
            'goals_for' => 0,
            'goals_against' => 0,
            'points' => 0,
        ]])->all();

        foreach ($this->matches->where('status', 'completed') as $match) {
            foreach ([[$match->home_team_id, $match->home_score, $match->away_score], [$match->away_team_id, $match->away_score, $match->home_score]] as [$teamId, $for, $against]) {
                if (! isset($rows[$teamId])) {
                    continue;
                }

                $rows[$teamId]['played']++;
                $rows[$teamId]['goals_for'] += $for;
                $rows[$teamId]['goals_against'] += $against;

                if ($for > $against) {
                    $rows[$teamId]['won']++;
                    $rows[$teamId]['points'] += 3;
                } elseif ($for === $against) {
                    $rows[$teamId]['drawn']++;
                    $rows[$teamId]['points']++;
                } else {
                    $rows[$teamId]['lost']++;
                }
            }
        }

        return collect($rows)->sortByDesc('points')->values()->all();
    }
}
