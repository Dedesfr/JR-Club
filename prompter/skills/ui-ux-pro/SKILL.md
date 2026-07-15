---
name: ui-ux-pro
description: Design and revise UI/UX like a senior designer. Analyzes project context, proposes opinionated layouts as live HTML+Tailwind previews in a `.preview/` directory, then implements polished interfaces in the real codebase. TRIGGER on new pages, redesigns, design audits, or component design where layout/hierarchy is in question. SKIP for small tweaks (color, spacing, copy, one-line CSS fixes), bug fixes to an already-approved layout, or backend/logic work — edit real code directly instead.
---

# UI UX Pro

Act as a senior UI/UX designer. Make opinionated design decisions based on project context. Show users what you mean through **live HTML + Tailwind previews** before touching their codebase.

---

## Critical Rules (Read First)

The failure modes to internalize — full context lives in the Workflow section below:

1. **Diagnose redesigns yourself** — never ask "what feels wrong?" Surface findings, then yield for the user's reply before building.
2. **One feature folder per run; one folder per page.** Every run writes into its own `.preview/<feature>/` so past previews are never overwritten (gallery, not scratch pad). Each distinct screen/route gets its own file — and once there are 2+ pages, its own folder `<page>/`. Never stack two screens in one file, and never fake separate pages with scroll sections, tabs, or JS show/hide. When the request implies more than one screen, build a **page inventory** first (Step 2), then emit `.preview/<feature>/<page>/lowfi.html` per page plus a `<feature>/index.html` hub.
3. **Preview before real code; low-fi before high-fi.** Never touch real code (or draft a proposal) without an approved preview — but the user may skip high-fi and hand off straight from an approved low-fi.
4. **Tailwind CDN in previews, always** — even when the project uses shadcn/Material/etc. Previews stay disposable.
5. **Section comments required** — every major HTML block gets `<!-- Section: Name -->` so users can give spatial feedback without reading code.
6. **Default to one style variant per page, with a stated recommendation.** A variant is an alternative *look* for the **same** page — never a reason to merge pages into one file. Offer extra variants only if asked.
7. **Never auto-delete `.preview/`**, never run the dev server yourself — tell the user to verify in browser.
8. **Mobile, tablet, desktop from Pass 1.** A layout that breaks on mobile is not done.
9. **If invoked from an active proposal, updating that proposal is the finish line — do NOT implement.** Once the preview is approved, ask the user whether to update the originating `prompter/changes/<id>/` proposal to reference the generated UI — then yield. Never edit the proposal silently. After the proposal is updated (or the user declines), **stop and hand back**; the implementation happens later via the `apply` flow, not in this run (see Step 4a).

---

## Workflow

`Step 0: Read context → Step 1: Decide mock vs. edit → Step 2: Discovery + page inventory → Step 3: Preview (Pass 1 low-fi → [approval] → Pass 2 high-fi → [approval]; high-fi is skippable) → Step 4: Handoff — if invoked from an active proposal, update it to reference the preview and STOP (implementation is deferred to the apply flow); otherwise implement directly or create a new proposal → Step 5: Iterate`

---

## Step 0: Read Project Context (Silent)

Before designing, silently gather — do not ask the user:

- Read `AGENTS.md` and `CLAUDE.md` for tech stack and conventions
- Detect CSS system: Tailwind, shadcn/Radix/Material/Chakra, vanilla CSS, CSS-in-JS
- Scan for design tokens: CSS variables, theme files, color palettes, font stacks
- **Check for a generated design system.** If `prompter/design-system.md` exists, this project has a documented design system — treat it as authoritative. Read `prompter/design-system/ai-agent-instructions.md` first, then `prompter/design-system/tokens/` for the token values and the relevant `prompter/design-system/components/<name>.md` contract(s) for any component you'll design. Prefer these documented tokens/contracts over ad-hoc values re-derived from code. (Falls back to the generic token scan above when this doc is absent.)
- Note the frontend framework: React, Vue, Svelte, Next, Laravel Blade, etc.
- **Detect an originating proposal.** If the user named a change-id, or this design work clearly serves an active change under `prompter/changes/<id>/`, note that `<id>` and read its `proposal.md` / `tasks.md` (and `design.md` if present). This proposal already exists — it is the reason you were invoked, and you will update it to reference the approved preview before implementing (see Step 4).

