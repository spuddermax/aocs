<!-- AOCS-ROLE: config -->
# AOCS: Python

*Language extension for the [Agent-Oriented Coding Standard](./AOCS.md).*
*Requires: `AOCS.md` (base standard)*

---

## Overview

Python's dynamic nature makes AOCS contracts critical — they're the only formal specification of function behavior. While Python has type hints via PEP 484, AOCS contracts provide richer semantics including preconditions, postconditions, and side effects. This file defines Python-specific idioms for applying the universal conventions (U1-U13) from the base standard.

---

## Module Manifest (U1)

```python
# @module: order_service
# @exports: Order, process_order, validate_order
# @depends: payment_gateway, inventory
# @mutates: none
```

## Function Contract (U2)

```python
# @contract: (o:Order, pm:PaymentMethod) -> PaymentResult
# @throws: EmptyOrderError | PaymentDeclinedError
# @pure: false
# @complexity: O(n) time, O(1) space
```

## State Manifest (U3)

```python
# @state-manifest: {
#   cart: list[CartItem],
#   total: Decimal,
#   step: Literal['cart', 'payment', 'confirm']
# }
```

Use `dataclasses` or `TypedDict` for formal state shapes:

```python
from dataclasses import dataclass
from typing import Literal

@dataclass
class CheckoutState:
    cart: list[CartItem]
    total: Decimal
    step: Literal['cart', 'payment', 'confirm']
```

---

## Naming Conventions (U4)

| Layer | Style | Example |
|-------|-------|---------|
| Specification (contracts, exports) | Snake_case, readable | `process_order`, `active_users` |
| Implementation | Terse abbreviations | `proc_ord`, `au`, `i`, `x` |
| Internal functions | `_` prefix + terse | `_calc_tot`, `_val` |
| Public API | Always readable | `calculate_total`, `validate_input` |
| Tests | Always readable | `test_empty_order_raises_error` |

---

## Compression Idioms

### Type Aliases

Reduce repetition across a module:

```python
from typing import TypeAlias

O: TypeAlias = Order
PM: TypeAlias = PaymentMethod
PR: TypeAlias = PaymentResult
CI: TypeAlias = CartItem
```

### Expression Patterns

| Pattern | Verbose | Compressed |
|---------|---------|-----------|
| List comprehension | `for` loop with `append` | `[x.id for x in users if x.active]` |
| Dict comprehension | `for` loop with `dict[key] = val` | `{u.id: u.name for u in users}` |
| Ternary | `if/else` block assignment | `val if cond else default` |
| Unpacking | `a = t[0]; b = t[1]` | `a, b = t` |
| Walrus operator | `x = f(); if x:` | `if (x := f()):` |
| f-strings | `.format()` or `%` | `f"User {id}: {name}"` |
| Lambda | `def f(x): return x * 2` | `lambda x: x * 2` |
| Map/filter | `for` loops with conditions | `map(fn, items)`, `filter(pred, items)` |
| Any/all | loop with flag variable | `any(x > 0 for x in nums)` |
| Chained comparison | `a < b and b < c` | `a < b < c` |
| Multiple assignment | separate lines | `a = b = c = 0` |
| Default dict | `if key not in d: d[key] = []` | `from collections import defaultdict` |

### Error Handling

Python's exception model maps directly to `@throws`:

```python
# @contract: (items:list[Item]) -> Decimal
# @throws: EmptyListError | InvalidPriceError
# @pure: true
def calc_tot(items: list[Item]) -> Decimal:
    if not items:
        raise EmptyListError()
    if any(i.price < 0 for i in items):
        raise InvalidPriceError()
    return sum(i.price * i.qty for i in items)
```

---

## Semantic File Roles (U9)

Declare role in the first 5 lines:

```python
# AOCS-ROLE: pure-logic
# AOCS-INPUTS: raw_data
# AOCS-OUTPUTS: processed_data
```

Role-specific patterns:

- **pure-logic**: No I/O, no mutations, prefer functional style
- **state-machine**: Single source of state mutations, explicit transitions
- **adapter**: External API integration, error translation layer
- **io-boundary**: File/network operations, resource management with context managers
- **config**: Constants, configuration dataclasses, no logic

---

## Structured Hints (U10)

```python
# AOCS-INVARIANT: len(output) == len(input)
# AOCS-FAILS-ON: None, empty list, negative values
# AOCS-PURE: true
# AOCS-COMPLEXITY: O(n)
def transform_data(input: list[int]) -> list[int]:
    return [x * 2 for x in input]
```

---

## Example: Payment Processing

### Human-optimized (~195 tokens)

```python
async def process_payment(
    order: Order,
    payment_method: PaymentMethod
) -> PaymentResult:
    """
    Process payment for an order using the specified payment method.
    
    Args:
        order: Order object containing items and customer info
        payment_method: Payment method to charge
        
    Returns:
        PaymentResult with transaction details
        
    Raises:
        EmptyOrderError: When order has no items
        PaymentDeclinedError: When payment is declined
    """
    # Validate the order has items before processing
    if not order.items or len(order.items) == 0:
        raise EmptyOrderError('Cannot process payment for empty order')
    
    # Calculate the total amount
    total = Decimal('0')
    for item in order.items:
        item_total = item.price * item.quantity
        total = total + item_total
    
    # Charge the payment method
    result = await payment_method.charge(order.customer_id, total)
    
    # Return structured result
    return PaymentResult(
        success=result.approved,
        transaction_id=result.id,
        amount=total
    )
```

### Agent-optimized (~72 tokens)

