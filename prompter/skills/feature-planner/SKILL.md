---
name: feature-planner
description: "Plan feature development on existing projects. Interview users about what they want to build, analyze the codebase to understand tech stack, patterns, and affected areas, then produce a structured implementation plan with phased tasks. For features too large to ship in one pass, splits the work into an ordered roadmap of independently-shippable increments, each becoming its own Prompter proposal. Also resumes an existing feature: `feature-planner <slug> status` shows roadmap progress and `feature-planner <slug> continue` scaffolds the next increment's proposal. Once every increment is archived, offers to generate a feature-level manual testing guide. Use when a user wants to add a feature, make a change, plan a large multi-increment feature, resume or check the status of a planned feature, or plan development work on a project that already exists."
---

# Feature Developer

Interview the user about what they want to build, analyze the existing codebase, then produce a phased implementation plan with concrete tasks and file references.

## Quick Start

1. **DESCRIBE** -- Ask what the user wants to build and why
2. **ANALYZE** -- Scan the codebase: structure, tech stack, patterns, existing specs
3. **SCOPE** -- Present what's in/out of scope, identify affected files
4. **SPLIT** -- *(always ask)* Ask the user whether to split the feature into an ordered roadmap of increments (each its own proposal) or keep it as one proposal
5. **PLAN** -- Break down into phased implementation tasks (for the first increment only, if split)
6. **REVIEW** -- Present the plan and iterate until approved
7. **PROPOSAL** -- Optionally create a Prompter change proposal

> Steps 1–7 above are **New Feature Mode**. If the invocation names an existing feature, you're in **Resume Mode** instead — see "Invocation & Mode Detection" below.

---

## Invocation & Mode Detection (DO THIS FIRST)

Parse the skill's invocation arguments before anything else:

```
feature-planner <slug>             → Resume Mode, default intent (show status, then ask)
feature-planner <slug> status      → Resume Mode, intent = status
feature-planner <slug> continue    → Resume Mode, intent = continue
feature-planner <new-feature-name> → New Feature Mode (no matching folder)
feature-planner                    → New Feature Mode (no args)
```

1. Take the first argument token as a candidate **slug** and the second (if any) as the **intent** (`status` or `continue`).
2. Check whether `prompter/features/<slug>/` exists (Glob).
   - **Folder exists →** enter **Resume Mode** (jump to the "Resume Mode" section below; skip the interview entirely).
   - **Folder does not exist →** enter **New Feature Mode** (the interview, Steps 1–7). If a name was given, use its kebab-case slug so a later multi-increment resume can find its folder.
3. If no intent word was given in Resume Mode, default to "show status, then ask".

> **Only multi-increment features have a folder.** Single-proposal features never create `prompter/features/<slug>/` (see Step 5), so they always route to New Feature Mode and are resumed through Prompter's own tooling, not `feature-planner <slug>`. Resume Mode is therefore a multi-increment-only path.

**feature-planner is a roadmap orchestrator.** It owns the roadmap and proposal scaffolding only. It never implements tasks, ticks task checkboxes, or reads `tasks.md` — that work belongs to Prompter's `/apply`. Resume Mode operates strictly at the **increment / proposal** level.

---

## Resume Mode (existing feature)

Triggered when the invocation names an existing `prompter/features/<slug>/` folder. **Do not run the interview.** Resume Mode reads the feature's saved state and either reports it or advances the roadmap by one increment.

### Resolve state (reconcile against Prompter — don't trust the cache)

Read `prompter/features/<slug>/roadmap.md` for the increment list, `change-id`s, and dependency order. Its **Status** column is a convenience cache only: Prompter's `/apply` and `/archive` do **not** write back to it, so an increment can be archived in Prompter while the roadmap still says `scaffolded`. Treat the column as a hint, then **reconcile each increment's real status from Prompter's own on-disk state**, which is the single source of truth:

- **`archived`** — an archived change exists for its `change-id`: a `prompter/changes/archive/*<change-id>*/` directory (Glob). This is the only status that unblocks dependents.
- **`scaffolded` / `in progress`** — an active change dir `prompter/changes/<change-id>/` exists and is not archived. (The two are informational only; the eligibility gate cares solely about `archived` vs not.)
- **`not created`** — no change dir exists for its `change-id` in either location.

