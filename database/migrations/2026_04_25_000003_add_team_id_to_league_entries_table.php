<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('league_entries', function (Blueprint $table) {
            $table->foreignId('team_id')->nullable()->after('league_id')->constrained()->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('league_entries', function (Blueprint $table) {
            $table->dropConstrainedForeignId('team_id');
        });
    }
};
