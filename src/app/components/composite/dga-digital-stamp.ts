import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DgaIcon } from '../foundation/dga-icon';

export type DgaDigitalStampExtension = 'gov.sa' | 'edu.sa' | 'med.sa' | 'org.sa' | 'sch.sa' | 'sa';

interface DgaDigitalStampCopy {
  prefix: string;
  domain: string;
  description: string;
}

const EXTENSION_COPY: Record<DgaDigitalStampExtension, DgaDigitalStampCopy> = {
  'gov.sa': {
    prefix: 'Official Saudi Government websites URL ends with ',
    domain: '.gov.sa',
    description: 'Website belongs to an official government organization in the Kingdom of Saudi Arabia always ends with .gov.sa .',
  },
  'edu.sa': {
    prefix: 'Official Saudi educational websites URL ends with ',
    domain: '.edu.sa',
    description: 'Website belongs to an official educational in the Kingdom of Saudi Arabia always ends with .edu.sa or sch.sa .',
  },
  'med.sa': {
    prefix: 'Official Saudi medical websites URL ends with ',
    domain: '.med.sa',
    description: 'Website belongs to an official medical in the Kingdom of Saudi Arabia always ends with .med.sa .',
  },
  'org.sa': {
    prefix: 'Official Saudi non-profit organizations websites URL ends with ',
    domain: '.org.sa',
    description: 'Website belongs to an official non-profit organizations in the Kingdom of Saudi Arabia always ends with .org.sa .',
  },
  'sch.sa': {
    prefix: 'Official Saudi educational websites URL ends with ',
    domain: '.sch.sa',
    description: 'Website belongs to an official educational in the Kingdom of Saudi Arabia always ends with .edu.sa or sch.sa .',
  },
  sa: {
    prefix: 'Official Saudi activities and initiatives websites URL ends with ',
    domain: '.sa',
    description: 'Website belongs to an official activities and initiatives in the Kingdom of Saudi Arabia always ends with .sa .',
  },
};

