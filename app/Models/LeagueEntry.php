<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeagueEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'league_id',
        'group_name',
        'player1_id',
        'player2_id',
        'substitute_id',
        'seed',
    ];

    protected $appends = ['label'];

    public function league()
    {
        return $this->belongsTo(League::class);
    }

    public function player1()
    {
        return $this->belongsTo(User::class, 'player1_id');
    }

    public function player2()
    {
        return $this->belongsTo(User::class, 'player2_id');
    }

    public function substitute()
    {
        return $this->belongsTo(User::class, 'substitute_id');
    }

    public function substitutes()
    {
        return $this->belongsToMany(User::class, 'league_entry_substitutes')
            ->withTimestamps();
    }

    public function groups()
    {
        return $this->belongsToMany(LeagueGroup::class, 'league_group_entries')
            ->withPivot(['id', 'seed', 'points', 'manual_advance_rank'])
            ->withTimestamps();
    }

    public function getLabelAttribute(): string
    {
        if ($this->group_name) {
            return $this->group_name;
        }

        $players = collect([$this->player1?->name, $this->player2?->name])->filter()->implode(' / ');

        return $players !== '' ? $players : 'Entry #'.$this->id;
    }
}
