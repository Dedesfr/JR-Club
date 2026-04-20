<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sport extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'icon', 'max_players_per_team', 'description'];

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }
}
