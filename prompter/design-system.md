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

| Role       | Size        | Weight  | Class pattern                                            | Notes                                  |
| ---------- | ----------- | ------- | -------------------------------------------------------- | -------------------------------------- |
| Display    | varies      | 800–900 | `font-black tracking-tight`                              | Scoreboards only. `tracking-[-0.02em]` |
| Headline   | `1.5rem`    | 700     | `text-[1.5rem] font-bold tracking-tight`                 | Section titles                         |
| Sub-header | `1rem`      | 400     | `text-[1rem] text-on-surface-variant`                    | Paired with headline                   |
| Body       | `0.875rem`  | 400–500 | `text-[0.875rem]`                                        | Workhorse                              |
| Label      | `0.6875rem` | 700     | `text-[0.6875rem] uppercase tracking-[0.05em] font-bold` | ALL CAPS metadata ("MATCH TIME")       |
| Caption    | `0.75rem`   | 400     | `text-[0.75rem] text-on-surface-variant`                 | Secondary info                         |

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

## Rules

| Do                                                                 | Don't                                    |
| ------------------------------------------------------------------ | ---------------------------------------- |
| `text-[#191c1e]` / `text-on-surface` for body text                 | Use `#000000` pure black                 |
| Background shifts to separate sections                             | 1px `border` dividers between list items |
| `active:scale-[0.98]` on tappable cards/buttons                    | Skip tap feedback                        |
| `text-[0.6875rem] uppercase tracking-[0.05em]` for metadata labels | Plain lowercase labels for metadata      |
| Monochromatic icons; color only for status (success/error)         | Decorative colored icons                 |
| Only BUMN Blue tokens (`primary`, `primary-container`)             | Standard Tailwind `blue-*` colors        |

---

## Template Map

| Screen                 | HTML Source                                | Preview                                     |
| ---------------------- | ------------------------------------------ | ------------------------------------------- |
| Login                  | `template/authentication_login/code.html`  | `template/authentication_login/screen.png`  |
| Activity Feed          | `template/sport_activities_feed/code.html` | `template/sport_activities_feed/screen.png` |
| Leagues & Competitions | `template/leagues_competitions/code.html`  | `template/leagues_competitions/screen.png`  |
| Live Match Detail      | `template/live_match_detail/code.html`     | `template/live_match_detail/screen.png`     |
| Team Management        | `template/team_management/code.html`       | `template/team_management/screen.png`       |
| Leaderboards           | `template/leaderboards/code.html`          | `template/leaderboards/screen.png`          |
| User Profile           | `template/user_profile/code.html`          | `template/user_profile/screen.png`          |
