import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DgaSlider, DgaSliderValue } from './dga-slider';

@Component({
  standalone: true,
  imports: [DgaSlider, ReactiveFormsModule],
  template: `
    <dga-slider
      id="test-slider"
      label="Volume"
      helperText="Adjust audio volume"
      [min]="min"
      [max]="max"
      [step]="step"
      [value]="sliderValue"
      [disabled]="disabled"
      [showValue]="showValue"
      [formatValue]="formatFn"
      (valueChange)="onValueChange($event)"
      (valueCommit)="onValueCommit($event)"
    />

    <dga-slider
      id="form-slider"
      [formControl]="control"
      [showValue]="true"
    />

    <dga-slider
      id="range-slider"
      label="Price Range"
      [min]="0"
      [max]="1000"
      [step]="50"
      [value]="rangeValue"
      [thumbLabels]="['Min price', 'Max price']"
      [showValue]="true"
      (valueChange)="onRangeChange($event)"
    />

    <dga-slider
      id="no-format-slider"
      [value]="50"
    />
  `,
})
class TestHostComponent {
  min = 0;
  max = 100;
  step = 1;
  sliderValue: DgaSliderValue = 25;
  rangeValue: DgaSliderValue = [100, 500];
  disabled = false;
  showValue = true;
  formatFn = (val: number) => `${val}%`;

  control = new FormControl(40);

  lastChange?: DgaSliderValue;
  lastCommit?: DgaSliderValue;
  lastRangeChange?: DgaSliderValue;

  onValueChange(val: DgaSliderValue): void {
    this.lastChange = val;
  }

  onValueCommit(val: DgaSliderValue): void {
    this.lastCommit = val;
  }

  onRangeChange(val: DgaSliderValue): void {
    this.lastRangeChange = val;
  }
}

/**
 * Mocks the Pointer Capture API and getBoundingClientRect on the slider root
 * element so that coordinate-based pointer tests work in JSDOM (which performs
 * no layout and does not implement Pointer Capture).
 * Mock rect: 200px wide, left=0, top=0.
 *
 * BROWSER-INTEGRATION GAP: Real visual drag behaviour (thumb rendering
 * position, visual RTL flip, touch targets) must be verified in
 * Cypress or Playwright where layout is available.
 */
