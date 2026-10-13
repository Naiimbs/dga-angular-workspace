import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DgaFooter, DgaFooterLink, DgaFooterLinkGroup, DgaFooterLogo } from './dga-footer';

function q(f: ComponentFixture<DgaFooter>, sel: string): HTMLElement | null {
  return f.nativeElement.querySelector(sel) as HTMLElement | null;
}
function qa(f: ComponentFixture<DgaFooter>, sel: string): HTMLElement[] {
  return Array.from(f.nativeElement.querySelectorAll(sel)) as HTMLElement[];
}

describe('DgaFooter', () => {
  let fixture: ComponentFixture<DgaFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DgaFooter] }).compileComponents();
    fixture = TestBed.createComponent(DgaFooter);
    fixture.detectChanges();
  });

  it('is a semantic <footer> landmark with accessible labels; light variant by default', () => {
    fixture.componentRef.setInput('ariaLabel', 'Site footer');
    fixture.detectChanges();
    const footer = q(fixture, 'footer.ddga-footer')!;
    expect(footer.tagName).toBe('FOOTER');
    expect(footer.getAttribute('aria-label')).toBe('Site footer');
    expect(footer.classList.contains('ddga-footer--dark')).toBe(false);
  });

  it('applies the dark variant class', () => {
    fixture.componentRef.setInput('variant', 'dark');
    fixture.detectChanges();
    expect(q(fixture, 'footer.ddga-footer')!.classList.contains('ddga-footer--dark')).toBe(true);
  });

  // --- link columns ---
  it('renders link columns (headingless and headed) inside a labeled nav', () => {
    const groups: DgaFooterLinkGroup[] = [
      { links: [{ label: 'About', href: '/about' }, { label: 'News', href: '/news' }] },
      { heading: 'Services', links: [{ label: 'Portal', href: '/portal' }] },
    ];
    fixture.componentRef.setInput('linkGroups', groups);
    fixture.componentRef.setInput('navLabel', 'Footer links');
    fixture.detectChanges();

    const nav = q(fixture, 'nav.ddga-footer__nav')!;
    expect(nav.getAttribute('aria-label')).toBe('Footer links');
    const cols = qa(fixture, '.ddga-footer__group');
    expect(cols.length).toBe(2);
    // first column has no heading
    expect(cols[0].querySelector('.ddga-footer__group-heading')).toBeNull();
    expect(cols[0].querySelectorAll('a').length).toBe(2);
    expect((cols[0].querySelector('a') as HTMLAnchorElement).getAttribute('href')).toBe('/about');
    // second column has a heading
    expect(cols[1].querySelector('h2.ddga-footer__group-heading')?.textContent).toContain('Services');
  });

  // --- social column ---
  it('renders social links with icons and accessible names + a heading', () => {
    const social: DgaFooterLink[] = [
      { label: 'X', href: '#', icon: 'new-twitter' },
      { label: 'LinkedIn', href: '#', ariaLabel: 'DGA on LinkedIn', icon: 'linkedin-01' },
    ];
    fixture.componentRef.setInput('socialLinks', social);
    fixture.componentRef.setInput('socialHeading', 'Social Media');
    fixture.detectChanges();
    const col = q(fixture, '.ddga-footer__column')!;
    expect(col.querySelector('.ddga-footer__group-heading')?.textContent).toContain('Social Media');
    const links = qa(fixture, '.ddga-footer__social a');
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('aria-label')).toBe('X');
    expect(links[0].querySelector('dga-icon')).toBeTruthy();
    expect(links[1].getAttribute('aria-label')).toBe('DGA on LinkedIn');
  });

  // --- legal area ---
  it('renders legal links, copyright, and last-modified only when provided', () => {
    expect(q(fixture, '.ddga-footer__legal-links')).toBeNull();
    expect(q(fixture, '.ddga-footer__copyright')).toBeNull();
    expect(q(fixture, '.ddga-footer__last-modified')).toBeNull();

    fixture.componentRef.setInput('legalLinks', [{ label: 'Sitemap', href: '/sitemap' }] as DgaFooterLink[]);
    fixture.componentRef.setInput('copyright', 'All Rights Reserved © 2026');
    fixture.componentRef.setInput('lastModified', 'Last Modified Date: 04/12/2026');
    fixture.detectChanges();

    expect((q(fixture, '.ddga-footer__legal-links a') as HTMLAnchorElement).getAttribute('href')).toBe('/sitemap');
    expect(q(fixture, '.ddga-footer__copyright')?.textContent).toContain('All Rights Reserved');
    expect(q(fixture, '.ddga-footer__last-modified')?.textContent).toContain('Last Modified Date');
  });

  // --- logos ---
  it('renders logos as images, optionally wrapped in links', () => {
    const logos: DgaFooterLogo[] = [
      { src: '/seal.svg', alt: 'Year of AI' },
      { src: '/platform.svg', alt: 'Platform', href: 'https://dga.gov.sa' },
    ];
    fixture.componentRef.setInput('logos', logos);
    fixture.detectChanges();
    const imgs = qa(fixture, '.ddga-footer__logos img') as HTMLImageElement[];
    expect(imgs.length).toBe(2);
    expect(imgs[0].getAttribute('src')).toBe('/seal.svg');
    expect(imgs[0].getAttribute('alt')).toBe('Year of AI');
    const linkedLogo = q(fixture, '.ddga-footer__logos a') as HTMLAnchorElement;
    expect(linkedLogo.getAttribute('href')).toBe('https://dga.gov.sa');
  });

  // --- backward compatibility ---
  it('still supports brand + description + ungrouped links (backward compatible)', () => {
    fixture.componentRef.setInput('brandMark', 'DGA');
    fixture.componentRef.setInput('brandName', 'Design System');
    fixture.componentRef.setInput('description', 'Designed for clarity.');
    fixture.componentRef.setInput('links', [{ label: 'Back to top ↑', href: '#top' }] as DgaFooterLink[]);
    fixture.detectChanges();
    expect(q(fixture, '.ddga-footer__brand-mark')?.textContent).toContain('DGA');
    expect(q(fixture, '.ddga-footer__brand-name')?.textContent).toContain('Design System');
    expect(q(fixture, '.ddga-footer__description')?.textContent).toContain('Designed for clarity.');
    expect((q(fixture, '.ddga-footer__legal-links a') as HTMLAnchorElement).getAttribute('href')).toBe('#top');
  });

  it('renders no nav when there are no groups or social links', () => {
    fixture.componentRef.setInput('copyright', 'x');
    fixture.detectChanges();
    expect(q(fixture, 'nav.ddga-footer__nav')).toBeNull();
  });

  it('exposes stable empty defaults', () => {
    const c = fixture.componentInstance;
    expect(c.variant).toBe('light');
    expect(c.linkGroups).toEqual([]);
    expect(c.socialLinks).toEqual([]);
    expect(c.logos).toEqual([]);
  });
});
