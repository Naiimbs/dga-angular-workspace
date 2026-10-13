import { Component, ElementRef, EventEmitter, Input, Output, inject, signal } from '@angular/core';

/** A call-to-action rendered on a hero slide. Renders as an `<a>` when `href`
 *  is set, otherwise as a `<button>` that emits `actionClick`. */
export interface DgaHeroAction {
  label: string;
  href?: string;
  ariaLabel?: string;
}

/** A single hero slide. */
export interface DgaHeroSlide {
  /** Slide heading. */
  title: string;
  /** Supporting paragraph. */
  description?: string;
  /** Optional line shown above the title (e.g. a localized subtitle). */
  subtitle?: string;
  subtitleLang?: string;
  subtitleDir?: string;
  /** Full-bleed background image URL. */
  imageSrc?: string;
  /** Alt text for the background image (empty = decorative). */
  imageAlt?: string;
  /** Primary call to action. */
  action?: DgaHeroAction;
}

/**
 * Hero carousel. Full-bleed image slides with a dark overlay, white heading /
 * description, a primary on-color CTA, and dot navigation. RTL-aware and
 * reduced-motion aware. Matches the DGA "Hero Section" template.
 *
 * API evolution (from the initial static hero): content is now a typed
 * `slides` model. The `title` / `description` / `subtitle` / `primaryAction`
 * inputs are kept as a convenience single-slide fallback for backward
 * compatibility.
 */
@Component({
  selector: 'dga-hero',
  standalone: true,
  host: { 'class': 'ddga-hero-host' },
  template: `
    <section class="ddga-hero" role="region" aria-roledescription="carousel"
      [attr.aria-label]="ariaLabel" (keydown)="onKeydown($event)">
      <div class="ddga-hero__viewport">
        @for (slide of resolvedSlides; track $index; let i = $index) {
          <div class="ddga-hero__slide" role="group" [attr.data-active]="i === active()"
            [attr.aria-roledescription]="'slide'" [attr.aria-label]="(i + 1) + ' of ' + resolvedSlides.length"
            [attr.aria-hidden]="i === active() ? null : 'true'" [attr.inert]="i === active() ? null : ''">
            @if (slide.imageSrc) {
              <img class="ddga-hero__image" [src]="slide.imageSrc" [alt]="slide.imageAlt || ''" />
            }
            <div class="ddga-hero__overlay" aria-hidden="true"></div>
            <div class="ddga-hero__content">
              @if (slide.subtitle) {
                <p class="ddga-hero__subtitle" [attr.lang]="slide.subtitleLang || null" [attr.dir]="slide.subtitleDir || null">{{ slide.subtitle }}</p>
              }
              <h2 class="ddga-hero__title">{{ slide.title }}</h2>
              @if (slide.description) { <p class="ddga-hero__description">{{ slide.description }}</p> }
              @if (slide.action) {
                @if (slide.action.href) {
                  <a class="ddga-hero__cta" [href]="slide.action.href" [attr.aria-label]="slide.action.ariaLabel || null">{{ slide.action.label }}</a>
                } @else {
                  <button class="ddga-hero__cta" type="button" [attr.aria-label]="slide.action.ariaLabel || null" (click)="actionClick.emit(slide)">{{ slide.action.label }}</button>
                }
              }
            </div>
          </div>
        }
      </div>

      @if (resolvedSlides.length > 1) {
        <div class="ddga-hero__dots" role="tablist" [attr.aria-label]="ariaLabel + ' slides'">
          @for (slide of resolvedSlides; track $index; let i = $index) {
            <button class="ddga-hero__dot" type="button" [attr.data-active]="i === active()"
              [attr.aria-label]="'Go to slide ' + (i + 1)" [attr.aria-current]="i === active() ? 'true' : null"
              (click)="goTo(i)"></button>
          }
        </div>
      }

      <div class="ddga-sr-only" role="status" aria-live="polite">{{ liveText }}</div>
    </section>
  `,
  styles: [`
    :host { display: block; }
    .ddga-hero { position: relative; }
    .ddga-hero__viewport { display: grid; min-block-size: var(--ddga-hero-min-height, 491px); }
    .ddga-hero__slide {
      grid-area: 1 / 1; position: relative; isolation: isolate; overflow: clip;
      display: flex; flex-direction: column; justify-content: flex-end; gap: var(--ddga-space-6);
      padding-block: var(--ddga-space-10) var(--ddga-space-8); padding-inline: clamp(1.25rem, 6vw, 6rem);
      color: #fff; opacity: 0; visibility: hidden; transition: opacity 400ms ease;
    }
    .ddga-hero__slide[data-active='true'] { opacity: 1; visibility: visible; z-index: 1; }
    .ddga-hero__image { position: absolute; inset: 0; z-index: -2; inline-size: 100%; block-size: 100%; object-fit: cover; object-position: center 64%; }
    .ddga-hero__overlay { position: absolute; inset: 0; z-index: -1; background: var(--ddga-sa-950); opacity: .9; }
    .ddga-hero__content { display: grid; gap: var(--ddga-space-6); max-inline-size: 39rem; }
    .ddga-hero__subtitle { margin: 0; font-family: var(--ddga-font-ar); font-size: var(--ddga-font-size-lg); opacity: .92; }
    .ddga-hero__title { margin: 0; font-size: clamp(2.25rem, 4.5vw, 3.5rem); font-weight: var(--ddga-font-weight-semibold); line-height: 1.1; letter-spacing: -.02em; overflow-wrap: anywhere; }
    [dir='rtl'] .ddga-hero__title { letter-spacing: normal; }
    .ddga-hero__description { margin: 0; max-inline-size: 34rem; font-size: var(--ddga-font-size-xl); line-height: 1.6; }
    .ddga-hero__cta {
      justify-self: start; display: inline-flex; align-items: center; gap: var(--ddga-space-2);
      padding: var(--ddga-space-3) var(--ddga-space-6); border: 0; border-radius: var(--ddga-radius-md);
      background: #fff; color: var(--ddga-sa-800); font: inherit; font-size: var(--ddga-font-size-base);
      font-weight: var(--ddga-font-weight-semibold); text-decoration: none; cursor: pointer;
    }
    .ddga-hero__cta:hover { background: var(--ddga-sa-100); }
    .ddga-hero__cta:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    .ddga-hero__dots { position: absolute; inset-block-end: var(--ddga-space-6); inset-inline: 0; z-index: 2; display: flex; justify-content: center; gap: var(--ddga-space-2); }
    .ddga-hero__dot { inline-size: .6rem; block-size: .6rem; padding: 0; border: 0; border-radius: var(--ddga-radius-full); background: rgb(255 255 255 / .5); cursor: pointer; transition: background-color 150ms, inline-size 150ms; }
    .ddga-hero__dot[data-active='true'] { inline-size: 1.4rem; border-radius: var(--ddga-radius-full); background: var(--ddga-color-primary); }
    .ddga-hero__dot:focus-visible { outline: 2px solid #fff; outline-offset: 2px; }
    .ddga-sr-only { position: absolute; inline-size: 1px; block-size: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
    @media (prefers-reduced-motion: reduce) {
      .ddga-hero__slide { transition: none; }
      .ddga-hero__dot { transition: none; }
    }
    @media (forced-colors: active) {
      .ddga-hero__overlay { opacity: 1; background: Canvas; }
      .ddga-hero__slide { color: CanvasText; }
      .ddga-hero__cta { border: 1px solid ButtonText; }
      .ddga-hero__dot[data-active='true'] { background: Highlight; }
    }
  `],
})
export class DgaHero {
  private host = inject(ElementRef<HTMLElement>);

