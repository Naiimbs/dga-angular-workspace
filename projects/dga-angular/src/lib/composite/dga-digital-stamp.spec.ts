import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DgaDigitalStamp } from './dga-digital-stamp';

function q(fixture: ComponentFixture<DgaDigitalStamp>, sel: string): HTMLElement | null {
  return fixture.nativeElement.querySelector(sel) as HTMLElement | null;
}

describe('DgaDigitalStamp', () => {
  let fixture: ComponentFixture<DgaDigitalStamp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DgaDigitalStamp] }).compileComponents();
    fixture = TestBed.createComponent(DgaDigitalStamp);
    fixture.detectChanges();
  });

  // --- structure / public content ---
  it('renders the statement text and the Saudi flag + chevron icons', () => {
    fixture.componentRef.setInput('statement', 'Verified government site.');
    fixture.detectChanges();
    expect(q(fixture, '.ddga-digital-stamp__statement')?.textContent?.trim()).toBe('Verified government site.');
    expect(q(fixture, 'dga-icon[name="saudi-flag"]')).toBeTruthy();
    expect(q(fixture, 'dga-icon[name="chevron-down"]')).toBeTruthy();
  });

  it('exposes the documented input defaults', () => {
    const c = fixture.componentInstance;
    expect(c.extension).toBe('gov.sa');
    expect(c.triggerLabel).toBe('How you know?');
    expect(c.ariaLabel).toBe('Government website verification');
    expect(c.defaultOpen).toBe(false);
    expect(c.open).toBeUndefined();
    expect(c.logo).toBe('');
    expect(c.logoSrc).toBe('');
  });

  // --- open / closed state & a11y wiring ---
  it('is collapsed by default with aria-expanded=false and the panel hidden', () => {
    const section = q(fixture, 'section.ddga-digital-stamp')!;
    const trigger = q(fixture, '.ddga-digital-stamp__trigger')!;
    const panel = q(fixture, '.ddga-digital-stamp__panel')!;
    expect(section.getAttribute('data-state')).toBe('closed');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(panel.hasAttribute('hidden')).toBe(true);
  });

  it('links the trigger to the panel via aria-controls/id', () => {
    const trigger = q(fixture, '.ddga-digital-stamp__trigger')!;
    const panel = q(fixture, '.ddga-digital-stamp__panel')!;
    const controls = trigger.getAttribute('aria-controls');
    expect(controls).toBeTruthy();
    expect(panel.id).toBe(controls);
  });

  it('opens on trigger click (uncontrolled) and emits openChange', () => {
    const emitted: boolean[] = [];
    fixture.componentInstance.openChange.subscribe((v) => emitted.push(v));
    (q(fixture, '.ddga-digital-stamp__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(q(fixture, 'section.ddga-digital-stamp')!.getAttribute('data-state')).toBe('open');
    expect(q(fixture, '.ddga-digital-stamp__trigger')!.getAttribute('aria-expanded')).toBe('true');
    expect(q(fixture, '.ddga-digital-stamp__panel')!.hasAttribute('hidden')).toBe(false);
    expect(emitted).toEqual([true]);
  });

  it('respects defaultOpen for the initial uncontrolled state', () => {
    const f = TestBed.createComponent(DgaDigitalStamp);
    f.componentRef.setInput('defaultOpen', true);
    f.detectChanges();
    expect(q(f, 'section.ddga-digital-stamp')!.getAttribute('data-state')).toBe('open');
  });

  it('is controlled by the open input: click emits intent but does not change state', () => {
    fixture.componentRef.setInput('open', false);
    fixture.detectChanges();
    const emitted: boolean[] = [];
    fixture.componentInstance.openChange.subscribe((v) => emitted.push(v));
    (q(fixture, '.ddga-digital-stamp__trigger') as HTMLButtonElement).click();
    fixture.detectChanges();
    // Still closed because `open` is controlled by the parent.
    expect(q(fixture, 'section.ddga-digital-stamp')!.getAttribute('data-state')).toBe('closed');
    expect(emitted).toEqual([true]);
  });

  // --- extension-driven copy ---
  it('reflects the extension on data-extension and in the domain title', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('extension', 'edu.sa');
    fixture.detectChanges();
    expect(q(fixture, 'section.ddga-digital-stamp')!.getAttribute('data-extension')).toBe('edu.sa');
    expect(q(fixture, '[data-slot="domain-verification"] strong')?.textContent).toContain('.edu.sa');
  });

  it('lets domainTitle override the default domain copy', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('domainTitle', 'Custom domain heading');
    fixture.detectChanges();
    const title = q(fixture, '[data-slot="domain-verification"] .ddga-digital-stamp__title')!;
    expect(title.textContent).toContain('Custom domain heading');
  });

  // --- registration block ---
  it('shows no registration block without a registrationNumber', () => {
    fixture.componentRef.setInput('open', true);
    fixture.detectChanges();
    expect(q(fixture, '[data-slot="registration"]')).toBeNull();
  });

  it('renders the registration number as a link when registrationHref is set, else as text', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('registrationNumber', 'DGA-123');
    fixture.detectChanges();
    expect(q(fixture, '.ddga-digital-stamp__registration-number')?.textContent).toBe('DGA-123');
    expect(q(fixture, 'a.ddga-digital-stamp__registration-link')).toBeNull();

    fixture.componentRef.setInput('registrationHref', 'https://example.gov.sa/reg');
    fixture.detectChanges();
    const link = q(fixture, 'a.ddga-digital-stamp__registration-link') as HTMLAnchorElement | null;
    expect(link).toBeTruthy();
    expect(link!.getAttribute('href')).toBe('https://example.gov.sa/reg');
    expect(link!.textContent).toBe('DGA-123');
  });

  // --- logo input behavior (backward-compatible image support) ---
  it('renders the logo string as plain text (backward compatible)', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('registrationNumber', 'DGA-1');
    fixture.componentRef.setInput('logo', 'DGA');
    fixture.detectChanges();
    const logo = q(fixture, '.ddga-digital-stamp__logo')!;
    expect(logo.textContent?.trim()).toContain('DGA');
    expect(logo.querySelector('img')).toBeNull();
  });

  it('renders logoSrc as a sanitized <img> that takes precedence over the logo text', () => {
    fixture.componentRef.setInput('open', true);
    fixture.componentRef.setInput('registrationNumber', 'DGA-1');
    fixture.componentRef.setInput('logo', 'DGA');
    fixture.componentRef.setInput('logoSrc', 'https://example.gov.sa/logo.png');
    fixture.componentRef.setInput('logoAlt', 'Authority logo');
    fixture.detectChanges();
    const img = q(fixture, '.ddga-digital-stamp__logo img') as HTMLImageElement | null;
    expect(img).toBeTruthy();
    expect(img!.getAttribute('src')).toBe('https://example.gov.sa/logo.png');
    expect(img!.getAttribute('alt')).toBe('Authority logo');
    // the plain-text branch must not also render
    expect(q(fixture, '.ddga-digital-stamp__logo')!.textContent?.trim()).toBe('');
  });

  it('applies the aria-label to the root section', () => {
    fixture.componentRef.setInput('ariaLabel', 'Saudi government verification');
    fixture.detectChanges();
    expect(q(fixture, 'section.ddga-digital-stamp')!.getAttribute('aria-label')).toBe('Saudi government verification');
  });
});
