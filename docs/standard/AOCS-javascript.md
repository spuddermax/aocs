# AOCS: JavaScript

*Language extension for the [Agent-Oriented Coding Standard](./AOCS.md).*
*Requires: `AOCS.md` (base standard)*

---

## Overview

JavaScript AOCS patterns focus on state management, DOM interaction, and behavior. Without TypeScript's type system, contracts carry even more weight — they become the only formal specification of function behavior.

---

## Module Manifest (U1)

```javascript
// @module: CartManager
// @exports: updateCart, getTotal, clearCart
// @depends: StorageService
// @mutates: localStorage
```

## Function Contract (U2)

```javascript
// @contract: (items:Item[], disc?:string) -> number
// @throws: never
// @pure: true
```

Without types, contracts must be more explicit about parameter shapes:

```javascript
// @contract: (o:{items:{price:num,qty:num}[], disc?:str}) -> num | num >= 0
```

## State Manifest (U3)

```javascript
// @state-manifest: {
//   cart: Item[],
//   total: number,
//   checkoutStep: 'cart' | 'payment' | 'confirm'
// }
```

---

## Compression Idioms

| Pattern | Verbose | Compressed |
|---------|---------|-----------|
| Arrow functions | `function(x) { return x * 2; }` | `x => x * 2` |
| Destructuring | `const id = user.id;` | `const { id } = user` |
| Spread | `Object.assign({}, state, { total })` | `{ ...state, total }` |
| Array reduce | `for` loop + accumulator | `.reduce((a, x) => a + x, 0)` |
| Template literals | `'User ' + id + ': ' + name` | `` `User ${id}: ${name}` `` |
| Short-circuit | `if (x) { doThing(); }` | `x && doThing()` |
| Nullish coalescing | `x !== null ? x : fallback` | `x ?? fallback` |
| Optional chaining | nested `if` checks | `obj?.prop?.sub` |

---

## Example: State Management

### Human-optimized

```javascript
function updateCartTotal(state) {
  const subtotal = state.cart.reduce((sum, item) => {
    return sum + (item.price * item.quantity);
  }, 0);

  const discount = state.discountCode ? subtotal * 0.10 : 0;
  const total = subtotal - discount;

  return { ...state, total: total };
}
```

### Agent-optimized

```javascript
// @contract: (s:State{cart:Item[]}) -> State
// @pure: true
const uct=s=>{
  const sub=s.cart.reduce((a,i)=>a+(i.price*i.qty),0)
  return{...s,total:sub*(s.disc?0.9:1)}
}
```

---

## DOM Patterns

### Event Delegation

```javascript
// @contract: (root:Element, sel:string, handler:fn) -> void
// @pure: false
const on=(root,sel,fn)=>
  root.addEventListener('click',e=>{
    const t=e.target.closest(sel)
    t&&fn(t,e)
  })
```

### State-Driven Rendering

Use `data-state` attributes instead of class toggling:

```javascript
// @contract: (el:Element, state:string) -> void
// @pure: false
const setState=(el,s)=>el.dataset.state=s

// Usage: setState(modal, 'open') → CSS handles [data-state="open"]
```

---

## Exceptions (Always Human-Readable)

- **Exported function names**: `updateCart` — not `uc`
- **Event handler names in HTML**: `data-action="add-to-cart"` — not `data-action="atc"`
- **Error messages**: human-readable strings
- **Console output**: readable for debugging
- **Test descriptions**: full English sentences

---

## Quick Reference

```
MODULE:     // @module: Name | @exports: ... | @depends: ... | @mutates: ...
CONTRACT:   // @contract: (params) -> Return | constraints
STATE:      // @state-manifest: { field: Type }

COMPRESS:   arrows, destructuring, spread, reduce, ?., ??, &&
READABLE:   exports, event handlers, errors, console, tests
DOM:        data-state for state, data-action for events, class for CSS only
```
