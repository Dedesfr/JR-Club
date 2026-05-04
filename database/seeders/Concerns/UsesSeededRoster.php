<?php

namespace Database\Seeders\Concerns;

use App\Models\Sport;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Collection;

trait UsesSeededRoster
{
    private function seededAdmin(): User
    {
        return User::query()
            ->where('role', 'admin')
            ->firstOrCreate(
                ['email' => 'admin@jasaraharja.co.id'],
                [
                    'name' => 'JR Club Admin',
                    'password' => 'password',
                    'role' => 'admin',
                    'gender' => 'male',
                ],
            );
    }

    private function seededSport(string $name, array $attributes): Sport
    {
        return Sport::query()->firstOrCreate(['name' => $name], $attributes);
    }

    private function seededBadmintonTeams(?int $limit = null): Collection
    {
        $query = Team::query()
            ->whereHas('sport', fn ($sportQuery) => $sportQuery->where('name', 'Badminton'))
            ->with(['members' => fn ($memberQuery) => $memberQuery->orderBy('users.id')])
            ->orderBy('id');

        if ($limit !== null) {
            $query->limit($limit);
        }

        return $query->get();
    }

    private function mensDoublesEntriesFromSeededTeams(int $requiredTeams = 16): Collection
    {
        $teams = $this->seededBadmintonTeams($requiredTeams);

        if ($teams->count() < $requiredTeams) {
            throw new \RuntimeException("Expected {$requiredTeams} seeded badminton teams, found {$teams->count()}.");
        }

        return $teams->values()->map(function (Team $team, int $index) {
            $players = $team->members
                ->filter(fn (User $member) => $member->gender === 'male' && $member->pivot?->role !== 'substitute')
                ->values();

            if ($players->count() < 2) {
                throw new \RuntimeException("Team {$team->name} does not have enough male players for men's doubles seeding.");
            }

            $substitutes = $team->members
                ->filter(fn (User $member) => $member->gender === 'male' && $member->pivot?->role === 'substitute')
                ->values();

            return [
                'team' => $team,
                'player1_id' => $players[0]->id,
                'player2_id' => $players[1]->id,
                'substitute_id' => $substitutes->first()?->id,
                'substitute_ids' => $substitutes->pluck('id')->all(),
                'seed' => $index + 1,
            ];
        });
    }
}