Resolve with Glob against `prompter/changes/<change-id>/` and `prompter/changes/archive/*<change-id>*/`; fall back to `prompter list` / `prompter show <change-id>` if the directories are ambiguous. After reconciling, **rewrite the Status column in `roadmap.md`** so the cache matches reality, then use the reconciled values for the dashboard and the `continue` eligibility rule.

Resume Mode only ever runs for multi-increment features (single proposals have no folder). Never open `tasks.md` or inspect task-level checkboxes — status is resolved purely at the increment/proposal level.

### Status dashboard

Print a compact, roadmap-level view. Multi-increment example:

```
Feature: webhook-delivery-retries

Increment  Scope                  change-id            Depends on   Status
1          Core schema + API      add-webhook-schema   —            archived
2          Delivery worker        add-webhook-worker   1            in progress
3          Admin UI               add-webhook-admin    2            not created

Next to run: Increment 3 (add-webhook-admin) — waiting on Increment 2 to be archived.
```

The "Next to run" line is the first roadmap row with status `not created` whose dependencies are all `archived`.

### When every increment is `archived` (feature complete)

If reconciliation shows **all** roadmap increments are `archived`, the feature is fully shipped — there is nothing left to scaffold. In this state, for **every** intent (`status`, `continue`, and default), after printing the dashboard, offer to generate a **feature-level manual testing guide**:

```json
{
  "questions": [
    {
      "question": "All increments are complete. Want me to generate a manual testing guide for this feature?",
      "header": "Feature Guide",
      "multiSelect": false,
      "options": [
        { "label": "Generate guide", "description": "Write a hand-testable guide covering the whole feature end-to-end" },
        { "label": "No thanks", "description": "I'm done — just wanted the status" }
      ]
    }
  ]
}
```

- **"Generate guide" →** produce it per "Feature Guide" below.
- **"No thanks" →** stop.

If `prompter/features/<slug>/guide.md` already exists, add a note to the question that generating will overwrite it.

### Feature Guide (generating)

Generate a single manual testing guide covering the whole feature end-to-end — modeled on Prompter `/apply`'s per-change guide, but at the feature level.

- **Save it to** `prompter/features/<slug>/guide.md`.
- **Source it from every archived increment — don't guess.** For each increment's `change-id`, read its archived change under `prompter/changes/archive/*<change-id>*/` (its `proposal.md`, `tasks.md`, and any per-change `guide.md`) to see what actually shipped and which files were touched. Aggregate these into one coherent feature walkthrough.
- **Structure** as concrete, step-by-step scenarios a person can follow by hand, each with: preconditions/setup, the exact steps to perform, and the expected result to verify against.
- **Cover** the primary happy path across increments plus any notable edge cases or error states the feature introduced.
- **Note required setup** (env vars, seed data, accounts, commands to start the app) so the tester can reproduce from a clean state.
- **Order scenarios by the roadmap's dependency order** so the guide reads as one feature, not disjoint per-increment tests.

After writing, tell the user the path (`prompter/features/<slug>/guide.md`) and stop.

### Intent: `status`

Print the dashboard. If every increment is `archived`, follow "When every increment is `archived`" above to offer the feature guide; otherwise stop and do nothing else.

### Intent: `continue`

Advance the roadmap by exactly **one** increment — never more, since later increments depend on earlier ones being merged first.

1. Find the **next eligible increment**: the first roadmap row with status `not created` whose dependencies are all `archived`.
   - If the next row's dependency is not yet `archived`, **stop** and report: "Increment N is blocked — Increment N-1 must be implemented and archived first (run `/apply` then `/archive`)."
   - If every increment is already `archived`, report "All increments complete", then follow "When every increment is `archived`" above to offer the feature guide.
