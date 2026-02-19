# AOCS — Agent-Oriented Coding Standard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A coding standard optimized for AI agent readability and token efficiency.

**Structured contracts that make your codebase machine-readable — and yes, they save tokens too.**

⚠️ **Early Stage** — AOCS v0.8 is a working proposal seeking real-world adoption and feedback. The ideas are proven; the ecosystem is young. Contributions welcome.

🌐 **Live site:** [aocs.myavs.us](https://aocs.myavs.us)
📦 **Repository:** [github.com/spuddermax/aocs](https://github.com/spuddermax/aocs)

## What is AOCS?

AOCS separates **specification** from **implementation**:

- **Specification layer**: formal `@contract` annotations declaring inputs, outputs, errors, and side effects
- **Implementation layer**: compressed code optimized for token efficiency

Humans read the contracts. Agents read both — but implementation can be dramatically shorter.

## Quick Start

1. Download the base standard and your language files:

| File | Purpose |
|------|---------|
| [`AOCS.md`](docs/standard/AOCS.md) | Base standard (required) |
| [`AOCS-typescript.md`](docs/standard/AOCS-typescript.md) | TypeScript rules |
| [`AOCS-javascript.md`](docs/standard/AOCS-javascript.md) | JavaScript rules |
| [`AOCS-html.md`](docs/standard/AOCS-html.md) | HTML rules |
| [`AOCS-css.md`](docs/standard/AOCS-css.md) | CSS rules |
| [`AOCS-extension-protocol.md`](docs/standard/AOCS-extension-protocol.md) | Bootstrap new languages |

2. Drop them in your project's `docs/` directory.

3. Reference from your `AGENTS.md`:

```markdown
## Coding Standard
Follow the AOCS standard:
- docs/AOCS.md (base conventions)
- docs/AOCS-typescript.md (TypeScript rules)
```

## Key Principles

1. **Contracts over comments** — formal `@contract` annotations replace prose
2. **Compression over verbosity** — terse implementation, readable specs
3. **Enforce boundaries centrally** — module contracts are non-negotiable
4. **Context is scarce** — structured docs, not encyclopedic AGENTS.md
5. **Drift is inevitable** — mechanical enforcement via linters

## Project Structure

```
aocs/
├── docs/
│   ├── standard/          ← downloadable AOCS files
│   │   ├── AOCS.md
│   │   ├── AOCS-typescript.md
│   │   ├── AOCS-javascript.md
│   │   ├── AOCS-html.md
│   │   ├── AOCS-css.md
│   │   └── AOCS-extension-protocol.md
│   └── pages/             ← website content (markdown)
├── site/
│   └── index.html         ← documentation website (built using AOCS)
├── examples/
│   └── payment-processor.ts
├── dev-server.py           ← local dev server
├── DEPLOY.md
└── LICENSE
```

## Local Development

```bash
python3 dev-server.py
```

Visit `http://localhost:8080` — redirects to the site automatically.

## Examples

See [`examples/payment-processor.ts`](examples/payment-processor.ts) for a side-by-side comparison of human-readable vs. agent-optimized code showing **58% token savings** on a single function.

## License

MIT — see [LICENSE](LICENSE).

---

*Built by [spuddermax](https://github.com/spuddermax). The teams that standardize this now will build the conventions everyone else eventually adopts.*
