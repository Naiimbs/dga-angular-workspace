import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DgaAccordionItem {
  value: string;
  title: string;
  content: string;
  disabled?: boolean;
}

export type DgaAccordionValue = string | readonly string[];

@Component({
  selector: 'dga-accordion',
  standalone: true,
  template: `
    <div class="accordion"
      [class.accordion--sm]="size === 'sm'"
      [class.accordion--md]="size === 'md'"
      [class.accordion--icon-leading]="iconAlign === 'leading'"
      [class.accordion--flush]="flush">
      @for (item of items; track item.value) {
        <div class="accordion__item" [class.accordion__item--disabled]="item.disabled"
          [class.accordion__item--open]="isOpen(item.value)">
          <button class="accordion__trigger" type="button" [disabled]="item.disabled"
            [attr.aria-expanded]="isOpen(item.value)" [attr.aria-controls]="panelId(item.value)"
            (click)="toggle(item)">
            <span class="accordion__title">{{ item.title }}</span>
            <span class="accordion__chevron" aria-hidden="true">⌄</span>
          </button>
          <div class="accordion__content" [id]="panelId(item.value)"
            [attr.aria-hidden]="isOpen(item.value) ? null : 'true'"
            [attr.inert]="isOpen(item.value) ? null : ''">
            <div class="accordion__content-inner">{{ item.content }}</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; inline-size: 100%; }
    .accordion { display: flex; flex-direction: column; inline-size: 100%; border-block-end: 1px solid var(--ddga-color-input); color: var(--ddga-text-primary); }
    .accordion__item { border-block-start: 1px solid var(--ddga-color-input); }
    .accordion__trigger { appearance: none; display: inline-flex; align-items: center; justify-content: flex-start; gap: var(--ddga-space-4); inline-size: 100%; padding-inline: var(--ddga-space-4); padding-block: var(--ddga-space-4); border: 0; background: transparent; color: var(--ddga-text-primary); font: inherit; font-size: var(--ddga-font-size-base); font-weight: var(--ddga-font-weight-semibold); line-height: 1.5rem; text-align: start; cursor: pointer; }
    .accordion__title { flex: 1 1 0; min-inline-size: 0; }
    .accordion__trigger:hover:not(:disabled) { background: var(--ddga-color-secondary); }
    .accordion__trigger:active:not(:disabled) { background: var(--ddga-color-secondary-hover); }
    .accordion__trigger:focus-visible { outline: 2px solid var(--ddga-color-focus-ring); outline-offset: -2px; }
    .accordion__chevron { inline-size: 1rem; block-size: 1rem; flex: 0 0 auto; color: var(--ddga-text-primary); transition: transform 200ms ease; }
    .accordion__item--open > .accordion__trigger .accordion__chevron { transform: rotate(180deg); }
    .accordion--icon-leading .accordion__chevron { order: -1; }
    .accordion__content { display: grid; grid-template-rows: 0fr; visibility: hidden; opacity: 0; color: var(--ddga-gray-700); line-height: 1.5rem; transition: grid-template-rows 200ms ease, opacity 200ms ease, visibility 0s linear 200ms; }
    .accordion__content[aria-hidden='true'] { pointer-events: none; }
    .accordion__content[aria-hidden='true'] .accordion__content-inner { padding-block: 0; }
    .accordion__item--open > .accordion__content { grid-template-rows: 1fr; visibility: visible; opacity: 1; transition: grid-template-rows 200ms ease, opacity 200ms ease, visibility 0s; }
    .accordion__content-inner { min-block-size: 0; overflow: hidden; padding-block-start: var(--ddga-space-2); padding-block-end: var(--ddga-space-6); padding-inline-start: var(--ddga-space-4); padding-inline-end: var(--ddga-space-12); transition: padding 200ms ease; }
    .accordion--sm .accordion__trigger { padding-block: var(--ddga-space-2); }
    .accordion--md .accordion__trigger { padding-block: var(--ddga-space-3); }
    .accordion--flush .accordion__trigger { padding-inline: 0; }
    .accordion--flush .accordion__content-inner { padding-inline-start: 0; }
    .accordion__item--disabled > .accordion__trigger { color: var(--ddga-gray-400); cursor: not-allowed; }
    .accordion__item--disabled > .accordion__content { color: var(--ddga-gray-400); }
    @media (prefers-reduced-motion: reduce) { .accordion__chevron, .accordion__content, .accordion__content-inner { transition: none; } }
    @media (forced-colors: active) { .accordion, .accordion__item { border-color: CanvasText; } .accordion__trigger:focus-visible { outline-color: Highlight; } }
  `],
})
export class DgaAccordion {
  @Input() items: readonly DgaAccordionItem[] = [];
  @Input() size: 'sm' | 'md' = 'md';
  @Input() iconAlign: 'leading' | 'trailing' = 'trailing';
  @Input() flush = false;
  @Input() multiple = false;
  @Input() collapsible = true;
  @Input() value: DgaAccordionValue = '';
  @Input() defaultValue: DgaAccordionValue = '';
  @Input() id = 'dga-accordion';
  @Output() readonly valueChange = new EventEmitter<DgaAccordionValue>();
  private hasInteracted = false;

  protected isOpen(value: string): boolean {
    const selected = this.currentValue;
    return Array.isArray(selected) ? selected.includes(value) : selected === value;
  }

  protected panelId(value: string): string {
    return `${this.id}-${value}`;
  }

  protected toggle(item: DgaAccordionItem): void {
    if (item.disabled) {
      return;
    }

    const selected = this.currentValue;
    const values = new Set(Array.isArray(selected) ? selected : selected ? [selected] : []);
    if (values.has(item.value)) {
      if (!this.multiple && !this.collapsible) {
        return;
      }
      values.delete(item.value);
    } else if (this.multiple) {
      values.add(item.value);
    } else {
      values.clear();
      values.add(item.value);
    }

    const nextValue: DgaAccordionValue = this.multiple
      ? Array.from(values)
      : Array.from(values)[0] ?? '';
    this.hasInteracted = true;
    this.value = nextValue;
    this.valueChange.emit(nextValue);
  }

  private get currentValue(): DgaAccordionValue {
    if (this.hasInteracted) {
      return this.value;
    }
    return this.value.length ? this.value : this.defaultValue;
  }
}
