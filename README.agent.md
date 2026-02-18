# Agent Context — AOCS

This repo follows AOCS v0.8. See `aocs.json` for machine-readable constraints.

## Rules
- No implicit state mutation
- State managed via `st` object in site/index.html only
- File roles declared via AOCS-ROLE in first 5 lines
- Function names follow verbNoun grammar
- No dynamic imports, reflection, magic strings, or implicit globals
- Contracts (@contract) on all public functions

## Key Files
- `aocs.json` — repository contract (load first)
- `docs/standard/AOCS.md` — the standard itself
- `docs/standard/AOCS-{language}.md` — language-specific rules
- `site/index.html` — documentation website (single-file SPA)

## Edit Rules
- One concern per change, one role category per diff
- All CSS uses design tokens (--c-*, --sp-*, --r, --m)
- HTML: class=styling, data-action=JS, data-state=state
- Validate against AOCS-INVARIANT comments before committing