2. **Scaffold that increment's proposal** following Step 5's "Create proposal" branch (read `prompter/skills/proposal` and `prompter/AGENTS.md`, derive the proposal from the roadmap row's scope + `change-id`, run `prompter validate <change-id> --strict --no-interactive`).
3. **Bump the roadmap Status** for that row: `not created` → `scaffolded`.
4. **Stop and hand off** — do not run `/apply`, do not implement tasks:

   ```
   Scaffolded Increment 3 → proposal add-webhook-admin.
   Next: run /apply add-webhook-admin to implement it, then /archive when done.
   Re-run `feature-planner webhook-delivery-retries continue` for the following increment.
   ```

### Intent: default (bare slug)

Print the status dashboard. If every increment is `archived`, skip the Continue/Just status question below and instead follow "When every increment is `archived`" above to offer the feature guide.

Otherwise, ask with `AskUserQuestion`:

```json
{
  "questions": [
    {
      "question": "What would you like to do?",
      "header": "Resume",
      "multiSelect": false,
      "options": [
        { "label": "Continue", "description": "Scaffold the next increment's proposal and hand off to /apply" },
        { "label": "Just status", "description": "I only wanted to see where things stand" }
      ]
    }
  ]
}
```

Route the answer to the `continue` or `status` behavior above.

---

## Before You Begin (REQUIRED)

> Applies to **New Feature Mode** only. In Resume Mode you've already loaded state above.

Before starting the interview:

1. **Read `AGENTS.md`** at the project root (if it exists) to understand the tech stack, conventions, and architecture.
2. **Read `prompter/project.md`** (if it exists) to understand project conventions.
3. **Scan the project structure** using Glob to understand the directory layout and key files.

Store what you learn -- you'll reference it when identifying affected files and patterns.

---

## Interactive Terminal Tool (REQUIRED)

Use the `AskUserQuestion` tool for **every question** in the interview. This renders an interactive UI in the terminal.

### How to Use AskUserQuestion

- **Single-choice questions**: Set `multiSelect: false`. Use for yes/no, pick-one decisions.
- **Multi-choice questions**: Set `multiSelect: true`. Use for checklists.
- **Free-text input**: When you need the user to describe something open-ended (like the feature itself), ask as a plain message and wait for their response. Only use `AskUserQuestion` for structured choices.
- **Keep options concise**: Labels should be 1-5 words. Add detail in the `description` field.

---

## Core Rules

- Use `AskUserQuestion` for every structured question -- never ask choice questions as plain text.
- Ask one question or one small grouped set at a time. Never overwhelm.
- After every answer, acknowledge what you understood before moving on.
- Ground every suggestion in what you observed in the codebase -- don't guess patterns.
- If unsure about something, look at the code before asking the user.
- Keep the interview short -- 3 to 5 questions max before producing the plan.

---

## Step 1: Feature Description (REQUIRED)

Open with:

```
What feature or change do you want to build? Tell me:

1. What it does (the user-visible behavior or system change)
2. Why you need it (the problem it solves or value it adds)
3. Any constraints or preferences (e.g., "must use existing auth system", "keep it simple")
```

Wait for the user's response. Summarize what you understood in 2-3 sentences.

---

## Step 2: Codebase Analysis (REQUIRED)

After understanding the feature, **silently analyze the codebase**. Do NOT ask the user about the tech stack -- discover it yourself.

### What to Analyze

1. **Project structure** -- Use Glob to map the directory layout (e.g., `src/**`, `app/**`, `resources/**`)
2. **Tech stack** -- Identify framework, language, database, styling from config files:
   - `package.json`, `composer.json`, `Cargo.toml`, `go.mod`, `requirements.txt`
   - Framework configs: `next.config.*`, `vite.config.*`, `artisan`, `convex/`
   - Database: migrations folder, schema files, ORM config
3. **Existing patterns** -- Read 2-3 files similar to what you'll need to create/modify:
   - If adding an API endpoint, read an existing endpoint
   - If adding a UI component, read an existing component
   - If adding a model, read an existing model
4. **Related code** -- Use Grep to find code related to the feature (e.g., if adding notifications, search for existing notification code)
5. **Existing specs** -- Check `prompter/specs/` for relevant capability specs

### Present Findings

After analysis, present a brief summary:

```
Here's what I found in your codebase:

**Stack**: [e.g., Laravel 12 + Filament + PostgreSQL + Docker]
**Structure**: [e.g., Standard Laravel with domain-driven modules under app/Domains/]
**Relevant patterns**:
- [e.g., Controllers follow single-action pattern (app/Http/Controllers/)]
- [e.g., All models use UUIDs as primary keys]
- [e.g., Tests use Pest with factories]

**Related existing code**:
- [e.g., Similar notification system exists at app/Notifications/]
- [e.g., No existing code for webhooks -- this is net new]
```

Then ask using `AskUserQuestion`:

```json
{
  "questions": [
    {
      "question": "Does this look right? Anything I missed about how your project works?",
      "header": "Codebase Analysis",
      "multiSelect": false,
      "options": [
        { "label": "Looks correct", "description": "Move on to scoping" },
        { "label": "Need to correct something", "description": "I'll clarify what's different" }
      ]
    }
  ]
}
```

If the user corrects something, update your understanding and move on.

---

## Step 3: Scope & Affected Areas

Based on the feature description and codebase analysis, present the scope:

```
Here's what I'd include for this feature:

**In scope:**
- [change 1]
- [change 2]
- [change 3]

**Out of scope (can do later):**
- [deferred item 1] -- [reason]

**Files that will be affected:**
- `path/to/file.ext` -- [what changes: new / modify / delete]
- `path/to/file.ext` -- [what changes]
```

Then ask:

```json
{
  "questions": [
    {
      "question": "Does this scope match what you had in mind?",
      "header": "Feature Scope",
      "multiSelect": false,
      "options": [
        { "label": "Looks good", "description": "Proceed to implementation plan" },
        { "label": "Too much", "description": "I want to trim the scope" },
        { "label": "Missing something", "description": "I'll tell you what to add" }
      ]
    }
  ]
}
```

Iterate until the user confirms the scope.

---

## Step 3.5: Structure Decision — Increment Roadmap vs Single Proposal (REQUIRED — ALWAYS ASK)

**Always run this step and always ask the user the structure question** (unless Prompter is absent — see Precondition). Planning a large feature as a single implementation plan recreates the flat "Out of scope" graveyard — follow-up work with no sequence, no `change-id`s, no run-order. When the user chooses to split, this step produces an ordered roadmap of **increments**, where each increment becomes its own proposal you run in sequence.

### Precondition: Prompter must be installed

This step is built on Prompter concepts (`change-id`, one-proposal-per-increment). Check whether `prompter/skills/proposal` exists (Glob), the same way Step 5 does.

- **Prompter present →** run this step as written.
- **Prompter absent →** skip this step. For a large feature without Prompter, fall back to the lightweight path: in Step 4 plan Increment 1 in detail, and list the remaining increments as a plain ordered checklist under the plan's **Notes** (name + one-line scope + depends-on, no `change-id`s or proposals). Then continue to Step 5's non-Prompter branch.

### Two levels — don't confuse them

- **Increment** (this step) = an independently shippable slice of the feature → **one proposal** (`change-id`). Increments run in dependency order, across separate work sessions.
- **Phase** (Step 4, inside one increment) = an implementation step *within* a single increment (Database → Backend → Frontend → Tests). Phases are tasks inside one proposal, never separate proposals.

So a large feature → several **increments**; each increment's plan → several **phases**.

### Trigger (ALWAYS ASK — never decide silently)

After scope is confirmed in Step 3, you **must always ask the user** how they want to structure the work. Do not skip this question, and do not pick the structure for them based on your own size judgment — letting the model silently decide is exactly the bug this step exists to prevent.

First, **judge the size** to set your recommendation (these signals make "split into increments" the recommended option):

- The plan clearly **can't be completed in a single session** (the skill's existing achievability rule).
- The affected-files list spans many unrelated modules / a large surface.
- The feature naturally decomposes into slices that each ship and get reviewed on their own.
- The user calls it big, multi-part, or phased.

