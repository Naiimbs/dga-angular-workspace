import { AfterContentInit, ChangeDetectorRef, Component, ContentChild, ContentChildren, EventEmitter, HostBinding, Input, OnChanges, Output, QueryList, SimpleChanges, inject } from '@angular/core';
import { DgaIcon } from './dga-icon';
import type { DgaIconName } from './dga-icon';

@Component({
  selector: 'dga-icon-button',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <button
      class="icon-button"
      [type]="type"
      [disabled]="disabled"
      [attr.aria-label]="label"
      [attr.title]="label"
      [class.icon-button--xs]="size === 'xs'"
      [class.icon-button--sm]="size === 'sm'"
      [class.icon-button--lg]="size === 'lg'"
      [class.icon-button--primary]="variant === 'primary'"
      [class.icon-button--secondary]="variant === 'secondary'"
      [class.icon-button--ghost]="variant === 'ghost'"
      [class.icon-button--destructive]="variant === 'destructive'"
      [class.icon-button--on-color]="onColor"
      (click)="clicked.emit($event)"
    >
      <dga-icon [name]="icon" />
    </button>
  `,
  styles: [`
    :host { display: inline-block; }
    .icon-button {
      display: inline-grid; place-items: center; inline-size: 2.5rem; block-size: 2.5rem;
      border: 1px solid var(--ddga-color-border); border-radius: var(--ddga-radius-md);
      color: var(--ddga-color-foreground); background: var(--ddga-color-card); font: inherit; cursor: pointer;
      transition: background-color 150ms, border-color 150ms, color 150ms, opacity 150ms;
    }
    .icon-button--sm { inline-size: 2rem; block-size: 2rem; }
    .icon-button--xs { inline-size: 1.5rem; block-size: 1.5rem; }
    .icon-button--lg { inline-size: 2.5rem; block-size: 2.5rem; }
    .icon-button:hover:not(:disabled) { background: var(--ddga-color-muted); }
    .icon-button:active:not(:disabled) { background: var(--ddga-color-secondary-hover); }
    .icon-button--primary { border-color: var(--ddga-color-primary); background: var(--ddga-color-primary); color: var(--ddga-color-primary-foreground); }
    .icon-button--primary:hover:not(:disabled) { background: var(--ddga-color-primary-hover); }
    .icon-button--primary:active:not(:disabled) { background: var(--ddga-color-primary-active); }
    .icon-button--secondary { border-color: transparent; background: var(--ddga-color-secondary); color: var(--ddga-color-secondary-foreground); }
    .icon-button--ghost { border-color: transparent; background: transparent; }
    .icon-button--destructive { border-color: var(--ddga-color-destructive); background: var(--ddga-color-destructive); color: var(--ddga-color-destructive-foreground); }
    .icon-button--destructive:hover:not(:disabled) { background: var(--ddga-color-destructive-hover); }
    .icon-button--destructive:active:not(:disabled) { background: var(--ddga-error-900); }
    .icon-button:focus-visible { box-shadow: inset 0 0 0 2px var(--ddga-color-background), inset 0 0 0 4px var(--ddga-color-focus-ring); outline: none; }
    .icon-button:disabled { border-color: transparent; background: var(--ddga-gray-200); color: var(--ddga-gray-400); cursor: not-allowed; }
    .icon-button--on-color { background: var(--ddga-alpha-white-20); color: white; }
    @media (prefers-reduced-motion: reduce) { .icon-button { transition: none; } }
  `],
})
export class DgaIconButton {
  @Input() icon: DgaIconName = 'more-horizontal';
  @Input({ required: true }) label = '';
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'md';
  @Input() variant: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' = 'default';
  @Input() disabled = false;
  @Input() onColor = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Output() readonly clicked = new EventEmitter<MouseEvent>();
}

@Component({
  selector: 'dga-avatar-image',
  standalone: true,
  template: `<img [src]="src" [alt]="alt" [hidden]="!imageLoaded"
    (load)="setImageState(true)" (error)="setImageState(false)" />`,
  styles: [`
    :host { position: absolute; inset: 0; }
    img { display: block; inline-size: 100%; block-size: 100%; border-radius: inherit; object-fit: cover; }
  `],
})
export class DgaAvatarImage {
  private imageSource = '';
  @Input() set src(value: string) {
    this.imageSource = value;
    this.setImageState(false);
  }
  get src(): string { return this.imageSource; }
  @Input() alt = '';
  @Output() readonly imageStateChange = new EventEmitter<boolean>();
  protected imageLoaded = false;

  protected setImageState(loaded: boolean): void {
    this.imageLoaded = loaded;
    this.imageStateChange.emit(loaded);
  }
}

@Component({
  selector: 'dga-avatar-fallback',
  standalone: true,
  template: `<span class="avatar__fallback"
    [class]="'avatar__fallback avatar__fallback--' + colorScheme"
    [hidden]="imageLoaded"><ng-content></ng-content></span>`,
  styles: [`
    :host { position: absolute; inset: 0; }
    .avatar__fallback { display: flex; align-items: center; justify-content: center; inline-size: 100%; block-size: 100%; border-radius: inherit; text-transform: uppercase; }
    .avatar__fallback--default { background: var(--ddga-gray-100); color: var(--ddga-gray-700); }
    .avatar__fallback--primary { background: var(--ddga-sa-100); color: var(--ddga-sa-800); }
    .avatar__fallback--secondary { background: var(--ddga-gray-200); color: var(--ddga-gray-800); }
    .avatar__fallback--success { background: var(--ddga-success-100); color: var(--ddga-success-700); }
    .avatar__fallback--warning { background: var(--ddga-warning-100); color: var(--ddga-warning-700); }
    .avatar__fallback--destructive { background: var(--ddga-error-100); color: var(--ddga-error-700); }
    .avatar__fallback--info { background: var(--ddga-info-100); color: var(--ddga-info-700); }
  `],
})
export class DgaAvatarFallback {
  private readonly changeDetector = inject(ChangeDetectorRef);
  @Input() colorScheme: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' = 'default';
  private loaded = false;
  get imageLoaded(): boolean { return this.loaded; }

  setImageLoaded(loaded: boolean): void {
    this.loaded = loaded;
    this.changeDetector.markForCheck();
  }
}

@Component({
  selector: 'dga-avatar',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <span class="avatar"
      [class]="'avatar avatar--' + resolvedSize + ' avatar--' + resolvedShape + ' avatar__fallback--' + colorScheme"
      [attr.role]="src && !imageFailed || !alt ? null : 'img'" [attr.aria-label]="src && !imageFailed || !alt ? null : alt">
      @if (hasComposition) {
        <ng-content select="dga-avatar-image" />
        <ng-content select="dga-avatar-fallback" />
      } @else {
        @if (src && !imageFailed) {
          <img [src]="src" [alt]="alt" (error)="onImageError()" />
        } @else {
          <span class="avatar__fallback" aria-hidden="true">
            @if (icon) { <dga-icon [name]="icon" /> } @else { {{ initials }} }
          </span>
        }
      }
      @if (status) {
        <span class="avatar__status" [class]="'avatar__status avatar__status--' + status"
          role="img" [attr.aria-label]="statusLabel || status"></span>
      }
    </span>
  `,
  styles: [`
    :host { display: inline-block; }
    :host([hidden]) { display: none !important; }
    .avatar {
      --ddga-avatar-size: 40px;
      position: relative; display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center;
      inline-size: var(--ddga-avatar-size); block-size: var(--ddga-avatar-size); overflow: visible;
      border-radius: var(--ddga-radius-full); background: var(--ddga-color-muted);
      color: var(--ddga-gray-700); font-size: var(--ddga-font-size-sm); font-weight: var(--ddga-font-weight-semibold);
      line-height: 1; box-shadow: 0 0 0 2px var(--ddga-color-background);
    }
    .avatar--xs { --ddga-avatar-size: 24px; font-size: var(--ddga-font-size-2xs); font-weight: var(--ddga-font-weight-bold); }
    .avatar--sm { --ddga-avatar-size: 32px; font-size: var(--ddga-font-size-xs); }
    .avatar--md { --ddga-avatar-size: 40px; }
    .avatar--lg { --ddga-avatar-size: 48px; font-size: var(--ddga-font-size-base); font-weight: var(--ddga-font-weight-medium); }
    .avatar--xl { --ddga-avatar-size: 64px; font-size: var(--ddga-font-size-xl); font-weight: var(--ddga-font-weight-medium); }
    .avatar--2xl { --ddga-avatar-size: 80px; font-size: var(--ddga-font-size-display-sm); font-weight: var(--ddga-font-weight-regular); }
    .avatar--3xl { --ddga-avatar-size: 120px; font-size: var(--ddga-font-size-display-md); font-weight: var(--ddga-font-weight-regular); box-shadow: 0 0 0 4px var(--ddga-color-background); }
    .avatar--square { border-radius: var(--ddga-radius-sm); }
    .avatar--square.avatar--3xl { border-radius: var(--ddga-radius-md); }
    .avatar img, .avatar__fallback { inline-size: 100%; block-size: 100%; border-radius: inherit; }
    .avatar img { object-fit: cover; }
    .avatar__fallback { display: flex; align-items: center; justify-content: center; text-transform: uppercase; }
    .avatar__fallback--default { background: var(--ddga-gray-100); color: var(--ddga-gray-700); }
    .avatar__fallback--primary { background: var(--ddga-sa-100); color: var(--ddga-sa-800); }
    .avatar__fallback--secondary { background: var(--ddga-gray-200); color: var(--ddga-gray-800); }
    .avatar__fallback--success { background: var(--ddga-success-100); color: var(--ddga-success-700); }
    .avatar__fallback--warning { background: var(--ddga-warning-100); color: var(--ddga-warning-700); }
    .avatar__fallback--destructive { background: var(--ddga-error-100); color: var(--ddga-error-700); }
    .avatar__fallback--info { background: var(--ddga-info-100); color: var(--ddga-info-700); }
    .avatar__status { position: absolute; inset-block-end: 0; inset-inline-end: 0; inline-size: calc(var(--ddga-avatar-size) * .25); block-size: calc(var(--ddga-avatar-size) * .25); min-inline-size: .5rem; min-block-size: .5rem; border-radius: var(--ddga-radius-full); box-shadow: 0 0 0 2px var(--ddga-color-background); }
    .avatar__status--online { background: var(--ddga-color-success); }
    .avatar__status--busy { background: var(--ddga-color-destructive); }
    .avatar__status--away { background: var(--ddga-color-warning); }
    .avatar__status--offline { background: var(--ddga-gray-400); }
    .avatar--square .avatar__status { inset-block-end: 2px; inset-inline-end: 2px; }
  `],
})
export class DgaAvatar implements AfterContentInit {
  @ContentChild(DgaAvatarImage) private composedImage?: DgaAvatarImage;
  @ContentChild(DgaAvatarFallback) private composedFallback?: DgaAvatarFallback;
  private imageStateSubscription?: { unsubscribe(): void };

