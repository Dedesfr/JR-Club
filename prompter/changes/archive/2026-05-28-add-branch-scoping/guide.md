# Branch Scoping Setup & Test Guide

This guide explains how to set up and manually verify the `add-branch-scoping` change.

## 1. Prepare the App

1. Install dependencies if needed:

   ```bash
   composer install
   npm install
   ```

2. Run migrations:

   ```bash
   php artisan migrate
   ```

   Expected result:
   - `branch` table exists.
   - Branch rows exist for `Pusat`, `DKI`, `Jateng`, and `Lampung`.
   - `Pusat` has `is_global = true`.
   - `users.branch_id` is required.
   - `leagues.branch_id`, `activities.branch_id`, and `teams.branch_id` are nullable.

3. Build frontend assets:

   ```bash
   npm run build
   ```

4. Start the app:

   ```bash
   php artisan serve
   ```

   Open the printed local URL, usually `http://127.0.0.1:8000`.

## 2. Confirm Branch Data

Run this in Tinker:

```bash
php artisan tinker
```

Then:

```php
App\Models\Branch::orderBy('id')->get(['id', 'name', 'is_global']);
```

Expected:
`Pusat` is global, while `DKI`, `Jateng`, and `Lampung` are not.

## 3. Create Test Users

You can seed branch admins directly:

```bash
php artisan db:seed --class=BranchAdminSeeder
```

Created accounts:

| Branch | Email | Password |
| --- | --- | --- |
| DKI | `admin.dki@jasaraharja.co.id` | `password` |
| Jateng | `admin.jateng@jasaraharja.co.id` | `password` |
| Lampung | `admin.lampung@jasaraharja.co.id` | `password` |

In Tinker, create one admin and one member per branch:

```php
$pusat = App\Models\Branch::where('name', 'Pusat')->first();
$dki = App\Models\Branch::where('name', 'DKI')->first();
$jateng = App\Models\Branch::where('name', 'Jateng')->first();

App\Models\User::factory()->create([
    'name' => 'Pusat Admin',
    'email' => 'pusat.admin@example.test',
    'role' => 'admin',
    'branch_id' => $pusat->id,
]);

App\Models\User::factory()->create([
    'name' => 'DKI Admin',
    'email' => 'dki.admin@example.test',
    'role' => 'admin',
    'branch_id' => $dki->id,
]);

App\Models\User::factory()->create([
    'name' => 'DKI Member',
    'email' => 'dki.member@example.test',
    'role' => 'member',
    'branch_id' => $dki->id,
]);

App\Models\User::factory()->create([
    'name' => 'Jateng Member',
    'email' => 'jateng.member@example.test',
    'role' => 'member',
    'branch_id' => $jateng->id,
]);
```

All factory-created passwords are `password`.

## 4. Create Test Content

Use a Pusat admin from `/admin` to create:

1. One national tournament: Branch = `National`.
2. One DKI tournament: Branch = `DKI`.
3. One Jateng tournament: Branch = `Jateng`.

Repeat the same style for activities and teams if you want to verify every content type.

Expected UI behavior for Pusat admin:
- Create pages show a Branch select.
- Index pages show all branches and national content.
- Branch badges appear in admin lists.
- Sidebar shows current admin branch.

## 5. Test Branch Admin Scoping

Log in as `dki.admin@example.test` / `password`.

Check `/admin/leagues`:
- DKI-owned tournaments are visible.
- Jateng-owned tournaments are hidden.
- National tournaments are hidden from branch-admin management.

Try opening a known Jateng admin tournament URL directly:

```text
/admin/leagues/{jatengLeagueId}
```

Expected:
- Request is denied with `403`.

Create a new tournament as DKI admin.

Expected:
- No Branch select is shown.
- The new tournament is automatically assigned to DKI.

## 6. Test Member Visibility

Log in as `dki.member@example.test` / `password`.

Check `/leagues`:
- National tournaments are visible.
- DKI tournaments are visible.
- Jateng tournaments are hidden.

Try opening a known Jateng member tournament URL directly:

```text
/leagues/{jatengLeagueId}
```

Expected:
- Request returns `404`.

If that Jateng tournament has a match, try:

```text
/matches/{jatengMatchId}
```

Expected:
- Request returns `404`.

## 7. Test Pusat Member Is Not All-Access

Create or use a Pusat member, not admin.

Check `/leagues`.

Expected:
- National tournaments are visible.
- Pusat-owned tournaments are visible if any exist.
- DKI and Jateng tournaments are hidden.

This confirms only Pusat admins get all-branch access.

## 8. Run Automated Checks

Run the focused branch scoping test:

```bash
php artisan test tests/Feature/BranchScopingTest.php
```

Expected:
- All tests pass.

Run frontend build:

```bash
npm run build
```

Expected:
- TypeScript and Vite build complete successfully.

Validate the proposal:

```bash
prompter validate add-branch-scoping --strict --no-interactive
```

Expected:
- Change is valid.

## 9. Known Full-Suite Notes

At the time this guide was written, the focused branch tests pass, but the full suite has unrelated failures in existing tests:

- `LeagueFormatServiceTest`: bracket round ordering expectation.
- `Admin/LeagueMatchTest`: locked match-set error expectation.
- `BasketballLeagueSeederTest`: seeded badminton team prerequisite.
- `ExampleTest`: root redirect expectation still points to `/activities` while the app redirects to `/leagues`.

Run the full suite when those existing issues are addressed:

```bash
php artisan test
```
