<!-- AOCS-ROLE: config -->
# AOCS: Rust

*Language extension for the [Agent-Oriented Coding Standard](./AOCS.md).*
*Requires: `AOCS.md` (base standard)*

---

## Overview

Rust's type system, ownership model, and borrow checker already enforce many AOCS principles mechanically. Ownership guarantees edit-locality (U11), the type system prevents implicit state mutation, and `Result<T, E>` makes error handling explicit. AOCS contracts complement Rust's existing guarantees by documenting intent, invariants, and complexity. This file defines Rust-specific idioms for applying the universal conventions (U1-U13) from the base standard.

---

## Module Manifest (U1)

```rust
// @module: order_service
// @exports: Order, process_order, validate_order
// @depends: payment_gateway, inventory
// @mutates: none
```

Place at the top of `lib.rs` or each module file, before the `mod` or `use` declarations.

---

## Function Contract (U2)

```rust
// @contract: (o:Order, pm:PaymentMethod) -> Result<PaymentResult, PaymentError>
// @throws: EmptyOrderError | PaymentDeclinedError
// @pure: false
// @complexity: O(n) time, O(1) space
pub fn process_payment(o: Order, pm: PaymentMethod) -> Result<PaymentResult, PaymentError> {
    // implementation
}
```

Rust's `Result<T, E>` maps directly to `@throws`. The `@throws` annotation lists specific error variants.

---

## State Manifest (U3)

```rust
// @state-manifest: {
//   cart: Vec<CartItem>,
//   total: Decimal,
//   step: CheckoutStep
// }
pub struct CheckoutState {
    pub cart: Vec<CartItem>,
    pub total: Decimal,
    pub step: CheckoutStep,
}
```

Rust's ownership model naturally enforces U11 (edit-locality):

- **Owned data**: Mutations only possible where ownership exists
- **Borrowed data**: `&T` prevents mutation, `&mut T` makes mutation explicit
- **Interior mutability**: `Cell`, `RefCell`, `Mutex` — document in `@mutates`

---

## Naming Conventions (U4)

| Layer | Style | Example |
|-------|-------|---------|
| Public types/functions | Snake_case, readable | `process_order`, `active_users` |
| Private functions | Snake_case, can be terse | `calc_tot`, `val_ord` |
| Local variables | Short, idiomatic | `ctx`, `req`, `resp`, `i`, `x` |
| Lifetimes | Single letter | `'a`, `'b`, `'static` |
| Type parameters | Single letter or descriptive | `T`, `E`, `Item` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_ITEMS`, `DEFAULT_TIMEOUT` |

Rust convention already embraces clarity with brevity. AOCS formalizes it:

```rust
// Idiomatic Rust (already AOCS-aligned)
pub fn fetch_user(client: &Client, id: &str) -> Result<User, FetchError> {
    let req = client.build_req(id)?;
    let resp = client.send(req)?;
    parse_user(&resp.body)
}
```

---

## Compression Idioms

### Error Handling with `?`

```rust
// @contract: (id:&str{len>0}) -> Result<User, Error>
// @throws: NotFoundError | InvalidIDError
pub fn get_user(id: &str) -> Result<User, Error> {
    if id.is_empty() {
        return Err(Error::InvalidID);
    }
    let user = fetch_from_db(id)?;
    Ok(user)
}
```

### Type Aliases

```rust
type O = Order;
type PM = PaymentMethod;
type PR = Result<PaymentResult, PaymentError>;
```

### Expression Patterns

| Pattern | Verbose | Compressed |
|---------|---------|-----------|
| Iterator chains | Loop with mutable vec | `.iter().filter().map().collect()` |
| Pattern matching | Nested if/else | `match expr { ... }` |
| Error propagation | `match` with early return | `result?` |
| Option handling | `match` with Some/None | `.unwrap_or(default)`, `.map()`, `.and_then()` |
| Struct update | Field-by-field | `User { age: 25, ..old_user }` |
| Turbofish | Explicit type annotation | `collect::<Vec<_>>()` |
| Closures | Named function | `|x| x * 2` |
| Range iteration | C-style loop | `for i in 0..n` |
| Destructuring | Separate assignments | `let Point { x, y } = pt` |
| If-let | Match with single arm | `if let Some(v) = opt { ... }` |
| While-let | Loop with pattern | `while let Some(v) = iter.next()` |

### Ownership Patterns

```rust
// @contract: (items:Vec<Item>) -> Decimal
// @pure: true
// @complexity: O(n)
fn calc_tot(items: Vec<Item>) -> Decimal {
    items.into_iter()
         .map(|it| it.price * it.qty)
         .sum()
}