  @Input() initials = 'DG';
  private imageSource = '';
  @Input() set src(value: string) {
    this.imageSource = value;
    this.imageFailed = false;
  }
  get src(): string { return this.imageSource; }
  @Input() alt = '';
  @Input() size: DgaAvatarSize | undefined;
  @Input() shape: 'circle' | 'square' | undefined;
  @Input() colorScheme: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'info' = 'default';
  @Input() status: 'online' | 'offline' | 'busy' | 'away' | '' = '';
  @Input() statusLabel = '';
  @Input() icon: DgaIconName | '' = '';
  protected imageFailed = false;
  protected imageLoaded = false;
  groupSize: DgaAvatarSize | undefined;
  groupShape: 'circle' | 'square' | undefined;
  groupHidden = false;

  @HostBinding('attr.hidden')
  protected get hiddenAttribute(): '' | null { return this.groupHidden ? '' : null; }

  @HostBinding('attr.data-avatar')
  protected readonly avatarAttribute = '';

  @HostBinding('style.--ddga-avatar-size')
  protected get groupSizeStyle(): string {
    const sizes: Record<DgaAvatarSize, string> = {
      xs: '24px', sm: '32px', md: '40px', lg: '48px', xl: '64px', '2xl': '80px', '3xl': '120px',
    };
    return sizes[this.resolvedSize];
  }