Then **ask exactly one question** with `AskUserQuestion`. Put the recommended option **first** and append "(Recommended)" to its label. If size signals are present, recommend "Split into increments"; otherwise recommend "Keep as one proposal".

Example when size signals are present:

```json
{
  "questions": [
    {
      "question": "How should I structure this work?",
      "header": "Structure",
      "multiSelect": false,
      "options": [
        { "label": "Split into increments (Recommended)", "description": "Big feature — build an ordered roadmap; each increment is its own proposal, run in sequence. Plan + build only the first increment now." },
        { "label": "Keep as one proposal", "description": "Plan the whole feature as a single proposal with phased tasks (Database → Backend → Frontend → Tests)." }
      ]
    }
  ]
}
```

When size signals are absent, ask the same question but make "Keep as one proposal" the first/recommended option.

- **"Split into increments" →** build the increment roadmap below.
- **"Keep as one proposal" →** skip to Step 4 and plan the feature as one unit.

### Building the increment roadmap (only if the user said yes)

Split the in-scope work into **increments** ordered by dependency. For each increment define:

- **Name** — short, human (e.g., "Core schema + API").
- **Scope** — one line on what it ships.
- **Depends on** — which earlier increment must merge first (or "none").
- **Proposed `change-id`** — verb-led kebab-case per Prompter convention (`add-`, `update-`, `remove-`, `refactor-`).

