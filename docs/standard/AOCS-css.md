# AOCS: CSS

*Language extension for the [Agent-Oriented Coding Standard](./AOCS.md).*
*Requires: `AOCS.md` (base standard)*

---

## Overview

CSS AOCS patterns focus on design tokens, scoped styling, and state-driven selectors. The goal: an agent can understand the entire design system by reading the `:root` block, and can modify any component's styles without reading unrelated CSS.

---

## Design Token Manifest (U1 + U3)

Declare the design system as custom properties in `:root`:

```css
/* @design-system: AppName v1.0
   color.primary: brand blue
   color.text: main text color
   spacing.unit: base spacing multiplier
   radius: standard border radius
   motion: default transition duration
*/
:root {
  /* Color */
  --c-pri: #2563eb;
  --c-pri-hover: #1e40af;
  --c-acc: #10b981;
  --c-bg: #ffffff;
  --c-bg-2: #f8fafc;
  --c-txt: #1e293b;
  --c-txt-dim: #64748b;
  --c-border: #e2e8f0;
  --c-error: #ef4444;
  --c-success: #22c55e;

  /* Spacing */
  --sp-u: 0.25rem;
  --sp-xs: calc(2 * var(--sp-u));   /* 8px */
  --sp-sm: calc(3 * var(--sp-u));   /* 12px */
  --sp-md: calc(4 * var(--sp-u));   /* 16px */
  --sp-lg: calc(6 * var(--sp-u));   /* 24px */
  --sp-xl: calc(8 * var(--sp-u));   /* 32px */

  /* Shape */
  --r: 0.5rem;
  --r-sm: 0.25rem;
  --r-full: 9999px;

  /* Motion */
  --m: 200ms;
  --m-fast: 100ms;
  --m-slow: 300ms;

  /* Layout */
  --max-w: 1200px;
  --sidebar-w: 280px;
}
```

This is the single source of truth. No magic numbers elsewhere in the stylesheet.

---

## Scope Blocks (U1)

Group styles by component with `@scope` comments:

```css
/* @scope: ProductCard component */
.product-card {
  padding: var(--sp-md);
  border: 1px solid var(--c-border);
  border-radius: var(--r);
  transition: transform var(--m);
}
.product-card:hover {
  transform: translateY(-2px);
}
.product-card .price {
  color: var(--c-pri);
  font-weight: 700;
}
/* end @scope */
```

An agent working on the ProductCard component reads only the code between `@scope` markers.

---

## State Selectors (U3)

Use `data-state` attribute selectors instead of toggled classes:

```css
/* ❌ Bad: class-based state */
.modal { display: none; }
.modal.open { display: block; }
.modal.open .overlay { opacity: 1; }

/* ✅ Good: data-state contract */
.modal[data-state="closed"] { display: none; }
.modal[data-state="open"] { display: block; }
.modal[data-state="open"] .overlay { opacity: 1; }
```

Benefits:
- State is visible in HTML inspector
- JavaScript sets `data-state`, CSS responds — clean contract
- No class name collisions between state and styling

---

## Naming Conventions (U4)

### Compressed Custom Properties

| Prefix | Meaning | Example |
|--------|---------|---------|
| `--c-` | Color | `--c-pri`, `--c-txt` |
| `--sp-` | Spacing | `--sp-md`, `--sp-lg` |
| `--r` | Border radius | `--r`, `--r-sm` |
| `--m` | Motion/transition | `--m`, `--m-fast` |
| `--max-w` | Max width | `--max-w` |
| `--font-` | Font family | `--font-mono` |
| `--z-` | Z-index | `--z-modal`, `--z-tooltip` |

### Class Names

- **Styling only**: `.card`, `.btn-primary`, `.price`
- **Never used for JavaScript hooks**: use `data-action` instead
- **Short but meaningful**: `.card` not `.product-card-wrapper-container`

---

## Compression Idioms

| Pattern | Verbose | Compressed |
|---------|---------|-----------|
| Shorthand properties | `margin-top: 0; margin-right: auto; ...` | `margin: 0 auto` |
| Custom properties | repeated `#2563eb` | `var(--c-pri)` |
| Calc expressions | hardcoded values | `calc(4 * var(--sp-u))` |
| Comma selectors | duplicate rule blocks | `.a, .b, .c { color: red }` |
| Nesting (native) | repeated parent selectors | `& .child { ... }` |

---

## Dark Mode

Define dark mode as an override layer:

```css
[data-theme="dark"] {
  --c-bg: #0f172a;
  --c-bg-2: #1e293b;
  --c-txt: #e2e8f0;
  --c-txt-dim: #94a3b8;
  --c-border: #334155;
}
```

All components automatically adapt — no per-component dark mode rules needed.

---

## Example: Full Component

### Human-optimized

```css
.shopping-cart-item {
  display: flex;
  align-items: center;
  padding: 16px;
  margin-bottom: 8px;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  transition: background-color 200ms ease;
}

.shopping-cart-item:hover {
  background-color: #f9fafb;
}

.shopping-cart-item .item-name {
  font-weight: 600;
  color: #1f2937;
}

.shopping-cart-item .item-price {
  color: #2563eb;
  font-weight: 700;
  margin-left: auto;
}
```

### Agent-optimized

```css
/* @scope: CartItem */
.cart-item {
  display: flex;
  align-items: center;
  padding: var(--sp-md);
  margin-bottom: var(--sp-xs);
  background: var(--c-bg);
  border: 1px solid var(--c-border);
  border-radius: var(--r);
  transition: background var(--m);
}
.cart-item:hover { background: var(--c-bg-2); }
.cart-item .name { font-weight: 600; color: var(--c-txt); }
.cart-item .price { color: var(--c-pri); font-weight: 700; margin-left: auto; }
/* end @scope */
```

---

## Quick Reference

```
TOKENS:     :root { --c-pri, --sp-md, --r, --m, --max-w }
SCOPE:      /* @scope: ComponentName */ ... /* end @scope */
STATE:      [data-state="value"] selectors (not .class toggling)
DARK MODE:  [data-theme="dark"] { override tokens }

NAMING:     --c-=color, --sp-=spacing, --r=radius, --m=motion
COMPRESS:   shorthand, calc(), var(), comma selectors, native nesting
READABLE:   class names stay meaningful (but short)
```