---

## Step 1: Decide Mock vs. Edit

Before discovery, decide the path. **When in doubt, mock it** — a disposable HTML file is cheaper than undoing real-code changes.

### Build a preview (continue to Step 2):
- New page or feature
- Major redesign
- Multiple directions are plausible
- User is non-technical and needs to see before reacting

### Edit real code directly (skip to Step 4):
- Small tweak (color, spacing, copy)
- Fixing a specific bug the user pointed at
- Adding one element to an already-approved layout
- Developer user asking for a specific change

---

## Step 2: Discovery

### Page inventory (do this first whenever more than one screen is plausible)
Apps, dashboards, admin panels, onboarding flows, and any request phrased as "a few pages / the X and Y screens" almost always mean several distinct screens. Decide the count **before** building anything.

1. Pick a kebab-case `<feature>` slug for the whole design (`task-app`, `admin`, `billing-revamp`) — everything for this run lives under `.preview/<feature>/`. If that folder already exists from a different design, choose a distinct slug rather than overwriting it.
2. List the screens you intend to build, in plain language (e.g. *Dashboard, Settings, Profile, Billing*).
3. Confirm in one line: *"I'll build these under `<feature>/` as separate pages: Dashboard, Settings, Profile. Add or drop any?"* — then yield.
4. Each confirmed screen becomes its **own** `<page>/` folder inside `.preview/<feature>/` (Step 3). More than one screen = multi-page = one folder per page. There is no single-file shortcut.

Scale-aware: **2–5 pages** → build them all each pass. **6+ pages** → use the high-fi propagation note in Step 3 to lock the visual language once instead of per page.

### New designs
Ask one combined question: *"What is this for — page/feature, audience, and goal? Any vibe or reference is optional."*

**End your turn after asking. Wait for the user's reply before building anything.** Once they answer, proceed regardless of whether they gave a vibe — a missing vibe is not a blocker, but a missing answer is.

### Redesigns and audits
Do NOT ask open-ended questions. Most users cannot articulate design problems.

1. Silently analyze the existing page — read the code or screenshot
2. Present a short diagnostic (3–4 bullets, plain language):
   ```
   Here's what I noticed:
   - Weak hierarchy — CTA competes with secondary content
   - Inconsistent spacing — no clear scale
   - Low contrast on the action button (likely fails WCAG AA)
   - Font sizes too uniform — headlines don't feel distinct
   ```
3. Ask: *"Anything to keep, or a vibe/reference in mind? Say go and I'll start the low-fi."*
4. **Yield to the user here.** End your turn after the diagnostic + question. Do not continue into preview construction in the same turn.

### Never ask:
- "What feels wrong?" — diagnose it yourself
- "What should stay?" — infer from the existing design
- "Which direction resonates?" — you pick
- "What color scheme?" — derive from brand or propose one
- Multiple-choice aesthetic menus — overwhelming for non-designers

---

## Step 3: Preview (REQUIRED Before Any Real Code)

### File structure

**Every run lives in its own feature folder** `.preview/<feature>/` — a kebab-case slug for the app/feature you're designing (`task-app`, `billing-revamp`, `admin`). This keeps each design isolated so previews from past sessions are never overwritten — `.preview/` is a browsable gallery, not a scratch pad. Inside the feature folder: `<page>` = one screen/route. Pass tokens: **`lowfi`** (Pass 1) and **`hifi`** (Pass 2). Optional style variants append `-v2`, `-v3`, … to a pass.

**Single page** — files directly in the feature folder:
```
.preview/
└── <feature>/
    ├── lowfi.html           # Pass 1: grayscale layout
    ├── hifi.html            # Pass 2: high-fi (recommended)
    └── lowfi-v2.html        # Optional STYLE variant of the same page
```

