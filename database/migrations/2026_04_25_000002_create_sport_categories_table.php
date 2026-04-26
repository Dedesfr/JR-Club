<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('sport_categories', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sport_id')->constrained()->cascadeOnDelete();
            $table->string('code');
            $table->string('name');
            $table->string('entry_type')->default('team');
            $table->unsignedInteger('player_count')->default(1);
            $table->string('gender_rule')->default('open');
            $table->unsignedInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['sport_id', 'code']);
        });

        Schema::table('leagues', function (Blueprint $table) {
            $table->foreignId('sport_category_id')->nullable()->after('sport_id')->constrained('sport_categories')->nullOnDelete();
        });

        $this->seedDefaultCategories();
    }

    public function down(): void
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->dropConstrainedForeignId('sport_category_id');
        });

        Schema::dropIfExists('sport_categories');
    }

    private function seedDefaultCategories(): void
    {
        $definitions = [
            'Badminton' => [
                ['MS', 'Single Putra', 'single', 1, 'male'],
                ['WS', 'Single Putri', 'single', 1, 'female'],
                ['MD', 'Ganda Putra', 'double', 2, 'male'],
                ['WD', 'Ganda Putri', 'double', 2, 'female'],
                ['XD', 'Ganda Campuran', 'double', 2, 'mixed'],
            ],
            'Basketball' => [
                ['3V3', '3 vs 3', 'team', 3, 'open'],
                ['5V5', '5 vs 5', 'team', 5, 'open'],
            ],
        ];

        foreach ($definitions as $sportName => $categories) {
            $sport = DB::table('sports')->where('name', $sportName)->first();

            if (! $sport) {
                continue;
            }

            foreach ($categories as $index => [$code, $name, $entryType, $playerCount, $genderRule]) {
                DB::table('sport_categories')->updateOrInsert(
                    ['sport_id' => $sport->id, 'code' => $code],
                    [
                        'name' => $name,
                        'entry_type' => $entryType,
                        'player_count' => $playerCount,
                        'gender_rule' => $genderRule,
                        'sort_order' => $index + 1,
                        'is_active' => true,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ],
                );
            }
        }

        DB::table('leagues')
            ->whereNotNull('category')
            ->orderBy('id')
            ->get(['id', 'sport_id', 'category'])
            ->each(function ($league) {
                $category = DB::table('sport_categories')
                    ->where('sport_id', $league->sport_id)
                    ->where('code', $league->category)
                    ->first();

                if ($category) {
                    DB::table('leagues')
                        ->where('id', $league->id)
                        ->update(['sport_category_id' => $category->id]);
                }
            });
    }
};
