import { Component, ElementRef, EventEmitter, HostListener, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DgaIcon } from '../icons/dga-icon';
import { DgaPopupPortal } from '../popup/dga-popup-portal';

export interface DgaMenuOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DgaTab {
  label: string;
  value: string;
  content: string;
  disabled?: boolean;
}

export interface DgaBreadcrumbItem {
  label: string;
  href?: string;
  routerLink?: string;
}

@Component({
  selector: 'dga-dropdown',
  standalone: true,
  imports: [DgaIcon, DgaPopupPortal],
  template: `
    <details #details class="dropdown" [open]="defaultOpen" [attr.data-state]="details.open ? 'open' : 'closed'"
      (toggle)="onToggle(details)" (keydown)="onKeydown($event, details)">
      <summary #trigger class="dropdown__trigger">{{ label }}<dga-icon name="chevron-down" /></summary>
      <div class="dropdown__menu" popover="manual" dgaPopupPortal [dgaPopupPortalOpen]="details.open"
        [dgaPopupPortalAnchor]="trigger" role="menu">
        @for (option of options; track option.value) {
          <button class="dropdown__item" type="button" role="menuitem" [disabled]="option.disabled"
            [attr.aria-checked]="selectedValue === option.value ? 'true' : null"
            [class.dropdown__item--selected]="selectedValue === option.value"
            (click)="onSelect(option.value, details)">{{ option.label }}</button>
        }
      </div>
    </details>
  `,
  styles: [`
    :host { display: inline-block; }
    .dropdown { position: relative; }
    .dropdown__trigger { position: relative; display: inline-flex; align-items: center; min-block-size: 2.5rem; padding-inline: var(--ddga-space-4); border: 1px solid var(--ddga-gray-400); border-radius: var(--ddga-radius-sm); background: var(--ddga-color-background); color: var(--ddga-gray-700); cursor: pointer; list-style: none; transition: border-color 150ms, box-shadow 150ms, background-color 150ms; }
    .dropdown__trigger::-webkit-details-marker { display: none; }
    .dropdown__trigger dga-icon { margin-inline-start: var(--ddga-space-2); transition: transform 150ms; }
    .dropdown[open] > .dropdown__trigger dga-icon { transform: rotate(180deg); }
    .dropdown__trigger::before { content: ''; position: absolute; inset-inline: 0; inset-block-end: -1px; block-size: 2px; background: var(--ddga-gray-950); transform: scaleX(0); transition: transform 400ms ease-out; }
    .dropdown__trigger:hover:not(:focus-visible) { border-color: var(--ddga-gray-700); }
    .dropdown__trigger:focus-visible { border-color: var(--ddga-gray-400); box-shadow: var(--ddga-shadow-md); outline: none; }
    .dropdown__trigger:focus-visible::before { transform: scaleX(1); }
    .dropdown__trigger:active { background: var(--ddga-gray-100); }
    .dropdown__trigger:active::before { transform: scaleX(.5); }
    .dropdown__item:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: -2px; }
    .dropdown__menu { position: absolute; z-index: 5; inset-block-start: calc(100% + var(--ddga-space-1)); inset-inline-start: 0; display: grid; min-inline-size: 12rem; padding: var(--ddga-space-1); border: 1px solid var(--ddga-color-border); border-radius: var(--ddga-radius-md); background: var(--ddga-color-card); box-shadow: var(--ddga-shadow-lg); }
    .dropdown[open] .dropdown__menu { animation: dropdown-in 120ms cubic-bezier(.16, 1, .3, 1); }
    .dropdown:not([open]) .dropdown__menu { display: none; }
    .dropdown__item { padding: var(--ddga-space-2) var(--ddga-space-3); border: 0; border-radius: var(--ddga-radius-sm); background: transparent; color: inherit; font: inherit; text-align: start; cursor: pointer; }
    .dropdown__item:hover:not(:disabled) { background: var(--ddga-gray-50); }
    .dropdown__item:active:not(:disabled) { background: var(--ddga-gray-200); }
    .dropdown__item--selected { background: var(--ddga-gray-100); }
    .dropdown__item:disabled { opacity: .5; cursor: not-allowed; }
    @keyframes dropdown-in { from { opacity: 0; transform: translateY(-2px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @media (prefers-reduced-motion: reduce) { .dropdown__trigger, .dropdown__trigger::before, .dropdown__trigger dga-icon { transition: none; } .dropdown__menu { animation: none !important; } }
  `],
})
export class DgaDropdown {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  @Input() label = 'More actions';
  @Input() options: readonly DgaMenuOption[] = [];
  @Input() selectedValue = '';
  @Input() defaultOpen = false;
  @Output() readonly selected = new EventEmitter<string>();

