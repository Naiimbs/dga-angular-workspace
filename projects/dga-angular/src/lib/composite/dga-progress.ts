import { Component, Input } from '@angular/core';

export type DgaProgressVariant = 'primary' | 'neutral';
export type DgaProgressState = 'default' | 'success' | 'error';

@Component({
  selector: 'dga-progress',
  standalone: true,
  template: `
    <div class="progress" [class]="'progress progress--' + variant + ' progress--' + state + ' progress--' + size">
      @if (label) {
        <span class="progress__label" [id]="labelId">
          {{ label }}
          @if (required) { <span class="progress__required" aria-hidden="true">*</span> }
          @if (showValue && value !== null) { <span class="progress__value-label">{{ percent }}%</span> }
        </span>
      }
      <div [id]="id" class="progress__track"
        [attr.data-state]="value === null ? 'indeterminate' : percent >= 100 ? 'complete' : state"
        role="progressbar" aria-valuemin="0" [attr.aria-valuemax]="max"
        [attr.aria-valuenow]="value === null ? null : normalizedValue"
        [attr.aria-labelledby]="label ? labelId : null"
        [attr.aria-label]="label ? null : ariaLabel"
        [attr.aria-describedby]="helperText ? helperId : null"
        [attr.aria-invalid]="state === 'error' ? 'true' : null">
        <span class="progress__indicator" [class.progress__indicator--indeterminate]="value === null"
          [style.inline-size]="value === null ? null : percent + '%'"></span>
      </div>
      @if (helperText) { <span class="progress__helper" [id]="helperId">{{ helperText }}</span> }
    </div>
  `,
  styles: [`
    :host { display: block; inline-size: 100%; }
    .progress { display: flex; flex-direction: column; gap: var(--ddga-space-1); inline-size: 100%; }
    .progress--primary { --progress-fill: var(--ddga-color-primary); }
    .progress--neutral { --progress-fill: var(--ddga-gray-700); }
    .progress--success { --progress-fill: var(--ddga-color-success); }
    .progress--error { --progress-fill: var(--ddga-color-destructive); }
    .progress__label { display: inline-flex; align-items: flex-end; gap: var(--ddga-space-1); color: var(--ddga-text-primary); font-size: var(--ddga-font-size-base); line-height: 1.5; }
    .progress--sm .progress__label { font-size: var(--ddga-font-size-sm); }
    .progress__required { color: var(--ddga-error-700); }
    .progress__value-label { margin-inline-start: auto; color: var(--ddga-text-secondary); font-size: var(--ddga-font-size-sm); }
    .progress__track { position: relative; display: block; inline-size: 100%; overflow: hidden; border: 0; border-radius: var(--ddga-radius-sm); background: var(--ddga-gray-100); }
    .progress--sm .progress__track { block-size: 4px; }
    .progress--md .progress__track { block-size: 8px; }
    .progress--lg .progress__track { block-size: 16px; border-radius: var(--ddga-radius-md); }
    .progress--success .progress__track, .progress--error .progress__track { background: var(--ddga-gray-300); }
    .progress__track[data-state='success'], .progress__track[data-state='error'] { background: var(--ddga-gray-300); }
    .progress__indicator { position: absolute; inset-block: 0; inset-inline-start: 0; display: block; border-radius: inherit; background: var(--progress-fill); transition: inline-size 200ms ease-out; }
    .progress__indicator--indeterminate { inline-size: 40%; animation: progress-slide 1.4s cubic-bezier(.65, .05, .36, 1) infinite; transform: translateX(-100%); }
    [dir='rtl'] .progress__indicator--indeterminate { animation-name: progress-slide-rtl; transform: translateX(100%); }
    @keyframes progress-slide { 0% { transform: translateX(-100%); } 100% { transform: translateX(250%); } }
    @keyframes progress-slide-rtl { 0% { transform: translateX(100%); } 100% { transform: translateX(-250%); } }
    .progress__helper { color: var(--ddga-text-secondary); font-size: var(--ddga-font-size-sm); line-height: 1.43; }
    .progress--sm .progress__helper { font-size: var(--ddga-font-size-xs); }
    .progress--success .progress__helper { color: var(--ddga-success-700); }
    .progress--error .progress__helper { color: var(--ddga-error-700); }
    @media (prefers-reduced-motion: reduce) { .progress__indicator { transition: none; } .progress__indicator--indeterminate { animation: none; } }
  `],
})
export class DgaProgress {
  @Input() id = 'dga-progress';
  @Input() value: number | null = 0;
  @Input() max = 100;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: DgaProgressVariant = 'primary';
  @Input() state: DgaProgressState = 'default';
  @Input() label = '';
  @Input() ariaLabel = 'Progress';
  @Input() required = false;
  @Input() helperText = '';
  @Input() showValue = false;

  protected get percent(): number {
    if (this.value === null || !Number.isFinite(this.value) || !Number.isFinite(this.max) || this.max <= 0) {
      return 0;
    }
    return Math.round(Math.min(this.max, Math.max(0, this.value)) / this.max * 100);
  }

  protected get normalizedValue(): number {
    return Math.min(this.max, Math.max(0, Number.isFinite(this.value) ? this.value ?? 0 : 0));
  }

  protected get labelId(): string {
    return `${this.id}-label`;
  }

  protected get helperId(): string {
    return `${this.id}-helper`;
  }
}