  get resolvedSize(): DgaAvatarSize { return this.size ?? this.groupSize ?? 'md'; }
  get resolvedShape(): 'circle' | 'square' { return this.shape ?? this.groupShape ?? 'circle'; }
  get hasComposition(): boolean { return Boolean(this.composedImage || this.composedFallback); }

  ngAfterContentInit(): void {
    if (this.composedImage) {
      this.imageStateSubscription = this.composedImage.imageStateChange.subscribe((loaded) => {
        this.imageLoaded = loaded;
        this.composedFallback?.setImageLoaded(loaded);
      });
    }
  }

  protected onImageError(): void { this.imageFailed = true; }

  ngOnDestroy(): void { this.imageStateSubscription?.unsubscribe(); }
}

export type DgaAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';

@Component({
  selector: 'dga-avatar-group',
  standalone: true,
  imports: [DgaAvatar],
  template: `
    <div class="avatar-group" role="group" [attr.aria-label]="label">
      <ng-content></ng-content>
      @if (overflowCount > 0) {
        <dga-avatar [size]="size" [shape]="shape" [initials]="'+' + overflowCount"
          [alt]="overflowLabel(overflowCount)" />
      }
    </div>
  `,
  styles: [`
    :host { display: inline-flex; }
    .avatar-group { display: inline-flex; align-items: center; }
    :host ::ng-deep .avatar-group > dga-avatar { margin-inline-start: calc(var(--ddga-avatar-size, 40px) * -.25); }
    :host ::ng-deep .avatar-group > dga-avatar:first-child { margin-inline-start: 0; }
  `],
})
export class DgaAvatarGroup implements AfterContentInit, OnChanges {
  @Input() max: number | undefined;
  @Input() size: DgaAvatarSize = 'md';
  @Input() shape: 'circle' | 'square' = 'circle';
  @Input() label = 'Avatar group';
  @Input() overflowLabel: (count: number) => string = (count) => `${count} more`;
  @ContentChildren(DgaAvatar) private avatars!: QueryList<DgaAvatar>;
  protected overflowCount = 0;

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.avatars) this.updateAvatars();
  }

  ngAfterContentInit(): void {
    this.updateAvatars();
    this.avatars.changes.subscribe(() => this.updateAvatars());
  }

  private updateAvatars(): void {
    const items = this.avatars.toArray();
    const max = this.max === undefined ? items.length : Math.max(0, this.max);
    this.overflowCount = Math.max(0, items.length - max);
    items.forEach((avatar, index) => {
      avatar.groupSize = this.size;
      avatar.groupShape = this.shape;
      avatar.groupHidden = this.max !== undefined && index >= max;
    });
  }
}

