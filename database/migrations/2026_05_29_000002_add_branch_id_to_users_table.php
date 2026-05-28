<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('branch', 'is_global')) {
            Schema::table('branch', function (Blueprint $table) {
                $table->boolean('is_global')->default(false)->after('name');
            });

            DB::table('branch')->where('name', 'Pusat')->update(['is_global' => true]);
        }

        $pusatId = DB::table('branch')->where('is_global', true)->value('id')
            ?? DB::table('branch')->where('name', 'Pusat')->value('id');

        Schema::table('users', function (Blueprint $table) use ($pusatId) {
            $table->foreignId('branch_id')
                ->default($pusatId)
                ->after('role')
                ->constrained('branch')
                ->restrictOnDelete();
        });

        DB::table('users')->whereNull('branch_id')->update(['branch_id' => $pusatId]);
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropConstrainedForeignId('branch_id');
        });
    }
};