**Increment 1 is the foundational slice** — the shared schema/infra/contracts the later increments build on.

### Decompose rule (teach this — don't over- or under-split)

Prompter already supports many tasks and multiple spec deltas inside one proposal, so "big feature = many proposals" is wrong.

- **One increment = one independently shippable proposal** — implement → review → archive as a unit before the next.
- **A big-but-coherent feature that ships together = ONE proposal** with phased tasks (Step 4), not multiple increments.
- **Split into increments only when each slice ships and reviews on its own** and later slices depend on earlier ones being merged.

### Confirm the roadmap

Present the increments as a table (Increment / Scope / `change-id` / Depends on) and confirm with `AskUserQuestion` (Looks good / Needs changes). Iterate until approved. Then in Step 4, **plan only Increment 1 in detail**; carry the full roadmap into the plan's **Increment Roadmap** section and into Step 5.

---

## Step 4: Implementation Plan (REQUIRED)

Produce the implementation plan using the template in `assets/implementation-plan-template.md`.

### Planning Rules

- **Phase tasks logically**: database/schema first, then backend logic, then frontend, then tests.
- **Reference specific files**: Every task should mention the file path where the work happens. Use existing file paths for modifications; propose paths that follow existing conventions for new files.
- **Follow existing patterns**: If the project uses a specific pattern (e.g., repository pattern, single-action controllers), your plan must follow it.
- **Be concrete**: "Create UserNotification model with `user_id`, `type`, `message`, `read_at` columns" is better than "Create notification model".
- **Include test tasks**: Always include at least one testing phase.
- **Keep it achievable**: Aim for a plan that can be completed in a single session. If the feature is large enough to need splitting, you should already have built an increment roadmap in Step 3.5 — plan **only Increment 1** here in detail; the rest stay on the roadmap. If you somehow reach this step with an oversized single-unit plan, go back and run Step 3.5.

### Present the Plan

Output the filled-in implementation plan template, then ask:

```json
{
  "questions": [
    {
      "question": "Does this implementation plan look correct?",
      "header": "Plan Review",
      "multiSelect": false,
      "options": [
        { "label": "Approved", "description": "Save the plan and optionally create a proposal" },
        { "label": "Needs changes", "description": "I'll tell you what to adjust" }
      ]
    }
  ]
}
```

Iterate if the user requests changes.

---

## Step 5: Save & Next Steps (REQUIRED)

Once approved, save the plan based on what's available in the project.

### Output location (multi-increment only)

**Only multi-increment features get a per-feature folder.** When Step 3.5 produced an Increment Roadmap, all artifacts live in a per-feature folder, never the project root:

```
prompter/features/{feature}/
```

- `{feature}` is a kebab-case slug derived from the feature name (e.g., "Webhook delivery retries" → `webhook-delivery-retries`).
- `roadmap.md` — the durable run-order tracker (written once; only its Status column is updated over time).
- `implementation-plan.md` — the detailed plan for the current increment only (regenerated/overwritten each increment).
- Create the folder if it doesn't exist (the path is relative to the project root, e.g. `prompter/features/webhook-delivery-retries/`).

**Single-proposal features do not create this folder and are not saved as a standalone plan file.** The plan feeds directly into a Prompter proposal or into implementation. Because there is no folder, single-proposal features are not resumable via `feature-planner <slug>` — resume them through Prompter's own tooling (`/apply`, the change under `prompter/changes/<change-id>/`).

The `roadmap.md` Status column is a cache — Resume Mode reconciles it against Prompter's `changes/` and `changes/archive/` directories each run and rewrites it, so it self-heals if it drifts. You don't need to hand-maintain it, but write it correctly when you scaffold so the first `status` read is accurate.

### Multi-increment handling (if an Increment Roadmap was built in Step 3.5)

When the feature was split into increments, these rules override everything below.

1. **Persist the roadmap to its own durable file — separate from the per-increment plan.** Write the **Increment Roadmap** + **Next Increment to Run** sections to `prompter/features/{feature}/roadmap.md` (a stable, feature-named file). This is the run-order tracker; it is written once and only its Status column is updated over time. Do this on **every** option, even "Start building".
   - Keep this distinct from `prompter/features/{feature}/implementation-plan.md`, which holds the **detailed plan for the current increment only** and is regenerated/overwritten each time you plan a new increment. Never store the roadmap in `implementation-plan.md`, or re-running the skill for Increment 2 would clobber it.