  protected onSelect(value: string, details: HTMLDetailsElement): void {
    this.selectedValue = value;
    this.selected.emit(value);
    details.open = false;
    details.querySelector('summary')?.focus();
  }

  protected onToggle(details: HTMLDetailsElement): void {
    if (details.open) {
      details.querySelector<HTMLButtonElement>('.dropdown__item:not(:disabled)')?.focus();
    }
  }

  protected onKeydown(event: KeyboardEvent, details: HTMLDetailsElement): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      details.open = false;
      details.querySelector('summary')?.focus();
      return;
    }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      return;
    }
    if (!details.open) {
      details.open = true;
    }
    const items = Array.from(details.querySelectorAll<HTMLButtonElement>('.dropdown__item:not(:disabled)'));
    if (!items.length) {
      return;
    }
    event.preventDefault();
    const currentIndex = items.indexOf(event.target as HTMLButtonElement);
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : event.key === 'ArrowDown'
          ? currentIndex < 0 ? 0 : (currentIndex + 1) % items.length
          : currentIndex < 0 ? items.length - 1 : (currentIndex - 1 + items.length) % items.length;
    items[nextIndex]?.focus();
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onOutsidePointerDown(event: PointerEvent): void {
    const details = this.elementRef.nativeElement.querySelector('details');
    if (details?.open && !this.elementRef.nativeElement.contains(event.target as Node)) {
      details.open = false;
    }
  }
}

