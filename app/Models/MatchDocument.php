<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MatchDocument extends Model
{
    protected $fillable = [
        'match_id',
        'path',
        'original_name',
        'uploaded_by',
    ];
}