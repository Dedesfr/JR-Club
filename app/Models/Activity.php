<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Activity extends Model
{
    use HasFactory;

    protected $fillable = [
        'sport_id',
        'created_by',
        'title',
        'description',
        'location',
        'scheduled_at',
        'max_participants',
        'status',
    ];

    protected function casts(): array
    {
        return ['scheduled_at' => 'datetime'];
    }

    public function sport()
    {
        return $this->belongsTo(Sport::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'activity_participants')
            ->withPivot('joined_at')
            ->withTimestamps();
    }

    public function getSpotsLeftAttribute(): int
    {
        return max(0, $this->max_participants - $this->participants_count);
    }
}
