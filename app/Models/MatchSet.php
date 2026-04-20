<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MatchSet extends Model
{
    use HasFactory;

    protected $fillable = [
        'match_id',
        'set_number',
        'home_points',
        'away_points',
    ];

    public function match()
    {
        return $this->belongsTo(GameMatch::class, 'match_id');
    }
}