// @contract: (items:&[Item]) -> Decimal
// @pure: true
fn calc_tot_ref(items: &[Item]) -> Decimal {
    items.iter()
         .map(|it| it.price * it.qty)
         .sum()
}
```

---

## Semantic File Roles (U9)

Declare role in the first 5 lines:

```rust
// AOCS-ROLE: pure-logic
// AOCS-INPUTS: raw_data
// AOCS-OUTPUTS: processed_data

use crate::types::*;
```

Role-specific patterns:

- **pure-logic**: No I/O, no `unsafe`, functions take `&T` or owned `T`, return owned results
- **state-machine**: State transitions, single source of truth, use enums for states
- **adapter**: External service integration, error translation to domain errors
- **io-boundary**: File/network/database, use `async` for I/O, `?` for error propagation
- **config**: Constants, configuration structs, `lazy_static` or `once_cell` for initialization

---

## Structured Hints (U10)

```rust
// AOCS-INVARIANT: output.len() == input.len()
// AOCS-FAILS-ON: empty slice
// AOCS-PURE: true
// AOCS-COMPLEXITY: O(n)
fn transform_data(input: &[i32]) -> Vec<i32> {
    input.iter().map(|x| x * 2).collect()
}
```

---

## Example: Payment Processing

### Human-optimized (~210 tokens)

```rust
pub async fn process_payment(
    order: Order,
    payment_method: PaymentMethod,
) -> Result<PaymentResult, PaymentError> {
    // Validate that the order contains items before processing
    if order.items.is_empty() {
        return Err(PaymentError::EmptyOrder {
            message: String::from("Cannot process payment for empty order"),
        });
    }
    
    // Calculate the total amount for all items in the order
    let mut total = Decimal::ZERO;
    for item in &order.items {
        let item_total = item.price.checked_mul(item.quantity)?;
        total = total.checked_add(item_total)?;
    }
    
    // Charge the payment method with the calculated total
    let result = payment_method
        .charge(&order.customer_id, total)
        .await?;
    
    // Return structured payment result
    Ok(PaymentResult {
        success: result.approved,
        transaction_id: result.id,
        amount: total,
    })
}
```

### Agent-optimized (~75 tokens)

```rust
// @contract: (o:Order{items:NonEmpty}, pm:PaymentMethod) -> Result<PaymentResult, PaymentError>
// @throws: EmptyOrderError | PaymentDeclinedError | ArithmeticError
// @pure: false
pub async fn proc_pay(o: Order, pm: PaymentMethod) -> Result<PaymentResult, PaymentError> {
    if o.items.is_empty() {
        return Err(PaymentError::EmptyOrder);
    }
    let amt = o.items.iter()
                     .try_fold(Decimal::ZERO, |acc, it| {
                         acc.checked_add(it.price.checked_mul(it.qty)?)
                     })?;
    let r = pm.charge(&o.customer_id, amt).await?;
    Ok(PaymentResult { success: r.approved, transaction_id: r.id, amount: amt })
}
```

**Token savings: 64%**

---

## Example: Data Grouping

### Human-optimized (~130 tokens)

```rust
use std::collections::HashMap;

pub fn group_users_by_role(users: Vec<User>) -> HashMap<String, Vec<User>> {
    let mut groups: HashMap<String, Vec<User>> = HashMap::new();
    
    for user in users {
        let role = user.role.clone();
        
        match groups.get_mut(&role) {
            Some(user_list) => {
                user_list.push(user);
            }
            None => {
                groups.insert(role, vec![user]);
            }
        }
    }
    
    groups
}
```

### Agent-optimized (~48 tokens)

```rust
// @contract: (users:Vec<User>{role:String}) -> HashMap<String,Vec<User>>
// @complexity: O(n) time, O(n) space
// @pure: true
use std::collections::HashMap;

