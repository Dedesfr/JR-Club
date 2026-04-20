<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeagueGroupEntry extends Model
{
    use HasFactory;

    protected $fillable = [
        'league_group_id',
        'league_entry_id',
        'seed',
        'points',
        'manual_advance_rank',
    ];

    public function group()
    {
        return $this->belongsTo(LeagueGroup::class, 'league_group_id');
    }

    public function entry()
    {
        return $this->belongsTo(LeagueEntry::class, 'league_entry_id');
    }
}