@Component({
  selector: 'dga-divider',
  standalone: true,
  template: `
    <div class="divider"
      [class.divider--vertical]="orientation === 'vertical'"
      [class.divider--dashed]="variant === 'dashed'"
      [class.divider--primary]="tone === 'primary'"
      [class.divider--white]="tone === 'white'"
      [class.divider--alpha-white]="tone === 'alpha-white'"
      [attr.role]="decorative ? 'none' : 'separator'"
      [attr.aria-orientation]="decorative ? null : orientation">
      @if (label && orientation === 'horizontal') {
        <span class="divider__line"></span>
        <span class="divider__label">{{ label }}</span>
        <span class="divider__line"></span>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .divider { display: flex; align-items: center; gap: var(--ddga-space-3); border-block-start: 1px solid var(--ddga-color-border); }
    .divider__line { flex: 1; border-block-start: inherit; }
    .divider__label { color: var(--ddga-color-muted-foreground); font-size: var(--ddga-font-size-sm); }
    .divider--dashed, .divider--dashed .divider__line { border-block-start-style: dashed; }
    .divider--primary, .divider--primary .divider__line { border-block-start-color: var(--ddga-color-primary); }
    .divider--white, .divider--white .divider__line { border-block-start-color: white; }
    .divider--alpha-white, .divider--alpha-white .divider__line { border-block-start-color: var(--ddga-alpha-white-30); }
    .divider--vertical { align-self: stretch; inline-size: 1px; border-block-start: 0; border-inline-start: 1px solid var(--ddga-color-border); }
    .divider--vertical.divider--dashed { border-inline-start-style: dashed; }
    .divider--vertical.divider--primary { border-inline-start-color: var(--ddga-color-primary); }
    .divider--vertical.divider--white { border-inline-start-color: white; }
    .divider--vertical.divider--alpha-white { border-inline-start-color: var(--ddga-alpha-white-30); }
  `],
})
export class DgaDivider {
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';
  @Input() variant: 'solid' | 'dashed' = 'solid';
  @Input() tone: 'neutral' | 'primary' | 'white' | 'alpha-white' = 'neutral';
  @Input() label = '';
  @Input() decorative = false;
}

