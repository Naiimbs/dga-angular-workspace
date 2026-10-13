import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { DgaSwitch } from './dga-form-controls';

function getInput(fixture: ComponentFixture<unknown>): HTMLInputElement {
  return fixture.nativeElement.querySelector('input[role="switch"]') as HTMLInputElement;
}
function getLabel(fixture: ComponentFixture<unknown>): HTMLLabelElement {
  return fixture.nativeElement.querySelector('label.switch') as HTMLLabelElement;
}
// Zoneless change detection only refreshes a view that has been notified of a change.
// Host state is held in signals so that `.set(...)` schedules the view for refresh and
// `fixture.detectChanges()` re-evaluates the bindings into DgaSwitch.
function childRef(fixture: ComponentFixture<unknown>): DgaSwitch {
  return fixture.debugElement.children[0].componentInstance as DgaSwitch;
}
function childCdr(fixture: ComponentFixture<unknown>): ChangeDetectorRef {
  return fixture.debugElement.children[0].injector.get(ChangeDetectorRef);
}

@Component({
  standalone: true,
  imports: [DgaSwitch, FormsModule],
  template: '<dga-switch [id]="id" [name]="name" [checked]="checked()" [disabled]="disabled()" [required]="required()" [error]="error()" [errorMessage]="errorMessage()" [helperText]="helperText()">Label</dga-switch>',
})
class HostComponent {
  id = 'sw-1'; name = 'sw';
  checked = signal(false); disabled = signal(false);
  required = signal(false); error = signal(''); errorMessage = signal(''); helperText = signal('');
}

@Component({
  standalone: true,
  imports: [DgaSwitch, FormsModule],
  template: '<dga-switch id="sw-ngmodel" name="sw-ngmodel" [ngModel]="value()" (ngModelChange)="value.set($event)">Toggle</dga-switch>',
})
class NgModelHostComponent { value = signal(false); }

