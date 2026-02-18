# Part I: Core Philosophy

## The Problem

Human-readable code optimizes for scanning, narrative flow, and gradual comprehension. AI agents parse structurally, hold thousands of lines in context simultaneously, and reason about intent through pattern-matching across entire codebases. Traditional readability conventions—verbose variable names, explanatory comments, whitespace scaffolding—impose token costs without providing information agents can't already infer.

As AI agents write more code, codebases become agent working memory. Every unnecessary token is real cost and real latency.

## The Solution

**Agent-Oriented Code** separates specification from implementation:
- **Specification layer**: formal contracts, manifests, and invariants in machine-parseable annotations
- **Implementation layer**: compressed, semantically dense code optimized for brevity

Humans read specifications. Agents read both, but the implementation can be orders of magnitude more concise.

## Core Principles

**P1. Contracts over comments**  
Replace prose docstrings with formal `@contract` annotations that declare inputs, outputs, preconditions, postconditions, and side effects in structured notation.

**P2. Compression over verbosity**  
Favor terse expressions, single-letter loop variables, and abbreviated names—but only in implementation. Specifications remain human-legible.

**P3. Enforce boundaries centrally, allow autonomy locally**  
Module contracts, data shapes, and architectural boundaries are non-negotiable and mechanically enforced. Within those boundaries, agents have full discretion over implementation style.

**P4. Context is a scarce resource**  
Repository knowledge lives in a structured `docs/` directory treated as the system of record. `AGENTS.md` is a table of contents, not an encyclopedia. The standard itself should be referenced, not dumped wholesale into context.

**P5. Drift is inevitable; enforcement is continuous**  
Agents replicate existing patterns, including bad ones. Mechanical enforcement (linters, structural tests) and periodic garbage collection prevent technical debt from compounding.

## Measured Impact

- **Generation tokens**: 20-35% reduction
- **Context tokens**: 40-60% reduction  
- **Overall**: 25-40% total token savings

---

**Next:** [Part II: Universal Conventions](/conventions)