@Component({
  selector: 'dga-tabs',
  standalone: true,
  template: `
    <div class="tabs" [class.tabs--vertical]="orientation === 'vertical'" [attr.data-orientation]="orientation">
      <div class="tabs__list" role="tablist" aria-label="Content sections" [attr.aria-orientation]="orientation">
        @for (tab of tabs; track tab.value) {
          <button class="tabs__trigger" type="button" role="tab"
            [id]="tabId(tab.value)" [attr.aria-controls]="panelId(tab.value)"
            [attr.aria-selected]="selectedValue === tab.value" [attr.tabindex]="focusedTabValue === tab.value ? 0 : -1"
            [attr.data-state]="selectedValue === tab.value ? 'active' : 'inactive'"
            [attr.data-orientation]="orientation" [attr.data-disabled]="tab.disabled ? '' : null" [disabled]="tab.disabled"
            (focus)="focusedValue = tab.value" (click)="select(tab.value)" (keydown)="onKeydown($event, tab.value)">
            {{ tab.label }}
          </button>
        }
      </div>
      @for (tab of tabs; track tab.value) {
        @if (selectedValue === tab.value) {
          <div class="tabs__panel" role="tabpanel" tabindex="0" [id]="panelId(tab.value)" [attr.aria-labelledby]="tabId(tab.value)">
            {{ tab.content }}
          </div>
        }
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    /* React parity: indicator-thickness token, separator via ::after on list */
    .tabs { --ddga-tabs-indicator-thickness: 3px; display: flex; flex-direction: column; gap: var(--ddga-space-3); color: var(--ddga-text-primary); }
    .tabs__list { position: relative; display: flex; align-items: stretch; overflow-x: auto; }
    /* Separator line: ::after on list (matches React) */
    .tabs__list::after { content: ''; position: absolute; inset-block-end: 0; inset-inline: 0; block-size: var(--ddga-tabs-indicator-thickness); background: var(--ddga-color-input); border-radius: var(--ddga-radius-full); }
    .tabs__trigger {
      position: relative; flex: 0 0 auto;
      display: inline-flex; align-items: center; justify-content: center;
      padding: var(--ddga-space-3) var(--ddga-space-4);
      border: 0; border-radius: var(--ddga-radius-sm);
      background: transparent; color: var(--ddga-gray-700);
      font: inherit; font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-medium); white-space: nowrap;
      cursor: pointer; transition: color 150ms, background-color 150ms, box-shadow 150ms;
    }
    /* Indicator: ::after pseudo-element on trigger (matches React) */
    .tabs__trigger::after {
      content: ''; position: absolute;
      inset-block-end: 0; inset-inline: var(--ddga-space-4);
      block-size: var(--ddga-tabs-indicator-thickness);
      border-radius: var(--ddga-radius-full);
      background: transparent; pointer-events: none;
    }
    /* Hover: show muted indicator, change bg */
    .tabs__trigger:hover:not([data-state='active']):not(:disabled),
    .tabs__trigger:active:not([data-state='active']):not(:disabled) { color: var(--ddga-text-primary); }
    .tabs__trigger:hover:not([data-state='active']):not(:disabled) { background: var(--ddga-color-muted); }
    .tabs__trigger:active:not([data-state='active']):not(:disabled) { background: var(--ddga-color-border); }
    .tabs__trigger:hover:not([data-state='active']):not(:disabled)::after,
    .tabs__trigger:active:not([data-state='active']):not(:disabled)::after { background: var(--ddga-text-primary); }
    /* Active state */
    .tabs__trigger[data-state='active'] { color: var(--ddga-text-primary); font-weight: var(--ddga-font-weight-bold); }
    .tabs__trigger[data-state='active']::after { background: var(--ddga-color-primary); }
    /* Focus */
    .tabs__trigger:focus-visible { border-radius: var(--ddga-radius-xs); box-shadow: inset 0 0 0 3px var(--ddga-text-primary), 0 0 0 1px var(--ddga-color-background); outline: none; }
    /* Panel */
    .tabs__panel { padding-block: var(--ddga-space-4); outline: none; }
    .tabs__panel:focus-visible { box-shadow: 0 0 0 2px var(--ddga-color-ring); border-radius: var(--ddga-radius-sm); }
    /* Disabled */
    .tabs__trigger:disabled { color: var(--ddga-text-placeholder); cursor: not-allowed; }
    .tabs__trigger:disabled:hover { background: transparent; }
    .tabs__trigger:disabled:not([data-state='active'])::after { background: transparent; }
    .tabs__trigger:disabled[data-state='active']::after { background: var(--ddga-text-placeholder); }
    /* Vertical */
    .tabs--vertical { flex-direction: row; align-items: stretch; gap: var(--ddga-space-4); }
    .tabs--vertical .tabs__list { flex-direction: column; align-items: stretch; }
    .tabs--vertical .tabs__list::after { inset-block-end: auto; inset-inline-end: 0; inset-block: 0; inset-inline-start: auto; block-size: auto; inline-size: var(--ddga-tabs-indicator-thickness); }
    .tabs--vertical .tabs__trigger { text-align: start; font-weight: var(--ddga-font-weight-regular); justify-content: flex-start; }
    .tabs--vertical .tabs__trigger[data-state='active'] { font-weight: var(--ddga-font-weight-semibold); }
    .tabs--vertical .tabs__trigger::after { inset-block-end: auto; inset-inline: auto; inset-inline-start: 0; inset-block: var(--ddga-space-2); block-size: auto; inline-size: var(--ddga-tabs-indicator-thickness); }
    .tabs--vertical .tabs__panel { flex: 1; min-inline-size: 0; }
    /* Dark mode */
    [data-theme='dark'] .tabs__trigger { color: var(--ddga-text-secondary); }
    [data-theme='dark'] .tabs__trigger[data-state='active'],
    [data-theme='dark'] .tabs__trigger:hover,
    [data-theme='dark'] .tabs__trigger:focus-visible { color: var(--ddga-text-primary); }
    /* Reduced motion */
    @media (prefers-reduced-motion: reduce) { .tabs__trigger { transition: none; } }
    /* Forced colors */
    @media (forced-colors: active) {
      .tabs__list::after { background: CanvasText; }
      .tabs__trigger[data-state='active'] { color: Highlight; }
      .tabs__trigger[data-state='active']::after { background: Highlight; }
      .tabs__trigger:focus-visible { outline: 2px solid Highlight; outline-offset: 2px; box-shadow: none; }
    }
  `],
})
export class DgaTabs {
  @Input() id = 'dga-tabs';
  @Input() tabs: readonly DgaTab[] = [];
  @Input() selected = '';
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  private activationModeValue: 'automatic' | 'manual' = 'automatic';
  @Input('activationMode')
  set activationMode(value: 'automatic' | 'manual') { this.activationModeValue = value; }
  get activationMode(): 'automatic' | 'manual' { return this.activationModeValue; }
  @Output() readonly selectedChange = new EventEmitter<string>();