pub fn grp_by_role(users: Vec<User>) -> HashMap<String, Vec<User>> {
    users.into_iter().fold(HashMap::new(), |mut m, u| {
        m.entry(u.role.clone()).or_insert_with(Vec::new).push(u);
        m
    })
}
```

**Token savings: 63%**

---

## Example: Result Chain

### Human-optimized (~145 tokens)

```rust
pub fn parse_and_validate_order(json_data: &str) -> Result<Order, OrderError> {
    // Parse the JSON string into an order structure
    let order: Order = match serde_json::from_str(json_data) {
        Ok(parsed_order) => parsed_order,
        Err(parse_error) => {
            return Err(OrderError::ParseError {
                details: parse_error.to_string(),
            });
        }
    };
    
    // Validate that the order has a customer ID
    if order.customer_id.is_empty() {
        return Err(OrderError::ValidationError {
            field: String::from("customer_id"),
            message: String::from("Customer ID is required"),
        });
    }
    
    // Validate that the order has items
    if order.items.is_empty() {
        return Err(OrderError::ValidationError {
            field: String::from("items"),
            message: String::from("Order must contain at least one item"),
        });
    }
    
    Ok(order)
}
```

### Agent-optimized (~58 tokens)

```rust
// @contract: (json:&str) -> Result<Order, OrderError>
// @throws: ParseError | ValidationError
// @pure: true
pub fn parse_val_ord(json: &str) -> Result<Order, OrderError> {
    let o: Order = serde_json::from_str(json)
        .map_err(|e| OrderError::Parse(e.to_string()))?;
    
    if o.customer_id.is_empty() {
        return Err(OrderError::Validation("customer_id required".into()));
    }
    if o.items.is_empty() {
        return Err(OrderError::Validation("items required".into()));
    }
    
    Ok(o)
}
```

**Token savings: 60%**

---

## Example: Async I/O with Error Handling

### Human-optimized (~120 tokens)

```rust
use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

pub async fn process_file(input_path: &str, output_path: &str) -> Result<usize, std::io::Error> {
    // Open the input file for reading
    let mut input_file = File::open(input_path).await?;
    
    // Read the contents into a buffer
    let mut buffer = Vec::new();
    input_file.read_to_end(&mut buffer).await?;
    
    // Transform the data (example: convert to uppercase)
    let transformed = buffer.iter()
        .map(|byte| byte.to_ascii_uppercase())
        .collect::<Vec<u8>>();
    
    // Write to the output file
    let mut output_file = File::create(output_path).await?;
    output_file.write_all(&transformed).await?;
    
    Ok(transformed.len())
}
```

### Agent-optimized (~62 tokens)

```rust
// @contract: (inp:&str, out:&str) -> Result<usize, io::Error>
// @throws: FileNotFoundError | PermissionDenied | WriteError
// @pure: false
// AOCS-ROLE: io-boundary
use tokio::fs::File;
use tokio::io::{AsyncReadExt, AsyncWriteExt};

pub async fn proc_file(inp: &str, out: &str) -> Result<usize, std::io::Error> {
    let mut buf = Vec::new();
    File::open(inp).await?.read_to_end(&mut buf).await?;
    let trans: Vec<u8> = buf.iter().map(|b| b.to_ascii_uppercase()).collect();
    File::create(out).await?.write_all(&trans).await?;
    Ok(trans.len())
}
```

**Token savings: 48%**

---

## Forbidden Patterns (U12)

These patterns must never appear in AOCS-compliant Rust code (unless explicitly allowed in `aocs.json`):

- `unsafe` blocks — breaks memory safety guarantees (exception: FFI, performance-critical sections)
- `Box<dyn Any>` — type erasure loses compile-time safety
- `unwrap()` / `expect()` — panic on error (use `?` or `match`)
- Excessive `macro_rules!` — reduces code clarity and debuggability
- Global mutable state with `static mut` — use `Mutex<T>`, `RwLock<T>`, or `once_cell`
- `mem::transmute` — undefined behavior risk
- `.clone()` everywhere — understand ownership instead
- Ignoring `Result` — `let _ = result;` ❌ use `result?` or explicit match ✓

---

## Enforcement (U7)

Recommended tools for AOCS compliance:

- **rustfmt**: Standard formatter (part of Rust toolchain)
- **clippy**: Official Rust linter with 500+ checks
- **cargo check**: Fast type checking without code generation
- **cargo test**: Built-in test runner
- **cargo-audit**: Security vulnerability scanner
- **cargo-deny**: Dependency license and security checking

Example `clippy.toml`:

```toml
# Enforce stricter linting
warn-on-all-wildcard-imports = true
disallowed-methods = [
    { path = "std::env::set_var", reason = "use config instead" },
]

