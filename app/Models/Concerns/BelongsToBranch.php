<?php

namespace App\Models\Concerns;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

trait BelongsToBranch
{
    protected static function bootBelongsToBranch(): void
    {
        static::creating(function ($model) {
            $user = auth()->user();

            if ($model->branch_id === null && $user instanceof User && $user->isAdmin() && ! $user->isPusatAdmin()) {
                $model->branch_id = $user->branch_id;
            }
        });
    }

    public function branch()
    {
        return $this->belongsTo(Branch::class);
    }

    public function scopeVisibleTo(Builder $query, ?User $user): Builder
    {
        return $query->where(function (Builder $query) use ($user) {
            $query->whereNull('branch_id');

            if ($user?->branch_id !== null) {
                $query->orWhere('branch_id', $user->branch_id);
            }
        });
    }

    public function scopeManageableBy(Builder $query, ?User $user): Builder
    {
        if ($user?->isPusatAdmin()) {
            return $query;
        }

        if ($user?->branch_id === null) {
            return $query->whereRaw('1 = 0');
        }

        return $query->where('branch_id', $user->branch_id);
    }
}