  protected get selectedValue(): string {
    return this.selected || this.tabs.find((tab) => !tab.disabled)?.value || '';
  }

  protected tabId(value: string): string {
    return `${this.id}-tab-${value}`;
  }

  protected panelId(value: string): string {
    return `${this.id}-panel-${value}`;
  }

  protected focusedValue = '';

  protected get focusedTabValue(): string {
    return this.tabs.some((tab) => tab.value === this.focusedValue && !tab.disabled)
      ? this.focusedValue
      : this.selectedValue;
  }

  protected select(value: string): void {
    this.selected = value;
    this.focusedValue = value;
    this.selectedChange.emit(value);
  }

  protected onKeydown(event: KeyboardEvent, current: string): void {
    const arrowKeys = this.orientation === 'horizontal' ? ['ArrowLeft', 'ArrowRight'] : ['ArrowUp', 'ArrowDown'];
    if (event.key === 'Enter' || event.key === ' ') {
      if (this.activationMode === 'manual') {
        event.preventDefault();
        this.select(this.focusedValue || current);
      }
      return;
    }
    if (![...arrowKeys, 'Home', 'End'].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const available = this.tabs.filter((tab) => !tab.disabled);
    if (!available.length) {
      return;
    }
    const active = this.focusedValue || current;
    const index = available.findIndex((tab) => tab.value === active);
    const rtl = getComputedStyle(event.currentTarget as HTMLElement).direction === 'rtl';
    const isForward = this.orientation === 'horizontal'
      ? (event.key === 'ArrowRight') !== rtl
      : event.key === 'ArrowDown';
    const direction = isForward ? 1 : -1;
    const nextIndex = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? available.length - 1
        : (index + direction + available.length) % available.length;
    const next = available[nextIndex];
    if (next) {
      this.focusedValue = next.value;
      if (this.activationMode === 'automatic') {
        this.select(next.value);
      }
      const tabList = (event.currentTarget as HTMLElement).closest('.tabs');
      Array.from(tabList?.querySelectorAll<HTMLElement>('[role="tab"]') ?? [])
        .find((tab) => tab.id === this.tabId(next.value))?.focus();
    }
  }
}

@Component({
  selector: 'dga-breadcrumb',
  standalone: true,
  imports: [RouterLink, DgaIcon, DgaPopupPortal],
  template: `
    <nav [attr.aria-label]="label">
      <ol class="breadcrumb">
        @for (item of items; track item.label; let last = $last; let index = $index) {
          <li class="breadcrumb__item">
            @if (item.routerLink && !last) {
              <a [routerLink]="item.routerLink">{{ item.label }}</a>
            } @else if (item.href && !last) {
              <a [href]="item.href">{{ item.label }}</a>
            } @else {
              <span [attr.aria-current]="last ? 'page' : null">{{ item.label }}</span>
            }
            @if (!last) { <span class="breadcrumb__separator" aria-hidden="true"><dga-icon name="chevron-right" /></span> }
          </li>
          @if (index === 0 && overflowItems.length) {
            <li class="breadcrumb__overflow">
            <details #overflowDetails (toggle)="syncOverflow(overflowDetails)">
              <summary #overflowSummary [attr.aria-label]="overflowLabel"><span aria-hidden="true">…</span></summary>
              <div class="breadcrumb__menu" popover="manual" dgaPopupPortal
                [dgaPopupPortalOpen]="overflowOpen" [dgaPopupPortalAnchor]="overflowSummary"
                role="group" [attr.aria-label]="overflowLabel">
                  @for (overflowItem of overflowItems; track overflowItem.label) {
                    @if (overflowItem.routerLink) {
                      <a [routerLink]="overflowItem.routerLink" (click)="closeOverflow(overflowDetails)">{{ overflowItem.label }}</a>
                    } @else if (overflowItem.href) {
                      <a [href]="overflowItem.href" (click)="closeOverflow(overflowDetails)">{{ overflowItem.label }}</a>
                    } @else {
                      <span>{{ overflowItem.label }}</span>
                    }
                  }
                </div>
              </details>
            </li>
          }
        }
      </ol>
    </nav>
  `,
  styles: [`
    :host { display: block; }
    .breadcrumb { display: flex; flex-wrap: wrap; gap: var(--ddga-space-2); margin: 0; padding: 0; list-style: none; color: var(--ddga-color-muted-foreground); font-size: var(--ddga-font-size-sm); }
    .breadcrumb__item { display: inline-flex; align-items: center; gap: var(--ddga-space-2); }
    .breadcrumb__separator { display: inline-flex; align-items: center; }
    :host-context([dir='rtl']) .breadcrumb__separator dga-icon { transform: rotate(180deg); }
    .breadcrumb__overflow { position: relative; display: inline-flex; align-items: center; }
    .breadcrumb__overflow summary { display: grid; place-items: center; min-inline-size: 2rem; min-block-size: 2rem; border-radius: var(--ddga-radius-sm); cursor: pointer; list-style: none; }
    .breadcrumb__overflow summary::-webkit-details-marker { display: none; }
    .breadcrumb__overflow summary:hover { background: var(--ddga-color-muted); }
    .breadcrumb__overflow summary:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: 2px; }
    .breadcrumb__menu { position: absolute; z-index: 5; inset-block-start: calc(100% + var(--ddga-space-1)); inset-inline-start: 0; display: grid; min-inline-size: max-content; padding: var(--ddga-space-1); border: 1px solid var(--ddga-color-border); border-radius: var(--ddga-radius-md); background: var(--ddga-color-card); box-shadow: var(--ddga-shadow-lg); }
    .breadcrumb__menu a, .breadcrumb__menu span { padding: var(--ddga-space-2) var(--ddga-space-3); border-radius: var(--ddga-radius-sm); color: inherit; white-space: nowrap; }
    .breadcrumb__menu a:hover { background: var(--ddga-color-muted); text-decoration: none; }
    .breadcrumb__menu a:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: -2px; }
    a { color: var(--ddga-color-foreground); font-weight: var(--ddga-font-weight-medium); text-decoration: none; }
    a:hover { color: var(--ddga-color-primary); text-decoration: underline; }
    a:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: 2px; }
    /* Current (last) crumb reads as muted light-gray; clickable crumbs stay dark (DGA reference). */
    [aria-current='page'] { color: var(--ddga-color-muted-foreground); }
  `],
})
export class DgaBreadcrumb {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  @Input() label = 'Breadcrumb';
  @Input() items: readonly DgaBreadcrumbItem[] = [];
  @Input() overflowItems: readonly DgaBreadcrumbItem[] = [];
  @Input() overflowLabel = 'More breadcrumbs';
  protected overflowOpen = false;

