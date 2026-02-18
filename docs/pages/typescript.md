# TypeScript

TypeScript is the reference implementation for AOCS. Its strong type system and annotation support make it ideal for formal contracts.

## Module Manifest

```typescript
// @module: OrderService
// @exports: Order, processOrder, validateOrder
// @depends: PaymentService, InventoryService
// @mutates: none
```

## Function Contract

```typescript
// @contract: (o:Order, pm:PaymentMethod) -> Promise<PaymentResult>
// @throws: EmptyOrderError | PaymentDeclinedError
// @pure: false
// @complexity: O(n) time, O(1) space
```

## Compression Idioms

- **Arrow functions**: `const f = (x) => x * 2`
- **Ternary**: `const y = cond ? a : b`
- **Optional chaining**: `user?.address?.city`
- **Nullish coalescing**: `val ?? defaultVal`
- **Array methods**: `items.filter(x => x.active).map(x => x.id)`
- **Type aliases**: `type O = Order; type PM = PaymentMethod;`

## Example Comparison

### Human-optimized (180 tokens)

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

**See also:** [JavaScript](/javascript) | [HTML](/html) | [CSS](/css)
