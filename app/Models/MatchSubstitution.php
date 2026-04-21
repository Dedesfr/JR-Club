<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchSubstitution extends Model
{
    protected $fillable = [
        'match_id',
        'entry_id',
        'original_player_id',
        'substitute_id',
        'reason',
        'activated_at',
    ];
}