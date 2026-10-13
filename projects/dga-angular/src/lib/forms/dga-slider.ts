import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  inject,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type DgaSliderValue = number | number[];
export type DgaSliderSize = 'sm' | 'md';

let nextUniqueId = 0;

@Component({
  selector: 'dga-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DgaSlider),
      multi: true,
    },
  ],
  template: `
    <div
      class="ddga-field ddga-slider-field"
      [class.ddga-slider-field--sm]="size === 'sm'"
      [class.ddga-slider-field--md]="size === 'md'"
      [attr.data-slot]="'slider-field'"
    >
      @if (label) {
        <span
          [id]="labelId"
          class="ddga-slider__label"
          [attr.data-slot]="'slider-label'"
        >
          {{ label }}
        </span>
      }

      <div class="ddga-slider__control" [attr.data-slot]="'slider-control'">
        <div
          #sliderTrack
          class="ddga-slider"
          [class.ddga-slider--error]="hasError"
          [attr.data-slot]="'slider'"
          [attr.data-disabled]="disabled ? '' : null"
          (pointerdown)="onPointerDown($event)"
          (pointermove)="onPointerMove($event)"
          (pointerup)="onPointerUp($event)"
          (pointercancel)="onPointerUp($event)"
        >
          <div class="ddga-slider__track" [attr.data-slot]="'slider-track'">
            <div
              class="ddga-slider__range"
              [attr.data-slot]="'slider-range'"
              [style.inset-inline-start.%]="rangeStartPercent"
              [style.inline-size.%]="rangeSizePercent"
            ></div>
          </div>

          @for (val of currentValues; track $index) {
            <span
              role="slider"
              class="ddga-slider__thumb"
              [attr.data-slot]="'slider-thumb'"
              [attr.tabindex]="disabled ? -1 : 0"
              [attr.aria-valuemin]="min"
              [attr.aria-valuemax]="max"
              [attr.aria-valuenow]="val"
              [attr.aria-valuetext]="formatValue ? formatThumbValue(val) : null"
              [attr.aria-label]="isRange ? thumbLabels[$index] : (ariaLabel || null)"
              [attr.aria-labelledby]="!isRange && label ? labelId : (ariaLabelledby || null)"
              [attr.aria-describedby]="describedById || null"
              [attr.aria-disabled]="disabled ? 'true' : null"
              [attr.aria-invalid]="hasError ? 'true' : null"
              [style.inset-inline-start]="getThumbPositionStyle(val)"
              (keydown)="onThumbKeyDown($event, $index)"
              (blur)="onThumbBlur()"
            ></span>
          }
        </div>

        @if (showValue) {
          <span class="ddga-slider__value" aria-hidden="true">
            {{ displayValueText }}
          </span>
        }
      </div>

      @if (hasErrorMessage) {
        <span
          class="ddga-field__message ddga-field__message--error"
          [id]="errorId"
          aria-live="polite"
        >
          {{ errorMessage }}
        </span>
      } @else if (hasHelper) {
        <span
          class="ddga-field__message ddga-field__message--helper"
          [id]="helperId"
        >
          {{ helperText }}
        </span>
      }
    </div>
  `,
  styles: [`
    :host {
      display: block;
      min-inline-size: 0;
    }

    .ddga-field {
      display: flex;
      flex-direction: column;
      gap: var(--ddga-space-2, 0.5rem);
      color: var(--ddga-color-foreground, #0a0a0a);
    }

    .ddga-slider-field--md {
      --ddga-slider-rail: var(--ddga-space-2, 0.5rem);
      --ddga-slider-thumb: var(--ddga-space-4, 1rem);
    }

    .ddga-slider-field--sm {
      --ddga-slider-rail: var(--ddga-space-1, 0.25rem);
      --ddga-slider-thumb: var(--ddga-space-3, 0.75rem);
    }

    .ddga-slider__label {
      color: var(--ddga-text-primary, var(--ddga-gray-900, #171717));
      font-weight: var(--ddga-font-weight-regular, 400);
    }

    .ddga-slider-field--md .ddga-slider__label {
      font-size: var(--ddga-font-size-base, 1rem);
      line-height: 1.5;
    }

    .ddga-slider-field--sm .ddga-slider__label {
      font-size: var(--ddga-font-size-sm, 0.875rem);
      line-height: 1.43;
    }

    .ddga-slider__control {
      align-items: center;
      gap: 0.375rem;
      display: flex;
      position: relative;
    }

    .ddga-slider__value {
      color: var(--ddga-gray-700, #404040);
      font-size: var(--ddga-font-size-xs, 0.75rem);
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
      line-height: 1.5;
    }

    .ddga-slider {
      min-inline-size: 0;
      block-size: var(--ddga-slider-thumb);
      touch-action: none;
      -webkit-user-select: none;
      user-select: none;
      flex: auto;
      align-items: center;
      display: flex;
      position: relative;
      cursor: pointer;
    }

    .ddga-slider__track {
      block-size: var(--ddga-slider-rail);
      border-radius: var(--ddga-radius-sm, 0.25rem);
      background-color: var(--ddga-color-muted, var(--ddga-gray-100, #f5f5f5));
      flex-grow: 1;
      position: relative;
    }

    .ddga-slider__range {
      border-radius: var(--ddga-radius-sm, 0.25rem);
      background-color: var(--ddga-color-primary, #006c35);
      block-size: 100%;
      position: absolute;
    }

    .ddga-slider__thumb {
      position: absolute;
      inset-block-start: 0;
      inline-size: var(--ddga-slider-thumb);
      block-size: var(--ddga-slider-thumb);
      border-radius: var(--ddga-radius-full, 9999px);
      background-color: var(--ddga-color-primary, #006c35);
      border: 1px solid var(--ddga-success-700, #005a2b);
      cursor: grab;
      transition: box-shadow 0.15s;
      display: block;
      outline: none;
      box-sizing: border-box;
    }

    .ddga-slider__thumb:active {
      cursor: grabbing;
    }

    .ddga-slider__thumb:focus-visible {
      box-shadow: 0 0 0 2px var(--ddga-color-background, #fff), 0 0 0 4px var(--ddga-color-ring, var(--ddga-color-primary, #006c35));
    }

    .ddga-slider--error .ddga-slider__range,
    .ddga-slider--error .ddga-slider__thumb {
      background-color: var(--ddga-color-error, #dc2626);
      border-color: var(--ddga-color-error, #dc2626);
    }

    .ddga-slider--error .ddga-slider__thumb:focus-visible {
      box-shadow: 0 0 0 2px var(--ddga-color-background, #fff), 0 0 0 4px var(--ddga-color-error, #dc2626);
    }

    .ddga-slider[data-disabled] {
      opacity: 0.5;
      pointer-events: none;
    }

    .ddga-slider[data-disabled] .ddga-slider__thumb {
      cursor: not-allowed;
    }

    .ddga-field__message {
      font-size: var(--ddga-font-size-xs, 0.75rem);
      padding-block: var(--ddga-space-1, 0.25rem);
    }

    .ddga-field__message--error {
      color: var(--ddga-color-error, #dc2626);
    }

    .ddga-field__message--helper {
      color: var(--ddga-text-secondary, var(--ddga-gray-600, #525252));
    }

    @media (prefers-reduced-motion: reduce) {
      .ddga-slider__thumb {
        transition: none;
      }
    }

    @media (forced-colors: active) {
      .ddga-slider__track {
        background-color: canvas;
        border: 1px solid canvastext;
      }
      .ddga-slider__range {
        background-color: highlight;
      }
      .ddga-slider__thumb {
        background-color: highlight;
        border: 1px solid canvastext;
      }
      .ddga-slider__thumb:focus-visible {
        outline-offset: 1px;
        outline: 2px solid highlight;
      }
    }
  `],
})
export class DgaSlider implements ControlValueAccessor {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly instanceId = `dga-slider-${nextUniqueId++}`;

