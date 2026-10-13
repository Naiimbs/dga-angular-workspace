# DGA Icon System

The DGA Design System includes a highly robust, centralized icon architecture.

## Overview
Rather than hardcoding SVGs into every component or forcing consumers to import massive icon libraries, the `@dev-dga/angular` library uses a centralized `DgaIconRegistry`.

This guarantees:
1. **Consistency:** All icons render with the correct size, stroke, and alignment.
2. **Performance:** Only icons that are explicitly registered are loaded in the DOM.
3. **Flexibility:** Consumers can use SVG paths, font ligatures, or CSS classes.

## The `<dga-icon>` Component
The primary way to render an icon is via the `<dga-icon>` component.

```html
<dga-icon name="check"></dga-icon>
```

### Variants
The system supports multiple DGA icon variants out-of-the-box (e.g., solid, stroke, two-tone).
```html
<dga-icon name="dga-icon-add-01" variant="stroke-rounded"></dga-icon>
```

## DgaIconRegistry
Before an icon can be rendered, it must be registered with the `DgaIconRegistry`.

### Registering SVG Icons
```typescript
import { DgaIconRegistry } from '@dev-dga/angular';

export class AppComponent {
  constructor(registry: DgaIconRegistry) {
    registry.registerIcon({
      name: 'custom-check',
      type: 'svg',
      viewBox: '0 0 24 24',
      svgHtml: '<path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" />',
    });
  }
}
```

### Registering Font Icons
If you are using the official DGA Icon font, you can register a font ligature:
```typescript
registry.registerIcon({
  name: 'dga-icon-add-01',
  type: 'font',
  variant: 'stroke-rounded'
});
```

## Fallbacks
If an icon is requested but not found in the registry, the `<dga-icon>` component will gracefully render nothing (or a fallback if configured), rather than throwing a fatal error or rendering a broken image link.

## Accessibility
When using icons for purely decorative purposes, `<dga-icon>` automatically manages `aria-hidden="true"`.
If the icon has semantic meaning (e.g., inside an icon-only button), you must provide an `aria-label` on the parent interactive element.
