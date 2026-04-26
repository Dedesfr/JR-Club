<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SportCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'sport_id',
        'code',
        'name',
        'entry_type',
        'player_count',
        'gender_rule',
        'sort_order',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'player_count' => 'integer',
            'sort_order' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function leagues()
    {
        return $this->hasMany(League::class);
    }
}
