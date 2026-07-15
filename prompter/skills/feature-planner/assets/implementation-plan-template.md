# Implementation Plan: [Feature Name]

> **Multi-increment features only.** This file is written just for the current increment; it is regenerated each increment. Run-order state lives in `roadmap.md` (the Status column), which is what `feature-planner <slug> status|continue` reads.
>
> Single-proposal features do not produce this file — their plan feeds directly into a Prompter proposal or into implementation, and they are resumed through Prompter's own tooling.

## Feature Overview
[1-2 sentence summary of what is being built and why]

---

## Scope

### In Scope
- [ ] [Change 1]
- [ ] [Change 2]
- [ ] [Change 3]

### Out of Scope
- [Deferred item 1] -- [reason]
- [Deferred item 2] -- [reason]

---

## Increment Roadmap
> Save this section + "Next Increment to Run" to a durable file `prompter/features/{feature}/roadmap.md` — the run-order tracker. Everything below "Codebase Analysis" is the detailed plan for the **current increment only** and lives in the transient `prompter/features/{feature}/implementation-plan.md`.
> The **Status** column is a cache: `/apply` and `/archive` don't write to it. Resume Mode (`feature-planner <slug> status|continue`) derives real status from Prompter's `changes/<change-id>/` (scaffolded/in progress) and `changes/archive/*<change-id>*/` (archived) dirs each run and rewrites this column to match.
> Each increment below becomes **one** Prompter proposal (`change-id`), run in dependency order. The Database/Backend/Frontend/Tests **phases** under "Implementation Tasks" live *inside* one increment — they are not separate proposals.

| Increment | Scope | Proposed `change-id` | Depends on | Status |
|-----------|-------|----------------------|-----------|--------|
| 1 | [Foundational slice] | `add-...` | — | not created / scaffolded / in progress / archived |
| 2 | [Slice] | `add-...` | Increment 1 | not created |
| 3 | [Slice] | `add-...` | Increment 2 | not created |

> The "Implementation Tasks" section below details **Increment 1 only**. Plan each later increment when its dependencies are merged.

### Next Increment to Run
> Multi-increment features only. This plan details and builds **Increment 1**; trigger each later increment yourself once its dependencies have merged — grounding it on the real, merged codebase instead of a stale guess.

**Next up:** [`add-...` — Increment N (Scope)]  ← the first roadmap row with status `not created` whose dependencies are met.

Advance the roadmap by running Resume Mode (it scaffolds the next increment's proposal and bumps its Status):

```
feature-planner {feature} continue
```

Check progress anytime with `feature-planner {feature} status`.

> `continue` scaffolds the proposal and hands off — implement it with `/apply <change-id>`, then `/archive` when done. It does not re-plan; re-run the full interview only if you want fresh codebase analysis for an increment's detailed plan.

After that increment is implemented and archived, run `continue` again for the next row.

---

## Codebase Analysis

### Tech Stack Detected
| Layer | Technology |
|-------|-----------|
| Frontend | [e.g., Next.js, React] |
| Backend | [e.g., Laravel, Express] |
| Database | [e.g., PostgreSQL, MySQL] |
| Other | [e.g., Redis, Docker] |

### Affected Files & Modules
| File / Module | Change Type | Description |
|---------------|-------------|-------------|
| [path/to/file] | New / Modify / Delete | [What changes] |

### Existing Patterns to Follow
- [Pattern 1 observed in codebase -- e.g., "Controllers use single-action pattern"]
- [Pattern 2 -- e.g., "All API responses use ApiResource wrapper"]
- [Pattern 3 -- e.g., "Tests use factories with specific naming convention"]

---

## Data Model Changes
> Skip this section if no database changes are needed.

### New Tables / Collections
- **[table_name]**: [key columns/fields]

### Modified Tables / Collections
- **[table_name]**: Add [column] ([type]) -- [reason]

### New Relationships
- [Entity A] has many [Entity B]

---

## Implementation Tasks

### Phase 1: [Foundation / Database / Setup]
- [ ] 1.1 [Task description] -- `path/to/file`
- [ ] 1.2 [Task description] -- `path/to/file`

### Phase 2: [Core Logic / Backend]
- [ ] 2.1 [Task description] -- `path/to/file`
- [ ] 2.2 [Task description] -- `path/to/file`

### Phase 3: [Frontend / UI]
- [ ] 3.1 [Task description] -- `path/to/file`
- [ ] 3.2 [Task description] -- `path/to/file`

### Phase 4: [Tests / Validation]
- [ ] 4.1 [Task description] -- `path/to/file`
- [ ] 4.2 [Task description] -- `path/to/file`

---

## Dependencies & Risks
| Risk | Impact | Mitigation |
|------|--------|------------|
| [Risk 1] | [High/Med/Low] | [How to handle] |

---

## Notes
- [Any additional context, edge cases, or decisions made during planning]
