<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasTable('team_sports')) {
            Schema::create('team_sports', function (Blueprint $table) {
                $table->id();
                $table->foreignId('team_id')->constrained()->cascadeOnDelete();
                $table->foreignId('sport_id')->constrained()->cascadeOnDelete();
                $table->timestamps();
                $table->unique(['team_id', 'sport_id']);
            });
        }

        if (Schema::hasColumn('teams', 'sport_id')) {
            // Migrate existing sport_id data into pivot table.
            DB::table('teams')
                ->whereNotNull('sport_id')
                ->get(['id', 'sport_id'])
                ->groupBy('sport_id')
                ->each(function ($teams, $sportId) {
                    $rows = $teams->map(fn ($team) => [
                        'team_id' => $team->id,
                        'sport_id' => $sportId,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ])->all();

                    DB::table('team_sports')->insert($rows);
                });

            Schema::table('teams', function (Blueprint $table) {
                if (DB::getDriverName() === 'pgsql') {
                    DB::statement('ALTER TABLE teams DROP CONSTRAINT IF EXISTS teams_sport_id_foreign');
                } else {
                    $table->dropForeign(['sport_id']);
                }
            });

            Schema::table('teams', function (Blueprint $table) {
                $table->dropColumn('sport_id');
            });
        }
    }

    public function down(): void
    {
        Schema::table('teams', function (Blueprint $table) {
            $table->foreignId('sport_id')->nullable()->constrained()->nullOnDelete();
        });

        // Restore first sport per team back to sport_id
        DB::table('team_sports')
            ->orderBy('team_id')
            ->orderBy('sport_id')
            ->get()
            ->groupBy('team_id')
            ->each(function ($rows, $teamId) {
                DB::table('teams')
                    ->where('id', $teamId)
                    ->update(['sport_id' => $rows->first()->sport_id]);
            });

        Schema::dropIfExists('team_sports');
    }
};
