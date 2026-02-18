# Agent-Oriented Coding Standard (AOCS)

**Version 0.6** · [aocs.dev](https://github.com/spuddermax/aocs) · MIT License

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
| Generation tokens (agent writing code) | 20-35% |
| Context tokens (agent reading codebase) | 40-60% |
| Reasoning tokens (agent thinking) | 15-25% |
| **Overall** | **25-40%** |

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

---

## Part III: Language Extension Protocol

To add a new language to AOCS, follow this bootstrap algorithm.

### Step 1: Map Core Concepts

For each universal convention (U1-U7), identify the language's native idiom:

| Concept | Check if language has... | Fallback |
|---------|--------------------------|----------|
| Contracts | Type system, decorators, assertions | Structured comments |
| Modules | Native module system | File-level comment headers |
| State | Class/struct fields, closure scope | Comment manifest |
| Errors | Typed exceptions or Result types | Enum or comment declaration |
| Naming | Conventional short names (i, x, acc) | Abbreviate common terms |

### Step 2: Define Compression Idioms

Identify language-specific patterns for brevity:

- Ternary operators, arrow functions, comprehensions
- Operator overloading, pipeline operators
- Native functional methods (map/reduce/filter equivalents)

### Step 3: Specify Exceptions

What stays human-readable regardless of compression:

- Public API signatures and exports
- Test descriptions and assertions
- Error messages
- Git commit messages and PR descriptions

### Step 4: Provide Examples

For each example, show:

1. Human-optimized version with token count
2. Agent-optimized version with token count
3. Percentage savings

### Step 5: Validate

Before adopting a language extension, verify:

- [ ] All seven universal conventions (U1-U7) mapped
- [ ] Compression idioms preserve correctness
- [ ] Exceptions clearly documented
- [ ] Examples demonstrate measurable token savings
- [ ] File follows the `AOCS-{language}.md` naming convention

---

## Quick Reference

```
CONTRACTS:    @contract, @throws, @pure, @complexity
MODULES:      @module, @exports, @depends, @mutates
STATE:        @state-manifest
ENFORCEMENT:  @aocs-todo (uncertainty marker)

NAMING:       Specs = readable, Impl = terse, APIs/Tests = always readable
COMMENTS:     Contracts = required, Why = rare, What = never
ERRORS:       Typed in contracts, agents reason about failure paths statically
```

### File Structure

```
your-project/
├── AGENTS.md              ← references docs/AOCS*.md
├── docs/
│   ├── AOCS.md            ← this file (base standard)
│   ├── AOCS-typescript.md ← language-specific
│   ├── AOCS-javascript.md
│   ├── AOCS-html.md
│   └── AOCS-css.md
└── src/
```

---

## Version History

- **v0.6** — Integrated OpenAI Harness Engineering principles; restructured as distributable files
- **v0.5** — Restructured: Philosophy → Conventions → Extension Protocol → Language Definitions
- **v0.4** — Added Language Extension Protocol
- **v0.3** — Generalized HTML/CSS/JS sections
- **v0.2** — Added HTML/CSS/JavaScript sections
- **v0.1** — Initial TypeScript-focused standard

---

*The teams that standardize this now will build the conventions everyone else eventually adopts.*