2. **Every action applies to Increment 1 only.** Never scaffold or build later increments now — they depend on Increment 1's *merged* code and would drift if written ahead. So:
   - "Create proposal" → scaffold **Increment 1's** proposal (using its roadmap `change-id`), note `depends on: none`, and set Increment 1's roadmap status to `scaffolded`.
   - "Start building" → scaffold **Increment 1's** proposal first (so every increment has a proposal of record), then implement its tasks; set Increment 1's status to `in progress`.
   - **Status values** (roadmap Status column): `not created` → `scaffolded` → `in progress` → `archived`.

3. **Trigger later increments with `feature-planner <slug> continue` (Resume Mode).** Once Increment 1 is implemented (`/apply`) and archived (`/archive`), the user advances the roadmap by running `feature-planner <slug> continue`, which scaffolds the next eligible increment's proposal and bumps its Status — see the "Resume Mode" section. They can check progress anytime with `feature-planner <slug> status`. Fill the roadmap file's **Next Increment to Run** block with that row's `change-id` and the copy-paste `continue` trigger line. (Re-running the full interview is only needed if they want fresh codebase analysis for that increment's detailed plan; the `continue` command alone does not re-plan, it only scaffolds the proposal.)

For single-feature plans, ignore this block and use the branches below as-is.

### If Prompter is installed

Check whether `prompter/skills/proposal` exists using Glob.

If it exists, ask. **Omit "Save plan only" for single-proposal features** — it only applies to multi-increment features, where it persists the roadmap without scaffolding the proposal. A single-proposal feature has no folder to save into, so it offers only Create proposal / Start building.

```json
{
  "questions": [
    {
      "question": "How would you like to proceed?",
      "header": "Next Steps",
      "multiSelect": false,
      "options": [
        { "label": "Create proposal", "description": "Scaffold a Prompter change proposal from this plan" },
        { "label": "Start building", "description": "Jump straight into implementation using this plan" },
        { "label": "Save plan only", "description": "Multi-increment only — persist the roadmap for later" }
      ]
    }
  ]
}
```

**If "Create proposal"**: Read `prompter/skills/proposal` and `prompter/AGENTS.md`, then follow their instructions to scaffold a full change proposal. Use the implementation plan as context to derive:
- `change-id` (verb-led, kebab-case)
- `proposal.md` (why, what changes, impact)
- `tasks.md` (from the implementation phases)
- `design.md` (only if needed per Prompter criteria)
- Spec deltas under `specs/[capability]/spec.md`

After scaffolding, run `prompter validate <change-id> --strict --no-interactive` and fix any issues.

**If "Start building"**: Begin implementing the tasks from the plan sequentially. Read the plan as your checklist and complete each task in order.

**If "Save plan only"** (multi-increment only): the roadmap is already persisted per the multi-increment rules above; also write Increment 1's `implementation-plan.md`. This option is not offered for single-proposal features.

### If Prompter is NOT installed

Without Prompter there are no increments and no per-feature folder, so the plan is not saved as a standalone file. The only next step is to build:

**Start building**: Begin implementing the tasks from the plan sequentially. Read the plan (which lives in the conversation) as your checklist and complete each task in order.

---

## Conversation Tips

### Handling Large Features
- Don't dump follow-up work into "Out of scope" — that's the graveyard this skill avoids. Run **Step 3.5** to build a structured Increment Roadmap instead.
- Plan only Increment 1 in detail; the rest live as ordered, named rows on the roadmap with their own `change-id`s.
- Use: "This is a big feature. I'd split it into increments you ship in order — let's build the roadmap, then plan the first one."

### Handling Vague Requests
- Look at the codebase first to infer what the user might mean.
- If still unclear after codebase analysis, ask ONE focused clarifying question.
- Never ask more than 2 clarifying questions before producing a draft plan -- it's easier to iterate on a concrete plan than to keep asking questions.

### Handling Technical Users
- Skip obvious explanations.
- Focus on file paths, patterns, and concrete decisions.
- Be direct about tradeoffs.

### Handling Unfamiliar Codebases
- Spend more time in Step 2 (analysis).
- Read more example files to understand patterns.
- Be explicit about assumptions: "I'm assuming X based on what I see in Y -- correct me if wrong."

---

## Resources

- **Implementation plan template**: [implementation-plan-template.md](assets/implementation-plan-template.md) -- Structured output format for the plan
