<?php

namespace App\Models;

use App\Models\Concerns\BelongsToBranch;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Team extends Model
{
    use BelongsToBranch, HasFactory;

    protected $fillable = ['name', 'branch_id', 'sport_id', 'created_by', 'logo_path'];

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
