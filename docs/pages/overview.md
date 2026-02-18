# Agent-Oriented Coding Standard (AOCS)

**Version 0.6** · [GitHub](https://github.com/spuddermax/aocs) · MIT License

*A coding standard optimized for AI agent readability, token efficiency, and mechanical enforcement.*

---

## The Problem

As AI agents write more code, your codebase becomes their working memory — and right now we're padding that memory with information optimized for humans who may never read it again.

## The Solution

**AOCS** separates specification from implementation:

- **Specification layer**: formal contracts, manifests, and invariants in machine-parseable annotations
- **Implementation layer**: compressed, semantically dense code optimized for brevity

Humans read specifications. Agents read both, but the implementation can be orders of magnitude more concise.

## Measured Impact

| Metric | Savings |
|--------|---------|
| Generation tokens (agent writing code) | 20-35% |
| Context tokens (agent reading codebase) | 40-60% |
| Reasoning tokens (agent thinking) | 15-25% |
| **Overall** | **25-40%** |

## Quick Example

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

**58% fewer tokens.** Now multiply that across a 10,000 line codebase an agent reads dozens of times a day.

## How to Adopt AOCS

### 1. Download the files you need

Grab the **base standard** plus the language files for your stack:

- **[AOCS.md](/download/AOCS.md)** — Base standard (required)
- **[AOCS-typescript.md](/download/AOCS-typescript.md)** — TypeScript
- **[AOCS-javascript.md](/download/AOCS-javascript.md)** — JavaScript
- **[AOCS-html.md](/download/AOCS-html.md)** — HTML
- **[AOCS-css.md](/download/AOCS-css.md)** — CSS

### 2. Drop them in your project

```
your-project/
├── AGENTS.md
├── docs/
│   ├── AOCS.md
│   ├── AOCS-typescript.md
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

## Read the Standard

- [Part I: Core Philosophy](/philosophy) — Principles and motivation
- [Part II: Universal Conventions](/conventions) — U1-U7: the rules that apply to every language
- [Part III: Extension Protocol](/extension) — How to bootstrap AOCS for any new language

## Language Definitions

- [TypeScript](/typescript) — Reference implementation
- [JavaScript](/javascript) — State and behavior patterns
- [HTML](/html) — Structure and semantics
- [CSS](/css) — Design tokens and scope