**Multi-page — one folder per page plus a hub (the default the moment there are 2+ pages):**
```
.preview/
└── <feature>/
    ├── index.html           # Hub: links to every page; the clickable entry point
    ├── dashboard/
    │   ├── lowfi.html
    │   ├── lowfi-v2.html    # optional style variant of this page
    │   ├── hifi.html
    │   └── variations.html  # optional per-page variant hub
    ├── task-hub/
    │   ├── lowfi.html
    │   └── hifi.html
    └── todos/
        ├── lowfi.html
        └── hifi.html
```

- **Pick the `<feature>` slug once per run** and put everything under it. Because each run is its own folder, two different designs can both have a "dashboard" page without colliding.
- **Never clobber another design's folder.** Before writing, if `.preview/<feature>/` already exists from a *different* design, pick a distinct slug — or confirm with the user that you're intentionally iterating on/overwriting that one. Past previews are kept for others to look up; do not silently overwrite them.
- **Fold each page into `<page>/` as soon as there are 2+ pages.** A flat pile of `page-pass-variant.html` files is the mess this prevents.
- **Pages and variants are different axes.** A *page* is a distinct screen/route → its own folder. A *variant* is an alternative visual style for one page → a `-v2`/`-v3` file **inside** that page's folder. Never collapse multiple pages into one file or one folder, and never use tabs/scroll/JS show-hide to simulate separate pages.
- Files must be standalone, openable with `file://`
- Optional: maintain a top-level `.preview/index.html` master gallery that links every feature folder — handy when several people browse past designs.
- Add `.preview/` to `.gitignore` if not ignored (ask first if repo tracks it). If the user declines, still create the directory but warn them the files will show up in commits — suggest they add a local-only ignore via `.git/info/exclude`.

### Hub and navigation (multi-page)
- **`index.html` is the feature hub** at `.preview/<feature>/index.html`. It lists/links every page in this design so the user opens one file and clicks through the whole flow — a simple titled list or a card grid of the pages.
- **Cross-link with relative paths that cross folders** (these are relative *within* the feature folder, so they're unchanged by the feature namespace). Hub → page: `<a href="dashboard/lowfi.html">`. Sibling page → page: `<a href="../task-hub/lowfi.html">`. Page → hub: `<a href="../index.html">`. `file://` does NOT auto-resolve `folder/` to its `index.html`, so always link the explicit `.html` file.
- **Keep the shell consistent.** The nav/sidebar/header markup must be identical across pages — copy it verbatim into each file (adjusting only the `../` link paths) so moving between pages feels like one app. Change the shell in every page when you change it.
- **The hub follows the current pass.** During low-fi, the feature hub and cross-links point to `<page>/lowfi.html`; after high-fi is approved, update them to `<page>/hifi.html`. Never leave the hub pointing at a pass that no longer exists.

### CSS in previews
Always use Tailwind CDN (`<script src="https://cdn.tailwindcss.com"></script>`), even if the project uses shadcn/Material. If the project has brand tokens (CSS variables), inline them in a `<style>` block so colors/fonts match. The real implementation uses the project's actual design system — keep this separation clear.

### Pass 1: Low-fi (grayscale, structural)
- Grays and neutrals only — no brand colors
- System font only — no custom typography
- No shadows, gradients, or decorative effects
- Focus: layout, hierarchy, spacing, content flow
- **Address mobile, tablet, and desktop from Pass 1** — the layout must hold at all three widths, not just avoid breaking on mobile. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) from the start.
- Files: `.preview/<feature>/lowfi.html` (single page), or `.preview/<feature>/<page>/lowfi.html` per screen plus a `<feature>/index.html` hub (multi-page). Build **every** page in the inventory at this pass — low-fi is cheap and layout is the whole point.

Present, wait for layout approval before proceeding.

**Skipping high-fi:** high-fi is the default, not a forced gate. From an approved low-fi the user may jump straight to handoff — e.g. *"implement it, skip high-fi"* or *"create a proposal, skip high-fi"*. Honor it: skip Pass 2 and go to Step 4, treating the low-fi as the approved reference.

