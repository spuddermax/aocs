# Agent Context — [Project Name]

This repo follows AOCS v0.7. See `aocs.json` for machine-readable constraints.

## Rules
- No implicit state mutation
- State changes only in `*.state.*` files (role: `state-machine`)
- All other files must be referentially transparent
- File roles declared via `AOCS-ROLE` in first 5 lines
- Function names follow `verbNoun` grammar
- No dynamic imports, reflection, magic strings, or implicit globals

## Key Files
- `aocs.json` — repository contract (load first)
- `docs/AOCS.md` — full standard
- `docs/AOCS-{language}.md` — language-specific rules

## Edit Rules
- One concern per change, one role category per diff
- Validate against `AOCS-INVARIANT` comments before committing
- Check `AOCS-FAILS-ON` hints for error paths
