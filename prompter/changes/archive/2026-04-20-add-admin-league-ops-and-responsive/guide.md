# Testing Guide: Admin League Ops & Responsive UI

This guide provides step-by-step instructions to manually verify all the features introduced in the `add-admin-league-ops-and-responsive` update.

## Prerequisites

Start by ensuring your local environment has the latest database schema, compiled assets, and seeded data.

```bash
# Refresh database and seed dummy data
php artisan migrate:fresh --seed

# Link storage (required for photo uploads)
php artisan storage:link

# Start the frontend build tool
npm run dev

# In a separate terminal, start the backend
php artisan serve
```

**Credentials:**
- Admin User: `admin@jasaraharja.co.id` / `password`
- Standard User: `member@jasaraharja.co.id` / `password`

---

## 1. Testing Admin League Operations

Log in with the **Admin User** account and navigate to the Admin Area -> Leagues. Select a Badminton League that is in the "upcoming" status (or create a new one).

### 1.1 Participant Import & Export
1. Go to the **Participants** tab of the league.
2. Click the **"Import / Export"** button.
3. Click **"Download Template"** to get the XLSX format.
4. Open the template and fill it with dummy data (ensure emails match existing seeded users, or use fake emails to test validation errors).
5. Upload the file. 
6. *Expected Result:* Valid rows will be added to the participants list. Invalid rows will show specific inline error messages in the modal without stopping the valid ones.
7. Click **"Export Current Participants"** and verify the downloaded file contains the current entries.

### 1.2 Group Match Scheduling
1. With enough participants added, go to the **Groups** tab.
2. Under "Generate Groups", fill out the inputs for Group Count and Group Size.
3. Notice the **Date/Time pickers** for each round. Select different dates for Round 1, Round 2, etc.
4. Click **Generate Groups & Matches**.
5. Go to the **Matches** tab and verify the group matches were scheduled according to the dates you picked for each round.

### 1.3 Bracket Shuffling & 3rd Place Match
1. Assuming group stages are complete (or by manually overriding group standings), go to the **Bracket** tab.
2. Seed the bracket (e.g., set Upper advances to 4 or 8).
3. Look at the upper bracket. You should now see a **3rd Place** match box rendered next to the finals.
4. **Test Shuffling:** Click on an unscored match node. It will highlight. Click a second unscored match node. A prompt will appear asking to swap them. Confirm it.
5. *Expected Result:* The two participants/teams swap positions in the bracket.
6. Try clicking a match that already has a score. It should *not* allow you to select it for shuffling.

### 1.4 Match Substitutions
1. Go to the **Matches** tab.
2. Find a match and click the **"Substitute"** button.
3. A modal will appear. Select the entry you want to substitute a player for.
4. Pick the original player and choose a valid substitute from their declared substitute list. Add a reason (e.g., "Injury") and save.
5. Click **"Open Match"** to view the public Match Details page.
6. *Expected Result:* Under the Players section, the substituted player should now be listed with a "(Sub)" label.

### 1.5 Match Photo Uploads
1. Go to the **Matches** tab.
2. Find a match and click the **"Photos"** button.
3. A drag-and-drop modal will appear. Upload 1-3 images (jpg, png, webp).
4. Click **"Open Match"** to view the public Match Details page.
5. *Expected Result:* Scroll down to see the "Match Photos" gallery grid displaying the uploaded images.

---

## 2. Testing Responsive UI

This update completely overhauls how the application adapts to tablet and desktop screens (`md:` and `lg:` breakpoints).

### 2.1 Public App Layout (`JRClubLayout`)
1. Log in as any user and go to the main App (`/activities`).
2. **Mobile View (< 768px):** Verify the bottom navigation bar is present and the top header shows the hamburger menu or back button. The layout should be a single column.
3. **Desktop View (> 768px):** Resize the window to be wider.
   - *Expected Result:* The bottom navigation bar disappears. A permanent left sidebar appears containing the navigation links and user profile info.
   - The main content area expands and uses a grid layout (2 columns on `md`, 3 columns on `lg`) for Activity Cards.
4. Check other public pages (`/leagues`, `/leaderboards`, `/profile/show`) to ensure they all successfully switch from single-column lists to multi-column grids on wider screens.

### 2.2 Admin Layout (`AdminLayout`)
1. Go to the Admin Dashboard (`/admin`).
2. **Mobile View (< 768px):** The sidebar should be hidden. Clicking the hamburger icon in the top header should slide out an overlay drawer containing the admin navigation.
3. **Desktop View (> 768px):** Resize the window to be wider.
   - *Expected Result:* The top header hamburger menu disappears, and the sidebar becomes permanently pinned to the left side of the screen.

### 2.3 Admin League Details View
1. Go to `/admin/leagues` and click into a specific league.
2. **Mobile View (< 1024px):** The tabs (Overview, Participants, Groups, Bracket, Matches) appear as a horizontal wrapping list of pill buttons above the content.
3. **Desktop View (> 1024px):**
   - *Expected Result:* The tabs move to become a vertical sidebar on the left of the content area.
   - Click the **Participants** tab. On mobile, this renders as stacked cards. On desktop, it should now render as a full HTML `<table>` for high data density.