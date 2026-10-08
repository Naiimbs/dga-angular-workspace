import { AfterContentInit, booleanAttribute, Component, ContentChildren, EventEmitter, forwardRef, Input, Output, QueryList } from '@angular/core';
import { DgaIcon } from '../foundation/dga-icon';
import type { DgaIconName } from '../foundation/dga-icon';

export type DgaCardVariant = 'default' | 'outline' | 'elevated' | 'filled' | 'gradient' | 'ghost' | 'plain';
export type DgaCardPadding = 'sm' | 'md' | 'lg';
export type DgaCardOrientation = 'vertical' | 'horizontal';

@Component({
  selector: 'dga-card',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <div class="ddga-card" [class]="'ddga-card ddga-card--' + variant + ' ddga-card--padding-' + padding +
      ' ddga-card--' + orientation + (align === 'center' ? ' ddga-card--center' : '') +
      (interactive ? ' ddga-card--interactive' : '') + (disabled ? ' ddga-card--disabled' : '') +
      (selectable ? ' ddga-card--selectable' : '') + (expandable ? ' ddga-card--expandable' : '')"
      [attr.data-slot]="'card'" [attr.data-orientation]="orientation"
      [attr.data-disabled]="disabled ? '' : null" [attr.data-state]="selectable ? (isSelected ? 'checked' : 'unchecked') : null"
      [attr.data-expanded]="expandable ? isExpanded : null"
      [attr.role]="selectable ? 'checkbox' : interactive && !expandable ? 'button' : null"
      [attr.aria-label]="ariaLabel || null" [attr.aria-labelledby]="ariaLabelledby || null"
      [attr.aria-checked]="selectable ? isSelected : null"
      [attr.aria-disabled]="disabled || null"
      [attr.tabindex]="selectable || interactive && !expandable ? (disabled ? -1 : 0) : null"
      (click)="activate($event)" (keydown)="onKeydown($event)">
      @if (selectable) {
        <span class="ddga-card__select-indicator" aria-hidden="true">
          <span class="ddga-card__checkbox" [attr.data-state]="isSelected ? 'checked' : 'unchecked'">
            @if (isSelected) { <dga-icon name="check" /> }
          </span>
        </span>
      }
      <ng-content></ng-content>
      @if (expandable) {
        <div class="ddga-card__expand-row">
          <button class="ddga-card__expand-button" type="button" [disabled]="disabled"
            [attr.aria-label]="expandLabel" [attr.aria-expanded]="isExpanded" [attr.aria-controls]="contentId"
            (click)="toggleExpanded($event)">
            <dga-icon name="chevron-down" />
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-inline-size: 0; }
    .ddga-card {
      --ddga-card-padding: calc(var(--ddga-space-4) - 1px);
      --ddga-card-gap: var(--ddga-space-6);
      position: relative; display: flex; flex-direction: column; gap: var(--ddga-card-gap);
      padding: var(--ddga-card-padding); border: 1px solid var(--ddga-color-input);
      border-radius: var(--ddga-radius-lg); background: var(--ddga-color-card);
      color: var(--ddga-color-card-foreground);
      transition: background-color 150ms, box-shadow 150ms, border-color 150ms;
    }
    .ddga-card--outline { border-color: var(--ddga-color-input); background: transparent; }
    .ddga-card--elevated { border-color: transparent; box-shadow: var(--ddga-shadow-md); }
    .ddga-card--filled { border-color: transparent; background: var(--ddga-color-muted); }
    .ddga-card--gradient { border-color: transparent; background: linear-gradient(90deg, var(--ddga-sa-600), var(--ddga-sa-500)); color: var(--ddga-color-primary-foreground); }
    .ddga-card--plain, .ddga-card--ghost { border-color: transparent; background: transparent; box-shadow: none; }
    .ddga-card--padding-sm { --ddga-card-padding: calc(var(--ddga-space-3) - 1px); }
    .ddga-card--padding-lg { --ddga-card-padding: calc(var(--ddga-space-6) - 1px); }
    .ddga-card--horizontal { flex-direction: row; }
    .ddga-card--center { align-items: center; text-align: center; }
    :host ::ng-deep .ddga-card--center .ddga-card__header,
    :host ::ng-deep .ddga-card--center .ddga-card__content,
    :host ::ng-deep .ddga-card--center .ddga-card__footer { align-items: center; justify-content: center; }
    :host ::ng-deep .ddga-card--center .ddga-card__icon { align-self: center; }
    .ddga-card--interactive, .ddga-card--selectable { cursor: pointer; }
    :host ::ng-deep .ddga-card[data-expanded='false'] dga-card-expandable-content { display: none; }
    .ddga-card--interactive:hover:not(.ddga-card--disabled),
    .ddga-card--selectable:hover:not(.ddga-card--disabled) { background: var(--ddga-gray-50); }
    .ddga-card--interactive.ddga-card--gradient:hover:not(.ddga-card--disabled) { box-shadow: var(--ddga-shadow-lg); }
    .ddga-card--interactive:focus-visible,
    .ddga-card--selectable:focus-visible { box-shadow: inset 0 0 0 2px var(--ddga-text-primary); outline: none; }
    .ddga-card--disabled { background: var(--ddga-gray-200); color: var(--ddga-gray-400); box-shadow: none; cursor: not-allowed; }
    .ddga-card--disabled.ddga-card--default,
    .ddga-card--disabled.ddga-card--outline { border-color: var(--ddga-gray-400); }
    .ddga-card--disabled .ddga-card__checkbox { border-color: var(--ddga-gray-400); }
    .ddga-card--disabled .ddga-card__checkbox[data-state='checked'] { border-color: var(--ddga-gray-400); background: var(--ddga-gray-200); }
    .ddga-card__select-indicator { position: absolute; z-index: 1; inset-block-start: var(--ddga-space-4); inset-inline-end: var(--ddga-space-4); }
    .ddga-card__checkbox { display: inline-flex; align-items: center; justify-content: center; inline-size: 1.25rem; block-size: 1.25rem; border: 1px solid var(--ddga-gray-500); border-radius: var(--ddga-radius-xs); background: var(--ddga-color-background); color: var(--ddga-color-primary-foreground); }
    .ddga-card__checkbox[data-state='checked'] { border-color: var(--ddga-color-primary); background: var(--ddga-color-primary); }
    .ddga-card__expand-row { display: flex; justify-content: flex-end; margin-block-start: auto; }
    .ddga-card__expand-button { display: inline-grid; place-items: center; inline-size: 2.5rem; block-size: 2.5rem; border: 0; border-radius: var(--ddga-radius-sm); background: transparent; color: inherit; cursor: pointer; }
    .ddga-card__expand-button:hover:not(:disabled) { background: var(--ddga-color-secondary); }
    .ddga-card__expand-button:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: 2px; }
    .ddga-card__expand-button:disabled { color: var(--ddga-gray-400); cursor: not-allowed; }
    .ddga-card__expand-button dga-icon { transition: rotate 150ms ease; }
    .ddga-card__expand-button dga-icon { --dga-icon-size: 1.5rem; }
    .ddga-card[data-expanded='true'] .ddga-card__expand-button dga-icon { rotate: 180deg; }
    :host ::ng-deep .ddga-card--horizontal dga-card-image { flex: 0 0 40%; align-self: stretch; max-inline-size: 240px; }
    :host ::ng-deep .ddga-card--horizontal dga-card-image .ddga-card__image { block-size: 100%; aspect-ratio: auto; }
    :host ::ng-deep .ddga-card--horizontal > :not(dga-card-image) { flex: auto; }
    @media (prefers-reduced-motion: reduce) { .ddga-card, .ddga-card__expand-button dga-icon { transition: none; } }
  `],
})
export class DgaCard implements AfterContentInit {
  static nextId = 0;

  @Input() variant: DgaCardVariant = 'default';
  @Input() padding: DgaCardPadding = 'md';
  @Input() orientation: DgaCardOrientation = 'vertical';
  @Input() align: 'start' | 'center' = 'start';
  @Input({ transform: booleanAttribute }) interactive = false;
  @Input({ transform: booleanAttribute }) selectable = false;
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() expandLabel = 'Toggle details';
  @Input() id = `dga-card-${++DgaCard.nextId}`;
  @Input('aria-label') ariaLabel = '';
  @Input('aria-labelledby') ariaLabelledby = '';
  @Output() readonly selectedChange = new EventEmitter<boolean>();
  @Output() readonly expandedChange = new EventEmitter<boolean>();
  @Output() readonly clicked = new EventEmitter<Event>();

  private selectedState = false;
  private controlledSelected: boolean | undefined;
  private expandedState = false;
  private controlledExpanded: boolean | undefined;
  @ContentChildren(forwardRef(() => DgaCardExpandableContent)) private expandableContents!: QueryList<DgaCardExpandableContent>;
  @Input({ transform: booleanAttribute }) expandable = false;

  @Input() set selected(value: boolean | undefined) { this.controlledSelected = value; }
  get selected(): boolean | undefined { return this.controlledSelected; }
  @Input() set defaultSelected(value: boolean) { this.selectedState = value; }
  get isSelected(): boolean { return this.controlledSelected ?? this.selectedState; }
  @Input() set expanded(value: boolean | undefined) {
    this.controlledExpanded = value;
    this.updateExpandableContents();
  }
  get expanded(): boolean | undefined { return this.controlledExpanded; }
  @Input() set defaultExpanded(value: boolean) {
    this.expandedState = value;
    this.updateExpandableContents();
  }
  get isExpanded(): boolean { return this.controlledExpanded ?? this.expandedState; }
  get contentId(): string { return `${this.id}-expandable-content`; }

  ngAfterContentInit(): void {
    this.updateExpandableContents();
    this.expandableContents.changes.subscribe(() => this.updateExpandableContents());
  }

  protected activate(event: Event): void {
    if (this.disabled) return;
    if (this.selectable) {
      const next = !this.isSelected;
      if (this.controlledSelected === undefined) this.selectedState = next;
      this.selectedChange.emit(next);
      this.clicked.emit(event);
    } else if (this.interactive && !this.expandable) {
      this.clicked.emit(event);
    }
  }

  protected toggleExpanded(event: Event): void {
    event.stopPropagation();
    if (this.disabled) return;
    const next = !this.isExpanded;
    if (this.controlledExpanded === undefined) this.expandedState = next;
    this.updateExpandableContents();
    this.expandedChange.emit(next);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled) return;
    if (this.selectable && event.key === ' ') {
      event.preventDefault();
      this.activate(event);
    } else if (this.interactive && !this.expandable && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      this.activate(event);
    }
  }

  private updateExpandableContents(): void {
    this.expandableContents?.forEach(content => {
      content.id = this.contentId;
      content.expanded = this.isExpanded;
    });
  }
}

@Component({
  selector: 'dga-card-header',
  standalone: true,
  template: `<div class="ddga-card__header"><ng-content></ng-content></div>`,
  styles: [`.ddga-card__header { display: flex; flex-direction: column; gap: var(--ddga-space-2); }`],
})
export class DgaCardHeader {}

@Component({
  selector: 'dga-card-title',
  standalone: true,
  template: `<h3 class="ddga-card__title"><ng-content></ng-content></h3>`,
  styles: [`.ddga-card__title { margin: 0; color: var(--ddga-gray-800); font-size: var(--ddga-font-size-lg); font-weight: var(--ddga-font-weight-bold); line-height: 1.75rem; }
    :host-context(.ddga-card--gradient) .ddga-card__title { color: inherit; }
    :host-context(.ddga-card--disabled) .ddga-card__title { color: var(--ddga-gray-400); }`],
})
export class DgaCardTitle {}

@Component({
  selector: 'dga-card-description',
  standalone: true,
  template: `<p class="ddga-card__description" [style.--ddga-card-description-min-lines]="minLines"
    [style.--ddga-card-description-clamp]="clamp"><ng-content></ng-content></p>`,
  styles: [`
    .ddga-card__description { margin: 0; color: var(--ddga-gray-800); font-size: var(--ddga-font-size-base); font-weight: var(--ddga-font-weight-regular); line-height: 1.5rem; }
    :host-context(.ddga-card--gradient) .ddga-card__description { opacity: .85; }
    :host-context(.ddga-card--gradient) .ddga-card__description { color: inherit; }
    :host-context(.ddga-card--disabled) .ddga-card__description { color: var(--ddga-gray-400); }
    .ddga-card__description[style*='--ddga-card-description-min-lines'] { min-block-size: calc(var(--ddga-card-description-min-lines) * 1.5rem); }
    .ddga-card__description[style*='--ddga-card-description-clamp'] { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: var(--ddga-card-description-clamp); overflow: hidden; }
  `],
})
export class DgaCardDescription {
  @Input() minLines: number | null = null;
  @Input() clamp: number | null = null;
}

@Component({
  selector: 'dga-card-content',
  standalone: true,
  template: `<div class="ddga-card__content"><ng-content></ng-content></div>`,
  styles: [`.ddga-card__content { display: flex; flex-direction: column; gap: var(--ddga-space-2); }`],
})
export class DgaCardContent {}

@Component({
  selector: 'dga-card-footer',
  standalone: true,
  template: `<div class="ddga-card__footer"><ng-content></ng-content></div>`,
  styles: [`.ddga-card__footer { display: flex; align-items: center; justify-content: flex-end; gap: var(--ddga-space-4); }`],
})
export class DgaCardFooter {}

@Component({
  selector: 'dga-card-icon',
  standalone: true,
  template: `<div class="ddga-card__icon" [class.ddga-card__icon--featured]="featured"
    [class.ddga-card__icon--lg]="featured && size === 'lg'" aria-hidden="true"><ng-content></ng-content></div>`,
  styles: [`
    .ddga-card__icon { display: inline-flex; align-items: center; justify-content: center; align-self: start; inline-size: max-content; color: var(--ddga-color-primary); }
    .ddga-card__icon dga-icon { --dga-icon-size: 1.75rem; }
    .ddga-card__icon--featured { display: grid; place-items: center; inline-size: 3rem; block-size: 3rem; margin-block-end: var(--ddga-space-4); border-radius: var(--ddga-radius-full); background: var(--ddga-sa-50); color: var(--ddga-success-700); --dga-icon-size: 1.5rem; }
    .ddga-card__icon--lg { inline-size: 3.5rem; block-size: 3.5rem; --dga-icon-size: 1.75rem; }
  `],
})
export class DgaCardIcon {
  @Input({ transform: booleanAttribute }) featured = false;
  @Input() size: 'md' | 'lg' = 'md';
}

@Component({
  selector: 'dga-card-image',
  standalone: true,
  template: `<img class="ddga-card__image" [src]="src" [alt]="alt" [attr.loading]="loading"
    [style.aspect-ratio]="aspectRatio || (blockSize ? 'auto' : '16 / 9')"
    [style.--ddga-card-image-block-size]="blockSize || null" />`,
  styles: [`.ddga-card__image { display: block; inline-size: 100%; block-size: var(--ddga-card-image-block-size, auto); aspect-ratio: var(--ddga-card-image-aspect, 16 / 9); object-fit: cover; border-radius: var(--ddga-radius-md); }`],
})
export class DgaCardImage {
  @Input({ required: true }) src = '';
  @Input() alt = '';
  @Input() aspectRatio = '';
  @Input() blockSize: number | string | null = null;
  @Input() loading: 'eager' | 'lazy' = 'eager';
}

@Component({
  selector: 'dga-card-expandable-content',
  standalone: true,
  template: `<div class="ddga-card__expandable-content" [id]="id" [hidden]="!expanded"><ng-content></ng-content></div>`,
  styles: [`.ddga-card__expandable-content[hidden] { display: none; }`],
})
export class DgaCardExpandableContent {
  @Input() id = '';
  @Input() expanded = false;
}