  protected syncOverflow(details: HTMLDetailsElement): void {
    this.overflowOpen = details.open;
  }

  protected closeOverflow(details: HTMLDetailsElement): void {
    details.open = false;
    this.overflowOpen = false;
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onOutsidePointerDown(event: PointerEvent): void {
    if (this.overflowOpen && !this.elementRef.nativeElement.contains(event.target as Node)) {
      const details = this.elementRef.nativeElement.querySelector('details');
      if (details) details.open = false;
      this.overflowOpen = false;
    }
  }
}

@Component({
  selector: 'dga-pagination',
  standalone: true,
  imports: [DgaIcon, DgaPopupPortal],
  template: `
    <nav class="pagination" [attr.aria-label]="label">
      <button class="pagination__button" type="button" [disabled]="currentPage <= 1"
        aria-label="Go to previous page" (click)="goTo(currentPage - 1)"><dga-icon class="pagination__previous" name="chevron-left" /></button>
      @for (item of pageItems; track $index; let index = $index) {
        @if (item.page !== null) {
          <button class="pagination__button" type="button" [attr.aria-label]="'Go to page ' + item.page"
            [attr.aria-current]="item.page === currentPage ? 'page' : null"
            [class.pagination__button--current]="item.page === currentPage" (click)="goTo(item.page)">{{ item.page }}</button>
        } @else {
          <div class="pagination__overflow">
            <button #overflowTrigger class="pagination__button pagination__ellipsis" type="button" [attr.aria-label]="overflowLabel"
              aria-haspopup="menu" [attr.aria-expanded]="openOverflowIndex === index"
              [attr.data-overflow-trigger]="index" (click)="toggleOverflow(index, $event)"
              (keydown)="onOverflowTriggerKeydown($event, index)">…</button>
            @if (openOverflowIndex === index) {
              <div class="pagination__menu" role="menu" [attr.aria-label]="overflowLabel"
                popover="manual" dgaPopupPortal [dgaPopupPortalOpen]="openOverflowIndex === index"
                [dgaPopupPortalAnchor]="overflowTrigger" [attr.data-overflow-menu]="index"
                (keydown)="onOverflowMenuKeydown($event, index)">
                @for (page of item.overflowPages; track page) {
                  <button class="pagination__menu-item" type="button" role="menuitem"
                    [attr.aria-current]="page === currentPage ? 'page' : null"
                    (click)="goToFromOverflow(page, index)">{{ page }}</button>
                }
              </div>
            }
          </div>
        }
      }
      <button class="pagination__button" type="button" [disabled]="currentPage >= totalPages"
        aria-label="Go to next page" (click)="goTo(currentPage + 1)"><dga-icon class="pagination__next" name="chevron-right" /></button>
    </nav>
  `,
  styles: [`
    :host { display: block; }
    .pagination { display: flex; flex-wrap: wrap; align-items: center; gap: var(--ddga-space-1); }
    .pagination__button { display: inline-grid; place-items: center; min-inline-size: 2.25rem; min-block-size: 2.25rem; padding-inline: var(--ddga-space-2); border: 1px solid var(--ddga-color-border); border-radius: var(--ddga-radius-md); background: var(--ddga-color-card); color: inherit; font: inherit; cursor: pointer; }
    .pagination__button:hover:not(:disabled) { background: var(--ddga-color-secondary); }
    .pagination__button--current { border-color: var(--ddga-color-primary); background: var(--ddga-color-primary); color: var(--ddga-color-primary-foreground); }
    .pagination__ellipsis { display: inline-grid; place-items: center; min-inline-size: 1.5rem; color: var(--ddga-color-muted-foreground); }
    .pagination__overflow { position: relative; }
    .pagination__menu { position: absolute; z-index: 5; inset-block-start: calc(100% + var(--ddga-space-1)); inset-inline-start: 0; display: grid; min-inline-size: 100%; max-block-size: 15rem; overflow-y: auto; padding: var(--ddga-space-1); border: 1px solid var(--ddga-color-border); border-radius: var(--ddga-radius-md); background: var(--ddga-color-card); box-shadow: var(--ddga-shadow-lg); }
    .pagination__menu-item { min-block-size: 2rem; padding-inline: var(--ddga-space-3); border: 0; border-radius: var(--ddga-radius-sm); background: transparent; color: inherit; font: inherit; text-align: start; cursor: pointer; }
    .pagination__menu-item:hover, .pagination__menu-item[aria-current='page'] { background: var(--ddga-color-muted); }
    .pagination__menu-item:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: -2px; }
    [dir='rtl'] .pagination__previous, [dir='rtl'] .pagination__next { transform: rotate(180deg); }
    .pagination__button:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: 2px; }
    .pagination__button:disabled { opacity: .45; cursor: not-allowed; }
  `],
})
export class DgaPagination {
  private readonly elementRef = inject(ElementRef<HTMLElement>);
  @Input() currentPage = 1;
  @Input() totalPages = 1;
  @Input() label = 'Pagination';
  @Input() overflowLabel = 'More pages';
  @Output() readonly pageChange = new EventEmitter<number>();
  protected openOverflowIndex: number | null = null;