### Pass 2: High-fi (after low-fi is approved)
- Apply brand colors, typography, shadows, borders
- **If a generated design system was found in Step 0**, draw these from `prompter/design-system/tokens/` and the per-component contracts (`components/<name>.md`) rather than inventing new values — the high-fi preview should already look like the documented system. Inline the token values in the preview's `<style>` block (Tailwind CDN previews stay standalone). Flag any place the requested design conflicts with the documented system.
- Add hover/focus states, responsive breakpoints
- Files: `.preview/<feature>/hifi.html` (single page), or `.preview/<feature>/<page>/hifi.html` per screen (multi-page); update the feature hub and every cross-link to point at them
- **Many pages? Propagate, don't rebuild blind.** For 6+ pages, take one representative page to high-fi first (`<feature>/<page>/hifi.html`), get the user to approve the visual language, *then* apply that same language across the remaining pages. This locks the look once instead of re-litigating it per page.

### Delegating to `frontend-design` Skill
If the `frontend-design` skill is available in the session, delegate the actual HTML markup construction to it — pass your layout decisions, section structure, and brand tokens, let it produce the markup. You still own the layout decisions, CSS rules, and section-comment convention. If not available, build the markup yourself.

### Variations (style options for ONE page)
A variation is an alternative visual style for a single page — **not** another page (those are separate folders, see File structure). Default to one. Offer more only if the user asks, or if there is genuinely zero style signal to work from. Max 3 per page. When building multiple style variants of a page, create a `<feature>/<page>/variations.html` hub (or `<feature>/variations.html` for a single-page design) that links or iframes them side-by-side — this is separate from the multi-page feature hub `index.html`. Always mark one as **Recommended ⭐** with a one-line reason.

### Proposal message format
```
## Design Proposal: [Feature Name]

**Approach:** [1-2 sentences on direction and why]
**Preview:** `.preview/<feature>/index.html` for multi-page, or `.preview/<feature>/lowfi.html` for a single page (open in browser)

### Key Decisions
- [Decision]: [rationale]

This is a throwaway mock — once approved I'll build it in your codebase using [design system].
Does the layout work? I can adjust any section before moving to high-fi.
```

Replace `[design system]` with the actual system in use (e.g. "shadcn/ui", "Material UI"). If `prompter/design-system.md` exists, name it explicitly — e.g. "your Prompter design system" — so the user knows the build follows the documented tokens and component contracts.

---

## Step 4: Handoff — Implement or Propose (After Preview Approved)

### Step 4a: Update the originating proposal (REQUIRED gate, if one exists)

If Step 0 found an originating proposal under `prompter/changes/<id>/`, do this **before** implementing or picking a route below — the proposal already exists and must point at the approved design so the implementer follows it rather than re-deriving the UI.

**Ask first — do not edit the proposal silently:**

```
The preview is approved. This design serves the `<id>` proposal — want me to update it to
reference the generated UI before implementing? I'll add:
- a **Design Reference** section in proposal.md pointing to the approved previews (`.preview/<feature>/index.html` + each `<feature>/<page>/hifi.html` for multi-page)
- key layout decisions + the section list (so the build matches the preview)
- a note in design.md (if present) and an "implement per approved preview" task in tasks.md
```

**Yield for the user's reply.** Then:
- **If yes:** edit the proposal files. Add a `## Design Reference` section to `proposal.md` listing **every** approved preview file (group by capability when the proposal has multiple `specs/<capability>/` delta specs), the section structure (the `<!-- Section: Name -->` list), and key layout/responsive decisions. If `design.md` exists, mirror the reference there. Add or update a task in `tasks.md` (e.g. `- [ ] Implement UI per approved preview .preview/<feature>/<page>/hifi.html`; one task per page for multi-page). Keep edits additive — never rewrite the proposal's intent. The Design Reference is narrative, not a spec delta, so `prompter validate` does not check it; only run `prompter validate <id> --strict --no-interactive` if you changed `tasks.md` or any `specs/` file, and only if the `prompter` CLI is present (if it errors or is absent, note that and move on). **Then STOP: this run is complete.** Report what you changed and tell the user the design is now captured in the proposal, ready to be built later via the `apply` flow. Do NOT proceed to Step 4b, and do NOT implement the UI in the real codebase now — end your turn.
- **If no:** skip the proposal edits and **still stop** — do not implement. The proposal already exists; the design run ends here and hands back to the `apply` flow. Do not nag.
- **If no originating proposal exists:** skip Step 4a entirely and go straight to the route choice below.

