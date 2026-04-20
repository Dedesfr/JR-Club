<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProfileShowController extends Controller
{
    public function me(Request $request): Response
    {
        return $this->render($request->user(), false);
    }

    public function public(User $user): Response
    {
        return $this->render($user, true);
    }

    private function render(User $user, bool $public): Response
    {
        $user->load(['activities.sport', 'teams.sport']);

        return Inertia::render('Profile/Show', [
            'profile' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $public ? null : $user->email,
                'role' => $user->role,
                'activities' => $user->activities,
                'teams' => $user->teams,
                'stats' => [
                    'activities_joined' => $user->activities->count(),
                    'teams' => $user->teams->count(),
                    'matches_played' => 0,
                    'win_rate' => 0,
                ],
            ],
            'isPublic' => $public,
        ]);
    }
}
