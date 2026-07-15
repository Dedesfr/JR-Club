<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->boolean('bracket_preset_enabled')->default(false)->after('advance_lower_count');
            $table->unsignedInteger('bracket_preset_reveal_at')->nullable()->after('bracket_preset_enabled');
            $table->unsignedInteger('bracket_seed_count')->default(0)->after('bracket_preset_reveal_at');
            $table->json('bracket_preset_slots')->nullable()->after('bracket_seed_count');
        });
    }

    public function down(): void
    {
        Schema::table('leagues', function (Blueprint $table) {
            $table->dropColumn([
                'bracket_preset_enabled',
                'bracket_preset_reveal_at',
                'bracket_seed_count',
                'bracket_preset_slots',
            ]);
        });
    }
};