# Deny common mistakes
unwrap-used = "deny"
expect-used = "deny"
panic = "deny"
```

Example `.cargo/config.toml`:

```toml
[target.'cfg(all())']
rustflags = [
    "-D", "warnings",           # Deny all warnings
    "-D", "clippy::all",        # All clippy lints
    "-D", "clippy::pedantic",   # Pedantic clippy
    "-W", "clippy::nursery",    # Experimental lints
]
```

---

## Exceptions (Always Human-Readable)

The following must remain human-readable regardless of AOCS compression:

- **Public function/type names**: `process_payment`, `Order` — not `pp`, `O`
- **Public API documentation**: `///` doc comments (used by `cargo doc`)
- **Error messages**: `Error::Validation("customer_id required")`
- **Test names**: `#[test] fn test_empty_order_returns_error()`
- **Log messages**: `log::info!("Processing order {}", order_id)`
- **Configuration keys**: `config.database_url` — not `cfg.db_u`
- **Feature flags**: `#[cfg(feature = "encryption")]` — not `#[cfg(feature = "enc")]`
- **Crate names**: `payment_gateway` — always descriptive

---

## Rust-Specific Best Practices

### Prefer Owned Types in Contracts

```rust
// @contract: (items:Vec<Item>) -> Decimal
// Consumes items, clear ownership transfer
pub fn calc_total(items: Vec<Item>) -> Decimal {
    items.into_iter().map(|it| it.price * it.qty).sum()
}

// @contract: (items:&[Item]) -> Decimal
// Borrows items, preserves caller's ownership
pub fn calc_total_ref(items: &[Item]) -> Decimal {
    items.iter().map(|it| it.price * it.qty).sum()
}
```

### Use Enums for State Machines

```rust
// AOCS-ROLE: state-machine
// @state-manifest: CheckoutState with variants
pub enum CheckoutState {
    Cart { items: Vec<CartItem> },
    Payment { items: Vec<CartItem>, method: PaymentMethod },
    Confirmed { order_id: String },
}

// @contract: (state:CheckoutState, action:Action) -> Result<CheckoutState, Error>
pub fn transition(state: CheckoutState, action: Action) -> Result<CheckoutState, Error> {
    match (state, action) {
        (CheckoutState::Cart { items }, Action::SelectPayment(method)) => {
            Ok(CheckoutState::Payment { items, method })
        }
        (CheckoutState::Payment { items, method }, Action::Confirm) => {
            let order_id = process_order(items, method)?;
            Ok(CheckoutState::Confirmed { order_id })
        }
        _ => Err(Error::InvalidTransition),
    }
}
```

### Document Unsafe Blocks

```rust
// @contract: (ptr:*const u8, len:usize) -> &[u8]
// @throws: never (caller must ensure validity)
// @pure: true
// UNSAFE: caller must ensure ptr is valid and len is correct
pub unsafe fn from_raw_parts(ptr: *const u8, len: usize) -> &[u8] {
    std::slice::from_raw_parts(ptr, len)
}
```

---

## Quick Reference

```
MODULE:     // @module: name | @exports: ... | @depends: ... | @mutates: ...
CONTRACT:   // @contract: (params) -> Result<T, E>
THROWS:     // @throws: ErrorVariant1 | ErrorVariant2
PURE:       // @pure: true | false
STATE:      // @state-manifest: { field: Type }
COMPLEXITY: // @complexity: O(n) time, O(1) space
ROLE:       // AOCS-ROLE: pure-logic | state-machine | adapter | io-boundary | config
HINTS:      // AOCS-INVARIANT | AOCS-FAILS-ON | AOCS-PURE | AOCS-COMPLEXITY

COMPRESS:   iterators, ?, match, closures, destructuring, turbofish, if-let, while-let
READABLE:   public names, /// docs, errors, tests, logs, config, features, crates
TOOLS:      rustfmt, clippy, cargo check, cargo test, cargo-audit, cargo-deny
FORBIDDEN:  unsafe (unless allowed), unwrap/expect, Box<dyn Any>, static mut, transmute
```