  @ViewChild('sliderTrack', { static: true }) sliderRef!: ElementRef<HTMLElement>;

  @Input() id = this.instanceId;
  @Input() min = 0;
  @Input() max = 100;
  @Input() step = 1;
  @Input() size: DgaSliderSize = 'md';
  @Input() label = '';
  @Input() helperText = '';

  private _errorMessage = '';
  @Input()
  set errorMessage(val: string) {
    this._errorMessage = val;
    this.cdr.markForCheck();
  }
  get errorMessage(): string {
    return this._errorMessage;
  }

  private _error = false;
  @Input()
  set error(val: boolean) {
    this._error = val;
    this.cdr.markForCheck();
  }
  get error(): boolean {
    return this._error;
  }

  private _disabled = false;
  @Input()
  set disabled(val: boolean) {
    this._disabled = !!val;
    this.cdr.markForCheck();
  }
  get disabled(): boolean {
    return this._disabled;
  }

  @Input() showValue = false;
  @Input() formatValue?: (value: number) => string;
  @Input() thumbLabels: [string, string] = ['Minimum', 'Maximum'];
  @Input() ariaLabel = '';
  @Input() ariaLabelledby = '';

  /**
   * Initial value for uncontrolled usage.
   * Note: Switching between controlled and uncontrolled mode dynamically at runtime
   * is not supported (passing `value=undefined` does not detach controlled mode).
   */
  @Input()
  set defaultValue(val: DgaSliderValue | undefined) {
    if (val !== undefined && this.internalValue === undefined) {
      this.initValue(val);
    }
  }

