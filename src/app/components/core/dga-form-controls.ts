import {
  Component,
  ElementRef,
  forwardRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  Output,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DgaIcon } from '../foundation/dga-icon';
import { DgaPopupPortal } from '../foundation/dga-popup-portal';

export type DgaFieldVariant = 'default' | 'filled-lighter' | 'filled-darker';
export type DgaFieldSize = 'sm' | 'md';

export interface DgaSelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface DgaRadioOption {
  label: string;
  value: string;
  disabled?: boolean;
}

@Component({
  selector: 'dga-input',
  standalone: true,
  template: `
    <div class="field">
      @if (label) {
        <label class="field__label" [for]="id">{{ label }}@if (required) { <span aria-hidden="true">*</span> }</label>
      }
      <div class="field__control"
        [class.field__control--default]="variant === 'default'"
        [class.field__control--filled-lighter]="variant === 'filled-lighter'"
        [class.field__control--filled-darker]="variant === 'filled-darker'"
        [class.field__control--error]="hasError"
        [class.field__control--success]="success && !hasError"
        [class.field__control--sm]="size === 'sm'">
        <input
          class="field__input"
          [id]="id"
          [type]="type"
          [value]="value"
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [attr.aria-invalid]="hasError ? 'true' : success ? 'false' : null"
          [attr.aria-describedby]="descriptionId"
          (input)="onInput($event)"
          (blur)="onTouched()"
        />
      </div>
      @if (message) {
        <span class="field__hint" [class.field__hint--error]="hasError" [id]="descriptionId">
          {{ message }}
        </span>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-inline-size: 0; }
    .field { display: grid; gap: var(--ddga-space-2); color: var(--ddga-color-foreground); }
    .field__label { font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-medium); }
    .field__control {
      box-sizing: border-box; position: relative; display: flex; align-items: center;
      inline-size: 100%; min-block-size: 3rem; padding-block: 0; padding-inline: var(--ddga-space-4);
      border: 1px solid var(--ddga-gray-400); border-radius: var(--ddga-radius-sm);
      background: var(--ddga-color-background); color: var(--ddga-gray-700);
      transition: border-color 150ms, box-shadow 150ms, background-color 150ms;
    }
    .field__control::after {
      content: ''; position: absolute; inset-inline: 0; inset-block-end: -1px; block-size: 2px;
      background: var(--ddga-gray-950); transform: scaleX(0); transform-origin: center;
      pointer-events: none; transition: transform 400ms ease-out;
    }
    .field__control--sm { min-block-size: 2rem; }
    .field__control--filled-lighter { border-color: transparent; background: var(--ddga-gray-25); }
    .field__control--filled-darker { border-color: transparent; background: var(--ddga-gray-100); }
    .field__control--error, .field__control--error:hover:not(:focus-within),
    .field__control--error:focus-within { border-color: var(--ddga-error-700); }
    .field__control--success { border-color: var(--ddga-success-600); }
    .field__control--default:hover:not(:focus-within) { border-color: var(--ddga-gray-700); }
    .field__control:focus-within { box-shadow: var(--ddga-shadow-md); }
    .field__control--default:focus-within { border-color: var(--ddga-gray-400); }
    .field__control:focus-within::after { transform: scaleX(1); }
    .field__control:active:not(:has(.field__input:disabled)) { background: var(--ddga-gray-100); }
    .field__control:active::after { transform: scaleX(.5); }
    .field__control:has(.field__input:read-only:not(:disabled)) { border-color: var(--ddga-gray-300); background: transparent; }
    .field__control:has(.field__input:disabled) { border-color: var(--ddga-gray-300); background: transparent; cursor: not-allowed; }
    .field__input {
      box-sizing: border-box; flex: 1 1 auto; inline-size: 100%; min-inline-size: 0; min-block-size: 100%;
      padding: var(--ddga-space-2) 0; border: 0; outline: 0; background: transparent;
      color: inherit; font: inherit;
    }
    .field__input::placeholder { color: var(--ddga-text-placeholder); }
    .field__input:disabled { color: var(--ddga-gray-400); cursor: not-allowed; }
    .field__input:disabled::placeholder { color: var(--ddga-gray-400); }
    .field__input:read-only { cursor: text; }
    .field__control--filled-lighter:focus-within, .field__control--filled-darker:focus-within { background: var(--ddga-color-background); }
    .field__hint { color: var(--ddga-text-secondary); font-size: var(--ddga-font-size-xs); padding-block: var(--ddga-space-1); }
    .field__hint--error { color: var(--ddga-color-error); }
    @media (prefers-reduced-motion: reduce) { .field__control, .field__control::after { transition: none; } }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DgaInput),
    multi: true,
  }],
})
export class DgaInput implements ControlValueAccessor {
  @Input() id = 'dga-input';
  @Input() label = '';
  @Input() type: 'text' | 'email' | 'password' | 'search' | 'tel' | 'url' | 'number' = 'text';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() variant: DgaFieldVariant = 'default';
  @Input() size: DgaFieldSize = 'md';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() error = '';
  @Input() errorMessage = '';
  @Input() success = false;
  @Input() helperText = '';
  @Output() readonly valueChange = new EventEmitter<string>();
  protected onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected get hasError(): boolean {
    return Boolean(this.error || this.errorMessage);
  }

  protected get message(): string {
    return this.error || this.errorMessage || this.helperText;
  }

  protected get descriptionId(): string | null {
    return this.message ? `${this.id}-hint` : null;
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.value = value;
    this.valueChange.emit(value);
    this.onChange(value);
  }
}

@Component({
  selector: 'dga-textarea',
  standalone: true,
  template: `
    <div class="field">
      @if (label) {
        <label class="field__label" [for]="id">{{ label }}@if (required) { <span aria-hidden="true">*</span> }</label>
      }
      <div class="field__control"
        [class.field__control--default]="variant === 'default'"
        [class.field__control--sm]="size === 'sm'"
        [class.field__control--filled-lighter]="variant === 'filled-lighter'"
        [class.field__control--filled-darker]="variant === 'filled-darker'"
        [class.field__control--error]="hasError"
        [class.field__control--success]="success && !hasError">
        <textarea
          class="field__input"
          [class.field__input--resize-none]="resize === 'none'"
          [id]="id"
          [rows]="rows"
          [value]="value"
          [placeholder]="placeholder"
          [required]="required"
          [disabled]="disabled"
          [readOnly]="readOnly"
          [attr.aria-invalid]="hasError ? 'true' : success ? 'false' : null"
          [attr.aria-describedby]="descriptionId"
          (input)="onInput($event)"
          (blur)="onTouched()"
        ></textarea>
      </div>
      @if (message) {
        <span class="field__hint" [class.field__hint--error]="hasError" [id]="descriptionId">{{ message }}</span>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-inline-size: 0; }
    .field { display: grid; gap: var(--ddga-space-2); }
    .field__label { color: var(--ddga-text-primary); font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-regular); }
    .field__control { box-sizing: border-box; position: relative; inline-size: 100%; min-block-size: 6rem; border: 1px solid var(--ddga-gray-400); border-radius: var(--ddga-radius-sm); background: var(--ddga-color-background); transition: border-color 150ms, box-shadow 150ms, background-color 150ms; }
    .field__control::after { content: ''; position: absolute; inset-inline: 0; inset-block-end: -1px; block-size: 2px; background: var(--ddga-gray-950); transform: scaleX(0); transform-origin: center; pointer-events: none; transition: transform 400ms ease-out; }
    .field__control--sm { min-block-size: 4.5rem; }
    .field__input { box-sizing: border-box; display: block; inline-size: 100%; min-block-size: inherit; padding-block: var(--ddga-space-3); padding-inline: var(--ddga-space-4); border: 0; outline: 0; border-radius: inherit; background: transparent; color: var(--ddga-text-primary); font: inherit; resize: vertical; }
    .field__input--resize-none { resize: none; }
    .field__input::placeholder { color: var(--ddga-gray-500); }
    .field__control--filled-lighter { border-color: transparent; background: var(--ddga-gray-25); }
    .field__control--filled-darker { border-color: transparent; background: var(--ddga-gray-100); }
    .field__control--default:hover:not(:focus-within) { border-color: var(--ddga-gray-700); }
    .field__control:focus-within { box-shadow: var(--ddga-shadow-md); }
    .field__control--default:focus-within { border-color: var(--ddga-gray-400); }
    .field__control:focus-within::after { transform: scaleX(1); }
    .field__control:active:not(:has(.field__input:disabled)) { background: var(--ddga-gray-100); }
    .field__control:active::after { transform: scaleX(.5); }
    .field__control--error, .field__control--error:hover:not(:focus-within), .field__control--error:focus-within { border-color: var(--ddga-error-700); }
    .field__control--success { border-color: var(--ddga-success-600); }
    .field__control:has(.field__input:read-only:not(:disabled)) { border-color: var(--ddga-gray-300); background: transparent; }
    .field__control:has(.field__input:disabled) { border-color: var(--ddga-gray-300); background: transparent; cursor: not-allowed; }
    .field__input:disabled { color: var(--ddga-gray-400); cursor: not-allowed; resize: none; }
    .field__input:disabled::placeholder { color: var(--ddga-gray-400); }
    .field__control--filled-lighter:focus-within, .field__control--filled-darker:focus-within { background: var(--ddga-color-background); }
    .field__hint { padding-block: var(--ddga-space-1); color: var(--ddga-gray-700); font-size: var(--ddga-font-size-xs); }
    .field__hint--error { color: var(--ddga-color-error); }
    @media (prefers-reduced-motion: reduce) { .field__control, .field__control::after { transition: none; } }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DgaTextarea),
    multi: true,
  }],
})
export class DgaTextarea implements ControlValueAccessor {
  @Input() id = 'dga-textarea';
  @Input() label = '';
  @Input() value = '';
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() resize: 'vertical' | 'none' = 'vertical';
  @Input() variant: DgaFieldVariant = 'default';
  @Input() size: DgaFieldSize = 'md';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() error = '';
  @Input() errorMessage = '';
  @Input() success = false;
  @Input() helperText = '';
  @Output() readonly valueChange = new EventEmitter<string>();
  protected onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected get hasError(): boolean {
    return Boolean(this.error || this.errorMessage);
  }

