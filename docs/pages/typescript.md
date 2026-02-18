<!-- AOCS-ROLE: config -->
# AOCS: TypeScript

*Language extension for the [Agent-Oriented Coding Standard](./AOCS.md).*
*Requires: `AOCS.md` (base standard)*

---

## Overview

TypeScript is the reference implementation for AOCS. Its strong type system, interface declarations, and annotation support make it ideal for formal contracts. This file defines TypeScript-specific idioms for applying the universal conventions (U1-U7) from the base standard.

---

## Module Manifest (U1)

```typescript
// @module: OrderService
// @exports: Order, processOrder, validateOrder
// @depends: PaymentService, InventoryService
// @mutates: none
```

## Function Contract (U2)

```typescript
// @contract: (o:Order, pm:PaymentMethod) -> Promise<PaymentResult>
// @throws: EmptyOrderError | PaymentDeclinedError
// @pure: false
// @complexity: O(n) time, O(1) space
```

## State Manifest (U3)

```typescript
// @state-manifest: {
//   cart: CartItem[],
//   total: number,
//   step: 'cart' | 'payment' | 'confirm'
// }
```

---

## Compression Idioms

### Type Aliases

Reduce repetition across a module:

```typescript
type O = Order;
type PM = PaymentMethod;
type PR = PaymentResult;
type CI = CartItem;
```

### Expression Patterns

| Pattern | Verbose | Compressed |
|---------|---------|-----------|
| Arrow functions | `function f(x) { return x * 2; }` | `const f = (x: number) => x * 2` |
| Ternary | `if (c) { r = a; } else { r = b; }` | `const r = c ? a : b` |
| Optional chaining | `if (user && user.address) { ... }` | `user?.address?.city` |
| Nullish coalescing | `val !== null ? val : defaultVal` | `val ?? defaultVal` |
| Array methods | `for` loops with `push` | `.filter().map().reduce()` |
| Destructuring | `const id = user.id; const name = user.name;` | `const { id, name } = user` |
| Spread | manual property copying | `{ ...state, total: newTotal }` |
| Template literals | string concatenation | `` `User ${id}: ${name}` `` |

### Error Pattern

```typescript
// @contract: () -> never
// @pure: true
class EmptyOrderError extends Error {
  constructor() { super('empty_order') }
}
```

---

## Example: Full Comparison

### Human-optimized (180 tokens)

```typescript
async function processPayment(
  order: Order,
  paymentMethod: PaymentMethod
): Promise<PaymentResult> {
  // Validate the order has items before processing
  if (!order.items || order.items.length === 0) {
    throw new Error('Cannot process payment for empty order');
  }

  // Calculate the total amount
  const total = order.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  // Charge the payment method
  const result = await paymentMethod.charge(order.customerId, total);

  // Return structured result
  return {
    success: result.approved,
    transactionId: result.id,
    amount: total
  };
}
```

### Agent-optimized (75 tokens)

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

**Token savings: 58%**

---

## Example: Grouping

### Human-optimized

```typescript
function groupUsersByRole(users: User[]): Map<string, User[]> {
  const groups = new Map<string, User[]>();
  for (const user of users) {
    const existingGroup = groups.get(user.role);
    if (existingGroup) {
      existingGroup.push(user);
    } else {
      groups.set(user.role, [user]);
    }
  }
  return groups;
}
```

### Agent-optimized

```typescript
// @contract: (User[]{role:str}) -> Map<str,User[]> | keys=distinct(roles), order:preserved
// @complexity: O(n) time, O(n) space
const gubr=(us:U[]):Map<string,U[]>=>
  us.reduce((m,u)=>(m.set(u.role,[...(m.get(u.role)??[]),u]),m),new Map)
```

---

## Exceptions (Always Human-Readable)

The following must remain human-readable regardless of AOCS compression:

- **Exported type/interface names**: `Order`, `PaymentResult` — not `O`, `PR`
- **Public API function names**: `processPayment` — not `pp`
- **Test descriptions**: `it('should throw EmptyOrderError when cart is empty')`
- **Error messages**: `'Cannot process payment for empty order'`
- **Enum values**: `OrderStatus.COMPLETED` — not `OS.C`

---

## Quick Reference

```
MODULE:     // @module: Name | @exports: ... | @depends: ... | @mutates: ...
CONTRACT:   // @contract: (params) -> Return | constraints
THROWS:     // @throws: Error1 | Error2 | never
PURE:       // @pure: true | false
STATE:      // @state-manifest: { field: Type }
COMPLEXITY: // @complexity: O(n) time, O(1) space

COMPRESS:   type aliases, arrow fns, ternary, ?., ??, destructuring, spread
READABLE:   exports, public APIs, tests, errors, enums
```