  /**
   * Controlled value input.
   * Note: Passing `undefined` is a no-op; the slider retains its last value.
   */
  @Input()
  set value(val: DgaSliderValue | undefined) {
    if (val !== undefined) {
      this.initValue(val);
    }
  }

  get value(): DgaSliderValue {
    return this.isRange ? [...this.currentValues] : this.currentValues[0];
  }

  @Output() readonly valueChange = new EventEmitter<DgaSliderValue>();
  @Output() readonly valueCommit = new EventEmitter<DgaSliderValue>();

  currentValues: number[] = [0];
  isRange = false;
  private internalValue?: DgaSliderValue;
  private activePointerId: number | null = null;
  private activeThumbIndex = -1;

  // CVA callbacks
  private onChange: (value: DgaSliderValue) => void = () => {};
  private onTouched: () => void = () => {};

  get labelId(): string {
    return `${this.id}-label`;
  }

  get errorId(): string {
    return `${this.id}-error`;
  }

  get helperId(): string {
    return `${this.id}-helper`;
  }

  get hasError(): boolean {
    return this._error || !!this._errorMessage;
  }

  get hasErrorMessage(): boolean {
    return !!this._errorMessage && this.hasError;
  }

  get hasHelper(): boolean {
    return !!this.helperText && !this.hasErrorMessage;
  }

  get describedById(): string | null {
    if (this.hasErrorMessage) return this.errorId;
    if (this.hasHelper) return this.helperId;
    return null;
  }

  get rangeStartPercent(): number {
    if (this.isRange && this.currentValues.length >= 2) {
      return this.getPercent(this.currentValues[0]);
    }
    return 0;
  }

  get rangeSizePercent(): number {
    if (this.isRange && this.currentValues.length >= 2) {
      const start = this.getPercent(this.currentValues[0]);
      const end = this.getPercent(this.currentValues[1]);
      return Math.max(0, end - start);
    }
    return this.getPercent(this.currentValues[0] ?? this.min);
  }

  get displayValueText(): string {
    const fmt = (n: number) => this.formatThumbValue(n);
    return this.currentValues.map(fmt).join(' – ');
  }

  formatThumbValue(val: number): string {
    if (this.formatValue) {
      return this.formatValue(val);
    }
    return String(val);
  }

  getThumbPositionStyle(val: number): string {
    const pct = this.getPercent(val);
    return `calc(${pct}% - (var(--ddga-slider-thumb) / 2))`;
  }

  private initValue(val: DgaSliderValue): void {
    this.internalValue = val;
    if (Array.isArray(val)) {
      this.isRange = true;
      this.currentValues = val.map((v) => this.clampAndSnap(v));
      if (this.currentValues.length >= 2 && this.currentValues[0] > this.currentValues[1]) {
        this.currentValues[1] = this.currentValues[0];
      }
    } else {
      this.isRange = false;
      this.currentValues = [this.clampAndSnap(val)];
    }
    this.cdr.markForCheck();
  }

  private getPercent(val: number): number {
    if (this.max <= this.min) return 0;
    const clamped = Math.min(this.max, Math.max(this.min, val));
    return ((clamped - this.min) / (this.max - this.min)) * 100;
  }

  private clampAndSnap(val: number): number {
    const steps = Math.round((val - this.min) / this.step);
    const stepped = this.min + steps * this.step;
    const precision = this.getStepPrecision();
    const clamped = Math.min(this.max, Math.max(this.min, stepped));
    return Number(clamped.toFixed(precision));
  }

  private getStepPrecision(): number {
    const stepStr = String(this.step);
    const decimalIdx = stepStr.indexOf('.');
    return decimalIdx >= 0 ? stepStr.length - decimalIdx - 1 : 0;
  }