  protected get message(): string {
    return this.error || this.errorMessage || this.helperText;
  }

  protected get descriptionId(): string | null {
    return this.message ? `${this.id}-hint` : null;
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  protected onInput(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value;
    this.value = value;
    this.valueChange.emit(value);
    this.onChange(value);
  }
}

@Component({
  selector: 'dga-select',
  standalone: true,
  imports: [DgaIcon, DgaPopupPortal],
  template: `
    <div class="field">
      @if (label) {
        <label class="field__label" [id]="labelId" [for]="triggerId">{{ label }}@if (required) { <span aria-hidden="true">*</span> }</label>
      }
      <div class="select">
        <button #selectTrigger class="field__control select__trigger"
          [class.field__control--sm]="size === 'sm'"
          [class.field__control--error]="hasError"
          [class.field__control--success]="success && !hasError"
          [id]="triggerId" type="button" role="combobox" aria-haspopup="listbox"
          [disabled]="disabled" [attr.aria-expanded]="open"
          [attr.aria-controls]="listboxId" [attr.aria-activedescendant]="activeOptionId"
          [attr.aria-labelledby]="label ? labelId : null"
          [attr.aria-readonly]="readOnly ? 'true' : null"
          [attr.aria-required]="required ? 'true' : null"
          [attr.aria-invalid]="hasError ? 'true' : success ? 'false' : null"
          [attr.aria-describedby]="descriptionId"
          (click)="toggleOpen()" (keydown)="onKeydown($event)" (blur)="onTouched()">
          <span [class.select__placeholder]="!selectedOption">{{ selectedOption?.label || placeholder }}</span>
          <dga-icon class="select__chevron" [class.select__chevron--open]="open" name="chevron-down" />
        </button>
        @if (open) {
          <div class="select__listbox" popover="manual" dgaPopupPortal [dgaPopupPortalOpen]="open"
            [dgaPopupPortalAnchor]="selectTrigger" [dgaPopupPortalMatchAnchor]="true"
            [id]="listboxId" role="listbox" [attr.aria-labelledby]="label ? labelId : null">
            @for (option of options; track option.value; let index = $index) {
              <div class="select__option" [id]="optionId(index)" role="option"
                [attr.aria-selected]="option.value === value"
                [attr.aria-disabled]="option.disabled ? 'true' : null"
                [class.select__option--active]="index === activeIndex"
                [class.select__option--selected]="option.value === value"
                [class.select__option--disabled]="option.disabled"
                (pointermove)="setActive(index)" (click)="choose(option)">
                <span>{{ option.label }}</span>
                @if (option.value === value) { <dga-icon class="select__check" name="check" /> }
              </div>
            }
          </div>
        }
      </div>
      @if (message) {
        <span class="field__hint" [class.field__hint--error]="hasError" [id]="descriptionId">{{ message }}</span>
      }
    </div>
  `,
  styles: [`
    :host { display: block; min-inline-size: 0; }
    .field { display: grid; gap: var(--ddga-space-2); }
    .field__label { color: var(--ddga-text-primary); font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-medium); }
    .select { position: relative; min-inline-size: 0; }
    .field__control { box-sizing: border-box; inline-size: 100%; min-block-size: 2.5rem; padding-block: var(--ddga-space-2); padding-inline: var(--ddga-space-4); border: 1px solid var(--ddga-color-input); border-radius: var(--ddga-radius-sm); background: var(--ddga-color-background); color: var(--ddga-text-primary); font: inherit; text-align: start; transition: border-color 150ms, box-shadow 150ms; }
    .select__trigger { display: flex; align-items: center; justify-content: space-between; gap: var(--ddga-space-3); cursor: pointer; }
    .field__control--sm { min-block-size: 2rem; font-size: var(--ddga-font-size-sm); }
    .field__control--error { border-color: var(--ddga-color-error); }
    .field__control--success { border-color: var(--ddga-color-success); }
    .field__control:hover:not(:focus-visible):not(:disabled) { border-color: var(--ddga-gray-700); }
    .field__control:focus-visible { border-color: var(--ddga-color-ring); box-shadow: 0 0 0 1px var(--ddga-color-ring); outline: none; }
    .field__control--error:focus-visible { border-color: var(--ddga-color-error); box-shadow: 0 0 0 1px var(--ddga-color-error); }
    .field__control:disabled { background: var(--ddga-color-muted); color: var(--ddga-color-muted-foreground); cursor: not-allowed; }
    .select__placeholder { color: var(--ddga-gray-500); }
    .select__chevron { flex: 0 0 auto; color: var(--ddga-gray-600); transition: transform 150ms; }
    .select__chevron--open { transform: rotate(180deg); }
    .select__listbox { position: absolute; z-index: 20; inset-block-start: calc(100% + var(--ddga-space-1)); inset-inline: 0; max-block-size: 16rem; overflow-y: auto; padding: var(--ddga-space-1); border: 1px solid var(--ddga-color-border); border-radius: var(--ddga-radius-md); background: var(--ddga-color-popover, var(--ddga-color-background)); box-shadow: var(--ddga-shadow-lg); }
    .select__option { display: flex; align-items: center; justify-content: space-between; gap: var(--ddga-space-3); min-block-size: 2.25rem; padding-block: var(--ddga-space-2); padding-inline: var(--ddga-space-3); border-radius: var(--ddga-radius-sm); color: var(--ddga-color-foreground); cursor: pointer; }
    .select__option--active:not(.select__option--disabled), .select__option:hover:not(.select__option--disabled) { background: var(--ddga-color-secondary); }
    .select__option--selected { font-weight: var(--ddga-font-weight-medium); }
    .select__option--disabled { color: var(--ddga-gray-400); cursor: not-allowed; }
    .select__check { color: var(--ddga-color-primary); }
    .select__listbox { box-sizing: border-box; }
    .select__listbox:popover-open { animation: dga-select-in 120ms cubic-bezier(.16, 1, .3, 1); }
    @keyframes dga-select-in { from { opacity: 0; transform: translateY(-2px) scale(.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
    .field__hint { color: var(--ddga-color-muted-foreground); font-size: var(--ddga-font-size-xs); }
    .field__hint--error { color: var(--ddga-color-error); }
    @media (prefers-reduced-motion: reduce) { .field__control, .select__chevron { transition: none; } .select__listbox:popover-open { animation: none; } }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DgaSelect),
    multi: true,
  }],
})
export class DgaSelect implements ControlValueAccessor {
  private readonly host = inject(ElementRef<HTMLElement>);
  @Input() id = 'dga-select';
  @Input() label = '';
  @Input() value = '';
  @Input() placeholder = 'Choose an option';
  @Input() options: readonly DgaSelectOption[] = [];
  @Input() size: DgaFieldSize = 'md';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() error = '';
  @Input() errorMessage = '';
  @Input() success = false;
  @Input() helperText = '';
  @Output() readonly valueChange = new EventEmitter<string>();
  protected onChangeValue: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};
  protected open = false;
  protected activeIndex = -1;

  protected get hasError(): boolean {
    return Boolean(this.error || this.errorMessage);
  }

  protected get message(): string {
    return this.error || this.errorMessage || this.helperText;
  }

  protected get descriptionId(): string | null {
    return this.message ? `${this.id}-hint` : null;
  }

  protected get labelId(): string { return `${this.id}-label`; }
  protected get triggerId(): string { return `${this.id}-trigger`; }
  protected get listboxId(): string { return `${this.id}-listbox`; }
  protected get activeOptionId(): string | null {
    return this.open && this.activeIndex >= 0 ? this.optionId(this.activeIndex) : null;
  }
  protected get selectedOption(): DgaSelectOption | undefined {
    return this.options.find(option => option.value === this.value);
  }

  protected optionId(index: number): string { return `${this.id}-option-${index}`; }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChangeValue = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    if (disabled) this.open = false;
  }

  protected toggleOpen(): void {
    if (this.disabled || this.readOnly) return;
    if (this.open) {
      this.open = false;
      this.onTouched();
    } else {
      this.openMenu();
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.open) {
        this.openMenu();
      } else {
        this.moveActive(event.key === 'ArrowDown' ? 1 : -1);
      }
    } else if (event.key === 'Home' || event.key === 'End') {
      if (!this.open) return;
      event.preventDefault();
      this.activeIndex = this.findEnabled(event.key === 'Home' ? 1 : -1, event.key === 'Home' ? -1 : this.options.length);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (!this.open) this.openMenu();
      else if (this.activeIndex >= 0) this.choose(this.options[this.activeIndex]);
    } else if (event.key === 'Escape' && this.open) {
      event.preventDefault();
      event.stopPropagation();
      this.open = false;
    } else if (event.key === 'Tab' && this.open) {
      this.open = false;
      this.onTouched();
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onDocumentPointerDown(event: PointerEvent): void {
    if (this.open && !this.host.nativeElement.contains(event.target as Node)) {
      this.open = false;
      this.onTouched();
    }
  }

  protected setActive(index: number): void {
    if (!this.options[index]?.disabled) this.activeIndex = index;
  }

  protected choose(option: DgaSelectOption): void {
    if (option.disabled || this.disabled || this.readOnly) return;
    this.value = option.value;
    this.valueChange.emit(this.value);
    this.onChangeValue(this.value);
    this.open = false;
    this.onTouched();
  }

  private openMenu(): void {
    if (this.disabled || this.readOnly) return;
    this.open = true;
    const selectedIndex = this.options.findIndex(option => option.value === this.value && !option.disabled);
    this.activeIndex = selectedIndex >= 0 ? selectedIndex : this.findEnabled(1, -1);
  }

  private moveActive(direction: 1 | -1): void {
    this.activeIndex = this.findEnabled(direction, this.activeIndex);
  }

  private findEnabled(direction: 1 | -1, from: number): number {
    const count = this.options.length;
    for (let offset = 1; offset <= count; offset += 1) {
      const index = ((from + direction * offset) % count + count) % count;
      if (!this.options[index].disabled) return index;
    }
    return -1;
  }
}

@Component({
  selector: 'dga-checkbox',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <label class="choice"
      [class.choice--disabled]="disabled"
      [class.choice--readonly]="readOnly"
      [class.choice--error]="error || errorMessage"
      [class.choice--neutral]="variant === 'neutral'">
      <input type="checkbox"
        [id]="id"
        [name]="name"
        class="choice__input"
        [class.choice__input--sm]="size === 'sm'"
        [class.choice__input--xs]="size === 'xs'"
        [checked]="checked"
        [indeterminate]="indeterminate"
        [disabled]="disabled"
        [required]="required"
        [attr.data-state]="indeterminate ? 'indeterminate' : checked ? 'checked' : 'unchecked'"
        [attr.data-readonly]="readOnly ? '' : null"
        [attr.aria-readonly]="readOnly ? 'true' : null"
        [attr.aria-checked]="indeterminate ? 'mixed' : null"
        [attr.aria-invalid]="error || errorMessage ? 'true' : null"
        [attr.aria-describedby]="descriptionId"
        (click)="onClick($event)"
        (change)="onChange($event)"
        (blur)="onTouched()" />
      <span class="choice__indicator" aria-hidden="true">
        <dga-icon class="choice__check" name="check" />
        <span class="choice__minus"></span>
      </span>
      <span class="choice__label"><ng-content></ng-content></span>
    </label>
    @if (errorMessage || helperText) {
      <span class="choice__hint" [class.choice__hint--error]="error || errorMessage" [id]="descriptionId">
        {{ errorMessage || helperText }}
      </span>
    }
  `,
  styles: [`
    :host { display: inline-block; }
    .choice { position: relative; display: inline-flex; align-items: center; gap: var(--ddga-space-2); cursor: pointer; }
    .choice__input { position: absolute; inline-size: 1.5rem; block-size: 1.5rem; margin: 0; opacity: 0; cursor: inherit; }
    .choice__indicator { position: relative; z-index: 0; display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; inline-size: 1.5rem; block-size: 1.5rem; border: 1px solid var(--ddga-gray-500); border-radius: var(--ddga-radius-xs); color: var(--ddga-color-primary-foreground); transition: background-color 150ms, border-color 150ms, box-shadow 150ms; }
    .choice__indicator::before { content: ''; position: absolute; z-index: -1; inset: -8px; border-radius: var(--ddga-radius-full); background: var(--ddga-gray-100); opacity: 0; pointer-events: none; transition: opacity 150ms; }
    .choice__input--sm, .choice__input--sm + .choice__indicator { inline-size: 1.25rem; block-size: 1.25rem; }
    .choice__input--xs, .choice__input--xs + .choice__indicator { inline-size: 1rem; block-size: 1rem; }
    .choice__check, .choice__minus { display: none; }
    .choice__check { inline-size: 75%; block-size: 75%; }
    .choice__minus { inline-size: 50%; min-block-size: 2px; block-size: 12.5%; border-radius: 1px; background: currentColor; }
    .choice__input:checked + .choice__indicator, .choice__input:indeterminate + .choice__indicator { border-color: var(--ddga-color-primary); background: var(--ddga-color-primary); }
    .choice__input:checked + .choice__indicator .choice__check, .choice__input:indeterminate + .choice__indicator .choice__minus { display: block; }
    .choice__input:indeterminate + .choice__indicator .choice__check { display: none; }
    .choice__input[data-state='unchecked']:not(:disabled):not([data-readonly]):active + .choice__indicator { background: var(--ddga-gray-300); }
    .choice__input:checked:not(:disabled):not([data-readonly]):hover + .choice__indicator,
    .choice__input:indeterminate:not(:disabled):not([data-readonly]):hover + .choice__indicator { border-color: var(--ddga-color-primary-hover); background: var(--ddga-color-primary-hover); }
    .choice__input:checked:not(:disabled):not([data-readonly]):active + .choice__indicator,
    .choice__input:indeterminate:not(:disabled):not([data-readonly]):active + .choice__indicator { border-color: var(--ddga-color-primary-active); background: var(--ddga-color-primary-active); }
    .choice__input:not(:disabled):not([data-readonly]):hover + .choice__indicator::before,
    .choice__input:not(:disabled):not([data-readonly]):active + .choice__indicator::before { opacity: 1; }
    .choice__input[data-readonly]:checked + .choice__indicator,
    .choice__input[data-readonly]:indeterminate + .choice__indicator { border-color: var(--ddga-gray-400); background: transparent; color: var(--ddga-color-primary); }
    .choice--neutral .choice__input:checked + .choice__indicator,
    .choice--neutral .choice__input:indeterminate + .choice__indicator { border-color: var(--ddga-gray-950); background: var(--ddga-gray-950); }
    .choice--neutral .choice__input:checked:not(:disabled):not([data-readonly]):hover + .choice__indicator,
    .choice--neutral .choice__input:indeterminate:not(:disabled):not([data-readonly]):hover + .choice__indicator { border-color: var(--ddga-gray-600); background: var(--ddga-gray-600); }
    .choice--neutral .choice__input:checked:not(:disabled):not([data-readonly]):active + .choice__indicator,
    .choice--neutral .choice__input:indeterminate:not(:disabled):not([data-readonly]):active + .choice__indicator { border-color: var(--ddga-gray-500); background: var(--ddga-gray-500); }
    .choice--neutral .choice__input[data-readonly]:checked + .choice__indicator,
    .choice--neutral .choice__input[data-readonly]:indeterminate + .choice__indicator { color: var(--ddga-gray-950); }
    .choice--error .choice__input:checked + .choice__indicator,
    .choice--error .choice__input:indeterminate + .choice__indicator { border-color: var(--ddga-color-error); background: var(--ddga-color-error); }
    .choice--error .choice__indicator { border-color: var(--ddga-color-error); }
    .choice__input:focus-visible + .choice__indicator { outline: 2px solid var(--ddga-color-focus-ring); outline-offset: 2px; }
    .choice--error .choice__input:focus-visible + .choice__indicator { outline-color: var(--ddga-color-error); }
    .choice__input:disabled + .choice__indicator { border-color: var(--ddga-gray-400); }
    .choice__input:disabled:checked + .choice__indicator,
    .choice__input:disabled:indeterminate + .choice__indicator { border-color: var(--ddga-gray-200); background: var(--ddga-gray-200); }
    .choice--readonly { cursor: default; }
    .choice--readonly input { cursor: default; }
    .choice--disabled { color: var(--ddga-color-muted-foreground); cursor: not-allowed; }
    @media (prefers-reduced-motion: reduce) { .choice__indicator, .choice__indicator::before { transition: none; } }
    .choice__hint { display: block; margin-block-start: var(--ddga-space-1); color: var(--ddga-color-muted-foreground); font-size: var(--ddga-font-size-xs); }
    .choice__hint--error { color: var(--ddga-color-error); }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DgaCheckbox),
    multi: true,
  }],
})
export class DgaCheckbox implements ControlValueAccessor {
  @Input() id = 'dga-checkbox';
  @Input() name = '';
  @Input() checked = false;
  @Input() indeterminate = false;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() required = false;
  @Input() error = '';
  @Input() errorMessage = '';
  @Input() helperText = '';
  @Input() size: 'xs' | 'sm' | 'md' = 'md';
  @Input() variant: 'primary' | 'neutral' = 'primary';
  @Output() readonly checkedChange = new EventEmitter<boolean>();
  protected onChangeValue: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected get descriptionId(): string | null {
    return this.errorMessage || this.helperText ? `${this.id}-hint` : null;
  }

  writeValue(value: boolean | null): void {
    this.checked = value ?? false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeValue = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  protected onClick(event: MouseEvent): void {
    if (this.readOnly) {
      event.preventDefault();
    }
  }

  protected onChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (this.readOnly) {
      input.checked = this.checked;
      return;
    }
    this.checked = input.checked;
    this.indeterminate = false;
    this.checkedChange.emit(this.checked);
    this.onChangeValue(this.checked);
  }
}

@Component({
  selector: 'dga-radio',
  standalone: true,
  template: `
    <label class="choice" [class.choice--disabled]="disabled">
      <input
        class="radio__input"
        type="radio"
        [name]="name"
        [value]="value"
        [checked]="checked"
        [disabled]="disabled"
        (change)="onChange()"
      />
      <span class="radio__circle" aria-hidden="true"><span class="radio__dot"></span></span>
      <span class="radio__label"><ng-content></ng-content></span>
    </label>
  `,
  styles: [`
    :host { display: inline-block; }
    .choice { position: relative; display: inline-flex; align-items: center; gap: var(--ddga-space-4); cursor: pointer; }
    .radio__input { position: absolute; inset-inline-start: -4px; inset-block-start: 50%; inline-size: 2rem; block-size: 2rem; margin: 0; opacity: 0; transform: translateY(-50%); cursor: inherit; }
    .radio__circle { position: relative; z-index: 0; display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; inline-size: 1.5rem; block-size: 1.5rem; border: 1px solid var(--ddga-gray-500); border-radius: var(--ddga-radius-full); background: var(--ddga-color-background); color: var(--ddga-color-primary); transition: border-color 150ms, color 150ms, background-color 150ms; }
    .radio__circle::before { content: ''; position: absolute; z-index: -1; inset: -12px; border-radius: inherit; background: var(--ddga-gray-100); opacity: 0; pointer-events: none; transition: opacity 150ms; }
    .radio__dot { inline-size: 1rem; block-size: 1rem; border-radius: inherit; background: currentColor; transform: scale(0); transition: transform 150ms; }
    .radio__input:checked + .radio__circle { border-color: var(--ddga-color-primary); }
    .radio__input:checked + .radio__circle .radio__dot { transform: scale(1); }
    .radio__input:not(:disabled):hover + .radio__circle::before,
    .radio__input:not(:disabled):active + .radio__circle::before { opacity: 1; }
    .radio__input[data-state='unchecked']:not(:disabled):active + .radio__circle { background: var(--ddga-gray-300); }
    .radio__input:checked:not(:disabled):hover + .radio__circle { border-color: var(--ddga-sa-800); color: var(--ddga-sa-800); }
    .radio__input:checked:not(:disabled):active + .radio__circle { border-color: var(--ddga-color-primary-active); color: var(--ddga-color-primary-active); }
    .radio__input:focus-visible + .radio__circle { outline: 2px solid var(--ddga-color-focus-ring); outline-offset: 2px; }
    .choice--disabled .radio__circle { border-color: var(--ddga-gray-400); color: var(--ddga-gray-400); }
    @media (prefers-reduced-motion: reduce) { .radio__circle, .radio__circle::before, .radio__dot { transition: none; } }
    .choice--disabled { color: var(--ddga-color-muted-foreground); cursor: not-allowed; }
  `],
})
export class DgaRadio {
  @Input() name = 'dga-radio';
  @Input() value = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Output() readonly selected = new EventEmitter<string>();

  protected onChange(): void {
    this.selected.emit(this.value);
  }
}

@Component({
  selector: 'dga-radio-group',
  standalone: true,
  template: `
    <fieldset class="radio-group" role="radiogroup" [class.radio-group--horizontal]="orientation === 'horizontal'"
      [class.radio-group--error]="error || errorMessage" [class.radio-group--readonly]="readOnly"
      [class.radio-group--neutral]="variant === 'neutral'" [disabled]="disabled"
      [attr.aria-describedby]="descriptionId" [attr.aria-invalid]="error || errorMessage ? 'true' : null"
      [attr.aria-readonly]="readOnly ? 'true' : null">
      @if (label) {
        <legend class="radio-group__label">{{ label }}@if (required) { <span aria-hidden="true">*</span> }</legend>
      }
      <div class="radio-group__options">
        @for (option of options; track option.value) {
          <label class="radio-option" [class.radio-option--disabled]="disabled || option.disabled">
            <input class="radio-option__input" type="radio" [name]="name" [value]="option.value" [checked]="value === option.value"
              [disabled]="disabled || option.disabled" [required]="required"
              [attr.data-radio-index]="$index"
              [attr.data-state]="value === option.value ? 'checked' : 'unchecked'"
              (click)="onRadioClick($event)" (change)="select(option.value)" (blur)="onTouched()"
              (keydown)="onKeydown($event, option.value)" />
            <span class="radio-option__circle" aria-hidden="true"><span></span></span>
            <span>{{ option.label }}</span>
          </label>
        }
      </div>
      @if (errorMessage || helperText) {
        <span class="radio-group__hint" [class.radio-group__hint--error]="error || errorMessage" [id]="descriptionId">
          {{ errorMessage || helperText }}
        </span>
      }
    </fieldset>
  `,
  styles: [`
    :host { display: block; min-inline-size: 0; }
    .radio-group { display: grid; gap: var(--ddga-space-2); min-inline-size: 0; margin: 0; padding: 0; border: 0; }
    .radio-group__label { margin-block-end: var(--ddga-space-1); color: var(--ddga-text-primary); font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-medium); }
    .radio-group__label span { margin-inline-start: var(--ddga-space-1); color: var(--ddga-color-error); }
    .radio-group__options { display: flex; flex-direction: column; gap: var(--ddga-space-3); }
    .radio-group--horizontal .radio-group__options { flex-flow: row wrap; gap: var(--ddga-space-3); }
    .radio-option { position: relative; display: inline-flex; align-items: center; gap: var(--ddga-space-4); cursor: pointer; }
    .radio-option__input { position: absolute; inset-inline-start: -4px; inset-block-start: 50%; inline-size: 2rem; block-size: 2rem; margin: 0; opacity: 0; transform: translateY(-50%); cursor: inherit; }
    .radio-option__circle { position: relative; z-index: 0; display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; inline-size: 1.5rem; block-size: 1.5rem; border: 1px solid var(--ddga-gray-500); border-radius: var(--ddga-radius-full); color: var(--ddga-color-primary); transition: border-color 150ms, color 150ms, background-color 150ms; }
    .radio-option__circle::before { content: ''; position: absolute; z-index: -1; inset: -12px; border-radius: inherit; background: var(--ddga-gray-100); opacity: 0; pointer-events: none; transition: opacity 150ms; }
    .radio-option__circle > span { inline-size: 1rem; block-size: 1rem; border-radius: inherit; background: currentColor; transform: scale(0); transition: transform 150ms; }
    .radio-option__input:checked + .radio-option__circle { border-color: var(--ddga-color-primary); }
    .radio-option__input:checked + .radio-option__circle > span { transform: scale(1); }
    .radio-option__input:not(:disabled):hover + .radio-option__circle::before,
    .radio-option__input:not(:disabled):active + .radio-option__circle::before { opacity: 1; }
    .radio-option__input[data-state='unchecked']:not(:disabled):active + .radio-option__circle { background: var(--ddga-gray-300); }
    .radio-option__input:checked:not(:disabled):hover + .radio-option__circle { border-color: var(--ddga-sa-800); color: var(--ddga-sa-800); }
    .radio-option__input:checked:not(:disabled):active + .radio-option__circle { border-color: var(--ddga-color-primary-active); color: var(--ddga-color-primary-active); }
    .radio-option__input:focus-visible + .radio-option__circle { outline: 2px solid var(--ddga-color-focus-ring); outline-offset: 2px; }
    .radio-group--readonly .radio-option__input:not(:disabled) { cursor: default; }
    .radio-group--readonly .radio-option__input:checked + .radio-option__circle { border-color: var(--ddga-gray-400); color: var(--ddga-color-primary); }
    .radio-group--neutral .radio-option__input:checked + .radio-option__circle { border-color: var(--ddga-gray-950); color: var(--ddga-gray-950); }
    .radio-group--error .radio-option__circle { border-color: var(--ddga-color-error); }
    .radio-group--error .radio-option__input:checked + .radio-option__circle { border-color: var(--ddga-color-error); color: var(--ddga-color-error); }
    .radio-group--error .radio-option__input:focus-visible + .radio-option__circle { outline-color: var(--ddga-color-error); }
    .radio-option--disabled { color: var(--ddga-text-tertiary); cursor: not-allowed; }
    .radio-option--disabled .radio-option__input { cursor: not-allowed; }
    .radio-option--disabled .radio-option__circle { border-color: var(--ddga-gray-400); color: var(--ddga-gray-400); }
    .radio-group__hint { color: var(--ddga-text-secondary); font-size: var(--ddga-font-size-xs); }
    .radio-group__hint--error { color: var(--ddga-color-error); }
    @media (prefers-reduced-motion: reduce) { .radio-option__circle, .radio-option__circle::before, .radio-option__circle > span { transition: none; } }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DgaRadioGroup),
    multi: true,
  }],
})
export class DgaRadioGroup implements ControlValueAccessor {
  @Input() id = 'dga-radio-group';
  @Input() name = 'dga-radio-group';
  @Input() label = '';
  @Input() value = '';
  @Input() options: readonly DgaRadioOption[] = [];
  @Input() orientation: 'horizontal' | 'vertical' = 'vertical';
  @Input() variant: 'primary' | 'neutral' = 'primary';
  @Input() required = false;
  @Input() disabled = false;
  @Input() readOnly = false;
  @Input() error = '';
  @Input() errorMessage = '';
  @Input() helperText = '';
  @Output() readonly valueChange = new EventEmitter<string>();
  protected onChange: (value: string) => void = () => {};
  protected onTouched: () => void = () => {};

