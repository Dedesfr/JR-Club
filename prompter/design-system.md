# Design System: Rahardja Kinetic

> **Generated:** 2026-04-20
> **Source:** `template/rahardja_kinetic/DESIGN.md` + all `template/*/code.html` templates
> **Theme:** "The Active Authority" — corporate authority + kinetic sports energy

---

## Color Tokens (Tailwind)

Paste into `tailwind.config.js` under `theme.extend.colors`:

```js
colors: {
  "primary":                    "#0056a4",  // authoritative anchor, high-priority actions
  "primary-container":          "#006ecf",  // active blue, interactive surfaces
  "primary-fixed":              "#d5e3ff",
  "primary-fixed-dim":          "#a7c8ff",
  "on-primary":                 "#ffffff",
  "on-primary-fixed":           "#001b3c",
  "on-primary-fixed-variant":   "#004788",
  "on-primary-container":       "#eef2ff",
  "inverse-primary":            "#a7c8ff",

  "secondary":                  "#376093",
  "secondary-container":        "#9fc6ff",
  "secondary-fixed":            "#d4e3ff",
  "secondary-fixed-dim":        "#a4c9ff",
  "on-secondary":               "#ffffff",
  "on-secondary-container":     "#275284",
  "on-secondary-fixed":         "#001c39",
  "on-secondary-fixed-variant": "#1b487a",

  "tertiary":                   "#8f3d00",  // winner's bronze — use sparingly on scoreboards
  "tertiary-container":         "#b55002",
  "tertiary-fixed":             "#ffdbca",
  "tertiary-fixed-dim":         "#ffb68f",
  "on-tertiary":                "#ffffff",
  "on-tertiary-container":      "#ffeee8",
  "on-tertiary-fixed":          "#331100",
  "on-tertiary-fixed-variant":  "#773200",

  "surface":                    "#f7f9fb",  // global background
  "surface-dim":                "#d8dadc",
  "surface-bright":             "#f7f9fb",
  "surface-variant":            "#e0e3e5",
  "surface-container-lowest":   "#ffffff",  // card background
  "surface-container-low":      "#f2f4f6",  // inset content / location blocks
  "surface-container":          "#eceef0",
  "surface-container-high":     "#e6e8ea",  // data tables, inset wells
  "surface-container-highest":  "#e0e3e5",
  "surface-tint":               "#005eb2",
  "inverse-surface":            "#2d3133",  // dark scoreboard backgrounds

  "on-surface":                 "#191c1e",  // near-black — NEVER use #000000
  "on-surface-variant":         "#414752",
  "inverse-on-surface":         "#eff1f3",
  "on-background":              "#191c1e",
  "background":                 "#f7f9fb",

  "outline":                    "#717784",
  "outline-variant":            "#c1c6d5",  // ghost borders at 20% opacity

  "error":                      "#ba1a1a",
  "error-container":            "#ffdad6",
  "on-error":                   "#ffffff",
  "on-error-container":         "#93000a",
}
```

---

## Border Radius

```js
borderRadius: {
  "DEFAULT": "0.25rem",   // forms, inputs — trusted/standardized feel
  "lg":      "0.5rem",    // standings tables (inset look)
  "xl":      "0.75rem",   // activity cards, content cards
  "full":    "9999px",    // bottom nav, pill buttons, filter chips
}
```

---

## Typography

- **Font**: Inter (all weights 400–900) — `font-family: 'Inter', sans-serif`
- **Icons**: Material Symbols Outlined (`wght,FILL` variable font)

| Role | Size | Weight | Class pattern | Notes |
|------|------|--------|---------------|-------|
| Display | varies | 800–900 | `font-black tracking-tight` | Scoreboards only. `tracking-[-0.02em]` |
| Headline | `1.5rem` | 700 | `text-[1.5rem] font-bold tracking-tight` | Section titles |
| Sub-header | `1rem` | 400 | `text-[1rem] text-on-surface-variant` | Paired with headline |
| Body | `0.875rem` | 400–500 | `text-[0.875rem]` | Workhorse |
| Label | `0.6875rem` | 700 | `text-[0.6875rem] uppercase tracking-[0.05em] font-bold` | ALL CAPS metadata ("MATCH TIME") |
| Caption | `0.75rem` | 400 | `text-[0.75rem] text-on-surface-variant` | Secondary info |

---

## Gradients

```css
/* Primary CTA gradient — buttons, sticky headers */
background: linear-gradient(135deg, #0056a4, #006ecf);
/* Tailwind: bg-gradient-to-br from-primary to-primary-container */

/* Glassmorphism — sticky header + floating bottom nav */
background: rgba(255, 255, 255, 0.85);
backdrop-filter: blur(12px);
/* Tailwind: bg-white/85 backdrop-blur-md */
```

---

## Shadows

