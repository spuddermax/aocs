# Part III: Language Extension Protocol

To add a new language to AOCS, follow this bootstrap algorithm.

## Step 1: Map Core Concepts

For each universal convention (U1-U7), identify the language's native idiom:

| Concept | Check if language has... | If not, use fallback... |
|---------|--------------------------|-------------------------|
| Contracts | Type system, assertions, decorators | Structured comments |
| Modules | Native module system | File-level comment headers |
| State | Class/struct fields, closure scope | Comment manifest |
| Errors | Typed exceptions or Result types | Enum or comment declaration |
| Naming | Conventional short names (i, x, acc) | Abbreviate common terms |

## Step 2: Define Compression Idioms

Identify language-specific patterns for brevity:
- Ternary operators, arrow functions, comprehensions
- Operator overloading, pipeline operators
- Native functional methods (map/reduce/filter equivalents)

## Step 3: Specify Exceptions

What stays human-readable?
- Public APIs (function signatures, exports)
- Tests (assertions, descriptions)
- Error messages
- Git commit messages and PR descriptions

## Step 4: Example Implementations

Provide at least three examples:
1. Human-optimized version
2. Agent-optimized version
3. Token count comparison

## Step 5: Validation

Before appending to AOCS, verify:
- [ ] All seven universal conventions mapped
- [ ] Compression idioms preserve correctness
- [ ] Exceptions clearly documented
- [ ] Examples demonstrate measurable token savings

---

**Previous:** [Part II: Universal Conventions](/conventions)  
**Next:** [TypeScript](/typescript)
