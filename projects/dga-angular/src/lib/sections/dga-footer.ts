import { Component, Input } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DgaIcon } from '../icons/dga-icon';
import type { DgaIconName } from '../icons/dga-icon';

/** A single footer link. */
export interface DgaFooterLink {
  label: string;
  href: string;
  /** Overrides the accessible name when the visible label is not enough. */
  ariaLabel?: string;
  /** Optional icon (e.g. for social links). When set, the link renders the icon. */
  icon?: DgaIconName;
}

/** A column of footer links, with an optional heading. */
export interface DgaFooterLinkGroup {
  heading?: string;
  links: readonly DgaFooterLink[];
}

/** A logo/seal shown in the footer's legal area. */
export interface DgaFooterLogo {
  src: string;
  alt: string;
  href?: string;
}

/**
 * Site footer. Supports the DGA dark-green multi-column layout (`variant="dark"`)
 * — link columns, a social/utility column, and a legal bar with copyright,
 * last-modified date and logos — as well as a minimal light bar. Content is fully
 * configurable through typed inputs; nothing is hardcoded. RTL-aware.
 */
@Component({
  selector: 'dga-footer',
  standalone: true,
  host: { 'class': 'ddga-footer-host' },
  imports: [NgTemplateOutlet, DgaIcon],
  template: `
    <footer class="ddga-footer" [class.ddga-footer--dark]="variant === 'dark'" [attr.aria-label]="ariaLabel || null">
      <div class="ddga-footer__content">
        @if (linkGroups.length || socialLinks.length) {
          <nav class="ddga-footer__nav" [attr.aria-label]="navLabel">
            @for (group of linkGroups; track $index) {
              <div class="ddga-footer__group">
                @if (group.heading) { <h2 class="ddga-footer__group-heading">{{ group.heading }}</h2> }
                <ul class="ddga-footer__group-list">
                  @for (link of group.links; track $index) {
                    <li><a [href]="link.href" [attr.aria-label]="link.ariaLabel || null">{{ link.label }}</a></li>
                  }
                </ul>
              </div>
            }
            @if (socialLinks.length) {
              <div class="ddga-footer__column">
                @if (socialHeading) { <h2 class="ddga-footer__group-heading">{{ socialHeading }}</h2> }
                <ul class="ddga-footer__social">
                  @for (link of socialLinks; track $index) {
                    <li><a [href]="link.href" [attr.aria-label]="link.ariaLabel || link.label">
                      @if (link.icon) { <dga-icon [name]="link.icon" /> } @else { {{ link.label }} }
                    </a></li>
                  }
                </ul>
                <ng-content select="[dgaFooterExtra]"></ng-content>
              </div>
            }
          </nav>
        }

        @if (hasLegal || hasBrand) {
          <div class="ddga-footer__legal">
            <div class="ddga-footer__legal-info">
              @if (hasBrand) { <ng-container [ngTemplateOutlet]="brand"></ng-container> }
              @if (description) { <p class="ddga-footer__description">{{ description }}</p> }
              @if (legalLinks.length || links.length) {
                <ul class="ddga-footer__legal-links">
                  @for (link of legalLinks; track $index) {
                    <li><a [href]="link.href" [attr.aria-label]="link.ariaLabel || null">{{ link.label }}</a></li>
                  }
                  @for (link of links; track $index) {
                    <li><a [href]="link.href" [attr.aria-label]="link.ariaLabel || null">{{ link.label }}</a></li>
                  }
                </ul>
              }
              @if (copyright) { <p class="ddga-footer__copyright">{{ copyright }}</p> }
              @if (lastModified) { <p class="ddga-footer__last-modified">{{ lastModified }}</p> }
            </div>
            @if (logos.length) {
              <div class="ddga-footer__logos">
                @for (logo of logos; track $index) {
                  @if (logo.href) {
                    <a [href]="logo.href"><img [src]="logo.src" [alt]="logo.alt" /></a>
                  } @else {
                    <img [src]="logo.src" [alt]="logo.alt" />
                  }
                }
              </div>
            }
          </div>
        }
      </div>
    </footer>

    <ng-template #brand>
      @if (hasBrand) {
        @if (brandHref) {
          <a class="ddga-footer__brand" [href]="brandHref"><ng-container [ngTemplateOutlet]="brandInner"></ng-container></a>
        } @else {
          <div class="ddga-footer__brand"><ng-container [ngTemplateOutlet]="brandInner"></ng-container></div>
        }
      }
    </ng-template>
    <ng-template #brandInner>
      @if (brandLogoSrc) {
        <img class="ddga-footer__brand-logo" [src]="brandLogoSrc" [alt]="brandLogoAlt" />
      } @else if (brandMark) {
        <span class="ddga-footer__brand-mark" aria-hidden="true">{{ brandMark }}</span>
      }
      @if (brandName) { <span class="ddga-footer__brand-name">{{ brandName }}</span> }
    </ng-template>
  `,
  styles: [`
    :host { display: block; }
    .ddga-footer { color: var(--ddga-gray-600); font-size: var(--ddga-font-size-xs); }
    .ddga-footer__content { display: flex; flex-direction: column; }
    .ddga-footer__nav { display: flex; flex-wrap: wrap; gap: 2.5rem; padding-block: 2.75rem; }
    .ddga-footer__group, .ddga-footer__column { flex: 1 1 12rem; min-inline-size: 0; }
    .ddga-footer__group-heading { margin: 0 0 1rem; color: var(--ddga-gray-800); font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-semibold); }
    .ddga-footer__group-list, .ddga-footer__social, .ddga-footer__legal-links { margin: 0; padding: 0; list-style: none; }
    .ddga-footer__group-list { display: flex; flex-direction: column; gap: .85rem; }
    .ddga-footer__group-list a { font-size: var(--ddga-font-size-sm); }
    .ddga-footer__social { display: flex; flex-wrap: wrap; gap: 1rem; }
    .ddga-footer__social a { display: inline-flex; align-items: center; justify-content: center; inline-size: 2.5rem; block-size: 2.5rem; border: 1px solid currentColor; border-radius: var(--ddga-radius-full); --dga-icon-size: 1.125rem; }
    .ddga-footer a { color: inherit; text-decoration: none; }
    .ddga-footer a:hover { text-decoration: underline; }
    .ddga-footer a:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; border-radius: var(--ddga-radius-sm); }
    .ddga-footer__legal { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 1.25rem; padding-block: 2rem; }
    .ddga-footer__nav + .ddga-footer__legal { border-block-start: 1px solid var(--ddga-color-border); }
    .ddga-footer__legal-info { display: flex; flex-direction: column; gap: .5rem; }
    .ddga-footer__legal-links { display: flex; flex-wrap: wrap; gap: 1.25rem; }
    .ddga-footer__copyright, .ddga-footer__last-modified, .ddga-footer__description { margin: 0; }
    .ddga-footer__logos { display: flex; flex-wrap: wrap; align-items: center; gap: 1.5rem; }
    .ddga-footer__logos img { block-size: 2.75rem; inline-size: auto; }
    .ddga-footer__brand { display: inline-flex; align-items: center; gap: .75rem; color: var(--ddga-gray-800); font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-semibold); }
    .ddga-footer__brand-mark { display: inline-grid; place-items: center; inline-size: 1.8rem; block-size: 1.8rem; border-radius: var(--ddga-radius-sm); background: var(--ddga-sa-700); color: #fff; font-size: .58rem; font-weight: var(--ddga-font-weight-bold); }
    .ddga-footer__brand-logo { block-size: 1.8rem; inline-size: auto; }

    /* Dark (DGA Figma) variant */
    .ddga-footer--dark { background: var(--ddga-sa-900); color: rgb(255 255 255 / .82); }
    .ddga-footer--dark .ddga-footer__content { inline-size: min(100%, 76rem); margin-inline: auto; padding-inline: clamp(1.25rem, 5vw, 4rem); }
    .ddga-footer--dark .ddga-footer__group-heading { color: #fff; }
    .ddga-footer--dark a { color: rgb(255 255 255 / .82); }
    .ddga-footer--dark a:hover { color: #fff; }
    .ddga-footer--dark .ddga-footer__nav + .ddga-footer__legal { border-block-start-color: rgb(255 255 255 / .18); }
    .ddga-footer--dark .ddga-footer__brand, .ddga-footer--dark .ddga-footer__copyright, .ddga-footer--dark .ddga-footer__last-modified { color: #fff; }

    @media (max-width: 60rem) { .ddga-footer__nav { gap: 2rem; } .ddga-footer__group, .ddga-footer__column { flex-basis: 40%; } }
    @media (max-width: 40rem) {
      .ddga-footer__nav { flex-direction: column; gap: 1.75rem; }
      .ddga-footer__group, .ddga-footer__column { flex-basis: auto; }
      .ddga-footer__legal { flex-direction: column; align-items: start; }
    }
    @media (forced-colors: active) {
      .ddga-footer--dark { background: Canvas; color: CanvasText; }
      .ddga-footer__brand-mark, .ddga-footer__social a { border: 1px solid ButtonText; }
    }
  `],
})
export class DgaFooter {
  /** Visual treatment. `dark` = the DGA dark-green footer; `light` = minimal bar. */
  @Input() variant: 'dark' | 'light' = 'light';
  /** Short brand mark (e.g. an abbreviation). Rendered as text, hidden from AT. */
  @Input() brandMark = '';
  @Input() brandName = '';
  /** When set, the brand becomes a link. */
  @Input() brandHref = '';
  /** Image logo URL (sanitized `<img>`, takes precedence over `brandMark`). */
  @Input() brandLogoSrc = '';
  @Input() brandLogoAlt = '';
  /** Short tagline / description line. */
  @Input() description = '';
  /** Titled columns of links (heading optional). */
  @Input() linkGroups: readonly DgaFooterLinkGroup[] = [];
  /** Ungrouped quick links shown in the legal bar. */
  @Input() links: readonly DgaFooterLink[] = [];
  /** Social links (icon or text) shown in the utility column. */
  @Input() socialLinks: readonly DgaFooterLink[] = [];
  /** Heading for the social column. */
  @Input() socialHeading = '';
  /** Legal links shown in the legal bar. */
  @Input() legalLinks: readonly DgaFooterLink[] = [];
  /** Copyright line. */
  @Input() copyright = '';
  /** Last-modified line. */
  @Input() lastModified = '';
  /** Logos/seals shown in the legal area. */
  @Input() logos: readonly DgaFooterLogo[] = [];
  /** Accessible label for the `<footer>` landmark. */
  @Input() ariaLabel = '';
  /** Accessible label for the links `<nav>`. */
  @Input() navLabel = 'Footer links';

  protected get hasBrand(): boolean {
    return !!(this.brandMark || this.brandName || this.brandLogoSrc);
  }
  protected get hasLegal(): boolean {
    return !!(this.description || this.legalLinks.length || this.links.length || this.copyright || this.lastModified || this.logos.length);
  }
}
