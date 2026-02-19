<!-- AOCS-ROLE: config -->
# Agent-Oriented Coding Standard

**Version 0.8** · [GitHub](https://github.com/spuddermax/aocs) · MIT License

**Structured contracts that make your codebase machine-readable.** Drop-in markdown files for your project.

⚠️ **Early Stage** — AOCS v0.8 is an early-stage standard seeking real-world validation. The ideas are battle-ready; the ecosystem is young.

---

## Get Started in 60 Seconds

### 1. Download the files

Grab the base standard, then add your languages:

- [⬇ AOCS.md (base standard)](/download/AOCS.md) — required for all projects
- [⬇ aocs-schema.json (JSON schema for aocs.json)](/download/aocs-schema.json)
- [⬇ README.agent.md (agent-first README template)](/download/README.agent.md)
- [⬇ AOCS-typescript.md](/download/AOCS-typescript.md)
- [⬇ AOCS-javascript.md](/download/AOCS-javascript.md)
- [⬇ AOCS-python.md](/download/AOCS-python.md)
- [⬇ AOCS-go.md](/download/AOCS-go.md)
- [⬇ AOCS-rust.md](/download/AOCS-rust.md)
- [⬇ AOCS-html.md](/download/AOCS-html.md)
- [⬇ AOCS-css.md](/download/AOCS-css.md)

### 2. Drop them in your project

```
your-project/
├── AGENTS.md
├── docs/
│   ├── AOCS.md              ← base standard
│   ├── AOCS-typescript.md   ← your language(s)
│   └── AOCS-css.md
└── src/
```

### 3. Reference from AGENTS.md

```markdown
## Coding Standard
Follow the AOCS standard:
- docs/AOCS.md (base conventions)
- docs/AOCS-typescript.md (TypeScript rules)
```

Don't paste the full standard into AGENTS.md — context is scarce. Point to the files.

**That's it.** Your agents now have a formal coding standard optimized for their workflow.

---

## Why AOCS?

Agents reason better with explicit contracts than by inferring intent from code. AOCS gives agents machine-readable metadata — file roles, function contracts, invariants, forbidden patterns — so they stop guessing and start validating.

As context windows grow, the value of token compression fades, but structured contracts remain essential. AOCS helps agents:

- **Understand intent** without reading implementation
- **Validate changes** against explicit constraints
- **Navigate codebases** via semantic file roles
- **Avoid hallucinations** through forbidden pattern lists

The compression layer is a bonus. The contract layer is the foundation.

---

## See the Difference

One example of how AOCS transforms code:

**Human-readable — 180 tokens:**

```typescript
async function processPayment(order: Order, paymentMethod: PaymentMethod): Promise<PaymentResult> {
  // Validate the order has items before processing
  if (!order.items || order.items.length === 0) {
    throw new Error('Cannot process payment for empty order');
  }
  const total = order.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);
  const result = await paymentMethod.charge(order.customerId, total);
  return {
    success: result.approved,
    transactionId: result.id,
    amount: total
  };
}
```

**Agent-optimized — 75 tokens:**

```typescript
// @contract: (o:Order{items:NonEmpty}, pm:PM) -> Promise<{success:bool, txId:str, amt:num}>
// @throws: EmptyOrderError
// @pure: false
type O=Order; type PM=PaymentMethod; type PR=PaymentResult;
const pp=async(o:O,pm:PM):Promise<PR>=>{
  if(!o.items?.length)throw new EmptyOrderError()
  const amt=o.items.reduce((a,i)=>a+(i.price*i.qty),0)
  const r=await pm.charge(o.customerId,amt)
  return{success:r.approved,txId:r.id,amt}
}
```

**58% fewer tokens** on a single function. Multiply across your entire codebase.

---

## Measured Impact

Structured contracts improve reasoning quality, and yes — they also save tokens:

| Metric | Savings |
|--------|---------|
| Generation tokens (agent writing) | 25-40% |
| Context tokens (agent reading) | 50-70% |
| Reasoning tokens (agent thinking) | 20-35% |
| **Overall** | **30-50%** |

*Measured on small examples. Real-world savings vary by codebase, workflow, and model. The primary benefit is reasoning quality, not token count.*

---

## How It Works

AOCS separates **specification** from **implementation**:

- **Specification layer**: formal `@contract` annotations that declare inputs, outputs, errors, and side effects
- **Implementation layer**: compressed code optimized for brevity

Humans read the contracts. Agents read both — but the implementation can be dramatically shorter.

## Learn More

- [Part I: Philosophy](/philosophy) — Why this works and the five core principles
- [Part II: Conventions](/conventions) — The seven universal rules (U1-U7)
- [Part III: Extension Protocol](/extension) — Bootstrap AOCS for any new language

## Language Definitions

- [TypeScript](/typescript) — Reference implementation with full examples
- [JavaScript](/javascript) — State management and DOM patterns
- [Python](/python) — Dynamic typing with contracts, comprehensions, and dataclasses
- [Go](/go) — Error handling, struct patterns, and explicit dependencies
- [Rust](/rust) — Ownership model, Result types, and iterator chains
- [HTML](/html) — Semantic structure and data attribute contracts
- [CSS](/css) — Design tokens and scoped styling

## Using a Language Not Listed?

Download the [Extension Protocol](/download/AOCS-extension-protocol.md) and any agent can create a new `AOCS-{language}.md` file autonomously. See the [full protocol](/extension) for details.

---

## Stable API

Agents can fetch AOCS files programmatically at predictable URLs. No scraping required.

### Manifest

```
GET /manifest.json
```

Returns the full file index, version history, and API documentation. Load this first.

### Raw Files (versioned)

```
GET /raw/latest/AOCS.md
GET /raw/latest/AOCS-python.md
GET /raw/latest/aocs-schema.json
GET /raw/v0.8/AOCS-typescript.md
```

Pin to a version (`/raw/v0.8/`) or track latest (`/raw/latest/`).

### Example: Agent Bootstrap

```python
# Fetch the manifest
manifest = fetch("https://aocs.pages.dev/manifest.json").json()

# Download the base standard + your language
base = fetch(f"https://aocs.pages.dev/raw/latest/{manifest['files']['base']}").text()
lang = fetch(f"https://aocs.pages.dev/raw/latest/{manifest['files']['languages']['python']}").text()
```

### CLI Validation

```bash
npx aocs validate        # validate current project
npx aocs init            # scaffold aocs.json + README.agent.md
```

---

## What's New in v0.8

AOCS v0.8 makes the standard **enforceable infrastructure** — not just rules, but tooling that mechanically validates compliance.

**Major additions:**

- **CLI Validator** (`aocs validate`) — Zero-dependency Node.js linter that checks aocs.json, file roles, contracts, hints, and forbidden patterns. Pluggable language modules loaded from your config. Run `npx aocs validate` in any AOCS project.
- **`aocs init`** — Interactive scaffolding that generates `aocs.json` and `README.agent.md` for new projects
- **Python, Go, Rust** — Three new language extensions with idiomatic examples, compression patterns, and before/after token comparisons
- **Stable API Endpoints** — Agents fetch files at `/raw/latest/AOCS.md` or pin to `/raw/v0.8/AOCS.md`. `/manifest.json` provides the full file index.
- **Self-Compliance** — The AOCS repo itself passes `aocs validate` with zero failures

**The litmus test:** An agent can now clone a repo, read `README.agent.md`, parse `aocs.json`, run `aocs validate`, and reliably generate compliant code. AOCS is no longer a style guide — it's infrastructure.

---

## What's New in v0.7

AOCS v0.7 transformed from a style guide into a **low-entropy intermediate representation for code** — a human-writable DSL optimized for LLM cognition.

**Major additions:**

- **Repository Contracts** (`aocs.json`) — Machine-parseable constraints eliminate prose interpretation
- **Semantic File Roles** (`AOCS-ROLE`) — Files declare their purpose (pure-logic, state-machine, adapter, etc.) in the first 5 lines
- **Structured Hints** (`AOCS-INVARIANT`, `AOCS-FAILS-ON`) — Comments become mechanical constraints
- **Edit-Locality Guarantees** — One concern per change, one role category per diff
- **Forbidden Pattern Lists** — Explicit enumeration of never-generate patterns
- **Agent-First README** (`README.agent.md`) — ≤200 token context bootstrap for system prompts