  /** Slides to render. When empty, a single slide is synthesized from the
   *  backward-compatible `title`/`description`/`subtitle`/`primaryAction` inputs. */
  @Input() slides: readonly DgaHeroSlide[] = [];
  /** Accessible label for the carousel region. */
  @Input() ariaLabel = 'Hero';
  /** Index of the slide shown first. */
  @Input() startIndex = 0;

  // --- backward-compatible single-slide inputs ---
  @Input() title = '';
  @Input() description = '';
  @Input() subtitle = '';
  @Input() subtitleLang = '';
  @Input() subtitleDir = '';
  @Input() primaryAction?: DgaHeroAction;

  /** Emits the slide whose CTA (button mode, no href) was activated. */
  @Output() readonly actionClick = new EventEmitter<DgaHeroSlide>();
  /** Emits the newly active slide index. */
  @Output() readonly slideChange = new EventEmitter<number>();

  private readonly activeIndex = signal(0);
  protected active = this.activeIndex.asReadonly();
  private initialized = false;

  ngOnChanges(): void {
    if (!this.initialized) {
      const max = Math.max(0, this.resolvedSlides.length - 1);
      this.activeIndex.set(Math.min(Math.max(this.startIndex, 0), max));
      this.initialized = true;
    }
  }

  protected get resolvedSlides(): readonly DgaHeroSlide[] {
    if (this.slides.length) return this.slides;
    if (this.title) {
      return [{
        title: this.title,
        description: this.description || undefined,
        subtitle: this.subtitle || undefined,
        subtitleLang: this.subtitleLang || undefined,
        subtitleDir: this.subtitleDir || undefined,
        action: this.primaryAction,
      }];
    }
    return [];
  }

  protected get liveText(): string {
    const slides = this.resolvedSlides;
    const s = slides[this.activeIndex()];
    return s ? `Slide ${this.activeIndex() + 1} of ${slides.length}: ${s.title}` : '';
  }

  protected goTo(index: number): void {
    const count = this.resolvedSlides.length;
    if (!count) return;
    const next = ((index % count) + count) % count;
    if (next === this.activeIndex()) return;
    this.activeIndex.set(next);
    this.slideChange.emit(next);
  }

  protected next(): void { this.goTo(this.activeIndex() + 1); }
  protected prev(): void { this.goTo(this.activeIndex() - 1); }

  private isRtl(): boolean {
    const el = this.host.nativeElement as HTMLElement;
    const dir = el.closest('[dir]')?.getAttribute('dir') || getComputedStyle(el).direction;
    return dir === 'rtl';
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.resolvedSlides.length < 2) return;
    const rtl = this.isRtl();
    switch (event.key) {
      case 'ArrowRight': event.preventDefault(); rtl ? this.prev() : this.next(); break;
      case 'ArrowLeft': event.preventDefault(); rtl ? this.next() : this.prev(); break;
      case 'Home': event.preventDefault(); this.goTo(0); break;
      case 'End': event.preventDefault(); this.goTo(this.resolvedSlides.length - 1); break;
    }
  }
}
