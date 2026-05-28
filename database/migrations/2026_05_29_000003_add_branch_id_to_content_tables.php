<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        foreach (['leagues', 'activities', 'teams'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->foreignId('branch_id')
                    ->nullable()
                    ->after('id')
                    ->constrained('branch')
                    ->nullOnDelete();
            });
        }
    }

    public function down(): void
    {
        foreach (['leagues', 'activities', 'teams'] as $tableName) {
            Schema::table($tableName, function (Blueprint $table) {
                $table->dropConstrainedForeignId('branch_id');
            });
        }
    }
};
