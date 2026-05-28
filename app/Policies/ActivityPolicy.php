<?php

namespace App\Policies;

use App\Models\Activity;
use App\Models\User;

class ActivityPolicy
{
    public function view(User $user, Activity $activity): bool
    {
        return $this->ownsBranch($user, $activity);
    }

    public function update(User $user, Activity $activity): bool
    {
        return $this->ownsBranch($user, $activity);
    }

    public function delete(User $user, Activity $activity): bool
    {
        return $this->ownsBranch($user, $activity);
    }

    private function ownsBranch(User $user, Activity $activity): bool
    {
        return $user->isAdmin()
            && $activity->branch_id !== null
            && $activity->branch_id === $user->branch_id;
    }
}
