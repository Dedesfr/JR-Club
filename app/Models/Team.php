<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'sport_id', 'created_by'];

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function members()
    {
        return $this->belongsToMany(User::class, 'team_members')
            ->withPivot(['role', 'joined_at'])
            ->withTimestamps();
    }

    public function leagues()
    {
        return $this->belongsToMany(League::class, 'league_teams')
            ->withPivot('registered_at')
            ->withTimestamps();
    }
}
