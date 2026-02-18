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

---

**Previous:** [Part I: Core Philosophy](/philosophy)  
**Next:** [Part III: Extension Protocol](/extension)
