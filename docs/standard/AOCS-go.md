# AOCS: Go

*Language extension for the [Agent-Oriented Coding Standard](./AOCS.md).*
*Requires: `AOCS.md` (base standard)*

---

## Overview

Go's strong conventions (gofmt, go vet) and explicit error handling make it naturally compatible with AOCS principles. The language already favors brevity — short variable names, minimal syntax, explicit dependencies. AOCS complements Go's philosophy by adding formal contracts and module manifests. This file defines Go-specific idioms for applying the universal conventions (U1-U13) from the base standard.

---

## Module Manifest (U1)

```go
// @module: orderservice
// @exports: Order, ProcessOrder, ValidateOrder
// @depends: paymentgateway, inventory
// @mutates: none
```

Place at the top of each `.go` file, before the `package` declaration.

---

## Function Contract (U2)

```go
// @contract: (o:Order, pm:PaymentMethod) -> (PaymentResult, error)
// @throws: ErrEmptyOrder | ErrPaymentDeclined
// @pure: false
// @complexity: O(n) time, O(1) space
func ProcessPayment(o Order, pm PaymentMethod) (PaymentResult, error) {
    // implementation
}
```

Go's `(T, error)` return pattern maps naturally to `@throws`. List specific error values or types.

---

## State Manifest (U3)

```go
// @state-manifest: {
//   cart: []CartItem,
//   total: decimal.Decimal,
//   step: CheckoutStep
// }
type CheckoutState struct {
    Cart  []CartItem      // Items in shopping cart
    Total decimal.Decimal // Running total
    Step  CheckoutStep    // Current checkout phase
}
```

Go's exported/unexported field convention aligns with specification vs. implementation:

- **Exported fields** (capitalized): Part of the public contract, must be documented
- **Unexported fields** (lowercase): Implementation details, can use terse names

---

## Naming Conventions (U4)

| Layer | Style | Example |
|-------|-------|---------|
| Exported types/functions | PascalCase, readable | `ProcessOrder`, `ActiveUsers` |
| Unexported functions | camelCase, can be terse | `calcTot`, `valOrd`, `procItems` |
| Local variables | Short, idiomatic Go | `ctx`, `req`, `resp`, `i`, `err` |
| Method receivers | Single letter | `(o *Order)`, `(c *Client)` |
| Package names | Short, lowercase | `http`, `json`, `sql` |
| Interface names | `er` suffix | `Reader`, `Writer`, `Formatter` |

Go convention already embraces brevity. AOCS formalizes it:

```go
// Idiomatic Go (already AOCS-aligned)
func (c *Client) Get(ctx context.Context, id string) (*User, error) {
    req, err := c.buildReq(ctx, id)
    if err != nil {
        return nil, err
    }
    
    resp, err := c.do(req)
    if err != nil {
        return nil, err
    }
    
    return parseUser(resp.Body)
}
```

---

## Compression Idioms

### Error Handling

Go's explicit error handling is already compressed. AOCS adds contract annotations:

```go
// @contract: (id:string{len>0}) -> (*User, error)
// @throws: ErrNotFound | ErrInvalidID
func GetUser(id string) (*User, error) {
    if id == "" {
        return nil, ErrInvalidID
    }
    // ...
}
```

### Type Aliases

```go
type (
    O  = Order
    PM = PaymentMethod
    PR = PaymentResult
)
```

### Expression Patterns

| Pattern | Verbose | Compressed |
|---------|---------|-----------|
| Error check + return | Multi-line if block | `if err != nil { return err }` |
| Struct initialization | Field-by-field assignment | `User{ID: id, Name: name}` |
| Slice/map operations | Loop with append | `append(slice, items...)` |
| Zero value check | `if x == 0` or `if x == ""` | `if x == zero` (generic) |
| Multiple return | Separate statements | `return result, nil` |
| Range loops | C-style for | `for i, v := range items` |
| Type assertion | Separate check + assert | `v, ok := i.(Type)` |
| Context value | Multi-line retrieval | `v := ctx.Value(key).(Type)` |

### Defer for Cleanup

```go
// @contract: (path:string) -> error
// @throws: ErrFileNotFound | ErrPermissionDenied
func processFile(path string) error {
    f, err := os.Open(path)
    if err != nil {
        return err
    }
    defer f.Close()
    
    return process(f)
}
```

---

## Semantic File Roles (U9)

