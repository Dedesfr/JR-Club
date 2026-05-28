<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('branch', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->boolean('is_global')->default(false);
            $table->timestamps();
        });

        DB::table('branch')->insert([
            ['name' => 'Pusat', 'is_global' => true],
            ['name' => 'DKI', 'is_global' => false],
            ['name' => 'Jateng', 'is_global' => false],
            ['name' => 'Lampung', 'is_global' => false],
        ]);
    }

    public function down(): void
    {
        Schema::dropIfExists('branch');
    }
};
