<!-- AOCS-ROLE: config -->
# Part II: Universal Conventions

These conventions apply to all languages.

## U1. Module Manifests

Every module/file begins with an `@module` declaration:

```
// @module: <name>
// @exports: <type1>, <type2>, <function1>
// @depends: <module1>, <module2>
// @mutates: <global-state-if-any> | none
```

Agents loading a large codebase can orient themselves by reading manifests alone, without parsing implementations.

## U2. Function Contracts

Every public function declares its contract:

```
// @contract: (param1:Type1, param2:Type2) -> ReturnType | constraints
// @throws: ErrorType1 | ErrorType2 | never
// @pure: true | false
// @complexity: O(n log n) time, O(n) space
```

Constraints describe preconditions, postconditions, or domain restrictions (e.g., `param1 > 0`, `length(result) == length(input)`).

## U3. State Manifests

Modules managing state declare the shape explicitly:

```
// @state-manifest: {
//   field1: Type1,  // description
//   field2: Type2,  // description
//   ...
// }
```

Agents can verify state access patterns without reading every assignment.

## U4. Naming Conventions

- **Specification layer**: human-readable names (`calculateOrderTotal`, `activeUsers`)
- **Implementation layer**: terse abbreviations (`cot`, `au`, single-letter loop vars)
- **Public APIs and tests**: always human-readable (exceptions to compression)

## U5. Comments

- **Contract annotations**: mandatory for all public interfaces
- **Why-comments**: rare, only for non-obvious decisions
- **What-comments**: forbidden (code should be self-documenting via contracts)

## U6. Error Handling

Typed errors in contracts enable static reasoning about failure paths:

```
// @throws: EmptyOrderError | PaymentDeclinedError
```

Agents can construct comprehensive error-handling without executing code.

## U7. Enforcement

Teams should implement custom linters that:
- Require `@module`, `@contract`, and `@state-manifest` annotations
- Check for drift (e.g., `// @aocs-todo` tags left by uncertain agents)
- Inject remediation instructions into lint error messages that reference AOCS sections

## U8. Repository Contract (aocs.json)

Every AOCS-compliant repo includes an `aocs.json` at root — a machine-parseable contract agents can load without reading prose.

**Example:**

```json
{
  "aocsVersion": "0.8",
  "languages": ["typescript"],
  "modulePattern": "agent-module",
  "stateOwnership": "local-only",
  "sideEffects": "explicit",
  "namingSchema": "verbNoun",
  "allowedPatterns": ["fsm", "pure-functions"],
  "forbiddenPatterns": ["implicit-global", "dynamic-eval"],
  "mode": "strict"
}
```

**Why it matters:**

System prompts can simply say "Follow AOCS v0.8; see aocs.json for constraints." Agents load the contract first, verify compatibility, then proceed with mechanical enforcement. No interpretation required.

The contract enables pre-flight validation: agents check forbidden patterns before generating code, validate naming schemas before committing, and ensure edit-locality by comparing changed files against declared roles.

## U9. Semantic File Roles

Every file declares its role in the first 5 lines:

```typescript
// AOCS-ROLE: state-machine
// AOCS-INPUTS: events
// AOCS-OUTPUTS: state

export class OrderStateMachine {
  // ... state transitions
}
```

**Allowed roles (finite, enumerable):**

- `pure-logic` — Referentially transparent computation, no side effects
- `state-machine` — State transitions, the **ONLY** files that may mutate state
- `adapter` — External system integration (APIs, databases)
- `ui-binding` — Presentation layer (components, templates)
- `io-boundary` — File system, network, database access
- `config` — Configuration and constants

**Example: Pure Logic**

```typescript
// AOCS-ROLE: pure-logic
// AOCS-INPUTS: numbers
// AOCS-OUTPUTS: sum
// AOCS-PURE: true

export function sum(nums: number[]): number {
  return nums.reduce((a, b) => a + b, 0);
}
```

**Example: State Machine**

```typescript
// AOCS-ROLE: state-machine
// AOCS-INPUTS: actions
// AOCS-OUTPUTS: new state

class CartState {
  items: Item[] = [];
  
  addItem(item: Item): void {
    this.items.push(item); // Mutation allowed ONLY in state-machine files
  }
}
```

**Why:** Agents immediately narrow reasoning scope. When editing a `pure-logic` file, mutations are forbidden. When editing a `state-machine` file, agents know this is the only place state can change. Role declarations partition the solution space and drastically reduce hallucinated side effects.

## U10. Structured Comment Hints

Replace prose comments with machine-parseable hints:

```typescript
// AOCS-INVARIANT: output.stateId === input.stateId
// AOCS-FAILS-ON: invalidEvent
// AOCS-PURE: true
// AOCS-COMPLEXITY: O(n)
```

These complement `@contract` annotations. Comments become constraints, not narratives. Agents reason mechanically instead of linguistically.

**Examples:**

```typescript
// AOCS-INVARIANT: result.length === input.length
// AOCS-FAILS-ON: null, undefined, empty array
// AOCS-PURE: true
// AOCS-COMPLEXITY: O(n)
function mapItems<T, U>(input: T[], fn: (x: T) => U): U[] {
  return input.map(fn);
}
```

```typescript
// AOCS-INVARIANT: balance >= 0
// AOCS-FAILS-ON: insufficient funds
// AOCS-PURE: false
// AOCS-MUTATES: accountState
function withdraw(account: Account, amount: number): void {
  if (account.balance < amount) throw new InsufficientFundsError();
  account.balance -= amount;
}
```

**Hint types:**

- `AOCS-INVARIANT` — Conditions that must hold before/after execution
- `AOCS-FAILS-ON` — Input conditions that cause failure
- `AOCS-PURE` — Whether function has side effects
- `AOCS-COMPLEXITY` — Time/space complexity
- `AOCS-MUTATES` — What state this function modifies

Hints are structured data. Agents parse them as facts, not suggestions.

## U11. Edit-Locality Guarantees

**Rule:** A change to one concern must modify no more than one role category.

- Logic change → `pure-logic` files only
- State change → `state-machine` files only
- UI change → `ui-binding` files only

**Example violation:**

```diff
# BAD: Change spans multiple role categories
+ pure-logic/calculate-total.ts (modified)
+ state-machine/cart.state.ts (modified)
```

**Correct approach:**

```diff
# GOOD: Change isolated to one role
+ pure-logic/calculate-total.ts (modified)
```

Keeps diffs small, prevents cross-file reasoning explosions, enables high-confidence patch generation.

Agents can validate edit-locality mechanically: "This change modifies both a `pure-logic` file and a `state-machine` file — violation of U11." The architectural constraint becomes a compile-time check.

## U12. Forbidden Ambiguity List

Explicitly list patterns agents must never generate:

- Dynamic imports (e.g., `import(variablePath)`)
- Runtime type mutation (e.g., `obj.constructor = NewClass`)
- Implicit fallthrough in switch statements
- Reflection / metaprogramming (e.g., `eval`, `Function()`)
- Magic strings (use constants or enums)
- Optional parameters in public APIs (use explicit overloads or separate functions)
- Implicit global state access (state must be passed explicitly)

**Examples:**

```typescript
// FORBIDDEN: Dynamic import
const module = await import(`./${userInput}.js`);

// ALLOWED: Static import with conditional logic
import { handlerA } from './handlerA.js';
import { handlerB } from './handlerB.js';
const handler = condition ? handlerA : handlerB;
```

```typescript
// FORBIDDEN: Optional parameters in public API
export function createUser(name: string, email?: string) { }

// ALLOWED: Explicit overloads
export function createUser(name: string): User;
export function createUser(name: string, email: string): User;
export function createUser(name: string, email?: string): User {
  // implementation
}
```

Include this list in `aocs.json` under `forbiddenPatterns`. Agents check before generating code. If a pattern appears in the forbidden list, generation halts with an error.

Hard constraints reduce hallucination space and make agent output safer by default.

## U13. Agent-First README

Every AOCS repo includes a `README.agent.md` (≤200 tokens) that can be injected verbatim into system prompts.

**Template:**

```markdown
# Agent Context — [Project Name]

This repo follows AOCS v0.8. See `aocs.json` for machine-readable constraints.

## Rules
- No implicit state mutation
- State changes only in `*.state.*` files (role: `state-machine`)
- All other files must be referentially transparent
- File roles declared via `AOCS-ROLE` in first 5 lines
- Function names follow `verbNoun` grammar
- No dynamic imports, reflection, magic strings, or implicit globals

## Key Files
- `aocs.json` — repository contract (load first)
- `docs/AOCS.md` — full standard
- `docs/AOCS-{language}.md` — language-specific rules

## Edit Rules
- One concern per change, one role category per diff
- Validate against `AOCS-INVARIANT` comments before committing
- Check `AOCS-FAILS-ON` hints for error paths
```

**Why:** The agent README is a compressed context bootstrap. System prompts load it once, and agents have the core rules without parsing the full standard.

Treat `README.agent.md` as the TL;DR for machines. Keep it under 200 tokens. Update it whenever core constraints change.

---

**Previous:** [Part I: Core Philosophy](/philosophy)  
**Next:** [Part III: Extension Protocol](/extension)