describe('DgaSwitch', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [HostComponent] }).compileComponents();
    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  // data-slot attributes
  it('renders data-slot=switch-field on the label', () => {
    expect(getLabel(fixture).getAttribute('data-slot')).toBe('switch-field');
  });
  it('renders data-slot=switch on the input', () => {
    expect(getInput(fixture).getAttribute('data-slot')).toBe('switch');
  });
  it('renders data-slot=switch-track on the track span', () => {
    expect(fixture.nativeElement.querySelector('[data-slot="switch-track"]')).toBeTruthy();
  });
  it('renders data-slot=switch-thumb on the thumb span', () => {
    expect(fixture.nativeElement.querySelector('[data-slot="switch-thumb"]')).toBeTruthy();
  });

  // data-state
  it('sets data-state=unchecked when unchecked', () => {
    host.checked.set(false); fixture.detectChanges();
    expect(getInput(fixture).getAttribute('data-state')).toBe('unchecked');
  });
  it('sets data-state=checked when checked', () => {
    host.checked.set(true); fixture.detectChanges();
    expect(getInput(fixture).getAttribute('data-state')).toBe('checked');
  });

  // data-disabled
  it('does not set data-disabled when enabled', () => {
    expect(getInput(fixture).hasAttribute('data-disabled')).toBe(false);
  });
  it('sets data-disabled when disabled', () => {
    host.disabled.set(true); fixture.detectChanges();
    expect(getInput(fixture).hasAttribute('data-disabled')).toBe(true);
  });

  // native disabled
  it('disables the native input when disabled=true', () => {
    host.disabled.set(true); fixture.detectChanges();
    expect(getInput(fixture).disabled).toBe(true);
  });

  // aria-required
  it('does not set aria-required when not required', () => {
    expect(getInput(fixture).getAttribute('aria-required')).toBeNull();
  });
  it('sets aria-required=true when required', () => {
    host.required.set(true); fixture.detectChanges();
    expect(getInput(fixture).getAttribute('aria-required')).toBe('true');
  });

  // aria-invalid
  it('does not set aria-invalid without error', () => {
    expect(getInput(fixture).getAttribute('aria-invalid')).toBeNull();
  });
  it('sets aria-invalid=true when error is set', () => {
    host.error.set('err'); fixture.detectChanges();
    expect(getInput(fixture).getAttribute('aria-invalid')).toBe('true');
  });
  it('sets aria-invalid=true when errorMessage is set', () => {
    host.errorMessage.set('Required'); fixture.detectChanges();
    expect(getInput(fixture).getAttribute('aria-invalid')).toBe('true');
  });

  // aria-describedby
  it('does not set aria-describedby when no message', () => {
    expect(getInput(fixture).getAttribute('aria-describedby')).toBeNull();
  });
  it('sets aria-describedby when helperText is set', () => {
    host.helperText.set('Some hint'); fixture.detectChanges();
    const id = getInput(fixture).getAttribute('aria-describedby');
    expect(id).toBeTruthy();
    const hint = fixture.nativeElement.querySelector('#' + id);
    expect(hint?.textContent?.trim()).toBe('Some hint');
  });
  it('sets aria-describedby when errorMessage is set', () => {
    host.errorMessage.set('Must be enabled'); fixture.detectChanges();
    const id = getInput(fixture).getAttribute('aria-describedby');
    expect(id).toBeTruthy();
    const hint = fixture.nativeElement.querySelector('#' + id);
    expect(hint?.textContent?.trim()).toBe('Must be enabled');
  });

  // CSS classes
  it('adds switch--error class when error is set', () => {
    host.error.set('err'); fixture.detectChanges();
    expect(getLabel(fixture).classList).toContain('switch--error');
  });
  it('adds switch--error class when errorMessage is set', () => {
    host.errorMessage.set('Err'); fixture.detectChanges();
    expect(getLabel(fixture).classList).toContain('switch--error');
  });
  it('adds switch--disabled class when disabled', () => {
    host.disabled.set(true); fixture.detectChanges();
    expect(getLabel(fixture).classList).toContain('switch--disabled');
  });

  // change event / checkedChange
  it('emits checkedChange and updates data-state on change event', () => {
    const inst = childRef(fixture);
    const emitted: boolean[] = [];
    inst.checkedChange.subscribe((v: boolean) => emitted.push(v));
    const inp = getInput(fixture);
    inp.checked = true;
    inp.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(emitted[0]).toBe(true);
    expect(inp.getAttribute('data-state')).toBe('checked');
  });

  // CVA: ngModel
  it('updates ngModel value when switch is toggled', async () => {
    const f = TestBed.createComponent(NgModelHostComponent);
    const h = f.componentInstance;
    f.detectChanges(); await f.whenStable();
    const inp = getInput(f);
    inp.checked = true;
    inp.dispatchEvent(new Event('change', { bubbles: true }));
    f.detectChanges(); await f.whenStable();
    expect(h.value()).toBe(true);
    expect(inp.getAttribute('data-state')).toBe('checked');
  });
  it('writeValue(true) reflects checked state', async () => {
    const f = TestBed.createComponent(NgModelHostComponent);
    f.componentInstance.value.set(true);
    f.detectChanges(); await f.whenStable();
    // ngModel pushes the value through writeValue() in a microtask; refresh the
    // control view after it settles so the reflected attribute is up to date.
    childCdr(f).detectChanges();
    expect(getInput(f).getAttribute('data-state')).toBe('checked');
  });
  it('writeValue(null) resets to unchecked (CVA contract)', async () => {
    const f = TestBed.createComponent(NgModelHostComponent);
    f.componentInstance.value.set(true);
    f.detectChanges(); await f.whenStable();
    const inst = childRef(f);
    inst.writeValue(null);
    childCdr(f).detectChanges();
    expect(getInput(f).getAttribute('data-state')).toBe('unchecked');
  });

  // setDisabledState
  it('setDisabledState(true) disables input and sets data-disabled', () => {
    const inst = childRef(fixture);
    inst.setDisabledState(true); childCdr(fixture).detectChanges();
    expect(getInput(fixture).disabled).toBe(true);
    expect(getInput(fixture).hasAttribute('data-disabled')).toBe(true);
  });

  // onTouched on blur
  it('onTouched fires on input blur (CVA touched-state timing)', () => {
    const inst = childRef(fixture);
    let touched = false;
    inst.registerOnTouched(() => { touched = true; });
    getInput(fixture).dispatchEvent(new Event('blur'));
    expect(touched).toBe(true);
  });
});
