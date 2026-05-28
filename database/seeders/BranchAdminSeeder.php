<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;

class BranchAdminSeeder extends Seeder
{
    public function run(): void
    {
        foreach ($this->admins() as $branchName => $admin) {
            $branch = Branch::query()->where('name', $branchName)->first();

            if (! $branch) {
                continue;
            }

            User::query()->updateOrCreate(
                ['email' => $admin['email']],
                [
                    'name' => $admin['name'],
                    'password' => 'password',
                    'role' => 'admin',
                    'gender' => $admin['gender'],
                    'branch_id' => $branch->id,
                ],
            );
        }
    }

    private function admins(): array
    {
        return [
            'DKI' => [
                'name' => 'JR Club Admin DKI',
                'email' => 'admin.dki@jasaraharja.co.id',
                'gender' => 'male',
            ],
            'Jateng' => [
                'name' => 'JR Club Admin Jateng',
                'email' => 'admin.jateng@jasaraharja.co.id',
                'gender' => 'male',
            ],
            'Lampung' => [
                'name' => 'JR Club Admin Lampung',
                'email' => 'admin.lampung@jasaraharja.co.id',
                'gender' => 'male',
            ],
        ];
    }
}
