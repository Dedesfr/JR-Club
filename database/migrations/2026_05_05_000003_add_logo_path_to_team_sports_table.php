<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('team_sports', function (Blueprint $table) {
            $table->string('logo_path')->nullable()->after('sport_id');
        });
    }

    public function down(): void
    {
        Schema::table('team_sports', function (Blueprint $table) {
            $table->dropColumn('logo_path');
        });
    }
};
