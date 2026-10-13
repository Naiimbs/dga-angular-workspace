# NavHeader (DgaHeader suite) — style contract

The header/navigation components (`DgaHeader`, `DgaHeaderNav`, `DgaHeaderItem`,
`DgaMenubar`, `DgaSidebar`, `DgaSlideoutMenu`, …) are **template-only** — they ship
no component-level styles. Their appearance is provided by the library's **global
navigation stylesheet**.

## The contract

- Styles live in `projects/dga-angular/src/lib/styles/_dga-navigation.scss` and are
  forwarded through the public style entry `styles/styles.scss` → `styles.scss`.
- `ng-package.json` copies `src/lib/styles/**/*.scss` into `dist/dga-angular/styles/`
  and the package root, so consumers can:

  ```scss
  @use '@dev-dga/angular/styles';   // tokens + table + navigation
  ```

- The **showcase** imports it via `src/styles.scss`:

  ```scss
  @use '../projects/dga-angular/src/lib/styles/dga-navigation';
  ```

**Consumers must import the global stylesheet** for the header to be styled. This is
intentional (shared class names / token layer with the DGA CSS), not a packaging
defect — verified against a controlled `ng build dga-angular`, which emits the SCSS
assets and a package `exports` map exposing `./styles` and `./styles/*`.

## Notes

- No sticky/scroll behavior is provided by the header (by design).
- `DgaSlideoutMenu` is modal (`role="dialog"`, `aria-modal`) and traps focus while
  open; the header mega-menu (`DgaHeaderSubmenu`) is a non-modal disclosure closed by
  `Escape` with native Tab order through its links.
