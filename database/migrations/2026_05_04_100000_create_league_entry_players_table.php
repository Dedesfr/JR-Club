<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('league_entry_players', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_entry_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
            $table->unique(['league_entry_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('league_entry_players');
    }
};
