---
name: cerebro
description: Save and resume cross-agent conversational sessions through the Cerebro MCP server. Use this skill whenever the user wants to preserve session context before switching AI agents (Claude Code → Codex → OpenCode → Cursor → Windsurf, or any combination), is approaching a usage limit and needs to continue elsewhere, says things like "save this for the next agent", "summarize this session", "I'm switching to Codex", "continuing in OpenCode", "pick up where the last agent left off", "resume from yesterday's session", or invokes `/handoff-save` / `/handoff-resume`. Also trigger for first-time setup when the user asks to connect Cerebro to their agents. Trigger this skill even if the user does not name Cerebro explicitly — any cross-agent handoff or session-summary intent qualifies.
---

# Session Handoff via Cerebro MCP

## What this skill is for

Long coding sessions often outlive a single agent's usage budget. The user might start in Claude Code, hit a limit, and switch to Codex or OpenCode — but the new agent has zero context. This skill bridges that gap by writing a structured session summary to Cerebro and pulling it back when a new agent starts.

---

## Step 0 — First-time setup

Before save/recall will work, Cerebro MCP must be installed in the agents the user wants to use. Check whether the cerebro tools are already available (look for `mcp__cerebro__session_create` in Claude Code, or `cerebro.*` tools in other agents).

**If not yet set up**, ask the user which agents they want to install Cerebro into, then show only the relevant instructions from the list below. Don't dump all six agents at once — pick the ones they asked for.

### Claude Code
```bash
claude mcp add --transport http --scope user cerebro http://localhost:3000/api/mcp \
  --header "Authorization: Bearer YOUR_TOKEN"
```
Verify: `claude mcp list` — should show `cerebro  connected`.  
No restart needed.

### OpenCode
Add to `~/.config/opencode/opencode.json`:
```json
{
  "mcp": {
    "cerebro": {
      "type": "remote",
      "url": "http://localhost:3000/api/mcp",
      "headers": { "Authorization": "Bearer YOUR_TOKEN" },
      "enabled": true
    }
  }
}
```
No restart needed — picked up on next `opencode` invocation.

### Codex (OpenAI Codex CLI)
Add to `~/.codex/config.json`:
```json
{
  "mcpServers": {
    "cerebro": {
      "command": "node",
      "args": ["/path/to/cerebro-mcp-server/dist/index.js"],
      "env": {
        "CEREBRO_URL": "http://localhost:3000",
        "CEREBRO_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}
```
The `cerebro-mcp-server` binary lives in the Cerebro repo under `cerebro-mcp-server/`. Build it once with `npm install && npm run build` if `dist/index.js` doesn't exist yet.

### Cursor
Add to `~/.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "cerebro": {
      "command": "node",
      "args": ["/path/to/cerebro-mcp-server/dist/index.js"],
      "env": {
        "CEREBRO_URL": "http://localhost:3000",
        "CEREBRO_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}
```
**Restart Cursor** to pick up the change.

### Windsurf
Add to `~/.codeium/windsurf/mcp_config.json`:
```json
{
  "mcpServers": {
    "cerebro": {
      "command": "node",
      "args": ["/path/to/cerebro-mcp-server/dist/index.js"],
      "env": {
        "CEREBRO_URL": "http://localhost:3000",
        "CEREBRO_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}
```
**Restart Windsurf** to pick up the change.

### Claude Desktop
- macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
- Windows: `%APPDATA%\Claude\claude_desktop_config.json`
```json
{
  "mcpServers": {
    "cerebro": {
      "command": "node",
      "args": ["/path/to/cerebro-mcp-server/dist/index.js"],
      "env": {
        "CEREBRO_URL": "http://localhost:3000",
        "CEREBRO_TOKEN": "YOUR_TOKEN"
      }
    }
  }
}
```
**Restart Claude Desktop** to pick up the change.

### Getting a token
Generate one at `http://localhost:3000` → **Settings → Agent Tokens**. One token can be reused across all agents.

---

## Two operations

| Trigger | Action |
|---|---|
| `/handoff-save`, "save this session", "I'm switching to Codex", "summarize this for the next agent" | **Save**: write a structured summary to Cerebro |
| `/handoff-resume`, "resume the last session", "pick up where I left off", "what was Claude working on" | **Recall**: fetch the most recent handoff and load it into context |

---

## Saving a handoff

1. **Build the structured summary** from the conversation so far:

   ```yaml
   goal: <one or two sentences — what is the user ultimately trying to achieve?>
   status: <where things stand right now>
   decisions:
     - <each non-obvious choice, with the reason>
   files_touched:
     - path: <relative path>
       change: <what was modified, added, or deleted>
   open_questions:
     - <anything unresolved or uncertain>
   next_steps:
     - <concrete items the next agent should pick up first>
   gotchas: <optional — subtle constraints the next agent must not miss>
   ```

   Be honest: if a change wasn't applied, don't list it. If a decision was tentative, say so.

2. **Pick a project slug** — use the current working directory's folder name. Confirm only if the cwd looks generic (home dir, `/tmp`).

3. **Resolve the project ID** via `mcp__cerebro__project_list`. If no project matches the slug, show the existing projects and ask the user whether to pick one or create a new one. If they want a new project, call `mcp__cerebro__project_create` with the slug as the name — no need to open the browser. Never silently fall back to a different project.

4. **Call `session_create`**:
   - `project`: the slug or ID
   - `summary`: the YAML from step 1
   - `sourceAgent`: current agent name (`claude-code`, `codex`, `opencode`, `cursor`, `windsurf`)
   - `tags`: `["session-handoff", "<source-agent-name>"]`
   - `metadata`: `{"cwd": "<current working directory>"}`

5. **Confirm** the session ID to the user. Tell them:
   - They can verify it in the Cerebro dashboard (the ID is shown on each session card).
   - In any agent, they can load it instantly by just providing the ID: `"load session <id>"` → `session_get({ sessionId: "<id>" })` — no project needed.

---

## Resuming a handoff

0. **If the user gives you a session ID directly** (e.g. "resume session k97abc123"), call `mcp__cerebro__session_get({ sessionId: "<id>" })` immediately — skip steps 1–3.
1. Otherwise, determine the project slug (cwd folder name, or ask).
2. Resolve to a project ID via `project_list` if needed.
3. Call `session_search` with query `"session-handoff"`. Filter results to those with `session-handoff` in their tags, sort by `createdAt` descending, take the newest.
4. Re-state goal and status in one or two sentences and ask if the user wants to start with the first next-step. Don't dump the whole YAML — they want continuity, not a recap wall.
5. If multiple handoffs match, list them briefly (date + agent + one-line goal) and ask which to resume.
6. If nothing matches, say so and offer to search by keyword.

---

## Why structured YAML

Named fields let any agent parse the handoff reliably without re-reading a wall of prose. The next agent has no shared memory of the prior conversation — only this summary. If a field doesn't apply, write `none` or omit it.

## Related: curated project knowledge

This skill handles **session handoffs** — saving/resuming where an agent left off. For curated,
compounding project *knowledge* (ingesting sources into a project's memory, building an
interlinked wiki, filing answers back), use the **`cerebro-wiki`** skill instead. The two are
complementary: sessions created here also serve as the wiki's chronological log (`session_create`
records each ingest on the project timeline).

## Reference

`references/agents.md` — per-agent config file paths, transport types, and restart requirements.
