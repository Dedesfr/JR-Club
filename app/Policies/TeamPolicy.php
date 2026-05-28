<?php

namespace App\Policies;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    public function view(User $user, Team $team): bool
    {
        return $this->ownsBranch($user, $team);
    }

    public function update(User $user, Team $team): bool
    {
        return $this->ownsBranch($user, $team);
    }

    public function delete(User $user, Team $team): bool
    {
        return $this->ownsBranch($user, $team);
    }

    private function ownsBranch(User $user, Team $team): bool
    {
        return $user->isAdmin()
            && $team->branch_id !== null
            && $team->branch_id === $user->branch_id;
    }
}
