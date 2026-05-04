<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeagueAward extends Model
{
    use HasFactory;

    protected $fillable = [
        'league_id',
        'title',
        'winner_label',
        'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'sort_order' => 'integer',
        ];
    }

    public function league()
    {
        return $this->belongsTo(League::class);
    }
}
