<?php

namespace Database\Seeders;

use App\Models\Sport;
use App\Models\Team;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;
use Illuminate\Support\Str;

class TeamSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::query()->firstOrCreate(
            ['email' => 'admin@jasaraharja.co.id'],
            [
                'name' => 'JR Club Admin',
                'password' => 'password',
                'role' => 'admin',
                'gender' => 'male',
            ],
        );

        $badminton = Sport::query()->firstOrCreate(
            ['name' => 'Badminton'],
            [
                'icon' => 'sports_tennis',
                'max_players_per_team' => 2,
                'description' => 'Singles and doubles court sessions.',
            ],
        );

        foreach ($this->parseRosterDocument() as $teamName => $entries) {
            $team = Team::query()->updateOrCreate(
                ['name' => $teamName, 'sport_id' => $badminton->id],
                [
                    'created_by' => $admin->id,
                    'logo_path' => $this->resolveTeamLogoPath($teamName),
                ],
            );

            $captainAssigned = false;
            $members = collect($entries)
                ->reduce(function (Collection $members, array $entry) use (&$captainAssigned) {
                    $name = $this->normalizeValue($entry['name']);

                    if ($name === null) {
                        return $members;
                    }

                    $email = $this->buildEmail($entry['team'], $name);
                    $existing = $members->get($email, [
                        'name' => $name,
                        'email' => $email,
                        'gender' => null,
                        'role' => 'substitute',
                    ]);

                    $isReserve = str_contains($entry['category'], 'Cadangan');
                    $gender = $this->inferGender($entry['category']);

                    $existing['gender'] = $this->mergeGender($existing['gender'], $gender);
                    $existing['role'] = $this->mergeRole($existing['role'], $isReserve, $captainAssigned);

                    if ($existing['role'] === 'captain') {
                        $captainAssigned = true;
                    }

                    $members->put($email, $existing);

                    return $members;
                }, collect());

            $memberIds = $members->mapWithKeys(function (array $member) {
                $user = User::query()->updateOrCreate(
                    ['email' => $member['email']],
                    [
                        'name' => $member['name'],
                        'password' => 'password',
                        'role' => 'member',
                        'gender' => $member['gender'],
                    ],
                );

                return [
                    $user->id => [
                        'role' => $member['role'],
                        'joined_at' => now(),
                    ],
                ];
            });

            $team->members()->sync($memberIds->all());
        }
    }

    private function parseRosterDocument(): Collection
    {
        $document = file_get_contents(base_path('document.md'));

        if ($document === false) {
            throw new \RuntimeException('Unable to read document.md for team seeding.');
        }

        return collect(preg_split('/\n---\n/', trim($document)) ?: [])
            ->mapWithKeys(function (string $section) {
                $lines = preg_split('/\R/', trim($section)) ?: [];
                $heading = trim(Str::after($lines[0] ?? '', '## '));

                $entries = collect($lines)
                    ->filter(fn (string $line) => str_starts_with($line, '|'))
                    ->reject(fn (string $line) => str_contains($line, '---|'))
                    ->skip(1)
                    ->map(function (string $line) use ($heading) {
                        $columns = array_map('trim', explode('|', trim($line, '|')));

                        return [
                            'team' => $heading,
                            'category' => $columns[1] ?? '',
                            'name' => $columns[2] ?? '',
                        ];
                    })
                    ->values()
                    ->all();

                return [$heading => $entries];
            });
    }

    private function normalizeValue(?string $value): ?string
    {
        $value = trim((string) $value);

        if ($value === '' || $value === '-') {
            return null;
        }

        return $value;
    }

    private function buildEmail(string $teamName, string $memberName): string
    {
        return sprintf(
            '%s.%s@jasaraharja.co.id',
            Str::slug($teamName),
            Str::slug($memberName),
        );
    }

    private function resolveTeamLogoPath(string $teamName): ?string
    {
        $matches = glob(public_path('images/team-logo/'.$teamName.'.*')) ?: [];

        if ($matches === []) {
            return null;
        }

        return '/images/team-logo/'.basename($matches[0]);
    }

    private function inferGender(string $category): ?string
    {
        if (str_contains($category, 'Putra')) {
            return 'male';
        }

        if (str_contains($category, 'Putri')) {
            return 'female';
        }

        return null;
    }

    private function mergeGender(?string $current, ?string $incoming): ?string
    {
        if ($current === null) {
            return $incoming;
        }

        if ($incoming === null || $current === $incoming) {
            return $current;
        }

        return null;
    }

    private function mergeRole(string $currentRole, bool $isReserve, bool $captainAssigned): string
    {
        if ($currentRole === 'captain' || (! $isReserve && $currentRole === 'member')) {
            return $currentRole;
        }

        if ($isReserve) {
            return $currentRole;
        }

        return $captainAssigned ? 'member' : 'captain';
    }
}