Declare role in the first 5 lines:

```go
// AOCS-ROLE: pure-logic
// AOCS-INPUTS: raw_data
// AOCS-OUTPUTS: processed_data

package calculator
```

Role-specific patterns:

- **pure-logic**: No I/O, no global state, pure functions only
- **state-machine**: State transitions, single source of truth for mutable state
- **adapter**: External service integration (HTTP clients, database adapters)
- **io-boundary**: File/network/database operations, resource management
- **config**: Configuration structs, constants, no logic

---

## Structured Hints (U10)

```go
// AOCS-INVARIANT: len(output) == len(input)
// AOCS-FAILS-ON: nil slice, empty slice
// AOCS-PURE: true
// AOCS-COMPLEXITY: O(n)
func TransformData(input []int) []int {
    output := make([]int, len(input))
    for i, v := range input {
        output[i] = v * 2
    }
    return output
}
```

---

## Example: HTTP Handler

### Human-optimized (~185 tokens)

```go
func HandleOrderPayment(w http.ResponseWriter, r *http.Request) {
    // Parse the request body to get order details
    var requestBody OrderPaymentRequest
    decoder := json.NewDecoder(r.Body)
    err := decoder.Decode(&requestBody)
    if err != nil {
        http.Error(w, "Invalid request body", http.StatusBadRequest)
        return
    }
    
    // Validate that the order has items
    if len(requestBody.Order.Items) == 0 {
        http.Error(w, "Order cannot be empty", http.StatusBadRequest)
        return
    }
    
    // Process the payment
    paymentService := payment.NewService()
    result, err := paymentService.ProcessPayment(
        requestBody.Order,
        requestBody.PaymentMethod,
    )
    if err != nil {
        http.Error(w, "Payment processing failed", http.StatusInternalServerError)
        return
    }
    
    // Return success response
    w.Header().Set("Content-Type", "application/json")
    w.WriteStatus(http.StatusOK)
    json.NewEncoder(w).Encode(result)
}
```

### Agent-optimized (~78 tokens)

```go
// @contract: (w:ResponseWriter, r:*Request{method:POST,body:OrderPaymentReq}) -> void
// @throws: ErrInvalidJSON | ErrEmptyOrder | ErrPaymentFailed
// @pure: false
// AOCS-ROLE: adapter
func HandleOrderPay(w http.ResponseWriter, r *http.Request) {
    var req OrderPaymentReq
    if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
        http.Error(w, "invalid_request", 400)
        return
    }
    if len(req.Order.Items) == 0 {
        http.Error(w, "empty_order", 400)
        return
    }
    res, err := payment.Process(req.Order, req.PaymentMethod)
    if err != nil {
        http.Error(w, "payment_failed", 500)
        return
    }
    w.Header().Set("Content-Type", "application/json")
    json.NewEncoder(w).Encode(res)
}
```

**Token savings: 58%**

---

## Example: Data Aggregation

### Human-optimized (~140 tokens)

```go
func CalculateOrderStatistics(orders []Order) OrderStats {
    var totalRevenue float64
    var totalItems int
    ordersByStatus := make(map[string]int)
    
    for _, order := range orders {
        // Accumulate revenue
        totalRevenue += order.Total
        
        // Count items
        for _, item := range order.Items {
            totalItems += item.Quantity
        }
        
        // Group by status
        status := order.Status
        count, exists := ordersByStatus[status]
        if exists {
            ordersByStatus[status] = count + 1
        } else {
            ordersByStatus[status] = 1
        }
    }
    
    return OrderStats{
        Revenue:     totalRevenue,
        TotalItems:  totalItems,
        ByStatus:    ordersByStatus,
    }
}
```

### Agent-optimized (~62 tokens)

```go
// @contract: (orders:[]Order) -> OrderStats
// @complexity: O(n*m) where m=avg items per order
// @pure: true
func CalcOrderStats(ords []Order) OrderStats {
    var rev float64
    var items int
    byStatus := make(map[string]int)
    
    for _, o := range ords {
        rev += o.Total
        for _, it := range o.Items {
            items += it.Qty
        }
        byStatus[o.Status]++
    }
    
    return OrderStats{Revenue: rev, TotalItems: items, ByStatus: byStatus}
}
```

**Token savings: 56%**

---

## Example: Error Wrapping

### Human-optimized (~95 tokens)

