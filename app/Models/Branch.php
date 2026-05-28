<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Branch extends Model
{
    protected $table = 'branch';

    protected $fillable = [
        'name',
        'is_global',
    ];

    protected function casts(): array
    {
        return [
            'is_global' => 'boolean',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function leagues()
    {
        return $this->hasMany(League::class);
    }

    public function activities()
    {
        return $this->hasMany(Activity::class);
    }

    public function teams()
    {
        return $this->hasMany(Team::class);
    }
}
