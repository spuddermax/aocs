# AOCS — Agent-Oriented Coding Standard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Structured contracts that make your codebase machine-readable for AI agents.

⚠️ **Early Stage** — AOCS v0.8 is a working proposal seeking real-world adoption and feedback. The ideas are proven; the ecosystem is young. Contributions welcome.

🌐 **Live site:** [aocs.myavs.us](https://aocs.myavs.us)
📦 **Repository:** [github.com/spuddermax/aocs](https://github.com/spuddermax/aocs)

## What is AOCS?

Agents fail because they guess — about state ownership, what a file does, what's allowed. AOCS eliminates guessing with machine-readable metadata:

- **File roles** (`AOCS-ROLE`) — every file declares its purpose
- **Function contracts** (`@contract`) — inputs, outputs, errors, side effects
- **Structured hints** (`AOCS-INVARIANT`, `AOCS-FAILS-ON`) — constraints, not comments
- **Repository contracts** (`aocs.json`) — project-wide rules agents parse instantly
- **Forbidden patterns** — explicit "never generate this" lists

The result: agents reason against explicit contracts instead of inferring intent from code.

## Quick Start

**Core files (required):**

| File | Purpose |
|------|---------|
| [`AOCS.md`](docs/standard/AOCS.md) | Base standard |
| [`aocs-schema.json`](docs/standard/aocs-schema.json) | JSON schema for aocs.json |
| [`README.agent.md`](docs/standard/README.agent.md) | Agent-first README template |

**Language extensions (pick yours):**

| File | Purpose |
|------|---------|
| [`AOCS-typescript.md`](docs/standard/AOCS-typescript.md) | TypeScript |
| [`AOCS-javascript.md`](docs/standard/AOCS-javascript.md) | JavaScript |
| [`AOCS-python.md`](docs/standard/AOCS-python.md) | Python |
| [`AOCS-go.md`](docs/standard/AOCS-go.md) | Go |
| [`AOCS-rust.md`](docs/standard/AOCS-rust.md) | Rust |
| [`AOCS-html.md`](docs/standard/AOCS-html.md) | HTML |
| [`AOCS-css.md`](docs/standard/AOCS-css.md) | CSS |
| [`AOCS-extension-protocol.md`](docs/standard/AOCS-extension-protocol.md) | Bootstrap new languages |

1. Drop them in your project's `docs/` directory.
2. Create `aocs.json` at repo root (or run `npx aocs init`).
3. Reference from your `AGENTS.md`:

```markdown
## Coding Standard
Follow the AOCS standard:
- docs/AOCS.md (base conventions)
- docs/AOCS-typescript.md (TypeScript rules)
```

## CLI Validator

```bash
npx aocs validate        # lint your project against AOCS
npx aocs init            # scaffold aocs.json + README.agent.md
```

Zero dependencies. Pluggable language modules. Checks file roles, contracts, hints, forbidden patterns, and schema validity.

## Key Principles

1. **Contracts over comments** — formal `@contract` annotations replace prose
2. **Compression is optional** — concise implementation where appropriate, never at the cost of debuggability
3. **Enforce boundaries centrally** — module contracts are non-negotiable
4. **Context is scarce** — structured docs, not encyclopedic AGENTS.md
5. **Drift is inevitable** — mechanical enforcement via `aocs validate`

## Project Structure

```
aocs/
├── aocs.json                ← repo contract (self-compliant)
├── README.agent.md          ← agent-first README
├── cli/                     ← aocs validate CLI
│   ├── bin/aocs.js
│   └── src/
├── docs/
│   ├── standard/            ← downloadable AOCS files
│   │   ├── AOCS.md
│   │   ├── aocs-schema.json
│   │   ├── README.agent.md
│   │   ├── AOCS-typescript.md
│   │   ├── AOCS-javascript.md
│   │   ├── AOCS-python.md
│   │   ├── AOCS-go.md
│   │   ├── AOCS-rust.md
│   │   ├── AOCS-html.md
│   │   ├── AOCS-css.md
│   │   └── AOCS-extension-protocol.md
│   └── pages/               ← website content (markdown)
├── site/
│   └── index.html           ← documentation website (built using AOCS)
├── examples/
│   └── payment-processor.ts
├── dev-server.py            ← local dev server
└── LICENSE
```

## Local Development

```bash
python3 dev-server.py
```

Visit `http://localhost:8080` — redirects to the site automatically.

## Stable API

Agents can fetch AOCS files at predictable URLs:

```
GET https://aocs.myavs.us/manifest.json          # file index + version history
GET https://aocs.myavs.us/raw/latest/AOCS.md     # always-current
GET https://aocs.myavs.us/raw/v0.8/AOCS.md       # version-pinned
```

## License

MIT — see [LICENSE](LICENSE).

---

*Built by [spuddermax](https://github.com/spuddermax). The teams that standardize this now will build the conventions everyone else eventually adopts.*
