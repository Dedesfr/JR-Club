# Per-Agent MCP Configuration Reference

## Token

Generate a token at your Cerebro instance → **Settings → Agent Tokens**. Enter a name (e.g. "My Computer"), click **Issue token**, and copy it immediately — it won't be shown again.

Tokens are **user-scoped**: one token grants read+write access to all projects, including ones created later.

---

## Per-agent details

### Claude Code

- **Transport**: HTTP (no binary needed)
- **Config**: `claude mcp add` CLI (preferred), or add to `~/.claude/settings.json`
- **Restart needed?** No

```bash
claude mcp add --transport http --scope user cerebro \
  http://localhost:3000/api/mcp \
  --header "Authorization: Bearer YOUR_TOKEN"
```

Verify: `claude mcp list` — expect `cerebro  connected`.

---

### OpenCode

- **Transport**: remote HTTP (no binary needed)
- **Config**: `~/.config/opencode/opencode.json` or project-root `opencode.json`
- **Restart needed?** No

```jsonc
{
  "$schema": "https://opencode.ai/config.json",
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

Verify: `opencode mcp list`

---

### Cursor

- **Transport**: stdio (requires built binary)
- **Config**: `~/.cursor/mcp.json`
- **Restart needed?** **Yes** — full Cursor restart

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

---

### VS Code (GitHub Copilot / Copilot Chat)

- **Transport**: stdio (requires built binary)
- **Requires**: VS Code 1.99+ with Copilot extension
- **Config**: `.vscode/mcp.json` (workspace) or user MCP config via Command Palette → **MCP: Open User Configuration**
- **Restart needed?** Yes

```json
{
  "servers": {
    "cerebro": {
      "type": "stdio",
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

---

### Windsurf

- **Transport**: stdio (requires built binary)
- **Config**: `~/.codeium/windsurf/mcp_config.json`
- **Restart needed?** **Yes** — full Windsurf restart

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

---

### Claude Desktop

- **Transport**: stdio (requires built binary)
- **Config**:
  - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
  - Windows: `%APPDATA%\Claude\claude_desktop_config.json`
- **Restart needed?** **Yes**

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

---

### Codex CLI

- **Transport**: stdio (requires built binary)
- **Config**: `~/.codex/config.json`
- **Restart needed?** No

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

---

## Building the stdio binary

Required for all stdio-transport agents (Cursor, VS Code, Windsurf, Claude Desktop, Codex CLI):

```bash
cd /path/to/cerebro-mcp-server
npm install && npm run build
# produces dist/index.js — use its absolute path in configs above
```

---

## Available tools

| Tool | What it does |
|---|---|
| `project_list` | List all projects (name, slug, ID) |
| `project_create` | Create a new project |
| `memory_create` | Create a memory in a project |
| `memory_get` | Fetch a memory by ID only — no project needed |
| `memory_update` | Update an existing memory |
| `memory_delete` | Delete a memory permanently |
| `memory_list` | List all memories in a project |
| `memory_search` | Full-text search across a project's memories |

---

## Verifying after install

In Claude Code:
```bash
claude mcp list
```
Expect `cerebro` with status `connected`.

In OpenCode:
```bash
opencode mcp list
opencode mcp debug cerebro
```

In stdio-transport agents (Cursor, VS Code, Windsurf, Claude Desktop), check the tool list (hammer icon) for the 8 tools above after restarting.