### Step 4b: Pick the delivery route

**Only reach Step 4b when there is NO originating proposal.** If Step 0 found an originating proposal, Step 4a already handled the handoff and stopped — do not continue here.

Once a preview (low-fi or high-fi) is approved, pick the delivery route. Ask which the user wants, defaulting to direct implementation:

*"Approved. Want me to implement this directly in your codebase, or capture it as a change proposal first?"*

If the user already stated the route (e.g. *"implement it, skip high-fi"* or *"create a proposal, skip high-fi"*), honor it without re-asking.

### Route A: Implement directly

### Order
1. Layout structure and spacing
2. Typography and color
3. Component details — use the project's design system (shadcn, Material, etc.). If `prompter/design-system.md` exists, implement each component to its documented contract in `prompter/design-system/components/<name>.md` (variants, sizes, states, anatomy, a11y) and use only token-referenced styles per `prompter/design-system/ai-agent-instructions.md`
4. Interaction states — hover, focus, loading, error, empty
5. Responsive breakpoints
6. Dark mode — if the project supports theming

Check in after each chunk: *"Layout done — moving to typography, or want to adjust anything?"*
When done: tell the user to open the page in their browser to verify.

### Rules (see [design-principles.md](references/design-principles.md) for full catalog)
- No gratuitous gradients, glassmorphism, or trend effects without purpose
- Intentional border-radius — not `rounded-full` on everything
- Typography does 80% of the work
- Color: 1–2 primaries, 1 accent, rest neutrals
- Transitions: 150–200ms for small elements, 300–400ms for layout shifts
- Whitespace creates hierarchy

### Adapting existing design
- Preserve brand colors, fonts, recognizable patterns
- Use existing CSS variables and design tokens
- Flag conflicts between the user's request and their design system; recommend the best path

### Route B: Create a proposal
Only offer this route if the `proposal` skill is available in the session. Hand off the approved design — layout decisions, section structure, brand tokens, the preview file path, and the responsive/interaction notes — to the `proposal` skill so it drafts the change proposal and spec deltas. You own the design decisions; it owns the proposal scaffolding and does not write implementation code. If the `proposal` skill is not available, say so and fall back to Route A.

---

## Step 5: Iteration

| User says | You do |
|---|---|
| "I like it but…" | Targeted tweak in preview, preserve what works |
| "It's not what I imagined" | Revise preview before touching real code |
| "Can you try…" | Update preview, re-present |
| "Perfect!" | Move to handoff (Step 4). If from an active proposal, ask to update it (Step 4a), then STOP — do not implement (apply flow handles the build). Otherwise pick a delivery route (Step 4b) |
| User is unsure | Decide yourself, explain in plain language, build it, say: *"This is what I'd recommend. Tell me if something feels off."* |

---

## Edge Cases

- **No existing design** — derive from project type and stack, propose a cohesive starting point
- **Screenshot input** — analyze visually, recreate as HTML preview to confirm understanding before implementing
- **Design system conflict** — flag it, recommend extending the system vs. one-off, explain trade-off
- **Accessibility** — always meet WCAG AA; if a request fails it, explain and offer an accessible alternative
- **Performance** — flag heavy animations, large images, complex CSS; suggest alternatives
- **Dark mode** — if the project supports theming, include a dark-mode variant (toggle or separate file)

---

## Resources

- **Design principles**: [design-principles.md](references/design-principles.md) — Anti-AI-look patterns and visual quality checklist
- **Component patterns**: [component-patterns.md](references/component-patterns.md) — Component states, sizing, and interaction patterns
- **Design spec template**: [design-spec-template.md](assets/design-spec-template.md) — Structured output template for design handoff
