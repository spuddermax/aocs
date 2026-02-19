<!-- AOCS-ROLE: config -->
# Part I: Core Philosophy

## The Problem

The real cost isn't tokens — it's **ambiguity**. When agents guess about intent, state ownership, or allowed patterns, they hallucinate, generate sprawling diffs, and break things.

Human-readable code optimizes for scanning and narrative flow. AI agents parse structurally and reason through pattern-matching across entire codebases. What agents need isn't more words — it's **explicit contracts**. Traditional code leaves agents inferring:

- What does this file do? (no role declaration)
- What can this function mutate? (no side-effect contract)
- What patterns are forbidden? (no constraint list)
- What invariants must hold? (no machine-readable assertions)

Every ambiguity expands the solution space. Every guess risks hallucination.

## The Solution

**Agent-Oriented Code** separates specification from implementation:
- **Specification layer**: formal contracts, manifests, and invariants in machine-parseable annotations
- **Implementation layer**: compressed, semantically dense code optimized for brevity

Humans read specifications. Agents read both, but the implementation can be orders of magnitude more concise.

## Core Principles

**P1. Contracts over comments**  
Replace prose docstrings with formal `@contract` annotations that declare inputs, outputs, preconditions, postconditions, and side effects in structured notation.

**P2. Compression over verbosity (optional)**  
Where appropriate, favor concise expressions in implementation — but never at the cost of human debuggability. Compression is a bonus, not the core. The real savings come from eliminating ambiguity — fewer clarification turns, smaller diffs, fewer retries. Context windows are growing; compression ages poorly, but contracts remain essential.

**P3. Enforce boundaries centrally, allow autonomy locally**  
Module contracts, data shapes, and architectural boundaries are non-negotiable and mechanically enforced. Within those boundaries, agents have full discretion over implementation style.

**P4. Context is a scarce resource**  
Repository knowledge lives in a structured `docs/` directory treated as the system of record. `AGENTS.md` is a table of contents, not an encyclopedia. The standard itself should be referenced, not dumped wholesale into context.

**P5. Drift is inevitable; enforcement is continuous**  
Agents replicate existing patterns, including bad ones. Mechanical enforcement (linters, structural tests) and periodic garbage collection prevent technical debt from compounding.

## Measured Impact

Structured contracts improve reasoning quality — and yes, they also save tokens:

- **Generation tokens**: 25-40% reduction
- **Context tokens**: 50-70% reduction  
- **Reasoning tokens**: 20-35% reduction
- **Overall**: 30-50% total token savings

*Measured on small examples. Real-world savings vary by codebase, workflow, and model. The primary benefit is reasoning quality, not token count.*

## From Style Guide to Low-Entropy IR

AOCS v0.7 marked a fundamental shift: from **style guide** to **low-entropy intermediate representation for code**.

Traditional style guides optimize for human aesthetics — indentation, naming conventions, comment placement. They assume code is read linearly, top-to-bottom, with gradual comprehension.

**Agents don't work that way.**

LLMs parse structurally, hold entire modules in context simultaneously, and reason through pattern-matching across thousands of tokens. They don't need "readable" code — they need **parseable contracts** and **constrained solution spaces**.

AOCS v0.7 reframed code as a **human-writable DSL optimized for LLM cognition**:

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
