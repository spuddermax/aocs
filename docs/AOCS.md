# Agent-Oriented Coding Standard (AOCS)
**Version 0.6**  
*A coding standard optimized for AI agent readability, token efficiency, and mechanical enforcement.*

---

## Table of Contents
- [Part I: Core Philosophy](#part-i-core-philosophy)
- [Part II: Universal Conventions](#part-ii-universal-conventions)
- [Part III: Language Extension Protocol](#part-iii-language-extension-protocol)
- [Part IV: Language Definitions](#part-iv-language-definitions)
- [Quick Reference](#quick-reference)

---

## Part I: Core Philosophy

### The Problem
Human-readable code optimizes for scanning, narrative flow, and gradual comprehension. AI agents parse structurally, hold thousands of lines in context simultaneously, and reason about intent through pattern-matching across entire codebases. Traditional readability conventions—verbose variable names, explanatory comments, whitespace scaffolding—impose token costs without providing information agents can't already infer.

As AI agents write more code, codebases become agent working memory. Every unnecessary token is real cost and real latency.

### The Solution
**Agent-Oriented Code** separates specification from implementation:
- **Specification layer**: formal contracts, manifests, and invariants in machine-parseable annotations
- **Implementation layer**: compressed, semantically dense code optimized for brevity

Humans read specifications. Agents read both, but the implementation can be orders of magnitude more concise.

### Core Principles

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

### Measured Impact
- **Generation tokens**: 20-35% reduction
- **Context tokens**: 40-60% reduction  
- **Overall**: 25-40% total token savings

---

## Part II: Universal Conventions

These conventions apply to all languages.

### U1. Module Manifests
Every module/file begins with an `@module` declaration:

```
// @module: <name>
// @exports: <type1>, <type2>, <function1>
// @depends: <module1>, <module2>
// @mutates: <global-state-if-any> | none
```

Agents loading a large codebase can orient themselves by reading manifests alone, without parsing implementations.

### U2. Function Contracts
Every public function declares its contract:

```
// @contract: (param1:Type1, param2:Type2) -> ReturnType | constraints
// @throws: ErrorType1 | ErrorType2 | never
// @pure: true | false
// @complexity: O(n log n) time, O(n) space
```

Constraints describe preconditions, postconditions, or domain restrictions (e.g., `param1 > 0`, `length(result) == length(input)`).

### U3. State Manifests
Modules managing state declare the shape explicitly:

```
// @state-manifest: {
//   field1: Type1,  // description
//   field2: Type2,  // description
//   ...
// }
```

Agents can verify state access patterns without reading every assignment.

### U4. Naming Conventions
- **Specification layer**: human-readable names (`calculateOrderTotal`, `activeUsers`)
- **Implementation layer**: terse abbreviations (`cot`, `au`, single-letter loop vars)
- **Public APIs and tests**: always human-readable (exceptions to compression)

### U5. Comments
- **Contract annotations**: mandatory for all public interfaces
- **Why-comments**: rare, only for non-obvious decisions
- **What-comments**: forbidden (code should be self-documenting via contracts)

### U6. Error Handling
Typed errors in contracts enable static reasoning about failure paths:

```
// @throws: EmptyOrderError | PaymentDeclinedError
```

Agents can construct comprehensive error-handling without executing code.

### U7. Enforcement
Teams should implement custom linters that:
- Require `@module`, `@contract`, and `@state-manifest` annotations
- Check for drift (e.g., `// @aocs-todo` tags left by uncertain agents)
- Inject remediation instructions into lint error messages that reference AOCS sections

---

## Part III: Language Extension Protocol

To add a new language to AOCS, follow this bootstrap algorithm:

### Step 1: Map Core Concepts
For each universal convention (U1-U7), identify the language's native idiom:

| Concept | Check if language has... | If not, use fallback... |
|---------|--------------------------|-------------------------|
| Contracts | Type system, assertions, decorators | Structured comments |
| Modules | Native module system | File-level comment headers |
| State | Class/struct fields, closure scope | Comment manifest |
| Errors | Typed exceptions or Result types | Enum or comment declaration |
| Naming | Conventional short names (i, x, acc) | Abbreviate common terms |

### Step 2: Define Compression Idioms
Identify language-specific patterns for brevity:
- Ternary operators, arrow functions, comprehensions
- Operator overloading, pipeline operators
- Native functional methods (map/reduce/filter equivalents)

### Step 3: Specify Exceptions
What stays human-readable?
- Public APIs (function signatures, exports)
- Tests (assertions, descriptions)
- Error messages
- Git commit messages and PR descriptions

### Step 4: Example Implementations
Provide at least three examples:
1. Human-optimized version
2. Agent-optimized version
3. Token count comparison

### Step 5: Validation
Before appending to AOCS, verify:
- [ ] All seven universal conventions mapped
- [ ] Compression idioms preserve correctness
- [ ] Exceptions clearly documented
- [ ] Examples demonstrate measurable token savings

---

## Part IV: Language Definitions

Each section follows the Part III protocol template.

---

### 4.1 TypeScript

**Module manifest:**
```typescript
// @module: OrderService
// @exports: Order, processOrder, validateOrder
// @depends: PaymentService, InventoryService
// @mutates: none
```

**Function contract:**
```typescript
// @contract: (o:Order, pm:PaymentMethod) -> Promise<PaymentResult>
// @throws: EmptyOrderError | PaymentDeclinedError
// @pure: false
// @complexity: O(n) time, O(1) space
```

**Compression idioms:**
- Arrow functions: `const f = (x) => x * 2`
- Ternary: `const y = cond ? a : b`
- Optional chaining: `user?.address?.city`
- Nullish coalescing: `val ?? defaultVal`
- Array methods: `items.filter(x => x.active).map(x => x.id)`
- Type aliases: `type O = Order; type PM = PaymentMethod;`

**Human-optimized example (180 tokens):**
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

**Agent-optimized example (75 tokens):**
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

### 4.2 JavaScript — State and Behavior

**State manifest:**
```javascript
// @state-manifest: {
//   cart: Item[],
//   total: number,
//   checkoutStep: 'cart'|'payment'|'confirm'
// }
```

**Compression idioms:**
- Destructuring: `const {id, name} = user`
- Spread: `const updated = {...state, total: newTotal}`
- Array reduce: `const sum = arr.reduce((a, x) => a + x, 0)`
- Template literals: `` `User ${id}: ${name}` ``

**Human-optimized:**
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

**Agent-optimized:**
```javascript
// @contract: (s:State{cart:Item[]}) -> State
// @pure: true
const uct=s=>{
  const sub=s.cart.reduce((a,i)=>a+(i.price*i.qty),0)
  return{...s,total:sub*(s.disc?0.9:1)}
}
```

---

### 4.3 HTML — Structure and Semantics

**App manifest (top of `<head>`):**
```html
<!-- @app: Citation Analyzer
     @routes: / (list), /detail/:id (detail view)
     @state: {filter:str, sort:str, selected:id|null}
     @components: CitationCard, FilterBar, DetailPanel
-->
```

**Data contracts (attributes):**
| Attribute | Purpose | Example |
|-----------|---------|---------|
| `data-action` | Click/interaction target | `data-action="filter"` |
| `data-state` | Reflects app state | `data-state="loading"` |
| `data-bind` | Binds to state key | `data-bind="currentUser"` |
| `data-id` | Entity identifier | `data-id="citation-42"` |

**Component structure:**
```html
<!-- @component: CitationCard
     @props: {citation: Citation}
     @emits: click:detail
-->
<article class="card" data-id="{{citation.id}}" data-action="show-detail">
  <h3>{{citation.title}}</h3>
  <p>{{citation.author}}</p>
</article>
```

**Conventions:**
- Use `class` for styling only (CSS namespace)
- Use `data-action`/`data-state` for JS hooks (never `class`)
- Every interactive element must have `data-action` or `id`
- Avoid anonymous divs: `<div id="nav-container">` not `<div>`

---

### 4.4 CSS — Design Tokens and Scope

**Design token manifest (`:root`):**
```css
/* @design-system:
   color.primary: #2563eb
   color.text: #1f2937
   spacing.unit: 0.25rem (4px)
   spacing.sm: 2u (8px)
   spacing.md: 4u (16px)
   radius.sm: 0.25rem
   motion.fast: 150ms
*/
:root {
  --c-pri: #2563eb;
  --c-txt: #1f2937;
  --sp-u: 0.25rem;
  --sp-sm: calc(2 * var(--sp-u));
  --sp-md: calc(4 * var(--sp-u));
  --r-sm: 0.25rem;
  --m-fast: 150ms;
}
```

**Scope blocks:**
```css
/* @scope: CitationCard component */
.card {
  padding: var(--sp-md);
  border-radius: var(--r-sm);
  transition: transform var(--m-fast);
}
.card:hover { transform: translateY(-2px); }
/* end @scope */
```

**State via data attributes, not classes:**
```css
/* ❌ Bad: class-based state */
.modal.open { display: block; }

/* ✅ Good: data-state */
.modal[data-state="open"] { display: block; }
```

**Compression:**
- Shorthand properties: `margin: 0 auto;` instead of `margin-left: auto; margin-right: auto;`
- Comma-grouped selectors: `.a, .b, .c { color: red; }`
- Custom properties instead of repeated values

---

## Quick Reference

**Part I: Core Philosophy**  
Contracts over comments · Compression over verbosity · Enforce boundaries, allow autonomy · Context is scarce · Drift is inevitable

**Part II: Universal Conventions**  
U1: Module manifests · U2: Function contracts · U3: State manifests · U4: Naming · U5: Comments · U6: Errors · U7: Enforcement

**Part III: Extension Protocol**  
Map concepts → Define compression → Specify exceptions → Provide examples → Validate

**Part IV: Language Definitions**  
4.1 TypeScript · 4.2 JavaScript · 4.3 HTML · 4.4 CSS

**NEW LANGUAGE?**  
Follow Part III protocol. Map U1-U7 to language idioms, provide three examples, append to Part IV.

---

## Version History

- **v0.6** — Integrated OpenAI Harness Engineering principles: AGENTS.md as table of contents, mechanical enforcement, drift management, structural testing
- **v0.5** — Restructured: Core Philosophy → Universal Conventions → Extension Protocol → Language Definitions
- **v0.4** — Added Language Extension Protocol for self-extending standard
- **v0.3** — Generalized HTML/CSS/JS sections beyond single-file apps
- **v0.2** — Added HTML/CSS/JavaScript sections based on real-world web app analysis
- **v0.1** — Initial TypeScript-focused standard with contracts and compression

---

*Token efficiency compounds. The teams that standardize this now build the conventions everyone else eventually adopts.*
