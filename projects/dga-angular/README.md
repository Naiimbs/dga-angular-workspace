# DGA Angular Design System

The official `@dev-dga/angular` Design System library.

## Purpose
This library provides a highly accessible, React-parity aligned UI component suite for Angular applications, including forms, data tables, feedback elements, and navigation.

## Installation
```bash
npm install @dev-dga/angular
```

## Quick Start
1. Add the styles to your global SCSS (e.g., `styles.scss`):
```scss
@use '@dev-dga/angular/styles';
```
Design tokens are provided as CSS custom properties on `:root`. Reference them in your components using standard CSS syntax:
```scss
.my-card {
  color: var(--ddga-color-primary);
  background-color: var(--ddga-color-background);
  border: 1px solid var(--ddga-color-border);
}
```

2. Import a component into your Angular app:
```typescript
import { DgaButton } from '@dev-dga/angular';

@Component({
  standalone: true,
  imports: [DgaButton],
  template: `<dga-button variant="primary">Submit</dga-button>`
})
export class MyComponent {}
```

## Supported Angular Versions
- Angular 17+ (Built with 22.x)

## Icon System
The library uses a centralized `DgaIconRegistry`. Do not hardcode SVG paths.
```typescript
constructor(registry: DgaIconRegistry) {
  registry.registerIcon({
    name: 'check',
    type: 'svg',
    viewBox: '0 0 24 24',
    svgHtml: '<path d="M20 6 9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2" />',
  });
}
```

## Forms
All form elements support `ControlValueAccessor` natively. Use `[(ngModel)]` or `[formControl]`.

## Development Workspace
This library is developed inside the `dga-angular-workspace`.
The source lives in `projects/dga-angular/`.
The interactive documentation/showcase lives in `src/app/pages/design-system`.
