<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\User;
use Illuminate\Database\Seeder;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $pusatId = Branch::query()->where('is_global', true)->value('id')
            ?? Branch::query()->where('name', 'Pusat')->value('id');

        User::query()->updateOrCreate(
            ['email' => 'superadmin@jasaraharja.co.id'],
            [
                'name' => 'JR Club Super Admin',
                'password' => 'password',
                'role' => 'super_admin',
                'gender' => 'male',
                'branch_id' => $pusatId,
            ],
        );
    }
}
