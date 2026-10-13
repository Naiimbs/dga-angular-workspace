import { TestBed } from '@angular/core/testing';
import { Component, PLATFORM_ID } from '@angular/core';
import { DgaIconRegistry } from './dga-icon-registry';
import { DgaIcon } from './dga-icon';

@Component({
  standalone: true,
  imports: [DgaIcon],
  template: `
    <dga-icon id="test-check" name="check" />
    <dga-icon id="test-check-variant" name="check" variant="solid" />
    <dga-icon id="test-saudi-flag" name="saudi-flag" />
    <dga-icon id="test-font-icon" name="dga-icon-add-01" variant="stroke-rounded" />
    <dga-icon id="test-unknown-icon" name="unknown-nonexistent-icon" />
    <dga-icon id="test-unknown-variant" name="check" variant="unknown-variant-xyz" />
    <dga-icon id="test-accessible" name="info" label="Information indicator" />
    <dga-icon id="test-sized" name="search" [size]="24" />
  `,
})
class TestHostComponent {}

describe('DgaIconRegistry & DgaIcon Component', () => {
  let registry: DgaIconRegistry;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, DgaIcon],
    }).compileComponents();

    registry = TestBed.inject(DgaIconRegistry);
  });

  describe('DgaIconRegistry Unit Tests', () => {
    it('should be created and contain registered default icons', () => {
      expect(registry).toBeTruthy();
      expect(registry.hasIcon('check')).toBe(true);
      expect(registry.hasIcon('saudi-flag')).toBe(true);
      expect(registry.hasIcon('chevron-down')).toBe(true);
    });

    it('should register and retrieve SVG vector icons by name and variant', () => {
      const checkDef = registry.getIcon('check');
      expect(checkDef).toBeDefined();
      expect(checkDef?.type).toBe('svg');
      expect(checkDef?.name).toBe('check');
      expect(checkDef?.viewBox).toBe('0 0 24 24');

      const checkSolidDef = registry.getIcon('check', 'solid');
      expect(checkSolidDef).toBeDefined();
      expect(checkSolidDef?.type).toBe('svg');
    });

    it('should register custom icons dynamically using registerIcon()', () => {
      registry.registerIcon({
        name: 'custom-star',
        variant: 'default',
        type: 'svg',
        viewBox: '0 0 24 24',
        svgHtml: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />',
      });

      expect(registry.hasIcon('custom-star')).toBe(true);
      const customStar = registry.getIcon('custom-star');
      expect(customStar?.svgHtml).toContain('polygon');
    });

    it('should handle font icons and resolve variant classes correctly', () => {
      const fontIcon = registry.getIcon('dga-icon-add-01', 'stroke-rounded');
      expect(fontIcon).toBeDefined();
      expect(fontIcon?.type).toBe('font');
      expect(fontIcon?.fontClass).toContain('dga-icon-add-01');
      expect(fontIcon?.fontClass).toContain('stroke rounded');
    });

    it('should return fallback definition for unknown icon names without crashing', () => {
      const unknownDef = registry.getIcon('nonexistent-icon-123');
      expect(unknownDef).toBeDefined();
      expect(unknownDef?.type).toBe('svg');
      expect(unknownDef?.svgHtml).toContain('circle');
    });

    it('should return default fallback definition for unknown variants', () => {
      const unknownVariantDef = registry.getIcon('check', 'nonexistent-variant');
      expect(unknownVariantDef).toBeDefined();
      expect(unknownVariantDef?.name).toBe('check');
    });

    it('should list all registered icons with getAllIcons()', () => {
      const allIcons = registry.getAllIcons();
      expect(allIcons.length).toBeGreaterThan(50);
    });
  });

  describe('Icon-font integration contract', () => {
    // These icons live in the DGA icon-font pack (DGA-icons-source) that is
    // bundled as library assets. The registry must resolve their font classes
    // independently of whether the WOFF2 is loaded (that is browser-only).
    it('resolves representative font icons across categories by full dga-icon-* name', () => {
      for (const name of ['dga-icon-add-01', 'dga-icon-wifi-01', 'dga-icon-home-01']) {
        const def = registry.getIcon(name);
        expect(def).toBeDefined();
        expect(def?.type).toBe('font');
        expect(def?.fontClass).toContain(name);
      }
    });

    it('resolves font icons registered under their stripped name', () => {
      const def = registry.getIcon('add-01');
      expect(def).toBeDefined();
      expect(def?.type).toBe('font');
      expect(def?.fontClass).toContain('dga-icon-add-01');
    });

    it('applies the correct variant modifier classes', () => {
      expect(registry.getIcon('dga-icon-add-01', 'solid-rounded')?.fontClass).toContain('solid rounded');
      expect(registry.getIcon('dga-icon-add-01', 'twotone-rounded')?.fontClass).toContain('twotone rounded');
      expect(registry.getIcon('dga-icon-add-01', 'stroke-sharp')?.fontClass).toContain('stroke sharp');
    });

    it('keeps curated SVG icons resolving as SVG (not replaced by the font pack)', () => {
      for (const name of ['check', 'chevron-down', 'saudi-flag', 'lock', 'link', 'menu', 'close']) {
        expect(registry.getIcon(name)?.type).toBe('svg');
      }
    });
  });

  describe('DgaIcon public API surface (must remain stable)', () => {
    it('exposes the documented inputs with their defaults', () => {
      const icon = TestBed.createComponent(DgaIcon).componentInstance;
      expect(icon.variant).toBe('default');
      expect(icon.size).toBe('md');
      expect(icon.label).toBe('');
      // `name` is a required input and has no default (undefined until set).
      expect('name' in icon).toBe(true);
    });
  });

  describe('DgaIcon DOM Rendering Tests', () => {
    it('should render SVG element for registered SVG icon', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('#test-check svg');
      expect(el).toBeTruthy();
      expect(el.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(el.getAttribute('aria-hidden')).toBe('true');
    });

    it('should render special viewBox for saudi-flag (0 0 20 14)', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('#test-saudi-flag svg');
      expect(el).toBeTruthy();
      expect(el.getAttribute('viewBox')).toBe('0 0 20 14');
      expect(el.getAttribute('width')).toBe('20');
      expect(el.getAttribute('height')).toBe('14');
    });

    it('should render <i> tag for font icon', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const fontEl = fixture.nativeElement.querySelector('#test-font-icon i');
      expect(fontEl).toBeTruthy();
      expect(fontEl.className).toContain('dga-icon-add-01');
      expect(fontEl.className).toContain('stroke');
      expect(fontEl.className).toContain('rounded');
    });

    it('should handle accessibility attributes correctly when label is provided', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const accEl = fixture.nativeElement.querySelector('#test-accessible svg');
      expect(accEl).toBeTruthy();
      expect(accEl.getAttribute('role')).toBe('img');
      expect(accEl.getAttribute('aria-label')).toBe('Information indicator');
      expect(accEl.hasAttribute('aria-hidden')).toBe(false);
    });

    it('should support numeric custom sizes', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const sizedEl = fixture.nativeElement.querySelector('#test-sized svg');
      expect(sizedEl).toBeTruthy();
      expect(sizedEl.getAttribute('width')).toBe('24px');
      expect(sizedEl.getAttribute('height')).toBe('24px');
    });

    it('should render inner SVG content in browser platform', () => {
      const fixture = TestBed.createComponent(TestHostComponent);
      fixture.detectChanges();

      const el = fixture.nativeElement.querySelector('#test-check svg');
      expect(el).toBeTruthy();
      expect(el.innerHTML).toBeTruthy();
      expect(el.innerHTML).toContain('path');
    });

    it('should safely render SVG in SSR server platform without calling innerHTML on SVGSVGElement', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [DgaIcon],
        providers: [{ provide: PLATFORM_ID, useValue: 'server' }],
      });
      const iconFixture = TestBed.createComponent(DgaIcon);
      iconFixture.componentRef.setInput('name', 'check');
      expect(() => iconFixture.detectChanges()).not.toThrow();

      const svgEl = iconFixture.nativeElement.querySelector('svg');
      expect(svgEl).toBeTruthy();
      expect(svgEl.getAttribute('viewBox')).toBe('0 0 24 24');
      expect(svgEl.getAttribute('focusable')).toBe('false');
    });
  });
});