  onPointerDown(event: PointerEvent): void {
    if (this._disabled) return;
    const sliderEl = this.sliderRef.nativeElement;
    sliderEl.setPointerCapture(event.pointerId);
    this.activePointerId = event.pointerId;

    const targetVal = this.getValueFromPointer(event);
    if (this.isRange && this.currentValues.length >= 2) {
      const dist0 = Math.abs(targetVal - this.currentValues[0]);
      const dist1 = Math.abs(targetVal - this.currentValues[1]);
      this.activeThumbIndex = dist0 <= dist1 ? 0 : 1;
    } else {
      this.activeThumbIndex = 0;
    }

    this.updateThumbValue(this.activeThumbIndex, targetVal);
  }

  onPointerMove(event: PointerEvent): void {
    if (this._disabled || this.activePointerId !== event.pointerId || this.activeThumbIndex < 0) {
      return;
    }
    const targetVal = this.getValueFromPointer(event);
    this.updateThumbValue(this.activeThumbIndex, targetVal);
  }

  onPointerUp(event: PointerEvent): void {
    if (this.activePointerId === event.pointerId) {
      const sliderEl = this.sliderRef.nativeElement;
      try {
        sliderEl.releasePointerCapture(event.pointerId);
      } catch {
        // Pointer capture may have already been released
      }
      this.activePointerId = null;
      this.activeThumbIndex = -1;
      this.emitCommit();
      this.onTouched();
    }
  }

  private getValueFromPointer(event: PointerEvent): number {
    const sliderEl = this.sliderRef.nativeElement;
    const rect = sliderEl.getBoundingClientRect();
    const isRtl = getComputedStyle(sliderEl).direction === 'rtl';
    const fraction = isRtl
      ? (rect.right - event.clientX) / rect.width
      : (event.clientX - rect.left) / rect.width;
    const raw = this.min + Math.min(1, Math.max(0, fraction)) * (this.max - this.min);
    return this.clampAndSnap(raw);
  }

  private updateThumbValue(index: number, val: number): void {
    const clamped = this.clampAndSnap(val);
    if (this.isRange && this.currentValues.length >= 2) {
      // Range constraint (F-03): Lower thumb is clamped to upper thumb, and vice versa.
      // Thumbs converge but cannot cross.
      let constrained = clamped;
      if (index === 0) {
        constrained = Math.min(clamped, this.currentValues[1]);
      } else if (index === 1) {
        constrained = Math.max(clamped, this.currentValues[0]);
      }
      if (this.currentValues[index] !== constrained) {
        this.currentValues[index] = constrained;
        this.cdr.markForCheck();
        this.emitChange();
      }
    } else {
      if (this.currentValues[0] !== clamped) {
        this.currentValues[0] = clamped;
        this.cdr.markForCheck();
        this.emitChange();
      }
    }
  }

  onThumbKeyDown(event: KeyboardEvent, index: number): void {
    if (this._disabled) return;
    const sliderEl = this.sliderRef.nativeElement;
    const isRtl = getComputedStyle(sliderEl).direction === 'rtl';
    let delta = 0;
    const largeStep = Math.max(this.step, (this.max - this.min) / 10);

    switch (event.key) {
      case 'ArrowRight':
        delta = isRtl ? -this.step : this.step;
        break;
      case 'ArrowLeft':
        delta = isRtl ? this.step : -this.step;
        break;
      case 'ArrowUp':
        delta = this.step;
        break;
      case 'ArrowDown':
        delta = -this.step;
        break;
      case 'PageUp':
        delta = largeStep;
        break;
      case 'PageDown':
        delta = -largeStep;
        break;
      case 'Home':
        this.updateThumbValue(
          index,
          this.isRange && index === 1 ? this.currentValues[0] : this.min,
        );
        this.emitCommit();
        event.preventDefault();
        return;
      case 'End':
        this.updateThumbValue(
          index,
          this.isRange && index === 0 ? this.currentValues[1] : this.max,
        );
        this.emitCommit();
        event.preventDefault();
        return;
      default:
        return;
    }

    if (delta !== 0) {
      event.preventDefault();
      const next = this.currentValues[index] + delta;
      this.updateThumbValue(index, next);
      this.emitCommit();
    }
  }

  onThumbBlur(): void {
    this.onTouched();
  }

  private emitChange(): void {
    const out = this.isRange ? [...this.currentValues] : this.currentValues[0];
    this.valueChange.emit(out);
    this.onChange(out);
  }

  private emitCommit(): void {
    const out = this.isRange ? [...this.currentValues] : this.currentValues[0];
    this.valueCommit.emit(out);
  }

  // --- ControlValueAccessor ---
  writeValue(obj: any): void {
    if (obj !== null && obj !== undefined) {
      this.initValue(obj);
    } else {
      this.initValue(this.min);
    }
    this.cdr.markForCheck();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
