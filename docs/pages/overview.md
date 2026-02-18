# Agent-Oriented Coding Standard (AOCS)

**Version 0.6**  
*A coding standard optimized for AI agent readability, token efficiency, and mechanical enforcement.*

## Overview

AOCS is a coding standard designed for an AI-first world. As agents write more code, your codebase becomes their working memory—and traditional human-readable conventions impose unnecessary token costs.

### Key Benefits

- **25-40% total token savings** across your codebase
- **40-60% context reduction** when agents read code
- **20-35% faster generation** when agents write code
- **Mechanical enforcement** prevents drift over time

### The Core Idea

**Agent-Oriented Code** separates specification from implementation:

- **Specification layer**: Formal contracts, manifests, and invariants in machine-parseable annotations
- **Implementation layer**: Compressed, semantically dense code optimized for brevity

Humans read specifications. Agents read both, but the implementation can be orders of magnitude more concise.

### Example

**Human-readable (180 tokens):**
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

**Agent-optimized (75 tokens):**
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

**That's 58% fewer tokens on a single function.** Now multiply that across a 10,000 line codebase an agent reads dozens of times a day.

### The Standard

AOCS is organized into four parts:

1. **[Part I: Core Philosophy](/philosophy)** - The problem, the solution, and five core principles
2. **[Part II: Universal Conventions](/conventions)** - Seven conventions that apply to all languages
3. **[Part III: Extension Protocol](/extension)** - How to bootstrap AOCS for any language
4. **[Part IV: Language Definitions](/typescript)** - Specific implementations for TypeScript, JavaScript, HTML, CSS

### Getting Started

Ready to adopt AOCS? Start with the [Core Philosophy](/philosophy) to understand the principles, then explore the [language-specific definitions](/typescript).

### Open Source

AOCS is MIT licensed and open source. Contributions welcome!

- **GitHub:** [github.com/spuddermax/aocs](https://github.com/spuddermax/aocs)
- **Version:** 0.6
- **License:** MIT