function mockSliderRect(trackEl: HTMLElement): void {
  vi.spyOn(trackEl, 'getBoundingClientRect').mockReturnValue({
    left: 0,
    right: 200,
    top: 0,
    bottom: 16,
    width: 200,
    height: 16,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect);
  // JSDOM does not implement Pointer Capture — stub both methods unconditionally.
  // Use Object.defineProperty to override any non-configurable JSDOM stub.
  Object.defineProperty(trackEl, 'setPointerCapture', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
  Object.defineProperty(trackEl, 'releasePointerCapture', {
    value: vi.fn(),
    writable: true,
    configurable: true,
  });
}

/**
 * Dispatches a bubbling PointerEvent on an element.
 *
 * JSDOM LIMITATION: setPointerCapture / releasePointerCapture are not
 * implemented in JSDOM. The slider wraps releasePointerCapture in a
 * try/catch so missing implementation is safe for unit testing.
 */
function dispatchPointer(
  el: HTMLElement,
  type: string,
  clientX: number,
  pointerId = 1,
): void {
  el.dispatchEvent(
    new PointerEvent(type, { bubbles: true, cancelable: true, pointerId, clientX }),
  );
}

describe('DgaSlider', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, DgaSlider, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ---------------------------------------------------------------------------
  // ARIA and rendering
  // ---------------------------------------------------------------------------

  it('renders slider element with correct accessible role and attributes', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    expect(sliderDe).toBeTruthy();

    const label = sliderDe.query(By.css('.ddga-slider__label'));
    expect(label.nativeElement.textContent.trim()).toBe('Volume');

    const thumb = sliderDe.query(By.css('[role="slider"]'));
    expect(thumb).toBeTruthy();
    expect(thumb.attributes['role']).toBe('slider');
    expect(thumb.attributes['aria-valuemin']).toBe('0');
    expect(thumb.attributes['aria-valuemax']).toBe('100');
    expect(thumb.attributes['aria-valuenow']).toBe('25');
    expect(thumb.attributes['aria-valuetext']).toBe('25%');
    expect(thumb.attributes['tabindex']).toBe('0');
  });

  it('omits aria-valuetext when no formatValue is provided (F-04)', () => {
    const sliderDe = fixture.debugElement.query(By.css('#no-format-slider'));
    const thumb = sliderDe.query(By.css('[role="slider"]'));
    // Without formatValue the browser reads aria-valuenow directly —
    // aria-valuetext must not be present.
    expect(thumb.attributes['aria-valuetext']).toBeUndefined();
    expect(thumb.nativeElement.hasAttribute('aria-valuetext')).toBe(false);
  });

  it('renders formatted value display when showValue is true', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const valDisplay = sliderDe.query(By.css('.ddga-slider__value'));
    expect(valDisplay).toBeTruthy();
    expect(valDisplay.nativeElement.textContent.trim()).toBe('25%');
  });

  // ---------------------------------------------------------------------------
  // Error message accessibility (F-06)
  // ---------------------------------------------------------------------------

  it('displays error message and sets error classes when error is present', () => {
    const sliderComponent = fixture.debugElement
      .query(By.css('#test-slider'))
      .componentInstance as DgaSlider;
    sliderComponent.errorMessage = 'Value out of range';
    sliderComponent.error = true;
    fixture.detectChanges();

    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const errorMsg = sliderDe.query(By.css('.ddga-field__message--error'));
    expect(errorMsg).toBeTruthy();
    expect(errorMsg.nativeElement.textContent.trim()).toBe('Value out of range');

    const thumb = sliderDe.query(By.css('[role="slider"]'));
    expect(thumb.attributes['aria-invalid']).toBe('true');
    expect(thumb.attributes['aria-describedby']).toContain('-error');
  });

  it('error message span carries aria-live="polite" so screen readers announce it (F-06)', () => {
    const sliderComponent = fixture.debugElement
      .query(By.css('#test-slider'))
      .componentInstance as DgaSlider;
    sliderComponent.errorMessage = 'Too high';
    sliderComponent.error = true;
    fixture.detectChanges();

    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const errorMsg = sliderDe.query(By.css('.ddga-field__message--error'));
    expect(errorMsg.nativeElement.getAttribute('aria-live')).toBe('polite');
  });

  // ---------------------------------------------------------------------------
  // Disabled state (F-07)
  // ---------------------------------------------------------------------------

  it('respects disabled state: ignores keyboard events and sets aria-disabled', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;
    sliderComp.disabled = true;
    fixture.detectChanges();

    const thumb = sliderDe.query(By.css('[role="slider"]'));
    expect(thumb.attributes['aria-disabled']).toBe('true');
    expect(thumb.attributes['tabindex']).toBe('-1');

    thumb.triggerEventHandler('keydown', { key: 'ArrowUp', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBeUndefined();
  });

  it('sets data-disabled as a boolean attribute (empty string, not "true") when disabled — F-07', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;
    sliderComp.disabled = true;
    fixture.detectChanges();

    const sliderRoot = sliderDe.query(By.css('.ddga-slider'));
    // F-07: must be a boolean attribute (value = '') to match [data-disabled] in reference CSS.
    expect(sliderRoot.nativeElement.hasAttribute('data-disabled')).toBe(true);
    expect(sliderRoot.nativeElement.getAttribute('data-disabled')).toBe('');
  });

  it('removes data-disabled attribute entirely when re-enabled (F-07)', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;
    sliderComp.disabled = true;
    fixture.detectChanges();

    sliderComp.disabled = false;
    fixture.detectChanges();

    const sliderRoot = sliderDe.query(By.css('.ddga-slider'));
    expect(sliderRoot.nativeElement.hasAttribute('data-disabled')).toBe(false);
  });

  // ---------------------------------------------------------------------------
  // Keyboard navigation
  // ---------------------------------------------------------------------------

  it('handles keyboard navigation: ArrowUp/ArrowRight increment and ArrowDown/ArrowLeft decrement', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const thumb = sliderDe.query(By.css('[role="slider"]'));

    thumb.triggerEventHandler('keydown', { key: 'ArrowRight', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBe(26);
    expect(host.lastCommit).toBe(26);

    thumb.triggerEventHandler('keydown', { key: 'ArrowUp', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBe(27);

    thumb.triggerEventHandler('keydown', { key: 'ArrowLeft', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBe(26);

    thumb.triggerEventHandler('keydown', { key: 'ArrowDown', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBe(25);
  });

  it('handles keyboard Home and End keys to jump to min and max', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const thumb = sliderDe.query(By.css('[role="slider"]'));

    thumb.triggerEventHandler('keydown', { key: 'Home', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBe(0);
    expect(thumb.attributes['aria-valuenow']).toBe('0');

    thumb.triggerEventHandler('keydown', { key: 'End', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBe(100);
    expect(thumb.attributes['aria-valuenow']).toBe('100');
  });

  it('handles PageUp and PageDown for large steps', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const thumb = sliderDe.query(By.css('[role="slider"]'));

    // Current is 25. Large step = (100 - 0)/10 = 10
    thumb.triggerEventHandler('keydown', { key: 'PageUp', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBe(35);

    thumb.triggerEventHandler('keydown', { key: 'PageDown', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastChange).toBe(25);
  });

  // ---------------------------------------------------------------------------
  // Pointer interaction (Phase C — F-09)
  // getBoundingClientRect is mocked (200px wide, left=0). Real drag layout and
  // visual thumb position must be verified in a browser integration test.
  // ---------------------------------------------------------------------------

  it('pointer down at midpoint (100/200px) sets value to 50', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;
    const trackEl = sliderDe.query(By.css('.ddga-slider')).nativeElement as HTMLElement;

    mockSliderRect(trackEl);
    dispatchPointer(trackEl, 'pointerdown', 100); // 50% of [0,100] = 50
    fixture.detectChanges();

    expect(sliderComp.currentValues[0]).toBe(50);
    expect(host.lastChange).toBe(50);
  });

  it('pointer move updates value continuously; pointer up fires commit once', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const trackEl = sliderDe.query(By.css('.ddga-slider')).nativeElement as HTMLElement;

    mockSliderRect(trackEl);
    dispatchPointer(trackEl, 'pointerdown', 80); // 40% → 40 (changes from initial 25)
    fixture.detectChanges();
    expect(host.lastChange).toBe(40);

    dispatchPointer(trackEl, 'pointermove', 150); // 75% → 75
    fixture.detectChanges();
    expect(host.lastChange).toBe(75);
    expect(host.lastCommit).toBeUndefined(); // not yet committed

    dispatchPointer(trackEl, 'pointerup', 150);
    fixture.detectChanges();
    expect(host.lastCommit).toBe(75);
  });

  it('disabled slider ignores pointer down (no value change, no event)', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;
    sliderComp.disabled = true;
    fixture.detectChanges();

    const trackEl = sliderDe.query(By.css('.ddga-slider')).nativeElement as HTMLElement;
    mockSliderRect(trackEl);
    dispatchPointer(trackEl, 'pointerdown', 100);
    fixture.detectChanges();

    expect(sliderComp.currentValues[0]).toBe(25); // unchanged
    expect(host.lastChange).toBeUndefined();
  });

  it('pointer cancel fires commit and resets active state (no stale drag after cancel)', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;
    const trackEl = sliderDe.query(By.css('.ddga-slider')).nativeElement as HTMLElement;

    mockSliderRect(trackEl);
    dispatchPointer(trackEl, 'pointerdown', 100); // 50% → value=50
    fixture.detectChanges();
    expect(host.lastChange).toBe(50); // value changed

    dispatchPointer(trackEl, 'pointercancel', 100);
    fixture.detectChanges();
    // Commit fires on cancel (same handler as pointerup)
    expect(host.lastCommit).toBe(50);

    // After cancel, subsequent move must be ignored (active state cleared)
    dispatchPointer(trackEl, 'pointermove', 180);
    fixture.detectChanges();
    expect(sliderComp.currentValues[0]).toBe(50); // no further change
  });

  it('pointer move without a preceding pointer down is ignored (no stale drag)', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;
    const trackEl = sliderDe.query(By.css('.ddga-slider')).nativeElement as HTMLElement;

    mockSliderRect(trackEl);
    dispatchPointer(trackEl, 'pointermove', 150);
    fixture.detectChanges();

    expect(sliderComp.currentValues[0]).toBe(25); // must remain at 25
    expect(host.lastChange).toBeUndefined();
  });

  it('range slider: pointer down selects nearest thumb (ordering preserved)', () => {
    const rangeSliderDe = fixture.debugElement.query(By.css('#range-slider'));
    const sliderComp = rangeSliderDe.componentInstance as DgaSlider;
    const trackEl = rangeSliderDe.query(By.css('.ddga-slider')).nativeElement as HTMLElement;

    // [100,500] on min=0 max=1000; 200px mock
    // lower thumb at 100/1000=10% → 20px; upper at 500/1000=50% → 100px
    mockSliderRect(trackEl);
    dispatchPointer(trackEl, 'pointerdown', 10); // 5% → 50; closer to lower (100)
    fixture.detectChanges();

    // Both values must remain ordered
    expect(sliderComp.currentValues[0]).toBeLessThanOrEqual(sliderComp.currentValues[1]);
    expect(host.lastRangeChange).toBeDefined();
  });

  // ---------------------------------------------------------------------------
  // Range constraint (F-03 — documented behaviour)
  // ---------------------------------------------------------------------------

  it('range slider: lower thumb cannot exceed upper thumb (F-03 documented constraint)', () => {
    const rangeSliderDe = fixture.debugElement.query(By.css('#range-slider'));
    const thumbs = rangeSliderDe.queryAll(By.css('[role="slider"]'));
    expect(thumbs.length).toBe(2);

    expect(thumbs[0].attributes['aria-valuenow']).toBe('100');
    expect(thumbs[0].attributes['aria-label']).toBe('Min price');
    expect(thumbs[1].attributes['aria-valuenow']).toBe('500');
    expect(thumbs[1].attributes['aria-label']).toBe('Max price');

    const valDisplay = rangeSliderDe.query(By.css('.ddga-slider__value'));
    expect(valDisplay.nativeElement.textContent.trim()).toBe('100 – 500');

    thumbs[0].triggerEventHandler('keydown', { key: 'ArrowUp', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastRangeChange).toEqual([150, 500]);

    // Lower thumb at End is clamped to upper thumb value (500); thumbs converge.
    thumbs[0].triggerEventHandler('keydown', { key: 'End', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.lastRangeChange).toEqual([500, 500]);
  });

  // ---------------------------------------------------------------------------
  // Reactive Forms / CVA
  // ---------------------------------------------------------------------------

  it('supports ReactiveForms integration via ControlValueAccessor', () => {
    const formSliderDe = fixture.debugElement.query(By.css('#form-slider'));
    const thumb = formSliderDe.query(By.css('[role="slider"]'));
    expect(thumb.attributes['aria-valuenow']).toBe('40');

    host.control.setValue(75);
    fixture.detectChanges();
    expect(thumb.attributes['aria-valuenow']).toBe('75');

    thumb.triggerEventHandler('keydown', { key: 'ArrowUp', preventDefault: () => {} });
    fixture.detectChanges();
    expect(host.control.value).toBe(76);

    host.control.disable();
    fixture.detectChanges();
    expect(thumb.attributes['aria-disabled']).toBe('true');
  });

  it('writeValue(null) resets slider to min value (CVA contract)', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;

    sliderComp.writeValue(null);
    fixture.detectChanges();

    const thumb = sliderDe.query(By.css('[role="slider"]'));
    expect(thumb.attributes['aria-valuenow']).toBe('0'); // resets to min
  });

  it('value input set to undefined leaves current value unchanged (F-02 documented contract)', () => {
    const sliderDe = fixture.debugElement.query(By.css('#test-slider'));
    const sliderComp = sliderDe.componentInstance as DgaSlider;
    expect(sliderComp.currentValues[0]).toBe(25);

    sliderComp.value = undefined;
    fixture.detectChanges();
    // DgaSlider does not support runtime switch from controlled to uncontrolled.
    // Setting value=undefined is a no-op; see F-02 in the audit report.
    expect(sliderComp.currentValues[0]).toBe(25);
  });

  it('onTouched fires on thumb blur (CVA touched-state timing)', () => {
    const formSliderDe = fixture.debugElement.query(By.css('#form-slider'));
    expect(host.control.touched).toBe(false);

    const thumb = formSliderDe.query(By.css('[role="slider"]'));
    thumb.triggerEventHandler('blur', {});
    fixture.detectChanges();

    expect(host.control.touched).toBe(true);
  });
});
