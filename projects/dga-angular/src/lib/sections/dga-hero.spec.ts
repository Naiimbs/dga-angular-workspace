import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DgaHero, DgaHeroSlide } from './dga-hero';

function q(f: ComponentFixture<DgaHero>, sel: string): HTMLElement | null {
  return f.nativeElement.querySelector(sel) as HTMLElement | null;
}
function qa(f: ComponentFixture<DgaHero>, sel: string): HTMLElement[] {
  return Array.from(f.nativeElement.querySelectorAll(sel)) as HTMLElement[];
}

const SLIDES: DgaHeroSlide[] = [
  { title: 'One', description: 'First slide', imageSrc: '/a.jpg', imageAlt: 'A', action: { label: 'Go', href: '#one' } },
  { title: 'Two', description: 'Second slide', imageSrc: '/b.jpg' },
  { title: 'Three', action: { label: 'Act' } }, // button-mode CTA (no href)
];

describe('DgaHero (carousel)', () => {
  let fixture: ComponentFixture<DgaHero>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DgaHero] }).compileComponents();
    fixture = TestBed.createComponent(DgaHero);
  });

  function withSlides(slides: DgaHeroSlide[] = SLIDES) {
    fixture.componentRef.setInput('slides', slides);
    fixture.detectChanges();
  }

  // --- carousel semantics ---
  it('exposes carousel region semantics', () => {
    withSlides();
    const region = q(fixture, '.ddga-hero')!;
    expect(region.getAttribute('role')).toBe('region');
    expect(region.getAttribute('aria-roledescription')).toBe('carousel');
    fixture.componentRef.setInput('ariaLabel', 'Highlights');
    fixture.detectChanges();
    expect(region.getAttribute('aria-label')).toBe('Highlights');
  });

  it('renders each slide as a labeled group with "N of M"', () => {
    withSlides();
    const slides = qa(fixture, '.ddga-hero__slide');
    expect(slides.length).toBe(3);
    expect(slides[0].getAttribute('role')).toBe('group');
    expect(slides[0].getAttribute('aria-label')).toBe('1 of 3');
    expect(slides[2].getAttribute('aria-label')).toBe('3 of 3');
  });

  it('renders slide content: title (h2), description, image with alt, and CTA link', () => {
    withSlides();
    const first = qa(fixture, '.ddga-hero__slide')[0];
    expect(first.querySelector('h2.ddga-hero__title')?.textContent).toContain('One');
    expect(first.querySelector('.ddga-hero__description')?.textContent).toContain('First slide');
    const img = first.querySelector('img.ddga-hero__image') as HTMLImageElement;
    expect(img.getAttribute('src')).toBe('/a.jpg');
    expect(img.getAttribute('alt')).toBe('A');
    const cta = first.querySelector('.ddga-hero__cta') as HTMLAnchorElement;
    expect(cta.tagName).toBe('A');
    expect(cta.getAttribute('href')).toBe('#one');
  });

  // --- active state / inert ---
  it('marks only the active slide active and makes inactive slides inert + aria-hidden', () => {
    withSlides();
    const slides = qa(fixture, '.ddga-hero__slide');
    expect(slides[0].getAttribute('data-active')).toBe('true');
    expect(slides[1].getAttribute('data-active')).toBe('false');
    expect(slides[1].hasAttribute('inert')).toBe(true);
    expect(slides[1].getAttribute('aria-hidden')).toBe('true');
    expect(slides[0].hasAttribute('inert')).toBe(false);
  });

  // --- dots ---
  it('renders a dot per slide with aria-current on the active one and navigates on click', () => {
    withSlides();
    const dots = qa(fixture, '.ddga-hero__dot');
    expect(dots.length).toBe(3);
    expect(dots[0].getAttribute('aria-current')).toBe('true');
    expect(dots[0].getAttribute('aria-label')).toBe('Go to slide 1');

    let changed = -1;
    fixture.componentInstance.slideChange.subscribe((i) => (changed = i));
    (dots[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(changed).toBe(2);
    expect(qa(fixture, '.ddga-hero__slide')[2].getAttribute('data-active')).toBe('true');
    expect(qa(fixture, '.ddga-hero__dot')[2].getAttribute('aria-current')).toBe('true');
  });

  it('does not render dots for a single slide', () => {
    withSlides([{ title: 'Only' }]);
    expect(q(fixture, '.ddga-hero__dots')).toBeNull();
  });

  // --- keyboard (LTR) ---
  it('navigates with Arrow/Home/End keys (LTR)', () => {
    withSlides();
    const region = q(fixture, '.ddga-hero')!;
    const press = (key: string) => region.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    press('ArrowRight'); fixture.detectChanges();
    expect(qa(fixture, '.ddga-hero__slide')[1].getAttribute('data-active')).toBe('true');
    press('ArrowLeft'); fixture.detectChanges();
    expect(qa(fixture, '.ddga-hero__slide')[0].getAttribute('data-active')).toBe('true');
    press('End'); fixture.detectChanges();
    expect(qa(fixture, '.ddga-hero__slide')[2].getAttribute('data-active')).toBe('true');
    press('Home'); fixture.detectChanges();
    expect(qa(fixture, '.ddga-hero__slide')[0].getAttribute('data-active')).toBe('true');
  });

  // --- keyboard (RTL) reversed ---
  it('reverses Arrow direction in RTL', () => {
    fixture.nativeElement.setAttribute('dir', 'rtl');
    withSlides();
    const region = q(fixture, '.ddga-hero')!;
    region.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    // In RTL, ArrowLeft advances to the next slide
    expect(qa(fixture, '.ddga-hero__slide')[1].getAttribute('data-active')).toBe('true');
  });

  // --- live region ---
  it('updates the sr-only status live region on slide change', () => {
    withSlides();
    const live = q(fixture, '.ddga-sr-only')!;
    expect(live.getAttribute('role')).toBe('status');
    expect(live.textContent).toContain('Slide 1 of 3: One');
    (qa(fixture, '.ddga-hero__dot')[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(live.textContent).toContain('Slide 2 of 3: Two');
  });

  // --- CTA button mode ---
  it('renders a button CTA (no href) that emits actionClick', () => {
    withSlides();
    (qa(fixture, '.ddga-hero__dot')[2] as HTMLButtonElement).click();
    fixture.detectChanges();
    const cta = qa(fixture, '.ddga-hero__slide')[2].querySelector('button.ddga-hero__cta') as HTMLButtonElement;
    expect(cta).toBeTruthy();
    let emitted: DgaHeroSlide | undefined;
    fixture.componentInstance.actionClick.subscribe((s) => (emitted = s));
    cta.click();
    expect(emitted?.title).toBe('Three');
  });

  // --- optional content ---
  it('omits image, description and CTA when a slide does not provide them', () => {
    withSlides([{ title: 'Bare' }]);
    const slide = q(fixture, '.ddga-hero__slide')!;
    expect(slide.querySelector('img')).toBeNull();
    expect(slide.querySelector('.ddga-hero__description')).toBeNull();
    expect(slide.querySelector('.ddga-hero__cta')).toBeNull();
    expect(slide.querySelector('h2.ddga-hero__title')?.textContent).toContain('Bare');
  });

  // --- backward compatibility (single-slide inputs) ---
  it('synthesizes a single slide from title/description/primaryAction (backward compatible)', () => {
    fixture.componentRef.setInput('title', 'Legacy');
    fixture.componentRef.setInput('description', 'Legacy desc');
    fixture.componentRef.setInput('primaryAction', { label: 'Legacy CTA', href: '#legacy' });
    fixture.detectChanges();
    const slides = qa(fixture, '.ddga-hero__slide');
    expect(slides.length).toBe(1);
    expect(slides[0].querySelector('h2')?.textContent).toContain('Legacy');
    expect(q(fixture, '.ddga-hero__cta')?.getAttribute('href')).toBe('#legacy');
    expect(q(fixture, '.ddga-hero__dots')).toBeNull();
  });

  it('respects startIndex', () => {
    fixture.componentRef.setInput('slides', SLIDES);
    fixture.componentRef.setInput('startIndex', 1);
    fixture.detectChanges();
    expect(qa(fixture, '.ddga-hero__slide')[1].getAttribute('data-active')).toBe('true');
  });
});
