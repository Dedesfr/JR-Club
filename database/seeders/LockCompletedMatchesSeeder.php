<?php

namespace Database\Seeders;

use App\Models\GameMatch;
use Illuminate\Database\Seeder;

class LockCompletedMatchesSeeder extends Seeder
{
    public function run(): void
    {
        GameMatch::whereHas('sets')
            ->where('locked', false)
            ->update(['locked' => true]);

        $count = GameMatch::whereHas('sets')->where('locked', true)->count();

        $this->command->info("Locked {$count} matches that already have sets recorded.");
    }
}