```go
func FetchUserProfile(ctx context.Context, userID string) (*UserProfile, error) {
    // Call the external API to get user data
    user, err := externalAPI.GetUser(ctx, userID)
    if err != nil {
        return nil, fmt.Errorf("failed to fetch user from external API: %w", err)
    }
    
    // Call the database to get profile data
    profile, err := database.GetProfile(ctx, userID)
    if err != nil {
        return nil, fmt.Errorf("failed to fetch profile from database: %w", err)
    }
    
    // Merge the data
    return mergeUserProfile(user, profile), nil
}
```

### Agent-optimized (~55 tokens)

```go
// @contract: (ctx:Context, uid:string) -> (*UserProfile, error)
// @throws: ErrUserNotFound | ErrDatabaseUnavailable
// @pure: false
func FetchProfile(ctx context.Context, uid string) (*UserProfile, error) {
    u, err := externalAPI.GetUser(ctx, uid)
    if err != nil {
        return nil, fmt.Errorf("fetch user: %w", err)
    }
    p, err := db.GetProfile(ctx, uid)
    if err != nil {
        return nil, fmt.Errorf("fetch profile: %w", err)
    }
    return mergeProfile(u, p), nil
}
```

**Token savings: 42%**

---

## Forbidden Patterns (U12)

These patterns must never appear in AOCS-compliant Go code:

- `reflect` package — dynamic type inspection/manipulation (exception: serialization libraries)
- `unsafe` package — breaks type safety and memory safety
- `init()` functions — implicit initialization order, prefer explicit setup
- `interface{}` as catch-all — use generics or specific types
- `panic()` for control flow — use `error` returns
- Global mutable state — use dependency injection
- `goto` — use structured control flow
- Type assertions without checking — `v := i.(Type)` ❌ use `v, ok := i.(Type)` ✓

---

## Enforcement (U7)

Recommended tools for AOCS compliance:

- **gofmt**: Standard formatter (run automatically)
- **go vet**: Built-in static analyzer for common mistakes
- **golangci-lint**: Meta-linter running 50+ linters
- **staticcheck**: Advanced static analysis
- **gosec**: Security-focused linter

Example `.golangci.yml`:

```yaml
linters:
  enable:
    - errcheck      # Check error returns
    - gosimple      # Simplify code
    - govet         # Go vet
    - ineffassign   # Detect ineffectual assignments
    - staticcheck   # Advanced static analysis
    - unused        # Unused code
    - gocyclo       # Cyclomatic complexity
    - gofmt         # Format checking
    - misspell      # Spelling
    - goconst       # Repeated strings that could be constants
    - dupl          # Duplicate code detection
    - gosec         # Security issues

linters-settings:
  gocyclo:
    min-complexity: 15
```

---

## Exceptions (Always Human-Readable)

The following must remain human-readable regardless of AOCS compression:

- **Exported names**: `Order`, `ProcessPayment` — not `O`, `PP`
- **Package names**: `orderservice` — always descriptive
- **Public API documentation**: Comments on exported functions/types
- **Error messages**: `errors.New("invalid order: missing items")`
- **Log messages**: `log.Printf("Processing order %s", orderID)`
- **Configuration keys**: `config.DatabaseURL` — not `cfg.DBU`
- **Test names**: `TestProcessPayment_EmptyOrder_ReturnsError`
- **HTTP endpoints**: `/api/orders` — not `/api/o`

---

## Quick Reference

```
MODULE:     // @module: name | @exports: ... | @depends: ... | @mutates: ...
CONTRACT:   // @contract: (params) -> (Return, error)
THROWS:     // @throws: ErrType1 | ErrType2
PURE:       // @pure: true | false
STATE:      // @state-manifest: { field: Type }
COMPLEXITY: // @complexity: O(n) time, O(1) space
ROLE:       // AOCS-ROLE: pure-logic | state-machine | adapter | io-boundary | config
HINTS:      // AOCS-INVARIANT | AOCS-FAILS-ON | AOCS-PURE | AOCS-COMPLEXITY

COMPRESS:   short names, early returns, struct literals, defer, range, type assertions
READABLE:   exports, package names, public docs, errors, logs, config, tests
TOOLS:      gofmt, go vet, golangci-lint, staticcheck, gosec
FORBIDDEN:  reflect, unsafe, init(), interface{} catch-all, panic for flow, global state
```