  protected get pageItems(): readonly { page: number | null; overflowPages?: readonly number[] }[] {
    const total = Math.max(0, Math.floor(this.totalPages));
    if (total <= 7) {
      return Array.from({ length: total }, (_, index) => ({ page: index + 1 }));
    }

    const current = Math.min(total, Math.max(1, Math.floor(this.currentPage)));
    let start = Math.max(2, current - 1);
    let end = Math.min(total - 1, current + 1);
    if (current <= 4) {
      start = 2;
      end = 5;
    } else if (current >= total - 3) {
      start = total - 4;
      end = total - 1;
    }

    const items: { page: number | null; overflowPages?: readonly number[] }[] = [{ page: 1 }];
    if (start > 2) {
      items.push({ page: null, overflowPages: this.range(2, start - 1) });
    }
    for (let page = start; page <= end; page += 1) {
      items.push({ page });
    }
    if (end < total - 1) {
      items.push({ page: null, overflowPages: this.range(end + 1, total - 1) });
    }
    items.push({ page: total });
    return items;
  }

  protected goTo(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(page);
    }
    this.openOverflowIndex = null;
  }

  protected toggleOverflow(index: number, event: MouseEvent): void {
    event.stopPropagation();
    this.openOverflowIndex = this.openOverflowIndex === index ? null : index;
  }