  protected get descriptionId(): string | null {
    return this.errorMessage || this.helperText ? `${this.id}-hint` : null;
  }

  writeValue(value: string | null): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  protected select(value: string): void {
    if (this.readOnly || this.disabled) {
      return;
    }
    this.value = value;
    this.valueChange.emit(value);
    this.onChange(value);
  }

  protected onRadioClick(event: MouseEvent): void {
    if (this.readOnly) {
      event.preventDefault();
    }
  }

  protected onKeydown(event: KeyboardEvent, currentValue: string): void {
    if (this.readOnly) {
      if ([' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
      return;
    }

    const current = this.options.find((option) => option.value === currentValue);
    const currentTarget = event.currentTarget as HTMLInputElement;
    const rtl = getComputedStyle(currentTarget).direction === 'rtl';
    const horizontalKey = event.key === 'ArrowLeft' || event.key === 'ArrowRight';
    const verticalKey = event.key === 'ArrowUp' || event.key === 'ArrowDown';
    if (!current || (this.orientation === 'horizontal' ? !horizontalKey : !verticalKey)) {
      return;
    }

    const direction = verticalKey
      ? event.key === 'ArrowDown' ? 1 : -1
      : event.key === 'ArrowRight' !== rtl ? 1 : -1;
    const available = this.options.filter((option) => !option.disabled);
    if (available.length < 2) {
      return;
    }
    event.preventDefault();
    const index = available.findIndex((option) => option.value === current.value);
    const nextIndex = (index + direction + available.length) % available.length;
    const next = available[nextIndex];
    if (!next) {
      return;
    }
    this.select(next.value);
    const optionIndex = this.options.indexOf(next);
    (currentTarget.closest('fieldset')?.querySelector(`[data-radio-index="${optionIndex}"]`) as HTMLInputElement | null)?.focus();
  }
}

@Component({
  selector: 'dga-switch',
  standalone: true,
  template: `
    <label class="switch" [class.switch--disabled]="disabled" [class.switch--error]="error || errorMessage">
      <input
        class="switch__input"
        [id]="id"
        [name]="name"
        type="checkbox"
        role="switch"
        [checked]="checked"
        [disabled]="disabled"
        [required]="required"
        [attr.aria-invalid]="error || errorMessage ? 'true' : null"
        [attr.aria-describedby]="descriptionId"
        (change)="onChange($event)"
        (blur)="onTouched()"
      />
      <span class="switch__track" aria-hidden="true"><span class="switch__thumb"></span></span>
      <span><ng-content></ng-content></span>
    </label>
    @if (errorMessage || helperText) {
      <span class="switch__hint" [class.switch__hint--error]="error || errorMessage" [id]="descriptionId">
        {{ errorMessage || helperText }}
      </span>
    }
  `,
  styles: [`
    :host { display: inline-block; }
    .switch { display: inline-flex; align-items: center; gap: var(--ddga-space-3); cursor: pointer; }
    .switch__input { position: absolute; inline-size: 1px; block-size: 1px; opacity: 0; }
    .switch__track {
      --switch-off: var(--ddga-gray-950); --switch-on: var(--ddga-color-primary);
      position: relative; box-sizing: border-box; display: inline-block; flex: 0 0 auto;
      inline-size: 3rem; block-size: 1.5rem; border-radius: var(--ddga-radius-full);
      background: transparent; box-shadow: inset 0 0 0 1px var(--switch-off);
      transition: background-color 150ms, box-shadow 150ms;
    }
    .switch__track::before { content: ''; position: absolute; inset: -4px; border: 4px solid var(--ddga-color-muted); border-radius: inherit; opacity: 0; pointer-events: none; transition: opacity 150ms; }
    .switch__track::after { content: ''; position: absolute; inset: -4px; border: 2px solid var(--ddga-text-primary); border-radius: inherit; opacity: 0; pointer-events: none; }
    .switch__thumb { position: absolute; inset-block-start: 4px; inset-inline-start: 4px; inline-size: 1rem; block-size: 1rem; border-radius: var(--ddga-radius-full); background: var(--switch-off); transition: translate 150ms, background-color 150ms; }
    .switch__input:checked + .switch__track { background: var(--switch-on); box-shadow: none; }
    .switch__input:checked + .switch__track .switch__thumb { background: var(--ddga-color-background); box-shadow: var(--ddga-shadow-sm); translate: 1.5rem 0; }
    [dir='rtl'] .switch__input:checked + .switch__track .switch__thumb { translate: -1.5rem 0; }
    .switch__input:not(:disabled):hover + .switch__track,
    .switch__input:not(:disabled):active + .switch__track { --switch-off: var(--ddga-gray-600); --switch-on: var(--ddga-sa-800); }
    .switch__input:not(:disabled):active + .switch__track { --switch-off: var(--ddga-gray-500); --switch-on: var(--ddga-color-primary-active); }
    .switch__input:not(:disabled):hover + .switch__track::before,
    .switch__input:not(:disabled):active + .switch__track::before { opacity: 1; }
    .switch__input:focus-visible + .switch__track::after { opacity: 1; }
    .switch--error .switch__input:focus-visible + .switch__track::after { border-color: var(--ddga-color-error); }
    .switch__input:disabled + .switch__track { cursor: not-allowed; }
    .switch__input:disabled:not(:checked) + .switch__track { --switch-off: var(--ddga-gray-400); }
    .switch__input:disabled:checked + .switch__track { background: var(--ddga-gray-300); }
    .switch__input:disabled:checked + .switch__track .switch__thumb { box-shadow: none; }
    .switch--disabled { color: var(--ddga-color-muted-foreground); cursor: not-allowed; }
    .switch__hint { display: block; margin-block-start: var(--ddga-space-1); color: var(--ddga-text-secondary); font-size: var(--ddga-font-size-xs); }
    .switch__hint--error { color: var(--ddga-color-error); }
    @media (prefers-reduced-motion: reduce) { .switch__track, .switch__track::before, .switch__thumb { transition: none; } }
  `],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DgaSwitch),
    multi: true,
  }],
})
export class DgaSwitch implements ControlValueAccessor {
  @Input() id = 'dga-switch';
  @Input() name = '';
  @Input() checked = false;
  @Input() disabled = false;
  @Input() required = false;
  @Input() error = '';
  @Input() errorMessage = '';
  @Input() helperText = '';
  @Output() readonly checkedChange = new EventEmitter<boolean>();
  protected onChangeValue: (value: boolean) => void = () => {};
  protected onTouched: () => void = () => {};

  protected get descriptionId(): string | null {
    return this.errorMessage || this.helperText ? `${this.id}-hint` : null;
  }

  writeValue(value: boolean | null): void {
    this.checked = value ?? false;
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChangeValue = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }

  protected onChange(event: Event): void {
    this.checked = (event.target as HTMLInputElement).checked;
    this.checkedChange.emit(this.checked);
    this.onChangeValue(this.checked);
  }
}
