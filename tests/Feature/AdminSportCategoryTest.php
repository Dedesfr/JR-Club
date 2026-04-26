<?php

namespace Tests\Feature;

use App\Models\League;
use App\Models\Sport;
use App\Models\SportCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AdminSportCategoryTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_update_and_delete_sport_category(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $sport = Sport::create(['name' => 'Basketball', 'icon' => 'sports_basketball', 'max_players_per_team' => 5]);

        $this->actingAs($admin)->post(route('admin.sports.categories.store', $sport), [
            'code' => '3V3',
            'name' => '3 vs 3',
            'entry_type' => 'team',
            'player_count' => 3,
            'gender_rule' => 'open',
            'sort_order' => 1,
            'is_active' => true,
        ])->assertRedirect();

        $category = $sport->categories()->firstOrFail();
        $this->assertSame('3V3', $category->code);

        $this->actingAs($admin)->patch(route('admin.sports.categories.update', [$sport, $category]), [
            'code' => '5V5',
            'name' => '5 vs 5',
            'entry_type' => 'team',
            'player_count' => 5,
            'gender_rule' => 'open',
            'sort_order' => 2,
            'is_active' => false,
        ])->assertRedirect();

        $category->refresh();
        $this->assertSame('5V5', $category->code);
        $this->assertSame(5, $category->player_count);
        $this->assertFalse($category->is_active);

        $this->actingAs($admin)->delete(route('admin.sports.categories.destroy', [$sport, $category]))->assertRedirect();
        $this->assertDatabaseMissing('sport_categories', ['id' => $category->id]);
    }

    public function test_admin_cannot_delete_category_used_by_league(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $sport = Sport::create(['name' => 'Basketball', 'icon' => 'sports_basketball', 'max_players_per_team' => 5]);
        $category = SportCategory::create([
            'sport_id' => $sport->id,
            'code' => '3V3',
            'name' => '3 vs 3',
            'entry_type' => 'team',
            'player_count' => 3,
            'gender_rule' => 'open',
        ]);

        League::create([
            'name' => 'JR 3x3',
            'sport_id' => $sport->id,
            'sport_category_id' => $category->id,
            'category' => $category->code,
            'entry_type' => $category->entry_type,
            'start_date' => now()->toDateString(),
            'status' => 'upcoming',
            'stage' => 'setup',
            'created_by' => $admin->id,
        ]);

        $this->actingAs($admin)->delete(route('admin.sports.categories.destroy', [$sport, $category]))->assertRedirect();
        $this->assertDatabaseHas('sport_categories', ['id' => $category->id]);
    }
}