@Component({
  selector: 'dga-digital-stamp',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <section class="ddga-digital-stamp digital-stamp" [id]="id" data-slot="digital-stamp" [attr.data-state]="isOpen ? 'open' : 'closed'"
      [attr.data-extension]="extension" [attr.aria-label]="ariaLabel">
      <div class="ddga-digital-stamp__row digital-stamp__row">
        <div class="ddga-digital-stamp__lead digital-stamp__lead">
          <dga-icon class="ddga-digital-stamp__flag digital-stamp__flag" name="saudi-flag" />
          <p class="ddga-digital-stamp__statement digital-stamp__statement">{{ statement }}</p>
        </div>
        <button class="ddga-digital-stamp__trigger digital-stamp__trigger" type="button" [attr.aria-expanded]="isOpen"
          [attr.aria-controls]="panelId" (click)="toggle()">
          <span class="ddga-digital-stamp__trigger-label">{{ triggerLabel }}</span><dga-icon class="ddga-digital-stamp__chevron digital-stamp__chevron" name="chevron-down" />
        </button>
      </div>
      <div class="ddga-digital-stamp__panel digital-stamp__panel" [id]="panelId" [hidden]="!isOpen">
        <div class="ddga-digital-stamp__extension digital-stamp__extension">
          <div class="ddga-digital-stamp__column digital-stamp__column" data-slot="domain-verification">
            <span class="ddga-digital-stamp__icon digital-stamp__icon" aria-hidden="true"><dga-icon name="link" /></span>
            <div class="ddga-digital-stamp__content digital-stamp__content">
              <p class="ddga-digital-stamp__title digital-stamp__title">{{ domainTitlePrefix }}<strong>{{ domainTitleValue }}</strong></p>
              <p class="ddga-digital-stamp__description digital-stamp__description">{{ domainDescription || copy.description }}</p>
            </div>
          </div>
          <div class="ddga-digital-stamp__column digital-stamp__column" data-slot="security-confirmation">
            <span class="ddga-digital-stamp__icon digital-stamp__icon" aria-hidden="true"><dga-icon name="lock" /></span>
            <div class="ddga-digital-stamp__content digital-stamp__content">
              <p class="ddga-digital-stamp__title digital-stamp__title">{{ securityTitlePrefix }}<strong>{{ securityTitleValue }}</strong></p>
              <p class="ddga-digital-stamp__description digital-stamp__description">{{ securityDescription || defaultSecurityDescription }}</p>
            </div>
          </div>
        </div>
        @if (registrationNumber) {
          <div class="ddga-digital-stamp__registration digital-stamp__registration" data-slot="registration">
            <span class="ddga-digital-stamp__logo digital-stamp__logo" aria-hidden="true">
              @if (logo) { {{ logo }} }
              <ng-content select="[dgaDigitalStampLogo]"></ng-content>
            </span>
            <div class="ddga-digital-stamp__registration-text digital-stamp__registration-text">
              <p class="ddga-digital-stamp__registration-label digital-stamp__registration-label">{{ registrationLabel }}</p>
              @if (registrationHref) {
                <a class="ddga-digital-stamp__registration-link digital-stamp__registration-link" [href]="registrationHref">{{ registrationNumber }}</a>
              } @else {
                <span class="ddga-digital-stamp__registration-number digital-stamp__registration-number">{{ registrationNumber }}</span>
              }
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    :host { display: block; inline-size: 100%; container-type: inline-size; }
    .ddga-digital-stamp, .digital-stamp { display: flex; flex-direction: column; gap: var(--ddga-space-10); inline-size: 100%; padding-block: var(--ddga-space-1-5); padding-inline: var(--ddga-space-4); overflow: clip; background: var(--ddga-color-muted); color: var(--ddga-text-primary); font-family: inherit; }
    .ddga-digital-stamp[data-state='open'], .digital-stamp[data-state='open'] { padding-block-end: var(--ddga-space-4); }
    .ddga-digital-stamp__row, .digital-stamp__row { display: flex; flex-direction: column; align-items: flex-start; gap: var(--ddga-space-2); }
    .ddga-digital-stamp__lead, .digital-stamp__lead { display: flex; align-items: flex-start; gap: var(--ddga-space-2); min-inline-size: 0; }
    .ddga-digital-stamp__flag, .digital-stamp__flag { flex: 0 0 auto; inline-size: 20px; block-size: 14px; margin-block-start: .1875rem; border-radius: 1px; }
    .ddga-digital-stamp__statement, .digital-stamp__statement { min-inline-size: 0; margin: 0; color: var(--ddga-text-primary); font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-medium); line-height: 1.25rem; overflow-wrap: anywhere; word-break: break-word; }
    .ddga-digital-stamp__trigger, .digital-stamp__trigger { display: inline-flex; flex: 0 0 auto; align-items: center; gap: var(--ddga-space-1); padding: 0; border: 0; border-radius: var(--ddga-radius-sm); background: transparent; color: var(--ddga-sa-700); font: inherit; font-size: var(--ddga-font-size-sm); line-height: 1.25rem; cursor: pointer; }
    .ddga-digital-stamp__trigger:focus-visible, .digital-stamp__trigger:focus-visible, .ddga-digital-stamp__registration-link:focus-visible, .digital-stamp__registration-link:focus-visible { box-shadow: 0 0 0 2px var(--ddga-text-primary); outline: none; }
    .ddga-digital-stamp__chevron, .digital-stamp__chevron { inline-size: 16px; block-size: 16px; flex: 0 0 auto; transition: transform 150ms; }
    .ddga-digital-stamp[data-state='open'] .ddga-digital-stamp__chevron, .digital-stamp[data-state='open'] .digital-stamp__chevron { transform: rotate(180deg); }
    .ddga-digital-stamp__panel, .digital-stamp__panel { display: flex; flex-direction: column; gap: var(--ddga-space-10); }
    .ddga-digital-stamp__panel[hidden], .digital-stamp__panel[hidden] { display: none; }
    .ddga-digital-stamp__extension, .digital-stamp__extension { display: flex; flex-direction: column; gap: var(--ddga-space-4); }
    .ddga-digital-stamp__column, .digital-stamp__column { display: flex; align-items: flex-start; gap: var(--ddga-space-3); min-inline-size: 0; }
    .ddga-digital-stamp__icon, .digital-stamp__icon { display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; inline-size: 2rem; block-size: 2rem; border: 1px solid var(--ddga-success-700); border-radius: var(--ddga-radius-full); box-shadow: var(--ddga-shadow-xs); color: var(--ddga-success-700); }
    .ddga-digital-stamp__icon dga-icon, .digital-stamp__icon dga-icon { --dga-icon-size: 1rem; }
    .ddga-digital-stamp__content, .digital-stamp__content { display: flex; flex-direction: column; gap: var(--ddga-space-3); min-inline-size: 0; }
    .ddga-digital-stamp__title, .digital-stamp__title { margin: 0; color: var(--ddga-text-primary); font-size: var(--ddga-font-size-lg); font-weight: var(--ddga-font-weight-semibold); line-height: 1.75rem; overflow-wrap: anywhere; word-break: break-word; }
    .ddga-digital-stamp__title strong, .digital-stamp__title strong { color: var(--ddga-color-primary); }
    .ddga-digital-stamp__description, .digital-stamp__description { margin: 0; color: var(--ddga-gray-700); font-size: var(--ddga-font-size-base); line-height: 1.5rem; overflow-wrap: anywhere; word-break: break-word; }
    .ddga-digital-stamp__registration, .digital-stamp__registration { display: flex; align-items: center; gap: var(--ddga-space-6); padding-block: var(--ddga-space-2); padding-inline: var(--ddga-space-6); border-radius: var(--ddga-radius-md); background: var(--ddga-color-background); }
    .ddga-digital-stamp__logo, .digital-stamp__logo { display: inline-flex; flex: 0 0 auto; }
    .ddga-digital-stamp__logo:empty, .digital-stamp__logo:empty { display: none; }
    .ddga-digital-stamp__logo img, .ddga-digital-stamp__logo svg, .digital-stamp__logo img, .digital-stamp__logo svg { block-size: 31px; inline-size: auto; }
    .ddga-digital-stamp__registration-text, .digital-stamp__registration-text { display: flex; flex-direction: column; gap: var(--ddga-space-3); min-inline-size: 0; }
    .ddga-digital-stamp__registration-label, .digital-stamp__registration-label, .ddga-digital-stamp__registration-link, .digital-stamp__registration-link, .ddga-digital-stamp__registration-number, .digital-stamp__registration-number { margin: 0; color: var(--ddga-color-primary); font-size: var(--ddga-font-size-base); line-height: 1.5rem; overflow-wrap: anywhere; }
    .ddga-digital-stamp__registration-label, .digital-stamp__registration-label { color: var(--ddga-text-primary); }
    .ddga-digital-stamp__registration-link, .digital-stamp__registration-link { border-radius: var(--ddga-radius-sm); text-decoration: underline; }
    @container (min-width: 768px) {
      .ddga-digital-stamp, .digital-stamp { padding-inline: var(--ddga-space-8); }
      .ddga-digital-stamp[data-state='closed'], .digital-stamp[data-state='closed'] { justify-content: center; min-block-size: 2rem; padding-block: 0; }
      .ddga-digital-stamp[data-state='open'], .digital-stamp[data-state='open'] { padding-block-end: var(--ddga-space-8); }
      .ddga-digital-stamp__row, .digital-stamp__row { flex-direction: row; align-items: center; }
      .ddga-digital-stamp__lead, .digital-stamp__lead { align-items: center; }
      .ddga-digital-stamp__flag, .digital-stamp__flag { margin-block-start: 0; }
      .ddga-digital-stamp__extension, .digital-stamp__extension { flex-flow: row wrap; gap: var(--ddga-space-4); }
      .ddga-digital-stamp__column, .digital-stamp__column { flex: 1 1 0; gap: var(--ddga-space-6); }
      .ddga-digital-stamp__icon, .digital-stamp__icon { inline-size: 3rem; block-size: 3rem; }
      .ddga-digital-stamp__icon dga-icon, .digital-stamp__icon dga-icon { --dga-icon-size: 1.5rem; }
      .ddga-digital-stamp__registration-text, .digital-stamp__registration-text { flex-flow: row wrap; align-items: center; row-gap: 18px; }
    }
    [data-theme='dark'] .ddga-digital-stamp__trigger, [data-theme='dark'] .digital-stamp__trigger { color: var(--ddga-color-primary); }
    [data-theme='dark'] .ddga-digital-stamp__description, [data-theme='dark'] .digital-stamp__description { color: var(--ddga-gray-300); }
    @media (prefers-reduced-motion: reduce) { .ddga-digital-stamp__chevron, .digital-stamp__chevron { transition: none; } }
    @media (forced-colors: active) {
      .ddga-digital-stamp__icon, .digital-stamp__icon { border-color: CanvasText; }
      .ddga-digital-stamp__trigger:focus-visible, .digital-stamp__trigger:focus-visible, .ddga-digital-stamp__registration-link:focus-visible, .digital-stamp__registration-link:focus-visible { box-shadow: none; outline: 2px solid Highlight; }
    }
  `],
})
export class DgaDigitalStamp {
  static nextId = 0;
  @Input() id = `dga-digital-stamp-${++DgaDigitalStamp.nextId}`;
  @Input() extension: DgaDigitalStampExtension = 'gov.sa';
  @Input() statement = 'A government website registered with the Digital Government Authority.';
  @Input() triggerLabel = 'How you know?';
  @Input() domainTitle = '';
  @Input() domainDescription = '';
  @Input() securityTitle = '';
  @Input() securityDescription = '';
  @Input() registrationLabel = 'Registered on Digital Government Authority:';
  @Input() registrationNumber = '';
  @Input() registrationHref = '';
  @Input() logo = '';
  @Input() ariaLabel = 'Government website verification';
  @Output() readonly openChange = new EventEmitter<boolean>();
  private openState = false;
  private interacted = false;
  @Input() open: boolean | undefined;
  @Input() defaultOpen = false;

  protected get panelId(): string {
    return `${this.id}-panel`;
  }

  protected get isOpen(): boolean {
    return this.open ?? (this.interacted ? this.openState : this.defaultOpen);
  }

  protected get copy(): DgaDigitalStampCopy {
    return EXTENSION_COPY[this.extension];
  }

  protected get domainTitlePrefix(): string {
    return this.domainTitle || this.copy.prefix;
  }

  protected get domainTitleValue(): string {
    return this.domainTitle ? '' : this.copy.domain;
  }

  protected get securityTitlePrefix(): string {
    return this.securityTitle || 'Official Reliable websites use ';
  }

  protected get securityTitleValue(): string {
    return this.securityTitle ? '' : 'HTTPS';
  }

  protected get defaultSecurityDescription(): string {
    return 'Ensure the website is using the HTTPS protocol.';
  }

  protected toggle(): void {
    const next = !this.isOpen;
    if (this.open === undefined) {
      this.interacted = true;
      this.openState = next;
    }
    this.openChange.emit(next);
  }
}
