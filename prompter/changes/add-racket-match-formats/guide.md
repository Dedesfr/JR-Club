# Testing Guide: Add Racket Match Formats

Use this guide to manually verify the `add-racket-match-formats` change in a local environment.

## 1. Prepare The App

1. Pull the latest code for this change.
2. Install dependencies if needed: `composer install` and `npm install`.
3. Run migrations: `php artisan migrate`.
4. Start the backend: `php artisan serve`.
5. Start the frontend dev server: `npm run dev`.
6. Log in as an admin using `admin@jasaraharja.co.id` / `password`.

Expected result: the app loads and the admin area is accessible.

## 2. Verify League Create Format Dropdown

1. Open `/admin/leagues/create`.
2. Find the `Match Rules & Advancement` section.
3. Open the `Match format` dropdown.
4. Confirm these options are available:
   - `Custom / Badminton default`
   - `Padel Semi Klasik`
   - `Padel Best of Three`
   - `Padel Best of Five`
   - `Padel Americano`
   - `Tenis Meja Best of Five`
   - `Tenis Meja Best of Seven`
5. Select `Tenis Meja Best of Five`.
6. Confirm `Sets to win` changes to `3` and `Points per set` changes to `11`.
7. Select `Padel Americano`.
8. Confirm `Sets to win` changes to `1` and `Points per set` changes to `21`.

Expected result: choosing a configured format prefills the set and point fields, while both fields remain editable.

## 3. Create Test Leagues

Create separate leagues for these formats so each scoring mode can be tested independently.

1. Create a Tenis Meja league with `Tenis Meja Best of Five`.
2. Create a Padel league with `Padel Best of Three`.
3. Create a Padel league with `Padel Americano`.
4. Create a regression league with `Custom / Badminton default`, `Sets to win = 2`, and `Points per set = 21`.
5. For each league, add enough participants/entries and generate matches using the normal admin flow.

Expected result: all leagues save successfully and each created league keeps its selected match format.

## 4. Verify League Edit Format Dropdown

1. Open a created league detail page in the admin area.
2. Go to the `Overview` tab.
3. Find `Match Rules & Advancement`.
4. Confirm the `Match format` dropdown shows the saved format.
5. Change the format to another configured value.
6. Confirm `Sets to win` and `Points per set` prefill from the new format.
7. Save changes.
8. Refresh the page.

Expected result: the updated format, sets, and points persist after save and refresh.

## 5. Verify Tenis Meja Deuce Validation

Use a match from the `Tenis Meja Best of Five` league.

1. Open the match from the admin match list or public match page while logged in as admin.
2. Record set score `11-9`.

Expected result: the set is accepted.

3. Record set score `11-10`.

Expected result: the set is rejected with a validation error because Tenis Meja deuce scoring requires win by 2.

4. Record set score `12-10`.

Expected result: the set is accepted.

## 6. Verify Padel All-Sets Completion

Use a match from the `Padel Best of Three` league.

1. Record set score `21-10`.
2. Confirm the match remains live.
3. Record set score `21-11`.
4. Confirm the match still remains live, even though one side has already won 2 sets.
5. Record set score `12-21`.

Expected result: the match completes only after all 3 sets are recorded. The final set score should be `2-1` and the winner should be the side with more sets won.

## 7. Verify Americano Single-Block Completion

Use a match from the `Padel Americano` league.

1. Record one block score, for example `21-18`.

Expected result: the match immediately completes after one recorded block. The final set score should be `1-0`.

2. Try adding another set/block after the match is completed.

Expected result: another set cannot be added because the match is already completed.

## 8. Verify Badminton/Custom Regression

Use a match from the `Custom / Badminton default` league with `Sets to win = 2` and `Points per set = 21`.

1. Record set score `21-10`.
2. Confirm the match is live.
3. Record set score `21-11`.

Expected result: the match completes as soon as one side reaches 2 sets won. This confirms null `match_format` still uses the old first-to-sets-to-win behavior.

## 9. Verify Match Page Display

Open a public/member match page for each configured format.

1. Confirm the match header shows the correct set slot count.
2. Confirm the format info card shows the configured format label.
3. For Tenis Meja, confirm the score hint says `First to 11, win by 2`.
4. For non-deuce Padel formats, confirm the score hint says `First to 21`.

Expected result: the match page displays format-aware labels and scoring hints.

## 10. Optional Automated Checks

Run these commands after manual testing:

```bash
php artisan test tests/Feature/AdminLeagueOpsTest.php
npm run build
prompter validate add-racket-match-formats --strict --no-interactive
```

Expected result: all commands complete successfully.

## Pass Criteria

The change is ready when all of these are true:

1. Admins can select and edit `match_format` on leagues.
2. Format selection prefills `sets_to_win` and `points_per_set` but does not lock them.
3. Tenis Meja rejects `11-10` and accepts `11-9` and `12-10`.
4. Padel `all_sets` finishes only after all configured sets are recorded.
5. Padel Americano finishes after one block.
6. Leagues with null `match_format` keep the previous first-to-sets-to-win behavior.
7. Match pages show the format label and deuce-aware scoring hint.
