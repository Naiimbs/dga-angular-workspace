# DGA Icons — extracted source and assets

Downloaded from the public Icons section of https://build-dga.web.app/#icons on 2026-10-08.

## Included

- `js/icons-data.js` — categorized icon registry used by the page.
- `js/components/icons.js` — icon browser/showcase module.
- `components/icons/icons.css` — showcase component styles.
- `css/icons-fonts.css` — imports the icon-category styles and declares the icon fonts.
- `utilities/Icons_Css/` — category-level icon class CSS files.
- `utilities/Fonts/` — WOFF2 font files required by those stylesheets.
- `manifest.json` — source paths and download status.

## Basic use

Preserve the folder layout so the relative URLs in `css/icons-fonts.css` resolve. Include the font stylesheet and use an icon class from the registry, for example:

```html
<link rel="stylesheet" href="css/icons-fonts.css">
<span class="icon dga-icon-home-01" aria-hidden="true"></span>
```

For the icon showcase UI, also load `components/icons/icons.css` and the page's icon module and registry scripts.

## Notes

These are the public files served by the linked website, not a separate upstream source repository. Review the source site's applicable license/usage terms before redistribution or production use.
