<!-- AOCS-ROLE: config -->
# AOCS: HTML

*Language extension for the [Agent-Oriented Coding Standard](./AOCS.md).*
*Requires: `AOCS.md` (base standard)*

---

## Overview

HTML AOCS patterns focus on semantic structure, data attribute contracts, and clear separation between CSS hooks and JavaScript hooks. The goal: an agent editing JavaScript never has to read CSS to find element selectors, and vice versa.

---

## App Manifest (U1)

Place at the top of each page or component template:

```html
<!-- @app: Shopping Cart
     @routes: /cart (cart view), /checkout (checkout flow)
     @state: {items:Item[], total:num, step:str}
     @components: CartItem, CartSummary, CheckoutForm
-->
```

For components:

```html
<!-- @component: CartItem
     @props: {item: Item, onRemove: fn}
     @emits: click:remove
-->
```

## Data Attribute Contracts (U2)

Separate concerns with dedicated attributes:

| Attribute | Purpose | Used by |
|-----------|---------|---------|
| `class` | Styling only | CSS |
| `data-action` | Click/interaction target | JavaScript |
| `data-state` | Reflects current state | CSS + JavaScript |
| `data-bind` | Binds to state key | JavaScript |
| `data-id` | Entity identifier | JavaScript |
| `id` | Unique page identifier | CSS + JavaScript |

### Why This Matters

```html
<!-- ❌ Bad: class used for both styling AND JavaScript -->
<button class="btn btn-primary active add-to-cart">Add</button>

<!-- ✅ Good: concerns separated -->
<button class="btn btn-primary" data-action="add-to-cart" data-state="active">Add</button>
```

An agent modifying button behavior only reads `data-action`. An agent modifying button appearance only reads `class`. Neither needs to understand the other.

---

## State via Data Attributes (U3)

Use `data-state` instead of toggling classes:

```html
<!-- State-driven visibility -->
<div class="modal" data-state="closed">...</div>
<div class="modal" data-state="open">...</div>

<!-- CSS handles the rendering -->
<!-- .modal[data-state="open"] { display: block; } -->
<!-- .modal[data-state="closed"] { display: none; } -->
```

This creates a contract between HTML, CSS, and JavaScript: the state attribute is the single source of truth.

---

## Naming Conventions (U4)

### IDs and Data Attributes

- **Descriptive**: `id="checkout-form"`, `data-action="submit-order"`
- **Kebab-case**: `data-action="add-to-cart"` — not `data-action="addToCart"`
- **No anonymous elements**: every interactive or significant element has an `id` or `data-action`

### Component Files

- Kebab-case filenames: `cart-item.html`, `checkout-form.html`
- Match component name: `<!-- @component: CartItem -->` in `cart-item.html`

---

## Structure Conventions

### Semantic Elements

Use semantic HTML elements — they're free documentation:

```html
<header>     <!-- page/section header -->
<nav>        <!-- navigation -->
<main>       <!-- primary content -->
<article>    <!-- self-contained content -->
<section>    <!-- thematic grouping -->
<aside>      <!-- supplementary content -->
<footer>     <!-- page/section footer -->
```

### Compression

HTML compression is minimal compared to JS/CSS, but:

- Remove unnecessary wrapper `<div>` elements
- Use semantic elements instead of `<div class="header">`
- Prefer `data-*` attributes over verbose class names for behavior
- Self-closing tags where valid: `<img />`, `<input />`

---

## Example: Component

### Human-optimized

```html
<div class="product-card-wrapper" id="product-card-wrapper">
  <div class="product-card">
    <div class="product-card-image">
      <img src="product.jpg" alt="Product Name" class="product-image" />
    </div>
    <div class="product-card-info">
      <h3 class="product-title">Product Name</h3>
      <p class="product-price">$29.99</p>
    </div>
    <div class="product-card-actions">
      <button class="btn btn-primary add-to-cart-button" onclick="addToCart('123')">
        Add to Cart
      </button>
    </div>
  </div>
</div>
```

### Agent-optimized

```html
<!-- @component: ProductCard | @props: {product:Product} | @emits: click:add-to-cart -->
<article class="product-card" data-id="123">
  <img src="product.jpg" alt="Product Name" />
  <h3>Product Name</h3>
  <p class="price">$29.99</p>
  <button class="btn-primary" data-action="add-to-cart">Add to Cart</button>
</article>
```

---

## Quick Reference

```
MANIFEST:   <!-- @app: Name | @routes: ... | @state: ... | @components: ... -->
COMPONENT:  <!-- @component: Name | @props: ... | @emits: ... -->

ATTRIBUTES: class=CSS only | data-action=JS events | data-state=state | data-bind=binding
STATE:      data-state="value" (not class toggling)
NAMING:     kebab-case, semantic elements, no anonymous divs
```
