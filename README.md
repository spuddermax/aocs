# AOCS - Agent-Oriented Coding Standard

A coding standard optimized for AI agent readability and token efficiency.

**Token savings: 25-40% overall | 40-60% context reduction**

## Quick Start

### Local Development
```bash
./dev-server.sh
```
Then visit: `http://localhost:8080/aocs`

### Read the Standard
See [`docs/AOCS.md`](docs/AOCS.md)

## Environments
- **Local:** http://aocs.lan:8080/aocs (requires DNS setup, see DEPLOY.md)
- **Production:** https://myavs.us/aocs

## Structure
- `/docs` - AOCS markdown standard (v0.6)
- `/site` - Website source (HTML/CSS/JS) — built using AOCS principles
- `/examples` - Code examples (TODO)

## Key Principles
1. **Contracts over comments** — formal `@contract` annotations replace prose
2. **Compression over verbosity** — terse implementation, readable specs
3. **Enforce boundaries centrally** — module contracts non-negotiable, implementation flexible
4. **Context is scarce** — structured docs, not encyclopedic AGENTS.md
5. **Drift is inevitable** — mechanical enforcement via linters

## Deployment
See [`DEPLOY.md`](DEPLOY.md) for production deployment instructions.