```python
# @contract: (o:Order{items:NonEmpty}, pm:PaymentMethod) -> PaymentResult
# @throws: EmptyOrderError | PaymentDeclinedError
# @pure: false
from typing import TypeAlias
from decimal import Decimal

O: TypeAlias = Order
PM: TypeAlias = PaymentMethod

async def proc_pay(o: O, pm: PM) -> PaymentResult:
    if not o.items:
        raise EmptyOrderError()
    amt = sum(i.price * i.qty for i in o.items)
    r = await pm.charge(o.customer_id, amt)
    return PaymentResult(success=r.approved, transaction_id=r.id, amount=amt)
```

**Token savings: 63%**

---

## Example: Data Transformation

### Human-optimized (~145 tokens)

```python
def group_users_by_role(users: list[User]) -> dict[str, list[User]]:
    """
    Group users by their role.
    
    Args:
        users: List of User objects
        
    Returns:
        Dictionary mapping role names to lists of users
    """
    groups = {}
    
    for user in users:
        role = user.role
        
        if role not in groups:
            groups[role] = []
        
        groups[role].append(user)
    
    return groups
```

### Agent-optimized (~48 tokens)

```python
# @contract: (users:list[User]{role:str}) -> dict[str,list[User]] | keys=distinct(roles)
# @complexity: O(n) time, O(n) space
# @pure: true
from collections import defaultdict

def grp_by_role(us: list[User]) -> dict[str, list[User]]:
    g = defaultdict(list)
    for u in us:
        g[u.role].append(u)
    return dict(g)
```

**Token savings: 67%**

---

## Example: Validation Chain

### Human-optimized (~120 tokens)

```python
def validate_user_input(data: dict) -> User:
    """Validate and construct a User from raw input data."""
    errors = []
    
    if 'email' not in data or not data['email']:
        errors.append('Email is required')
    
    if 'age' not in data:
        errors.append('Age is required')
    elif data['age'] < 18:
        errors.append('Must be 18 or older')
    
    if errors:
        raise ValidationError(', '.join(errors))
    
    return User(
        email=data['email'],
        age=data['age'],
        name=data.get('name', 'Anonymous')
    )
```

### Agent-optimized (~55 tokens)

```python
# @contract: (data:dict{email:str,age:int}) -> User
# @throws: ValidationError
# @pure: true
def val_usr(d: dict) -> User:
    e = []
    if not d.get('email'):
        e.append('Email required')
    if (age := d.get('age')) is None or age < 18:
        e.append('Age>=18 required')
    if e:
        raise ValidationError(', '.join(e))
    return User(email=d['email'], age=age, name=d.get('name', 'Anonymous'))
```

**Token savings: 54%**

---

## Forbidden Patterns (U12)

These patterns must never appear in AOCS-compliant Python code:

- `exec()` or `eval()` — arbitrary code execution
- `globals()` or `locals()` for state access — implicit state
- `setattr()` / `getattr()` for dynamic behavior — use explicit attributes
- `__import__()` — dynamic imports (use `import` or `from...import`)
- Magic strings as dict keys — use TypedDict or dataclass
- Mutable default arguments — `def f(x=[]):` ❌ use `def f(x=None): x = x or []` ✓
- Wildcard imports — `from module import *` ❌ use explicit imports ✓
- Exception swallowing — `except: pass` ❌ use specific exceptions ✓

---

## Enforcement (U7)

Recommended tools for AOCS compliance:

- **ruff**: Fast linter covering pycodestyle, pyflakes, isort, and more
- **mypy**: Static type checking (verify type hints match contracts)
- **pylint**: Detect code smells and enforce naming conventions
- **black**: Opinionated formatter (optional, helps with consistency)

Example `pyproject.toml`:

```toml
[tool.ruff]
select = ["E", "F", "W", "C90", "I", "N", "UP", "ANN", "S", "B", "A", "C4", "DTZ", "T10", "EM", "ISC", "ICN", "G", "PIE", "PT", "Q", "RSE", "RET", "SIM", "TID", "ARG", "PTH", "ERA", "PD", "PGH", "PL", "TRY", "RUF"]
ignore = ["ANN101", "ANN102"]  # Don't require type annotations for self/cls

[tool.mypy]
strict = true
warn_return_any = true
warn_unused_configs = true
```

---

## Exceptions (Always Human-Readable)

The following must remain human-readable regardless of AOCS compression:

- **Exported class/function names**: `Order`, `process_payment` — not `O`, `pp`
- **Public API names**: Anything imported by other modules
- **Test function names**: `test_empty_order_raises_error`
- **Exception messages**: `'Cannot process payment for empty order'`
- **Docstrings on public APIs**: Used by `help()`, IDEs, and documentation generators
- **Configuration keys**: `CONFIG['database_url']` — not `CFG['db_u']`
- **Log messages**: `logger.info('Processing order 12345')`

---

## Quick Reference

```
MODULE:     # @module: name | @exports: ... | @depends: ... | @mutates: ...
CONTRACT:   # @contract: (params) -> Return | constraints
THROWS:     # @throws: Error1 | Error2 | never
PURE:       # @pure: true | false
STATE:      # @state-manifest: { field: Type }
COMPLEXITY: # @complexity: O(n) time, O(1) space
ROLE:       # AOCS-ROLE: pure-logic | state-machine | adapter | io-boundary | config
HINTS:      # AOCS-INVARIANT | AOCS-FAILS-ON | AOCS-PURE | AOCS-COMPLEXITY

COMPRESS:   comprehensions, ternary, walrus, unpacking, f-strings, lambda, map/filter, any/all
READABLE:   exports, public APIs, docstrings, tests, exceptions, config, logs
TOOLS:      ruff, mypy, pylint, black
FORBIDDEN:  exec, eval, globals, setattr for reflection, mutable defaults, wildcard imports
```
