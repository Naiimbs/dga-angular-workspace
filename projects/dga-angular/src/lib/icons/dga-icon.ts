import { Component, Input, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DgaIconRegistry, DgaIconDefinition } from './dga-icon-registry';

export type DgaIconName = string;

@Component({
  selector: 'dga-icon',
  standalone: true,
  host: {
    'ngSkipHydration': 'true',
  },
  template: `
    @if (iconDef?.type === 'font') {
      <i [class]="iconDef?.fontClass"
        [style.font-size]="dimension"
        [attr.role]="label ? 'img' : null"
        [attr.aria-label]="label || null"
        [attr.aria-hidden]="label ? null : 'true'"></i>
    } @else {
      @if (isBrowser) {
        <svg [attr.viewBox]="viewBox"
          [attr.width]="width"
          [attr.height]="height"
          [attr.fill]="fill"
          [attr.stroke]="stroke"
          [attr.stroke-width]="strokeWidth"
          [attr.stroke-linecap]="strokeLinecap"
          [attr.stroke-linejoin]="strokeLinejoin"
          [attr.role]="label ? 'img' : null"
          [attr.aria-label]="label || null"
          [attr.aria-hidden]="label ? null : 'true'"
          focusable="false"
          [innerHTML]="safeSvgHtml">
        </svg>
      } @else {
        <svg [attr.viewBox]="viewBox"
          [attr.width]="width"
          [attr.height]="height"
          [attr.fill]="fill"
          [attr.stroke]="stroke"
          [attr.stroke-width]="strokeWidth"
          [attr.stroke-linecap]="strokeLinecap"
          [attr.stroke-linejoin]="strokeLinejoin"
          [attr.role]="label ? 'img' : null"
          [attr.aria-label]="label || null"
          [attr.aria-hidden]="label ? null : 'true'"
          focusable="false">
        </svg>
      }
    }
  `,
  styles: [`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 auto;
      inline-size: max-content;
      block-size: max-content;
      line-height: 0;
      color: inherit;
    }
    svg {
      display: block;
      inline-size: var(--dga-icon-size, 1em);
      block-size: var(--dga-icon-size, 1em);
      color: inherit;
    }
    svg[viewBox="0 0 20 14"] {
      inline-size: auto;
      aspect-ratio: 20 / 14;
    }
    svg[viewBox^="0 0 17.5"] {
      inline-size: auto;
      aspect-ratio: 1;
    }
    i[class^="dga-icon-"], i[class*=" dga-icon-"] {
      display: inline-block;
      line-height: 1;
      font-style: normal;
      color: inherit;
    }
  `],
})
export class DgaIcon {
  private registry = inject(DgaIconRegistry);
  private sanitizer = inject(DomSanitizer);
  private platformId = inject(PLATFORM_ID);
  protected isBrowser = isPlatformBrowser(this.platformId);

  @Input({ required: true }) name!: string;
  @Input() variant: string = 'default';
  @Input() label = '';
  @Input() size: 'sm' | 'md' | 'lg' | number = 'md';

  protected get iconDef(): DgaIconDefinition | undefined {
    return this.registry.getIcon(this.name, this.variant);
  }

  protected get safeSvgHtml(): SafeHtml {
    const html = this.iconDef?.svgHtml || '<circle cx="12" cy="12" r="10" /><path d="M12 8v4m0 4h.01" />';
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  protected get dimension(): string {
    if (typeof this.size === 'number') return `${this.size}px`;
    return this.size === 'sm' ? '0.875em' : this.size === 'lg' ? '1.25em' : '1em';
  }

  protected get width(): string {
    if (this.name === 'saudi-flag') return '20';
    return this.dimension;
  }

  protected get height(): string {
    if (this.name === 'saudi-flag') return '14';
    return this.dimension;
  }

  protected get viewBox(): string {
    if (this.iconDef?.viewBox) return this.iconDef.viewBox;
    if (this.name === 'saudi-flag') return '0 0 20 14';
    if (this.name === 'lock') return '0 0 17.5 21.5';
    if (this.name === 'link') return '0 0 17.5001 17.5';
    return '0 0 24 24';
  }

  protected get fill(): string | null {
    if (this.iconDef?.fill) return this.iconDef.fill;
    return this.filled ? 'currentColor' : 'none';
  }

  protected get stroke(): string | null {
    if (this.iconDef?.stroke !== undefined) return this.iconDef.stroke === 'none' ? null : this.iconDef.stroke;
    return this.filled ? null : 'currentColor';
  }

  protected get strokeWidth(): string | number {
    if (this.iconDef?.strokeWidth !== undefined && this.iconDef.strokeWidth !== null) return this.iconDef.strokeWidth;
    return this.name === 'check' ? 3 : 2;
  }

  protected get strokeLinecap(): string {
    return this.iconDef?.strokeLinecap || 'round';
  }

  protected get strokeLinejoin(): string {
    return this.iconDef?.strokeLinejoin || 'round';
  }

  protected get filled(): boolean {
    return this.name === 'more-horizontal' || this.name === 'lock' || this.name === 'link';
  }
}
