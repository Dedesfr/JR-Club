```markdown
# Design System Document: The Active Authority

## 1. Overview & Creative North Star
This design system is built upon the North Star of **"The Active Authority."** For a BUMN entity like PT Jasa Raharja, the digital experience must command the same respect as a physical institution while vibrating with the kinetic energy of a sports community. 

We are moving away from the "standard app" aesthetic. Instead, we are adopting a **High-End Editorial** approach. This means rejecting the "box-within-box" layout in favor of intentional asymmetry, sophisticated tonal layering, and high-contrast typography. We don't just display data; we curate an athletic narrative. The goal is to make every PT Jasa Raharja employee feel like a professional athlete entering a premium, private club.

---

## 2. Colors & Tonal Architecture
The palette is rooted in the BUMN Blue legacy but elevated through a sophisticated scale of depth.

### Core Palette
*   **Primary (`#0056a4`):** The authoritative anchor. Used for high-priority actions.
*   **Primary Container (`#006ecf`):** Our "Active Blue." Used for interactive surfaces and subtle gradients.
*   **Tertiary (`#8f3d00` / `#b55002`):** Used sparingly as a "winner's gold/bronze" for high-contrast scoreboard moments.
*   **Surface Hierarchy:**
    *   `surface-container-lowest`: `#ffffff` (The base for cards)
    *   `surface`: `#f7f9fb` (The global background)
    *   `surface-container-high`: `#e6e8ea` (Used for "inset" content like data tables)

### The "No-Line" Rule
To achieve a premium, editorial feel, **1px solid borders are prohibited for sectioning.** 
*   **Constraint:** Do not use lines to separate content.
*   **Solution:** Boundaries must be defined by shifts in background tokens. A `surface-container-lowest` card sitting on a `surface` background provides all the definition required.

### Glass & Gradient Rule
For the "Active" personality, use subtle linear gradients:
*   **CTA Gradient:** `primary` (#0056a4) to `primary_container` (#006ecf) at a 135-degree angle.
*   **Glassmorphism:** For floating headers and bottom navigation, use `surface` at 85% opacity with a 12px backdrop-blur. This creates a "frosted lens" effect that feels modern and lightweight.

---

## 3. Typography: The Editorial Voice
We utilize the **Inter** family to bridge the gap between corporate legibility and modern sport aesthetics.

*   **Display (Large/Medium):** Reserved for scoreboards and "Big Win" moments. Tighten letter-spacing to `-0.02em` for a more aggressive, athletic stance.
*   **Headlines:** Used for section titles (e.g., "Upcoming Matches"). Use `headline-sm` (1.5rem) with a `title-sm` (1rem) sub-header in `muted-slate` for a hierarchy that feels like a magazine header.
*   **Body:** Keep `body-md` (0.875rem) as the workhorse. It ensures legibility on mobile screens without crowding the layout.
*   **Labels:** Use `label-sm` (0.6875rem) in ALL CAPS with `+0.05em` letter-spacing for metadata (e.g., "MATCH TIME" or "TEAM STATS").

---

## 4. Elevation & Depth
We eschew traditional drop shadows for **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by stacking. A `surface-container-lowest` card is placed on a `surface-container-low` background. This creates a "soft lift" that feels architectural rather than digital.
*   **Ambient Shadows:** For floating elements (Action Buttons or Score Pop-ups), use an extra-diffused shadow: `0px 12px 32px rgba(15, 23, 42, 0.06)`. The shadow color must be a tint of the `on-surface` color, never pure black.
*   **The Ghost Border:** If a border is required for accessibility on inputs, use `outline-variant` at **20% opacity**. It should be felt, not seen.

---

## 5. Signature Components

### Sticky Headers & Navigation
*   **The Frosted Header:** Use the Glassmorphism rule. The brand logo should sit on the left, with the user's profile avatar on the right, breaking the container slightly to create a layered effect.
*   **Floating Bottom Tab Bar:** This should not be pinned to the bottom of the screen. Instead, float it 16px from the bottom with a `rounded-full` (9999px) radius and a `primary` tint shadow to make it feel like a high-tech athletic wearable.

### Activity Cards & Team Stats
*   **Cards:** Use `rounded-xl` (16px). Forbid internal dividers. 
*   **Team Stats Blocks:** Use asymmetrical layouts. Place the team logo large and cropped (30% opacity) in the background, with high-contrast `display-sm` stats layered on top.
*   **High-Contrast Scoreboards:** Use `inverse-surface` backgrounds with `primary-fixed` text. This "Dark Mode" moment within a light UI signals importance and urgency.

### Data Tables (Standings)
*   **The Inset Look:** Tables should sit in a `surface-container-high` well with `rounded-md` (6px) corners. 
*   **Row Styling:** Instead of lines, use alternating backgrounds (`surface-container-lowest` vs `surface-container-low`) or a high-contrast `primary` highlight for the "user's team" row.

### Forms & Inputs
*   **Forms:** Use `rounded-md` (6px) for a more "standardized/trusted" feel, contrasting against the more playful `rounded-xl` cards.
*   **Input States:** On focus, transition the "Ghost Border" from 20% opacity to a solid `primary` 2px stroke, but only on the bottom edge to maintain an editorial look.

---

## 6. Do’s and Don’ts

### Do
*   **Do** use whitespace as a separator. If in doubt, increase the padding.
*   **Do** use "Scale Transitions." When a user taps a card, it should subtly scale down (98%) to feel tactile.
*   **Do** use monochromatic icons. Only use color for status (Success/Error).

### Don’t
*   **Don't** use pure black (#000000) for text. Use `Near Black (#0F172A)` to keep the UI looking premium.
*   **Don't** use standard "Material" blue. Only use the defined BUMN Blue tokens to maintain brand integrity.
*   **Don't** use 1px dividers to separate list items. Use a 12px vertical gap instead.

---
**Director's Closing Note:** 
Remember, this is for PT Jasa Raharja. Every pixel must feel deliberate. If a component looks like it could belong to any other app, it’s not finished. Refine the tonal layers until the UI feels like a custom-tailored suit—perfectly fitted, professional, and ready for action.```