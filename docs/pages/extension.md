<!-- AOCS-ROLE: config -->
# AOCS: Language Extension Protocol

*Part of the [Agent-Oriented Coding Standard](./AOCS.md).*
*Use this file to create an AOCS language definition for any language not already covered.*

---

## Purpose

This file is a blueprint. If your project uses a language without an existing `AOCS-{language}.md` file, follow this protocol to create one. The resulting file should be self-contained, reference the base standard, and be immediately usable by any agent.

---

## Output File Format

The file you create must:

- Be named `AOCS-{language}.md` (lowercase, e.g., `AOCS-python.md`, `AOCS-rust.md`, `AOCS-go.md`)
- Begin with this header:

```markdown
# AOCS: {Language}

*Language extension for the [Agent-Oriented Coding Standard](./AOCS.md).*
*Requires: `AOCS.md` (base standard)*

---
```

- Contain all sections defined in the template below
- Be droppable into any project's `docs/` folder alongside `AOCS.md`

---

## Step 1: Map Universal Conventions

Map each of the seven universal conventions (U1-U7) from the base standard to the target language's native idioms. Use this table as your starting point:

| Convention | What to define | If language lacks native support |
|------------|---------------|----------------------------------|
| **U1. Module Manifests** | How to declare `@module`, `@exports`, `@depends`, `@mutates` | Use structured comments at file top |
| **U2. Function Contracts** | How to declare `@contract`, `@throws`, `@pure`, `@complexity` | Use structured comments above functions |
| **U3. State Manifests** | How to declare `@state-manifest` | Use structured comments; for stateless languages, note "N/A" |
| **U4. Naming** | Terse implementation names vs. readable specification names | Map to language conventions (e.g., Python's `_` prefix for private) |
| **U5. Comments** | Contract = required, Why = rare, What = never | Same across all languages |
| **U6. Error Handling** | How to declare `@throws` with typed errors | Map to language's error model (exceptions, Result types, error codes) |
| **U7. Enforcement** | Recommended linters/tools for the language | List specific tools (e.g., `eslint`, `clippy`, `golint`) |

### Language-Specific Considerations

Some languages require special handling:

- **No exceptions** (Go, Rust): Use `@returns: Result<T, E>` or `@returns: (T, error)` instead of `@throws`
- **No modules** (C, assembly): Use file-level `@module` comments
- **No classes** (C, Go): Use `@state-manifest` in struct/package comments
- **Functional languages** (Haskell, Elixir): Contracts map naturally to type signatures; focus compression on point-free style and composition
- **Dynamically typed** (Python, Ruby, JS): Contracts are critical — they're the only formal specification of function behavior

---

## Step 2: Define Compression Idioms

Identify language-specific patterns that reduce token count while preserving correctness:

### Categories to Cover

1. **Expression over statement** — Can multi-line logic become a single expression?
   - List comprehensions, ternary operators, match expressions
   
2. **Functional methods** — Does the language have map/filter/reduce equivalents?
   - Iterator chains, stream operations, pipeline operators

3. **Type/name abbreviation** — What's the convention for short names?
   - Type aliases, import aliases, single-letter variables in tight scopes

4. **Destructuring/unpacking** — Can compound assignments be compressed?
   - Tuple unpacking, pattern matching, destructuring

5. **Implicit returns** — Does the language support expression-bodied functions?
   - Arrow functions, implicit returns, expression blocks

### Format

Present as a comparison table:

```markdown
| Pattern | Verbose | Compressed |
|---------|---------|-----------|
| ... | ... | ... |
```

---

## Step 3: Specify Exceptions

Define what must remain human-readable regardless of compression. At minimum:

- **Public API names** (exported functions, types, interfaces)
- **Test descriptions** (test names, assertion messages)
- **Error messages** (user-facing and log messages)
- **Git commit messages and PR descriptions**
- **Documentation strings on public APIs** (if the language uses them for tooling)

Add language-specific exceptions as needed:

- **Python**: Docstrings on public functions (used by `help()` and IDE tooling)
- **Rust**: `///` doc comments (used by `cargo doc`)
- **Go**: Package comments and exported function comments (used by `godoc`)

---

## Step 4: Provide Examples

Include at least **two** full examples showing:

1. **Human-optimized version** with approximate token count
2. **Agent-optimized version** with approximate token count  
3. **Percentage savings**

Choose examples that demonstrate:

- A function with contracts, error handling, and logic (core pattern)
- A data transformation or collection operation (compression showcase)

### Example Template

```markdown
### Human-optimized (~N tokens)

\`\`\`{language}
{verbose code}
\`\`\`

### Agent-optimized (~N tokens)

\`\`\`{language}
{compressed code with contracts}
\`\`\`

**Token savings: N%**
```

---

## Step 5: Write the Quick Reference

End the file with a quick reference block that an agent can scan in seconds:

```markdown
## Quick Reference

\`\`\`
MODULE:     {language-specific @module syntax}
CONTRACT:   {language-specific @contract syntax}
STATE:      {language-specific @state-manifest syntax}
ERRORS:     {language-specific error declaration}

COMPRESS:   {comma-separated list of compression idioms}
READABLE:   {comma-separated list of exceptions}
TOOLS:      {recommended linters/enforcers}
\`\`\`
```

---

## Step 6: Validate

Before adding the file to your project, verify:

- [ ] File is named `AOCS-{language}.md`
- [ ] Header references `AOCS.md` as a dependency
- [ ] All seven universal conventions (U1-U7) are mapped
- [ ] Compression idioms are documented with comparison table
- [ ] Exceptions (always-readable items) are listed
- [ ] At least two examples with token counts and savings percentages
- [ ] Quick reference block is present
- [ ] File is self-contained — an agent can read it without other language files

---

## Worked Example: Python

Here's what running this protocol produces for Python:

### Module Manifest (U1)

```python
# @module: order_service
# @exports: process_order, validate_order, Order
# @depends: payment_gateway, inventory
# @mutates: none
```

### Function Contract (U2)

```python
# @contract: (o:Order, pm:PaymentMethod) -> PaymentResult
# @throws: EmptyOrderError | PaymentDeclinedError
# @pure: false
```

### Compression Idioms

| Pattern | Verbose | Compressed |
|---------|---------|-----------|
| Comprehension | `for` loop + `append` | `[x.id for x in users if x.active]` |
| Ternary | `if/else` block | `val if cond else default` |
| Unpacking | `a = t[0]; b = t[1]` | `a, b = t` |
| Walrus | `x = f(); if x:` | `if (x := f()):` |
| f-strings | `format()` or `%` | `f"User {id}: {name}"` |

### Example

**Human-optimized (~120 tokens):**

```python
def find_active_users(users, days_threshold=30):
    """Return users who have logged in within the threshold period."""
    from datetime import datetime, timedelta
    cutoff_date = datetime.now() - timedelta(days=days_threshold)
    active_users = []
    for user in users:
        if user.last_login > cutoff_date:
            active_users.append(user)
    return active_users
```

**Agent-optimized (~55 tokens):**

```python
# @contract: (users:list[User], d:int=30) -> list[User] | subset, order:preserved
# @pure: true
from datetime import datetime,timedelta
def fau(us,d=30):
    c=datetime.now()-timedelta(days=d)
    return[u for u in us if u.last_login>c]
```

**Token savings: ~54%**

### Quick Reference

```
MODULE:     # @module: name | @exports: ... | @depends: ... | @mutates: ...
CONTRACT:   # @contract: (params) -> Return | constraints
ERRORS:     # @throws: Error1 | Error2

COMPRESS:   comprehensions, ternary, unpacking, walrus, f-strings
READABLE:   exports, docstrings on public APIs, test names, error messages
TOOLS:      ruff, mypy, pylint
```

---

*This protocol is self-extending. Any agent can follow these steps to create a compliant AOCS language file for any programming language.*
