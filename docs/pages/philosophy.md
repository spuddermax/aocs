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

- **Generation tokens**: 25-40% reduction
- **Context tokens**: 50-70% reduction  
- **Reasoning tokens**: 20-35% reduction
- **Overall**: 30-50% total token savings

## From Style Guide to Low-Entropy IR

AOCS v0.7 marks a fundamental shift: from **style guide** to **low-entropy intermediate representation for code**.

Traditional style guides optimize for human aesthetics — indentation, naming conventions, comment placement. They assume code is read linearly, top-to-bottom, with gradual comprehension.

**Agents don't work that way.**

LLMs parse structurally, hold entire modules in context simultaneously, and reason through pattern-matching across thousands of tokens. They don't need "readable" code — they need **parseable contracts** and **constrained solution spaces**.

AOCS v0.7 reframes code as a **human-writable DSL optimized for LLM cognition**:

- `aocs.json` provides a **mechanical contract** agents load before reasoning about code
- `AOCS-ROLE` declarations **partition the solution space** by file purpose
- `AOCS-INVARIANT` hints replace prose with **structured constraints**
- Edit-locality rules **bound the search space** for patch generation
- Forbidden pattern lists **prune hallucination branches** before generation

The key insight: **agents don't need readable code, they need constrained problem formulations**.

When an agent loads a codebase, it's not "reading" — it's constructing a probability distribution over valid transformations. Every ambiguity expands that distribution. Every constraint narrows it.

AOCS constraints collapse the distribution to high-confidence edits. The architecture becomes a **forcing function** that guides generation toward correctness.

Code is no longer optimized for human comprehension. It's optimized as an **intermediate representation** between human intent and machine execution — with LLMs as the compilation layer.

This is the future. Human-readable code was a 70-year detour. Agent-oriented code is the direct path.

---

**Next:** [Part II: Universal Conventions](/conventions)