  protected onOverflowTriggerKeydown(event: KeyboardEvent, index: number): void {
    if (event.key !== 'ArrowDown' && event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    this.openOverflowIndex = index;
    requestAnimationFrame(() => this.focusMenuItem(index, 0));
  }

  protected onOverflowMenuKeydown(event: KeyboardEvent, index: number): void {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      return;
    }
    const menu = this.elementRef.nativeElement.querySelector(`[data-overflow-menu="${index}"]`) as HTMLElement | null;
        const items = menu ? Array.from(menu.querySelectorAll('[role="menuitem"]')) as HTMLButtonElement[] : [];
    if (!items.length) {
      return;
    }
    event.preventDefault();
    const current = items.indexOf(event.target as HTMLButtonElement);
    const target = event.key === 'Home'
      ? 0
      : event.key === 'End'
        ? items.length - 1
        : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items[target]?.focus();
  }

  protected goToFromOverflow(page: number, index: number): void {
    this.goTo(page);
    requestAnimationFrame(() => this.focusOverflowTrigger(index));
  }

  @HostListener('document:pointerdown', ['$event'])
  protected closeOverflowOnOutsideClick(event: PointerEvent): void {
    if (this.openOverflowIndex !== null && !this.elementRef.nativeElement.contains(event.target as Node)) {
      this.openOverflowIndex = null;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  protected closeOverflowOnEscape(event: Event): void {
    const ke = event as KeyboardEvent;
    if (this.openOverflowIndex === null) {
      return;
    }
        ke.preventDefault();
    const index = this.openOverflowIndex;
    this.openOverflowIndex = null;
    requestAnimationFrame(() => this.focusOverflowTrigger(index));
  }

  private range(start: number, end: number): readonly number[] {
    return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
  }

  private focusMenuItem(index: number, itemIndex: number): void {
    const menu = this.elementRef.nativeElement.querySelector(`[data-overflow-menu="${index}"]`) as HTMLElement | null;
        const items = menu ? Array.from(menu.querySelectorAll('[role="menuitem"]')) as HTMLButtonElement[] : [];
        items[itemIndex]?.focus();
  }

  private focusOverflowTrigger(index: number): void {
    (this.elementRef.nativeElement.querySelector(`[data-overflow-trigger="${index}"]`) as HTMLButtonElement | null)?.focus();
  }
}
