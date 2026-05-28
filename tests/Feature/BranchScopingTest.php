<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\GameMatch;
use App\Models\League;
use App\Models\Sport;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class BranchScopingTest extends TestCase
{
    use RefreshDatabase;

    public function test_branch_admin_index_and_single_record_access_are_scoped(): void
    {
        [$dki, $jateng] = $this->branches();
        $sport = $this->sport();
        $admin = User::factory()->create(['role' => 'admin', 'branch_id' => $dki->id]);
        $dkiLeague = $this->league($sport, ['name' => 'DKI League', 'branch_id' => $dki->id]);
        $jatengLeague = $this->league($sport, ['name' => 'Jateng League', 'branch_id' => $jateng->id]);
        $nationalLeague = $this->league($sport, ['name' => 'National League', 'branch_id' => null]);

        $this->actingAs($admin)
            ->get(route('admin.leagues.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('leagues', 1)
                ->where('leagues.0.id', $dkiLeague->id));

        $this->actingAs($admin)->get(route('admin.leagues.show', $jatengLeague))->assertForbidden();
        $this->actingAs($admin)->patch(route('admin.leagues.update', $jatengLeague), ['name' => 'Blocked'])->assertForbidden();
        $this->actingAs($admin)->delete(route('admin.leagues.destroy', $nationalLeague))->assertForbidden();
    }

    public function test_pusat_admin_sees_and_manages_all_branch_and_national_content(): void
    {
        [$dki, $jateng, $pusat] = $this->branches();
        $sport = $this->sport();
        $admin = User::factory()->create(['role' => 'admin', 'branch_id' => $pusat->id]);
        $dkiLeague = $this->league($sport, ['name' => 'DKI League', 'branch_id' => $dki->id]);
        $this->league($sport, ['name' => 'Jateng League', 'branch_id' => $jateng->id]);
        $this->league($sport, ['name' => 'National League', 'branch_id' => null]);

        $this->actingAs($admin)
            ->get(route('admin.leagues.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page->has('leagues', 3));

        $this->actingAs($admin)
            ->patch(route('admin.leagues.update', $dkiLeague), ['name' => 'Updated DKI League'])
            ->assertSessionHas('success');

        $this->assertDatabaseHas('leagues', ['id' => $dkiLeague->id, 'name' => 'Updated DKI League']);
    }

    public function test_branch_admin_created_content_is_auto_assigned_to_their_branch(): void
    {
        [$dki] = $this->branches();
        $sport = $this->sport();
        $admin = User::factory()->create(['role' => 'admin', 'branch_id' => $dki->id]);

        $this->actingAs($admin)
            ->post(route('admin.leagues.store'), [
                'name' => 'Branch Created League',
                'sport_id' => $sport->id,
                'description' => null,
                'start_date' => now()->toDateString(),
                'status' => 'upcoming',
                'start_stage' => 'group',
                'participant_total' => 8,
                'sets_to_win' => 2,
                'points_per_set' => 21,
                'advance_upper_count' => 1,
                'advance_lower_count' => 1,
            ])
            ->assertRedirect();

        $this->assertDatabaseHas('leagues', [
            'name' => 'Branch Created League',
            'branch_id' => $dki->id,
        ]);
    }

    public function test_members_see_national_and_own_branch_only_and_pusat_member_has_no_all_access(): void
    {
        [$dki, $jateng, $pusat] = $this->branches();
        $sport = $this->sport();
        $dkiMember = User::factory()->create(['role' => 'member', 'branch_id' => $dki->id]);
        $pusatMember = User::factory()->create(['role' => 'member', 'branch_id' => $pusat->id]);
        $nationalLeague = $this->league($sport, ['name' => 'National League', 'branch_id' => null]);
        $dkiLeague = $this->league($sport, ['name' => 'DKI League', 'branch_id' => $dki->id]);
        $jatengLeague = $this->league($sport, ['name' => 'Jateng League', 'branch_id' => $jateng->id]);

        $this->actingAs($dkiMember)
            ->get(route('leagues.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('allLeagues', 2)
                ->where('allLeagues', fn ($leagues) => collect($leagues)->pluck('id')->sort()->values()->all() === [$nationalLeague->id, $dkiLeague->id]));

        $this->actingAs($dkiMember)->get(route('leagues.show', $jatengLeague))->assertNotFound();

        $this->actingAs($pusatMember)
            ->get(route('leagues.index'))
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('allLeagues', 1)
                ->where('allLeagues', fn ($leagues) => collect($leagues)->pluck('id')->all() === [$nationalLeague->id]));
    }

    public function test_match_visibility_derives_from_parent_league_and_user_lookup_remains_global(): void
    {
        [$dki, $jateng] = $this->branches();
        $sport = $this->sport();
        $dkiMember = User::factory()->create(['role' => 'member', 'branch_id' => $dki->id]);
        $foreignUser = User::factory()->create(['role' => 'member', 'branch_id' => $jateng->id]);
        $jatengLeague = $this->league($sport, ['branch_id' => $jateng->id]);
        $match = GameMatch::create([
            'league_id' => $jatengLeague->id,
            'scheduled_at' => now(),
            'status' => 'scheduled',
        ]);

        $this->actingAs($dkiMember)->get(route('matches.show', $match))->assertNotFound();

        $this->assertNotNull(auth()->loginUsingId($dkiMember->id));
        $this->assertTrue(User::query()->whereKey($foreignUser->id)->exists());
    }

    private function branches(): array
    {
        return [
            Branch::where('name', 'DKI')->firstOrFail(),
            Branch::where('name', 'Jateng')->firstOrFail(),
            Branch::where('name', 'Pusat')->firstOrFail(),
        ];
    }

    private function sport(): Sport
    {
        return Sport::create([
            'name' => 'Badminton',
            'icon' => 'sports_tennis',
            'max_players_per_team' => 2,
            'description' => 'Court sessions.',
        ]);
    }

    private function league(Sport $sport, array $attributes = []): League
    {
        return League::create($attributes + [
            'name' => 'Test League',
            'sport_id' => $sport->id,
            'description' => 'Test',
            'start_date' => now()->toDateString(),
            'status' => 'active',
            'stage' => 'setup',
            'start_stage' => 'group',
            'sets_to_win' => 2,
            'points_per_set' => 21,
            'advance_upper_count' => 1,
            'advance_lower_count' => 1,
            'created_by' => User::factory()->create()->id,
        ]);
    }
}
