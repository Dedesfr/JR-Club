# Guide: Add Admin League Match Controls

## 1. Run the migration

```bash
php artisan migrate
```

Adds a `locked` boolean column (default `false`) to the `matches` table.

---

## 2. Match locking (admin)

Open any live or completed match from the admin league page. In the **Match Controls** panel you will now see:

- **Lock** button — enabled only when status is `live` or `completed`
- **Unlock** button — appears in place of Lock once the match is locked
- A red **Locked** badge next to the panel title when the match is locked

**What locking does:**
- Hides the "Record Set" inline form so no new sets can be added
- Disables edit and delete icons on all existing set cards
- Any backend attempt to add/edit/delete a set on a locked match returns a validation error

---

## 3. Record a set (admin, unlocked match)

On the match detail page (`/matches/{id}`), admins see an inline **Record Set** form at the bottom of the Match Controls panel. Enter home and away points and click **Save Set**. The match score and status update immediately.

---

## 4. Edit a set (admin, unlocked match)

Each recorded set card shows two icon buttons in its top-right corner:

- **Edit (pencil)** — replaces the card with an inline edit form. Enter new points and click **Save**. Match score/status recomputes automatically and a live-score broadcast fires.
- **Delete (trash)** — confirms deletion, removes the set, renumbers remaining sets (e.g. sets 1,2,3 with set 2 deleted become 1,2), and recomputes the match.

These buttons are hidden when the match is locked or for non-admin viewers.

---

## 5. Score Difference column in standings

On the league detail page (`/leagues/{id}`), the standings tables now show an **SD** column between Losses and Points:

- `+N` in blue — more points scored than conceded
- `-N` in red — more points conceded than scored
- `0` in grey — equal or no completed matches

This applies to both group-stage (entry-based) standings and team-based standings.

---

## 6. Member dashboard

Authenticated members can now visit `/dashboard` and see a personalised summary:

| Section | Content |
|---|---|
| **Upcoming Matches** | Next 5 scheduled matches the user is entered in |
| **Recent Results** | Last 5 completed matches the user was in |
| **My Teams** | Teams the user belongs to, with sport label |
| **Ongoing Competitions** | Active leagues the user has an entry in |

Each section shows a clear empty-state message if no data exists. All rows link to the relevant detail page.

---

## 7. Uniform league and activity listings

The league index (`/leagues`) and activity index (`/activities`) no longer promote the first item as a large featured banner. Every card is now rendered using the same compact card component.

---

## 8. Smoke-test checklist

- [ ] As admin: open a `live` match → Lock it → confirm "Locked" badge appears and Record Set form is gone
- [ ] As admin: unlock the match → confirm Record Set form returns
- [ ] As admin: add a set → edit it → verify match score updates
- [ ] As admin: delete a set from the middle → verify remaining sets are renumbered
- [ ] Try locking a `scheduled` match → expect an error, lock state unchanged
- [ ] Open a league with completed group matches → verify SD column shows signed values
- [ ] Log in as a member → visit `/dashboard` → verify all four sections render
- [ ] Visit `/leagues` → confirm no large featured banner, all cards look the same
- [ ] Visit `/activities` → confirm no large featured banner, all cards look the same
