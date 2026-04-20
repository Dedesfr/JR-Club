# Design System Document: The Active Authority

## 1. Overview & Creative North Star: Kinetic Precision
This design system is engineered to embody **"The Active Authority."** It rejects the static, boxy nature of traditional PWAs in favor of an editorial, high-motion experience. We move beyond "standard" UI by treating the interface as a living, breathing publication for the elite athlete and club member.

**Creative North Star: "Kinetic Precision"**
The aesthetic is defined by the tension between high-energy movement and rigid professional control. We achieve this through:
*   **Intentional Asymmetry:** Breaking the grid with oversized typography and overlapping "floating" containers.
*   **Tonal Depth:** Replacing harsh lines with a sophisticated hierarchy of grayscale surfaces.
*   **Editorial Authority:** High-contrast weights and tight tracking that command attention.

---

## 2. Colors & Surface Philosophy
The palette is rooted in a "Global Surface" of soft, atmospheric gray, punctuated by a deep, authoritative blue.

### The Color Tokens (Material Design Convention)
*   **Primary (Accent):** `#003f7b` (Deep Blue)
*   **Primary Container (Active):** `#0056a4`
*   **Surface:** `#f7f9fb` (Global Background)
*   **Surface Container Lowest:** `#ffffff` (Floating Cards/Active State)
*   **Surface Container Low:** `#f2f4f6` (Sectional Shifts)
*   **Surface Container High:** `#e6e8ea` (Inactive/Inset Depth)
*   **Text Primary:** `#191c1e` (Near Black)
*   **Outline Variant:** `#c2c6d3` at 20% opacity (Ghost Borders only)

### The "No-Line" Rule
Explicitly prohibited: 1px solid borders for sectioning or list separation. Boundaries must be defined solely through **Background Shifts**. 
*   *Example:* A `Surface Container Lowest` card sits atop a `Surface Container Low` section, which itself sits on the `Global Surface`. This creates a natural "staircase" of importance without visual clutter.

### Signature Textures & Gradients
To provide "soul" to the interface, main CTA buttons and Hero sections must not use flat colors. Use a linear gradient:
*   **Direction:** 135deg
*   **From:** `primary` (#003f7b)
*   **To:** `primary_container` (#0056a4)

---

## 3. Typography: The Editorial Edge
We use **Inter** not as a utility font, but as a brand signature. The typography is the primary driver of the "Authority" theme.

*   **Display & Headlines:** Must use **Bold** (700) or **Black** (900) weights with tight tracking (`letter-spacing: -0.04em`). This creates a dense, powerful visual block.
*   **Metadata Labels:** `label-sm` (0.6875rem), **Bold**, and **All-Caps**. These function as navigational anchors and should have slightly increased letter-spacing (`0.05em`) to maintain legibility.
*   **Scoreboards & Data:** Use `font-black` (900) with the tightest possible tracking. These are the "Hero" numbers of the PWA and should be sized at `display-lg` to create a focal point.
*   **Body:** `body-md` (0.875rem) in `Text Secondary` (#414752) to provide a soft contrast against the aggressive headers.

---

## 4. Elevation & Depth: Tonal Layering
Traditional shadows are often "dirty." This system uses ambient light and glassmorphism to create a premium, airy feel.

### The Layering Principle
Hierarchy is achieved by "stacking" surfaces. 
1.  **Level 0 (Base):** `Global Surface` (#f7f9fb)
2.  **Level 1 (Sections):** `Surface Container Low` (#f2f4f6)
3.  **Level 2 (Interaction):** `Surface Container Lowest` (#ffffff)

### Glassmorphism & Floating Nav
Sticky headers and bottom navigation bars must use the **Glass Filter**:
*   **Background:** `rgba(255, 255, 255, 0.85)`
*   **Backdrop-blur:** `12px` (md)
*   **Effect:** This allows the "Kinetic" energy of the content to bleed through as the user scrolls, keeping the UI integrated with the motion.

### Ambient Shadows
When a card requires a floating effect (Level 3 depth):
*   **Shadow:** `0 12px 32px -4px rgba(25, 28, 30, 0.06)`
*   The shadow is ultra-diffused and tinted with the `Text Primary` color to mimic natural environment light.

---

## 5. Components

### Buttons: The "Power" Variant
*   **Primary:** 135° Gradient (Deep Blue to Active Blue). Border-radius: `0.25rem`. Text: `label-md` (Bold/All-caps).
*   **Secondary:** `Surface Container High` background with `Text Primary`. No border.
*   **Ghost:** `Outline Variant` at 20% opacity.

### Navigation Pills
*   **Shape:** `9999px` (Full Round).
*   **State:** Active pills should use the Primary gradient; inactive pills use `Surface Container High`.

### Cards & Tables
*   **Border-radius:** Tables/Lists use `0.5rem` (lg), while standalone cards use `0.75rem` (xl).
*   **No Dividers:** In lists, separate items using `16px` of vertical whitespace or a hover-state background shift to `Surface Container Lowest`.

### Kinetic Scoreboards (Custom Component)
A high-impact data visualization block. 
*   **Layout:** Vertical stack. Metadata label (All-caps) on top, followed by a `display-lg` Black-weight value.
*   **Style:** Placed on a `Surface Container Lowest` card with an ambient shadow.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use massive scale differences between headlines and body text.
*   **Do** allow elements to bleed off-canvas or overlap slightly to suggest motion.
*   **Do** use the "Ghost Border" (#c1c6d5 @ 20%) only when two surfaces of the exact same color meet (e.g., a white input on a white card).

### Don't:
*   **Don't** use standard `1px` solid borders (e.g., `#dddddd`). It breaks the premium "editorial" feel.
*   **Don't** use default tracking on Inter. It feels too "default PWA." Always tighten headlines.
*   **Don't** use pure black for shadows. It creates "muddy" UI. Always use the low-opacity tinted ambient shadow.
*   **Don't** align everything to a rigid center. Use left-aligned "Authority" layouts for impact.