```css
/* Card ambient */
box-shadow: 0px 12px 32px rgba(15, 23, 42, 0.04);

/* Sticky header */
box-shadow: 0px 12px 32px rgba(15, 23, 42, 0.06);

/* Floating bottom nav */
box-shadow: 0px 12px 32px rgba(15, 23, 42, 0.12);

/* CTA button */
box-shadow: 0px 8px 16px rgba(0, 86, 164, 0.15);

/* CTA button hover */
box-shadow: 0px 12px 24px rgba(0, 86, 164, 0.25);
```

**No 1px dividers.** Use background token shifts (`surface-container-lowest` on `surface`) for section separation.

---

## Key Components

### Sticky Header
```tsx
<header className="bg-white/85 backdrop-blur-md sticky top-0 z-50 shadow-[0px_12px_32px_rgba(15,23,42,0.06)]">
  <div className="flex justify-between items-center px-6 py-4">
    {/* avatar left, logo center or left, action icon right */}
  </div>
</header>
```

### Floating Bottom Tab Bar
```tsx
<nav className="bg-white/85 backdrop-blur-md fixed bottom-4 left-4 right-4 rounded-full z-50 shadow-[0px_12px_32px_rgba(15,23,42,0.12)]">
  <div className="flex justify-around items-center p-2">
    {/* Active tab */}
    <a className="flex flex-col items-center bg-primary text-on-primary rounded-full px-4 py-2 scale-110">
      <span className="material-symbols-outlined text-xl mb-1" />
      <span className="text-[10px] font-bold uppercase tracking-widest">Label</span>
    </a>
    {/* Inactive tab */}
    <a className="flex flex-col items-center text-slate-500 px-4 py-2 transition-all">...</a>
  </div>
</nav>
```
Tabs: **Activities** · **Leagues** · **Rankings** · **Profile**

### Activity Card
```tsx
<div className="bg-surface-container-lowest rounded-xl p-5 shadow-[0px_12px_32px_rgba(15,23,42,0.04)] active:scale-[0.98] transition-transform">
  {/* sport icon (w-12 h-12 rounded-full + fixed-color bg) + label (ALL CAPS) + title */}
  {/* location block: bg-surface-container-low rounded-md p-3 */}
  {/* participant avatars (-space-x-2) + Join button (pill gradient) */}
</div>
```

### CTA Button (Primary)
```tsx
<button className="rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold px-6 py-2
                   shadow-[0px_8px_16px_rgba(0,86,164,0.15)] hover:shadow-[0px_12px_24px_rgba(0,86,164,0.25)]
                   hover:scale-[0.98] transition-all">
```

### Form Input (Bottom-border editorial style)
```tsx
<input className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant/20 rounded-t-md px-4 py-3
                  focus:border-primary focus:outline-none focus:ring-0 transition-colors" />
```

### Sport Filter Chips
```tsx
{/* Active */}
<button className="whitespace-nowrap px-5 py-2 rounded-full bg-primary text-on-primary text-[0.875rem] font-semibold">All Sports</button>
{/* Inactive */}
<button className="whitespace-nowrap px-5 py-2 rounded-full bg-surface-container-lowest text-on-surface-variant border border-outline-variant/20 shadow-[0px_4px_12px_rgba(15,23,42,0.03)] text-[0.875rem] font-semibold hover:bg-surface-container-high">Padel</button>
```

### Scoreboard (High-contrast dark block)
```tsx
<div className="bg-inverse-surface text-inverse-on-surface rounded-xl p-6">
  {/* large score display with tight tracking */}
</div>
```

### Standings Table
```tsx
<div className="bg-surface-container-high rounded-lg overflow-hidden">
  {/* alternating rows: bg-surface-container-lowest / bg-surface-container-low */}
  {/* user's own team row: bg-primary text-on-primary */}
</div>
```

---

## Rules

| Do | Don't |
|----|-------|
| `text-[#191c1e]` / `text-on-surface` for body text | Use `#000000` pure black |
| Background shifts to separate sections | 1px `border` dividers between list items |
| `active:scale-[0.98]` on tappable cards/buttons | Skip tap feedback |
| `text-[0.6875rem] uppercase tracking-[0.05em]` for metadata labels | Plain lowercase labels for metadata |
| Monochromatic icons; color only for status (success/error) | Decorative colored icons |
| Only BUMN Blue tokens (`primary`, `primary-container`) | Standard Tailwind `blue-*` colors |

---

## Template Map

| Screen | HTML Source | Preview |
|--------|-------------|---------|
| Login | `template/authentication_login/code.html` | `template/authentication_login/screen.png` |
| Activity Feed | `template/sport_activities_feed/code.html` | `template/sport_activities_feed/screen.png` |
| Leagues & Competitions | `template/leagues_competitions/code.html` | `template/leagues_competitions/screen.png` |
| Live Match Detail | `template/live_match_detail/code.html` | `template/live_match_detail/screen.png` |
| Team Management | `template/team_management/code.html` | `template/team_management/screen.png` |
| Leaderboards | `template/leaderboards/code.html` | `template/leaderboards/screen.png` |
| User Profile | `template/user_profile/code.html` | `template/user_profile/screen.png` |
