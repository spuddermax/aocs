# AOCS Validator

Official linter and validator for the [Agent-Oriented Coding Standard](https://github.com/spuddermax/aocs) (AOCS v0.7).

## Installation

```bash
npm install -g aocs
```

Or use locally without installing:

```bash
npx aocs validate
```

## Usage

### Validate a project

```bash
# Validate current directory
aocs validate

# Validate a specific path
aocs validate /path/to/project
```

### Initialize AOCS in a new project

```bash
aocs init
```

This creates:
- `aocs.json` — repository contract
- `README.agent.md` — agent context file

### Check version

```bash
aocs --version
```

### Get help

```bash
aocs --help
```

## What it checks

### Universal checks (all languages)

- **U8**: Repository contract (`aocs.json`) exists and is valid
- **U13**: Agent README exists and is ≤200 tokens
- **U9**: File roles declared (`AOCS-ROLE`) in first 5 lines
- **U2**: Function contracts (`@contract`) on public functions
- **U10**: Structured hints well-formed (`AOCS-INVARIANT`, `AOCS-FAILS-ON`, etc.)
- **U12**: Forbidden patterns not present (from `aocs.json`)
- **U1**: Module manifests (`@module`, `@exports`, `@depends`)

### Language-specific checks

#### JavaScript/TypeScript
- State manifests for state-machine files

#### HTML
- Interactive elements have `id` or `data-action`

#### CSS
- Design tokens defined in `:root`

## Exit codes

- `0` — All checks passed
- `1` — One or more checks failed

## Example output

```
✅ PASS: Repository contract (aocs.json) exists and valid
✅ PASS: File roles declared (AOCS-ROLE)
❌ FAIL: Function contracts (@contract)
  src/utils.js:12 — Exported function missing @contract annotation
⚠️  WARN: Structured hints well-formed
  src/math.js:5 — AOCS-PURE hint is malformed or empty

Summary: 2 passed, 1 failed, 1 warnings
```

## Requirements

- Node.js ≥18
- Zero external dependencies (uses only Node.js built-ins)

## License

MIT
