<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('gender')->nullable()->after('role');
        });

        Schema::table('leagues', function (Blueprint $table) {
            $table->string('category')->nullable()->after('sport_id');
            $table->string('entry_type')->nullable()->after('category');
            $table->string('stage')->default('setup')->after('status');
            $table->unsignedInteger('participant_total')->nullable()->after('stage');
            $table->unsignedInteger('group_count')->nullable()->after('participant_total');
            $table->unsignedInteger('group_size')->nullable()->after('group_count');
            $table->unsignedInteger('sets_to_win')->default(2)->after('group_size');
            $table->unsignedInteger('points_per_set')->default(21)->after('sets_to_win');
            $table->unsignedInteger('advance_upper_count')->default(0)->after('points_per_set');
            $table->unsignedInteger('advance_lower_count')->default(0)->after('advance_upper_count');
        });

        Schema::create('league_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')->constrained()->cascadeOnDelete();
            $table->foreignId('player1_id')->constrained('users')->cascadeOnDelete();
            $table->foreignId('player2_id')->nullable()->constrained('users')->nullOnDelete();
            $table->foreignId('substitute_id')->nullable()->constrained('users')->nullOnDelete();
            $table->unsignedInteger('seed')->nullable();
            $table->timestamps();
        });

        Schema::create('league_groups', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('position');
            $table->timestamps();
        });

        Schema::create('league_group_entries', function (Blueprint $table) {
            $table->id();
            $table->foreignId('league_group_id')->constrained()->cascadeOnDelete();
            $table->foreignId('league_entry_id')->constrained()->cascadeOnDelete();
            $table->unsignedInteger('seed')->nullable();
            $table->unsignedInteger('points')->default(0);
            $table->unsignedInteger('manual_advance_rank')->nullable();
            $table->timestamps();
            $table->unique(['league_group_id', 'league_entry_id']);
        });

        Schema::table('leagues', function (Blueprint $table) {
            $table->foreignId('upper_champion_entry_id')->nullable()->after('advance_lower_count')->constrained('league_entries')->nullOnDelete();
            $table->foreignId('lower_champion_entry_id')->nullable()->after('upper_champion_entry_id')->constrained('league_entries')->nullOnDelete();
        });

        Schema::table('matches', function (Blueprint $table) {
            $table->foreignId('home_entry_id')->nullable()->after('away_team_id')->constrained('league_entries')->nullOnDelete();
            $table->foreignId('away_entry_id')->nullable()->after('home_entry_id')->constrained('league_entries')->nullOnDelete();
            $table->foreignId('league_group_id')->nullable()->after('league_id')->constrained('league_groups')->nullOnDelete();
            $table->string('stage')->nullable()->after('status');
            $table->unsignedInteger('round')->nullable()->after('stage');
            $table->string('bracket_slot')->nullable()->after('round');
            $table->foreignId('next_match_id')->nullable()->after('bracket_slot')->constrained('matches')->nullOnDelete();

            $table->foreignId('home_team_id')->nullable()->change();
            $table->foreignId('away_team_id')->nullable()->change();
        });

        Schema::create('match_sets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('match_id')->constrained('matches')->cascadeOnDelete();
            $table->unsignedInteger('set_number');
            $table->unsignedInteger('home_points');
            $table->unsignedInteger('away_points');
            $table->timestamps();
            $table->unique(['match_id', 'set_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('match_sets');

        Schema::table('matches', function (Blueprint $table) {
            $table->dropConstrainedForeignId('next_match_id');
            $table->dropColumn('bracket_slot');
            $table->dropColumn('round');
            $table->dropColumn('stage');
            $table->dropConstrainedForeignId('league_group_id');
            $table->dropConstrainedForeignId('away_entry_id');
            $table->dropConstrainedForeignId('home_entry_id');
            $table->foreignId('home_team_id')->nullable(false)->change();
            $table->foreignId('away_team_id')->nullable(false)->change();
        });

        Schema::dropIfExists('league_group_entries');
        Schema::dropIfExists('league_groups');
        Schema::dropIfExists('league_entries');

        Schema::table('leagues', function (Blueprint $table) {
            $table->dropConstrainedForeignId('upper_champion_entry_id');
            $table->dropConstrainedForeignId('lower_champion_entry_id');
            $table->dropColumn(['category', 'entry_type', 'stage', 'participant_total', 'group_count', 'group_size', 'sets_to_win', 'points_per_set', 'advance_upper_count', 'advance_lower_count']);
        });

        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('gender');
        });
    }
};