@Component({
  selector: 'dga-spinner',
  standalone: true,
  template: `
    <svg class="spinner" [class]="'spinner spinner--' + size + ' spinner--' + tone"
      viewBox="0 0 24 24" role="status" [attr.aria-label]="label" focusable="false">
      <circle class="spinner__track" cx="12" cy="12" r="9" fill="none" stroke-width="3" />
      <circle class="spinner__arc" cx="12" cy="12" r="9" fill="none" stroke-width="3" stroke-linecap="round" />
      <title>{{ label }}</title>
    </svg>
  `,
  styles: [`
    :host { display: inline-flex; flex: 0 0 auto; }
    .spinner {
      inline-size: 1.5rem; block-size: 1.5rem; color: var(--ddga-color-primary);
      animation: dga-spin 600ms linear infinite;
    }
    .spinner--sm { inline-size: 1rem; block-size: 1rem; }
    .spinner--lg { inline-size: 2rem; block-size: 2rem; }
    .spinner--xl { inline-size: 2.5rem; block-size: 2.5rem; }
    .spinner--neutral { color: var(--ddga-text-primary); }
    .spinner--on-color { color: white; }
    .spinner__track { stroke: color-mix(in srgb, currentColor 12%, transparent); }
    .spinner__arc { stroke: currentColor; stroke-dasharray: 40 60; transform-origin: center; }
    @keyframes dga-spin { to { transform: rotate(1turn); } }
    @media (prefers-reduced-motion: reduce) { .spinner { animation-duration: 1.5s; } }
  `],
})
export class DgaSpinner {
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() tone: 'neutral' | 'primary' | 'on-color' = 'primary';
  @Input() label = 'Loading';
}

@Component({
  selector: 'dga-skeleton',
  standalone: true,
  template: `<span class="skeleton" [class.skeleton--none]="animation === 'none'"
    [style.inline-size]="width" [style.block-size]="height" aria-hidden="true"></span>`,
  styles: [`
    :host { display: block; }
    .skeleton { display: block; max-inline-size: 100%; border-radius: var(--ddga-radius-sm); background: linear-gradient(90deg, var(--ddga-gray-100), var(--ddga-gray-50), var(--ddga-gray-100)); background-size: 200% 100%; animation: dga-skeleton-shimmer 1.6s ease-in-out infinite alternate; }
    .skeleton--none { animation: none; }
    @keyframes dga-skeleton-shimmer { from { background-position: 0 0; } to { background-position: 100% 0; } }
    [dir='rtl'] .skeleton { animation-name: dga-skeleton-shimmer-rtl; }
    @keyframes dga-skeleton-shimmer-rtl { from { background-position: 100% 0; } to { background-position: 0 0; } }
    @media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
  `],
})
export class DgaSkeleton {
  @Input() width = '100%';
  @Input() height = '1rem';
  @Input() animation: 'shimmer' | 'none' = 'shimmer';
}
