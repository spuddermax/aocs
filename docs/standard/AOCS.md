# Agent-Oriented Coding Standard (AOCS)

**Version 0.7** · [aocs.dev](https://github.com/spuddermax/aocs) · MIT License

*A coding standard optimized for AI agent readability, token efficiency, and mechanical enforcement.*

---

## How to Use This File

Drop this file into your project's `docs/` directory. Then add the language-specific AOCS files for your stack:

- `AOCS-typescript.md`
- `AOCS-javascript.md`
- `AOCS-html.md`
- `AOCS-css.md`

Reference them from your `AGENTS.md` or equivalent:

```
## Coding Standard
Follow the AOCS standard defined in:
- docs/AOCS.md (base conventions)
- docs/AOCS-typescript.md (TypeScript rules)
```

Do **not** paste the full standard into your AGENTS.md. Context is a scarce resource — point to the files, and let agents load what they need.

---

## Part I: Core Philosophy

### The Problem

Human-readable code optimizes for scanning, narrative flow, and gradual comprehension. AI agents parse structurally, hold thousands of lines in context simultaneously, and reason about intent through pattern-matching across entire codebases. Traditional readability conventions — verbose variable names, explanatory comments, whitespace scaffolding — impose token costs without providing information agents can't already infer.

As AI agents write more code, codebases become agent working memory. Every unnecessary token is real cost and real latency.

### The Solution

**Agent-Oriented Code** separates specification from implementation:

- **Specification layer**: formal contracts, manifests, and invariants in machine-parseable annotations
- **Implementation layer**: compressed, semantically dense code optimized for brevity

Humans read specifications. Agents read both, but the implementation can be orders of magnitude more concise.

### Core Principles

**P1. Contracts over comments**
Replace prose docstrings with formal `@contract` annotations that declare inputs, outputs, preconditions, postconditions, and side effects in structured notation.

**P2. Compression over verbosity**
Favor terse expressions, single-letter loop variables, and abbreviated names — but only in implementation. Specifications remain human-legible.

**P3. Enforce boundaries centrally, allow autonomy locally**
Module contracts, data shapes, and architectural boundaries are non-negotiable and mechanically enforced. Within those boundaries, agents have full discretion over implementation style.

**P4. Context is a scarce resource**
Repository knowledge lives in a structured `docs/` directory treated as the system of record. `AGENTS.md` is a table of contents, not an encyclopedia. The standard itself should be referenced, not dumped wholesale into context.

**P5. Drift is inevitable; enforcement is continuous**
Agents replicate existing patterns, including bad ones. Mechanical enforcement (linters, structural tests) and periodic garbage collection prevent technical debt from compounding.

### Measured Impact

| Metric | Savings |
|--------|---------|
| Generation tokens (agent writing code) | 25-40% |
| Context tokens (agent reading codebase) | 50-70% |
| Reasoning tokens (agent thinking) | 20-35% |
| **Overall** | **30-50%** |

---

## Part II: Universal Conventions

These conventions apply to **all languages**. Language-specific files extend these with idioms and examples.

### U1. Module Manifests

Every module/file begins with an `@module` declaration:

```
// @module: <name>
// @exports: <type1>, <type2>, <function1>
// @depends: <module1>, <module2>
// @mutates: <global-state-if-any> | none
```

Agents loading a large codebase can orient themselves by reading manifests alone, without parsing implementations.

### U2. Function Contracts

Every public function declares its contract:

```
// @contract: (param1:Type1, param2:Type2) -> ReturnType | constraints
// @throws: ErrorType1 | ErrorType2 | never
// @pure: true | false
// @complexity: O(n log n) time, O(n) space
```

Constraints describe preconditions, postconditions, or domain restrictions (e.g., `param1 > 0`, `length(result) == length(input)`).

### U3. State Manifests

Modules managing state declare the shape explicitly:

```
// @state-manifest: {
//   field1: Type1,  // description
//   field2: Type2,  // description
// }
```

Agents can verify state access patterns without reading every assignment.

### U4. Naming Conventions

| Layer | Style | Example |
|-------|-------|---------|
| Specification (contracts, manifests) | Human-readable | `calculateOrderTotal`, `activeUsers` |
| Implementation | Terse abbreviations | `cot`, `au`, single-letter loop vars |
| Public APIs | Human-readable | Always — these are the specification layer |
| Tests | Human-readable | Always — tests serve as documentation |

### U5. Comments

- **Contract annotations**: mandatory for all public interfaces
- **Why-comments**: rare, only for non-obvious decisions
- **What-comments**: forbidden — code is self-documenting via contracts
- **`@aocs-todo`**: marks uncertain patterns for later review

### U6. Error Handling

Typed errors in contracts enable static reasoning about failure paths:

```
// @throws: EmptyOrderError | PaymentDeclinedError
```

Agents can construct comprehensive error-handling without executing code.

### U7. Enforcement

Teams should implement linters/CI checks that:

- Require `@module`, `@contract`, and `@state-manifest` annotations on public interfaces
- Scan for `@aocs-todo` tags left by uncertain agents
- Enforce file size limits to prevent monoliths
- Include AOCS section references in lint error messages so agents can self-correct

### U8. Repository Contract (aocs.json)

Every AOCS-compliant repo includes an `aocs.json` at root — a machine-parseable contract agents can load without reading prose:

```json
{
  "aocsVersion": "0.7",
  "languages": ["typescript"],
  "modulePattern": "agent-module",
  "stateOwnership": "local-only",
  "sideEffects": "explicit",
  "namingSchema": "verbNoun",
  "allowedPatterns": ["fsm", "pure-functions"],
  "forbiddenPatterns": ["implicit-global", "dynamic-eval"],
  "mode": "strict"
}
```

This eliminates the need for agents to infer rules from prose. System prompts can simply say "Follow AOCS v0.7; see aocs.json for constraints." The contract enables agent pre-flight validation before code edits.

Agents load `aocs.json` first, verify compatibility, then proceed with mechanical enforcement of declared constraints. No interpretation required.

### U9. Semantic File Roles

Every file declares its role in the first 5 lines:

```
// AOCS-ROLE: state-machine
// AOCS-INPUTS: events
// AOCS-OUTPUTS: state
```

Allowed roles (finite, enumerable):

- `pure-logic` — referentially transparent computation
- `state-machine` — state transitions, the ONLY files that may mutate state
- `adapter` — external system integration
- `ui-binding` — presentation layer
- `io-boundary` — file system, network, database
- `config` — configuration and constants

**Why:** Agents immediately narrow reasoning scope, prevents cross-concern edits, enables role-specific generation templates. Drastically reduces hallucinated side effects.

When editing a `pure-logic` file, agents know mutations are forbidden. When editing a `state-machine` file, agents know this is the only place state can change. Role declarations partition the solution space.

### U10. Structured Comment Hints

Replace prose comments with machine-parseable hints:

```ts
// AOCS-INVARIANT: output.stateId === input.stateId
// AOCS-FAILS-ON: invalidEvent
// AOCS-PURE: true
// AOCS-COMPLEXITY: O(n)
```

These complement `@contract` annotations. Comments become constraints, not narratives. Agents reason mechanically instead of linguistically.

**Examples:**

```ts
// AOCS-INVARIANT: result.length === input.length
// AOCS-FAILS-ON: null, undefined, empty array
// AOCS-PURE: true
function mapItems<T,U>(input: T[], fn: (x:T)=>U): U[] {
  return input.map(fn);
}
```

Hints are structured data. Agents parse them as facts, not suggestions.

### U11. Edit-Locality Guarantees

**Rule:** A change to one concern must modify no more than one role category.

- Logic change → `pure-logic` files only
- State change → `state-machine` files only
- UI change → `ui-binding` files only

Keeps diffs small, prevents cross-file reasoning explosions, enables high-confidence patch generation.

Agents can validate edit-locality mechanically: "This change modifies both a `pure-logic` file and a `state-machine` file — violation of U11." The architectural constraint becomes a compile-time check.

### U12. Forbidden Ambiguity List

Explicitly list patterns agents must never generate:

- Dynamic imports
- Runtime type mutation
- Implicit fallthrough
- Reflection / metaprogramming
- Magic strings
- Optional parameters in public APIs (use explicit overloads or separate functions)
- Implicit global state access

Hard constraints reduce hallucination space and make agent output safer by default.

Include this list in `aocs.json` under `forbiddenPatterns`. Agents check before generating code. If a pattern appears in the forbidden list, generation halts with an error.

### U13. Agent-First README

Every AOCS repo includes a `README.agent.md` (≤200 tokens) that can be injected verbatim into system prompts:

```markdown
This repo follows AOCS v0.7.
- No implicit state
- All state changes in *.state.ts files
- Pure functions only elsewhere  
- Follow aocs.json for constraints
- File roles declared via AOCS-ROLE
- See docs/AOCS.md for full standard
```

The agent README is a compressed context bootstrap. System prompts load it once, and agents have the core rules without parsing the full standard.

Treat `README.agent.md` as the TL;DR for machines. Keep it under 200 tokens. Update it whenever core constraints change.

---

## Part III: Language Extension Protocol

To add AOCS support for a language not already covered, use the **Extension Protocol**:

📄 **[AOCS-extension-protocol.md](./AOCS-extension-protocol.md)**

This standalone file contains the complete blueprint for creating a new `AOCS-{language}.md` file, including:

1. **Map universal conventions** (U1-U7) to the language's native idioms
2. **Define compression idioms** specific to the language
3. **Specify exceptions** (what stays human-readable)
4. **Provide examples** with token counts and savings percentages
5. **Write a quick reference** block
6. **Validate** the resulting file

The protocol includes a worked Python example showing the complete output.

Drop `AOCS-extension-protocol.md` into your project alongside this file so agents can bootstrap new language definitions autonomously.

---

## Quick Reference

```
CONTRACTS:    @contract, @throws, @pure, @complexity
MODULES:      @module, @exports, @depends, @mutates
STATE:        @state-manifest
ENFORCEMENT:  @aocs-todo (uncertainty marker)
REPOSITORY:   aocs.json (machine contract), README.agent.md (≤200 tokens)
FILE ROLES:   AOCS-ROLE (pure-logic, state-machine, adapter, ui-binding, io-boundary, config)
HINTS:        AOCS-INVARIANT, AOCS-FAILS-ON, AOCS-PURE, AOCS-COMPLEXITY
EDIT-LOCALITY: One concern → one role category per diff
FORBIDDEN:    Dynamic imports, runtime type mutation, magic strings, implicit globals

NAMING:       Specs = readable, Impl = terse, APIs/Tests = always readable
COMMENTS:     Contracts = required, Why = rare, What = never
ERRORS:       Typed in contracts, agents reason about failure paths statically
```

### File Structure

```
your-project/
├── AGENTS.md                      ← references docs/AOCS*.md
├── docs/
│   ├── AOCS.md                    ← this file (base standard)
│   ├── AOCS-extension-protocol.md ← how to add new languages
│   ├── AOCS-typescript.md         ← language-specific
│   ├── AOCS-javascript.md
│   ├── AOCS-html.md
│   └── AOCS-css.md
└── src/
```

---

## Version History

- **v0.7** — Added repository contracts (aocs.json), semantic file roles, structured hints, edit-locality, forbidden patterns, agent-first README
- **v0.6** — Integrated OpenAI Harness Engineering principles; restructured as distributable files
- **v0.5** — Restructured: Philosophy → Conventions → Extension Protocol → Language Definitions
- **v0.4** — Added Language Extension Protocol
- **v0.3** — Generalized HTML/CSS/JS sections
- **v0.2** — Added HTML/CSS/JavaScript sections
- **v0.1** — Initial TypeScript-focused standard

---

*The teams that standardize this now will build the conventions everyone else eventually adopts.*
