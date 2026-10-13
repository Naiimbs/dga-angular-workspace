# DGA icon font assets (local integration)

These are the **runtime** assets for the DGA icon *font* pack, used by `DgaIcon`'s
font-rendering branch (`<dga-icon name="dga-icon-…">`). The curated inline-SVG
icons do **not** depend on these files and keep working without them.

## Contents (do not change the relative layout)

```
icons/fonts/
├── css/icons-fonts.css                 # loader: @import of the 60 category CSS + 61 @font-face
└── utilities/
    ├── Icons_Css/*.css                 # 60 category class files (.dga-icon-* → glyph)
    └── Fonts/*.woff2                    # 61 font faces
```

`css/icons-fonts.css` references its siblings with **relative** URLs
(`../utilities/Icons_Css/…`, `../utilities/Fonts/…`). The folder layout above must
be preserved or those `@import`/`url()` references break.

## Loading contract

- **Showcase app:** `icons-fonts.css` is registered in `angular.json` under the
  `dga-angular-workspace` build `styles` array (single entry — no duplicate global
  import). esbuild follows the `@import` chain and emits the woff2 files to
  `media/`.
- **Library package:** the whole `icons/fonts/` tree is copied verbatim by
  `ng-package.json` `assets` to `dist/dga-angular/icons/fonts/…`. A consumer opts in
  by loading `…/icons/fonts/css/icons-fonts.css` as a global stylesheet. (Note: the
  generated package `exports` map does not yet expose this subpath; publishing would
  need that added — see licensing below, publishing is out of scope.)
- Applying a class: `<dga-icon name="dga-icon-home-01" variant="stroke-rounded" />`
  renders `<i class="dga-icon-home-01 stroke rounded">`. Fonts load lazily on first
  paint.

## Source & licensing — UNRESOLVED

Extracted from the public DGA Icons page (`https://build-dga.web.app/#icons`,
downloaded 2026-10-08). **No license file accompanies these assets.** They are the
website's public files, not an upstream repository, and redistribution rights have
**not** been verified.

- Local development and testing only.
- **Do not** publish, redistribute, or ship these fonts in a released package until
  the applicable usage/redistribution terms are reviewed and confirmed.
- The source gallery JavaScript (`js/…`) and showcase CSS are intentionally **not**
  integrated — only the runtime font + CSS assets are vendored here.
