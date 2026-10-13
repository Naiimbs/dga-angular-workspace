# Library Architecture Audit

**Date:** 2026-10-08  
**Workspace:** `dga-angular-workspace`

## 1. Current Architecture
The workspace contains a standard Angular application structure with a `src/app/` folder.
Inside `src/app/`, there are two main areas:
- `components/`: Contains all the DGA Design System UI components, foundations, and forms integration. It exposes a single barrel file (`index.ts`).
- `pages/design-system/`: An application-only showcase page that imports components from `src/app/components/`.

There is also an existing but mostly empty Angular library project scaffolded at `projects/dga-angular/` configured in `angular.json` with `ng-packagr`.

## 2. Proposed Library Architecture
We will migrate all contents of `src/app/components/` into `projects/dga-angular/src/lib/`.

```text
projects/dga-angular/
  src/
    lib/
      components/
        dga-button/
      foundation/
      forms/
      feedback/
      navigation/
      data/
      composite/
      popup/
    public-api.ts
```

The global styles and tokens from `src/styles/` will also be migrated or exposed so that consumers can import the DGA theme via SCSS.

## 3. Reusable Components
All components currently inside `src/app/components/` are pure UI components and safe to move to the library. This includes:
- Button, IconButton, Checkbox, Radio, Switch, Input, Select, Textarea
- Badge, Tag, Alert, Tooltip, Modal
- Tabs, Breadcrumb, Pagination, Dropdown, Menubar, Header, Sidebar
- Table, Accordion, Progress, EmptyState, DigitalStamp
- Icon, IconRegistry, PopupPortal

## 4. Application-Only Components
- `src/app/pages/design-system/`: The showcase page itself.
- App component (`app.component.ts`).

## 5. Dependency Risks
- **Angular Forms:** The form components use `ControlValueAccessor` and require `@angular/forms`. This is a standard Angular dependency and safe to require as a peer dependency.
- **Browser APIs:** Components like `DgaPopupPortal` rely on browser APIs (DOM manipulation, floating UI logic). These must be carefully checked for SSR compatibility.

## 6. Styling Risks
- Components use CSS custom properties (`--ddga-*`), which is excellent for encapsulation.
- We must ensure that the base tokens (`dga-tokens.scss`) are distributed with the library so consumers can import them (e.g., `@use '@dev-dga/angular/styles';`).
- Showcase-specific styles (`design-system.scss`) must remain in the app and not be published.

## 7. Icon Registry Strategy
- The `DgaIconRegistry` must be exported.
- Consumers will register their required icons using `registry.registerIcon()`.
- The library will not bundle massive SVG sets; it will provide the registry and the `<dga-icon>` component to render them.

## 8. SSR Considerations
- The popup portal and digital stamp may perform DOM measurements. If they do, they must guard against server-side execution using `isPlatformBrowser` or by safely deferring DOM logic to `afterNextRender` / `ngAfterViewInit`.

## 9. Recommended Package Name
**`@dev-dga/angular`**
This name will be set in `projects/dga-angular/package.json`. No conflicts are currently identified in the workspace configuration.
