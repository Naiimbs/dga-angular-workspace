# DgaHero & DgaFooter

Two configurable, standalone public components for page-level sections, matching the
DGA "Home Page Template" (hero slider) and dark footer Figma designs. Both ship their
own encapsulated styles and use `--ddga-*` design tokens. Exported from
`@dev-dga/angular`. Images/logos are supplied by the caller via inputs (the library
ships no demo assets).

## DgaHero — hero carousel

A full-bleed image carousel: each slide has a background image + dark overlay
(`--ddga-sa-950` @ 90%), white heading/description and a primary on-color CTA, with
dot navigation. Keyboard (Arrow/Home/End, RTL-aware), a `role=status` live region,
`inert` inactive slides, and reduced-motion/forced-colors handling. No autoplay (not
in the reference).

### API

| Input | Type | Default | Notes |
|-------|------|---------|-------|
| `slides` | `DgaHeroSlide[]` | `[]` | The slides to render. |
| `ariaLabel` | `string` | `'Hero'` | Carousel region label. |
| `startIndex` | `number` | `0` | Initially active slide. |
| `title`,`description`,`subtitle`,`subtitleLang`,`subtitleDir`,`primaryAction` | — | — | **Backward-compatible** single-slide fallback used only when `slides` is empty. |

Outputs: `slideChange: EventEmitter<number>`, `actionClick: EventEmitter<DgaHeroSlide>` (fires for a CTA with no `href`).

```ts
interface DgaHeroSlide {
  title: string; description?: string;
  subtitle?: string; subtitleLang?: string; subtitleDir?: string;
  imageSrc?: string; imageAlt?: string;   // empty alt = decorative
  action?: DgaHeroAction;
}
interface DgaHeroAction { label: string; href?: string; ariaLabel?: string; }
```

Semantics: `role=region` + `aria-roledescription=carousel`; each slide is a
`role=group` labeled `"N of M"`; dots are buttons (`aria-label="Go to slide N"`,
`aria-current` on active). Heading is `<h2>` per slide (inactive slides are
`inert`/`aria-hidden`, so AT sees one).

> API evolution: the previous static hero's `eyebrow`/`stats`/`secondaryAction` and
> the `[dgaHeroVisual]` projection (and `DgaHeroVisual`/`DgaHeroStat`) were removed —
> they are not part of the Figma hero. The retained single-slide inputs keep old
> usage rendering.

```html
<dga-hero ariaLabel="Highlights" [slides]="heroSlides" />
```

## DgaFooter — dark multi-column footer

Dark-green (`--ddga-sa-900`) footer with link columns, a social/utility column, and a
legal bar (copyright, last-modified, logos). A minimal light bar remains the default.

### API

| Input | Type | Default | Notes |
|-------|------|---------|-------|
| `variant` | `'dark'\|'light'` | `'light'` | `dark` = DGA Figma footer. |
| `linkGroups` | `DgaFooterLinkGroup[]` | `[]` | Columns; heading optional. |
| `socialLinks` | `DgaFooterLink[]` | `[]` | Icon or text links. |
| `socialHeading` | `string` | `''` | Heading for the social column. |
| `legalLinks` / `links` | `DgaFooterLink[]` | `[]` | Legal-bar links. |
| `copyright` / `lastModified` | `string` | `''` | Legal-bar text lines. |
| `logos` | `DgaFooterLogo[]` | `[]` | Seals/logos (optionally linked). |
| `brandMark`,`brandName`,`brandHref`,`brandLogoSrc`,`brandLogoAlt`,`description` | — | — | Backward-compatible brand block. |
| `ariaLabel` / `navLabel` | `string` | `''`/`'Footer links'` | Landmark / nav labels. |

```ts
interface DgaFooterLink { label: string; href: string; ariaLabel?: string; icon?: DgaIconName; }
interface DgaFooterLinkGroup { heading?: string; links: DgaFooterLink[]; }
interface DgaFooterLogo { src: string; alt: string; href?: string; }
```

A `[dgaFooterExtra]` slot (inside the social/utility column) accepts extra content
(e.g. accessibility-tool controls), which are app behavior rather than footer data.

```html
<dga-footer variant="dark" ariaLabel="Site footer"
  [linkGroups]="groups" [socialLinks]="social" socialHeading="Social Media"
  [legalLinks]="legal" copyright="…" lastModified="…" [logos]="logos" />
```

Semantic `<footer>` landmark; link columns in a labeled `<nav>`; headings `<h2>`;
optional sections render only when populated (no empty columns). Backward-compatible
with the previous brand/description/links light bar.
