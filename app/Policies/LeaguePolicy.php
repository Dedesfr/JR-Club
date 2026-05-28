<?php

namespace App\Policies;

use App\Models\League;
use App\Models\User;

class LeaguePolicy
{
    public function view(User $user, League $league): bool
    {
        return $this->ownsBranch($user, $league);
    }

    public function update(User $user, League $league): bool
    {
        return $this->ownsBranch($user, $league);
    }

    public function delete(User $user, League $league): bool
    {
        return $this->ownsBranch($user, $league);
    }

    private function ownsBranch(User $user, League $league): bool
    {
        return $user->isAdmin()
            && $league->branch_id !== null
            && $league->branch_id === $user->branch_id;
    }
}
