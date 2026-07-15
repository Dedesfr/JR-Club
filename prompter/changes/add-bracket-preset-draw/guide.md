# Manual Testing Guide: Predetermined Bracket Draw (Preset Reveal)

This guide covers the bracket-preset feature added in `add-bracket-preset-draw`:
a per-league preset that forces a chosen first-round layout to appear on the **Nth**
"Seed Brackets" click, with a persistent seed-attempt counter.

---

## Setup (from a clean state)

1. Ensure the schema is current (adds the four `leagues` columns):
   ```bash
   php artisan migrate
   ```
2. Start the backend and the Vite dev server:
   ```bash
   php artisan serve
   npm run dev
   ```
3. Sign in as an **admin** (branch admin or Pusat admin). Any admin seeded by
   `DatabaseSeeder` works; otherwise create one via `BranchAdminSeeder` or `php artisan tinker`.
4. Create a **bracket-start** league and register entries:
   - Admin → Leagues → **New league**
   - Set **Start from = Bracket**, a Badminton category (e.g. `MS`), and `participant_total = 4`.
   - Open the league, go to the **Participants** tab, and add **4 players** as entries.

> The **Setup** tab (which holds the Bracket Setting panel) appears for any tournament league
> — both **Start from = Bracket** and **Start from = Group Stage**, since group play also
> progresses to a bracket. It is hidden only for league categories that do not use brackets.

---

## Scenario 1 — Save a bracket preset (happy path)

**Preconditions:** Bracket-start league with 4 entries (from Setup).

**Steps:**
1. Open the league → **Setup** tab.
2. Locate the **Bracket Setting** panel.
3. Tick **Enable bracket preset**.
4. Set **Reveal on attempt (N)** to `5`.
5. In the slot dropdowns (there are 4 slots = next power of two of 4 entries), assign an
   arrangement of entries and/or **BYE** — e.g. Slot 1 = Player 4, Slot 2 = Player 3,
   Slot 3 = Player 2, Slot 4 = Player 1.
6. Click **Save Preset**.

**Expected result:**
- A success flash ("Bracket preset saved.").
- Reloading the page keeps the checkbox enabled, N = 5, and the slot selections intact.
- The panel shows **Seed attempts: 0**.

---

## Scenario 2 — Reveal the preset on the Nth seed

**Preconditions:** Scenario 1 completed with **N = 2** (change N to `2` and Save Preset if you used 5).
Use a distinctive layout such as Slot1=Player4, Slot2=Player3, Slot3=Player2, Slot4=Player1.

**Steps:**
1. Go to the **Bracket** tab. In the **Seed Brackets** form set Upper advances = `4`,
   interval = `15`, then click **Seed Brackets**. (Confirm the "replace existing" dialog if it appears.)
2. Open the **Setup** tab and observe the **Seed attempts** badge in the Bracket Setting panel → it reads **1**.
3. Back on the **Bracket** tab, note the first-round matchups in the Upper Bracket tree (normal seeding order).
4. Click **Seed Brackets** a second time (this is the Nth = 2nd attempt).

**Expected result:**
- After the 2nd seed, the first-round matches match the **preset layout exactly**:
  Match 1 → Player 4 vs Player 3, Match 2 → Player 2 vs Player 1.
- The **Seed attempts** badge resets to **0**.
- Any BYE slots leave the opposing entry to auto-advance (no partner shown).

---

## Scenario 3 — Non-Nth seeds are unaffected

**Preconditions:** Preset enabled with **N = 5** (Setup tab), counter at 0.

**Steps:**
1. On the **Bracket** tab, click **Seed Brackets** once.
2. Check the **Seed attempts** badge (Setup tab) and the first-round matchups (Bracket tab).

**Expected result:**
- The badge reads **1** (incremented, not reset).
- The bracket uses **normal seeding order** (entries in registration order, not the preset layout).

---

## Scenario 4 — Manually reset the counter

**Preconditions:** Preset enabled and the **Seed attempts** badge shows a value greater than 0
(e.g. run one seed first).

**Steps:**
1. On the **Setup** tab, in the Bracket Setting panel, click **Reset Counter**.

**Expected result:**
- Success flash and the **Seed attempts** badge returns to **0**.
- Preset enabled state, N, and slot assignments are unchanged.

---

## Scenario 5 — Preset works for group-start leagues

**Preconditions:** A tournament league with **Start from = Group Stage** and entries registered.

**Steps:**
1. Open the league → **Setup** tab (it is visible for group-start leagues too).
2. Enable the preset, set a reveal number, assign slots, and click **Save Preset**.
3. Configure and run the group stage, then seed the bracket from the **Bracket** tab until
   the Nth attempt.

**Expected result:**
- The Setup tab is available and the preset persists.
- On the Nth "Seed Brackets" attempt, the **upper bracket** first round matches the preset
  layout exactly and the counter resets to `0`. (The preset applies to the upper bracket;
  any lower bracket seeds from group standings as usual.)

---

## Scenario 6 — Reject duplicate slot assignments (error state)

**Preconditions:** Bracket-start league with entries; Bracket Setting panel open (**Setup** tab).

**Steps:**
1. Try to assign the **same entry** to two different slots.
   - In the UI: selecting an entry that is already used in another slot automatically clears
     the earlier slot (duplicate guard), so you cannot create a duplicate through the form.
   - To verify the server-side guard, submit a payload with a repeated entry id directly to
     `PATCH /admin/leagues/{league}/bracket/preset` (as in Scenario 5).

**Expected result:**
- UI: the previously-assigned slot is cleared, keeping every entry in at most one slot.
- Server: the request is rejected with a validation error on `bracket_preset_slots`
  ("Each entry can be assigned to only one slot.").

---

## Regression check — Preset disabled behaves as before

**Steps:**
1. On a bracket-start league with the preset **disabled** (or never configured), click **Seed Brackets**.

**Expected result:**
- Seeding produces the usual bracket with no counter side effects and no forced layout —
  identical to pre-feature behavior.
