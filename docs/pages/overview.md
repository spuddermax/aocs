# Agent-Oriented Coding Standard

**Version 0.6** · [GitHub](https://github.com/spuddermax/aocs) · MIT License

Write code optimized for AI agents. **25-40% fewer tokens.** Drop-in markdown files for your project.

---

## Get Started in 60 Seconds

### 1. Download the files

Grab the base standard, then add your languages:

- [⬇ AOCS.md (base standard)](/download/AOCS.md) — required for all projects
- [⬇ AOCS-typescript.md](/download/AOCS-typescript.md)
- [⬇ AOCS-javascript.md](/download/AOCS-javascript.md)
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

## What You Get

| Metric | Savings |
|--------|---------|
| Generation tokens (agent writing) | 20-35% |
| Context tokens (agent reading) | 40-60% |
| Reasoning tokens (agent thinking) | 15-25% |
| **Overall** | **25-40%** |

---

## See the Difference

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
- [HTML](/html) — Semantic structure and data attribute contracts
- [CSS](/css) — Design tokens and scoped styling

## Using a Language Not Listed?

Download the [Extension Protocol](/download/AOCS-extension-protocol.md) and any agent can create a new `AOCS-{language}.md` file autonomously. See the [full protocol](/extension) for details.
