<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('league_entries', function (Blueprint $table) {
            $table->string('group_name')->nullable()->after('league_id');
        });

        Schema::create('league_entry_substitutes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_entry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->timestamps();
            $table->unique(['league_entry_id', 'user_id']);
        });

        DB::table('league_entries')
            ->whereNotNull('substitute_id')
            ->orderBy('id')
            ->get(['id', 'substitute_id'])
            ->each(function ($entry) {
                DB::table('league_entry_substitutes')->insert([
                    'league_entry_id' => $entry->id,
                    'user_id' => $entry->substitute_id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            });
    }

    public function down(): void
    {
        Schema::dropIfExists('league_entry_substitutes');

        Schema::table('league_entries', function (Blueprint $table) {
            $table->dropColumn('group_name');
        });
    }
};
