<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeagueGroup extends Model
{
    use HasFactory;

    protected $fillable = [
        'league_id',
        'name',
        'position',
    ];

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function entries()
    {
        return $this->belongsToMany(LeagueEntry::class, 'league_group_entries')
            ->withPivot(['id', 'seed', 'points', 'manual_advance_rank'])
            ->withTimestamps();
    }

    public function groupEntries()
    {
        return $this->hasMany(LeagueGroupEntry::class);
    }

    public function matches()
    {
        return $this->hasMany(GameMatch::class, 'league_group_id');
    }
}
