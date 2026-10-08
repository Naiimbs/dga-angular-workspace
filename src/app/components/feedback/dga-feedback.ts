import { AfterViewChecked, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, signal, ViewChild } from '@angular/core';
import { DgaIcon } from '../foundation/dga-icon';
import type { DgaIconName } from '../foundation/dga-icon';
import { DgaPopupPortal } from '../foundation/dga-popup-portal';

export type DgaStatus = 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type DgaBadgeStatus = 'ghost' | 'subtle' | 'inverted';

@Component({
  selector: 'dga-badge',
  standalone: true,
  template: `<span class="badge"
    [class]="'badge badge--' + (tone || variant) + ' badge--' + status"
    [class.badge--sm]="size === 'sm'"
    [class.badge--lg]="size === 'lg'"><span class="badge__dot" aria-hidden="true"></span><ng-content></ng-content></span>`,
  styles: [`
    :host { display: inline-flex; }
    .badge { align-items: center; display: inline-flex; min-block-size: 1.5rem; padding-inline: var(--ddga-space-2); border-radius: var(--ddga-radius-full); font-size: var(--ddga-font-size-xs); font-weight: var(--ddga-font-weight-medium); line-height: 1.4; white-space: nowrap; }
    .badge--sm { min-block-size: 1.25rem; font-size: var(--ddga-font-size-2xs); font-weight: var(--ddga-font-weight-semibold); }
    .badge--lg { min-block-size: 2rem; padding-inline: var(--ddga-space-3); font-size: var(--ddga-font-size-base); }
    .badge__dot { inline-size: .45rem; block-size: .45rem; flex: 0 0 auto; border-radius: var(--ddga-radius-full); background: currentColor; }
    .badge--success { --badge-tone: var(--ddga-success-800); }
    .badge--warning { --badge-tone: var(--ddga-warning-800); }
    .badge--error { --badge-tone: var(--ddga-error-800); }
    .badge--info { --badge-tone: var(--ddga-info-800); }
    .badge--neutral { --badge-tone: var(--ddga-gray-800); }
    .badge { color: var(--badge-tone); }
    .badge__dot { background: var(--badge-tone); }
    .badge--success.badge--subtle { color: var(--ddga-success-800); background: var(--ddga-success-50); }
    .badge--warning.badge--subtle { color: var(--ddga-warning-800); background: var(--ddga-warning-50); }
    .badge--error.badge--subtle { color: var(--ddga-error-800); background: var(--ddga-error-50); }
    .badge--info.badge--subtle { color: var(--ddga-info-800); background: var(--ddga-info-50); }
    .badge--neutral.badge--subtle { color: var(--ddga-gray-700); background: var(--ddga-gray-100); }
    .badge--success.badge--ghost, .badge--warning.badge--ghost, .badge--error.badge--ghost,
    .badge--info.badge--ghost, .badge--neutral.badge--ghost { color: currentColor; background: transparent; }
    .badge--success.badge--inverted { color: white; background: var(--ddga-success-700); }
    .badge--warning.badge--inverted { color: white; background: var(--ddga-warning-700); }
    .badge--error.badge--inverted { color: white; background: var(--ddga-error-600); }
    .badge--info.badge--inverted { color: white; background: var(--ddga-info-600); }
    .badge--neutral.badge--inverted { color: white; background: var(--ddga-gray-600); }
    .badge--inverted .badge__dot { background: var(--ddga-alpha-white-60); }
  `],
})
export class DgaBadge {
  @Input() variant: DgaStatus = 'neutral';
  @Input() tone: DgaStatus | '' = '';
  @Input() status: DgaBadgeStatus = 'subtle';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}

export type DgaTagVariant =
  | 'default' | 'primary' | 'secondary' | 'outline' | 'destructive'
  | 'destructive-subtle' | 'success' | 'warning' | 'info'
  | 'primary-subtle' | 'secondary-subtle' | 'success-subtle'
  | 'warning-subtle' | 'info-subtle' | 'on-color';

@Component({
  selector: 'dga-tag',
  standalone: true,
  imports: [DgaIcon],
  template: `
    @if (open) {
    <span class="tag"
      [class]="'tag tag--' + variant + ' tag--' + size"
      [class.tag--squared]="shape === 'squared'"
      [class.tag--outlined]="outlined">
      <ng-content></ng-content>
      @if (removable) {
        <button class="tag__remove" type="button" [attr.aria-label]="closeLabel + ' ' + label" (click)="dismiss()"><dga-icon name="close" /></button>
      }
    </span>
    }
  `,
  styles: [`
    :host { display: inline-flex; }
    .tag { display: inline-flex; align-items: center; justify-content: center; gap: var(--ddga-space-1); min-block-size: 1.5rem; padding-inline: var(--ddga-space-2); border: 1px solid transparent; border-radius: var(--ddga-radius-full); font-size: var(--ddga-font-size-xs); font-weight: var(--ddga-font-weight-medium); line-height: 1.4; white-space: nowrap; }
    .tag--sm { min-block-size: 1.25rem; font-size: var(--ddga-font-size-2xs); font-weight: var(--ddga-font-weight-semibold); }
    .tag--lg { min-block-size: 2rem; padding-inline: var(--ddga-space-3); font-size: var(--ddga-font-size-base); }
    .tag--squared { border-radius: var(--ddga-radius-sm); }
    .tag--default { background: var(--ddga-gray-100); color: var(--ddga-gray-700); }
    .tag--primary { background: var(--ddga-color-primary); color: var(--ddga-color-primary-foreground); }
    .tag--secondary { background: var(--ddga-color-secondary); color: var(--ddga-color-secondary-foreground); }
    .tag--destructive { background: var(--ddga-color-destructive); color: var(--ddga-color-destructive-foreground); }
    .tag--success { background: var(--ddga-color-success); color: var(--ddga-color-success-foreground); }
    .tag--warning { background: var(--ddga-color-warning); color: var(--ddga-color-warning-foreground); }
    .tag--info { background: var(--ddga-color-info); color: var(--ddga-color-info-foreground); }
    .tag--primary-subtle { background: var(--ddga-sa-50); color: var(--ddga-sa-800); border-color: var(--ddga-sa-200); }
    .tag--secondary-subtle { background: var(--ddga-gray-50); color: var(--ddga-gray-800); border-color: var(--ddga-gray-200); }
    .tag--destructive-subtle { background: var(--ddga-error-50); color: var(--ddga-error-800); border-color: var(--ddga-error-200); }
    .tag--success-subtle { background: var(--ddga-success-50); color: var(--ddga-success-800); border-color: var(--ddga-success-200); }
    .tag--warning-subtle { background: var(--ddga-warning-50); color: var(--ddga-warning-800); border-color: var(--ddga-warning-200); }
    .tag--info-subtle { background: var(--ddga-info-50); color: var(--ddga-info-800); border-color: var(--ddga-info-200); }
    .tag--outline { border-color: var(--ddga-color-border); background: transparent; color: var(--ddga-color-foreground); }
    .tag--on-color { background: var(--ddga-alpha-white-20); color: white; }
    .tag--outlined { background: transparent; }
    .tag__remove { display: inline-grid; place-items: center; inline-size: 1.5em; block-size: 1.5em; margin-inline-start: .125em; margin-inline-end: -.25em; border: 0; border-radius: var(--ddga-radius-full); background: transparent; color: inherit; font: inherit; cursor: pointer; }
    .tag__remove:hover { background: color-mix(in srgb, currentColor 18%, transparent); }
    .tag__remove:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: 1px; }
  `],
})
export class DgaTag {
  @Input() label = 'tag';
  @Input() removable = false;
  @Input() variant: DgaTagVariant = 'outline';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() shape: 'pill' | 'squared' = 'pill';
  @Input() outlined = false;
  @Input() closeLabel = 'Remove';
  @Input() open = true;
  @Output() readonly openChange = new EventEmitter<boolean>();
  @Output() readonly removed = new EventEmitter<void>();

  protected dismiss(): void {
    this.removed.emit();
    this.open = false;
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'dga-alert',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <section class="alert" [class]="'alert alert--' + variant" [attr.role]="variant === 'error' ? 'alert' : 'status'">
      <span class="alert__icon" aria-hidden="true"><dga-icon [name]="icon" /></span>
      <div class="alert__body">
        @if (title) { <strong class="alert__title">{{ title }}</strong> }
        <div><ng-content></ng-content></div>
      </div>
      @if (dismissible) {
        <button class="alert__close" type="button" aria-label="Dismiss message" (click)="dismissed.emit()"><dga-icon name="close" /></button>
      }
    </section>
  `,
  styles: [`
    :host { display: block; }
    .alert { display: flex; align-items: flex-start; gap: var(--ddga-space-3); padding: var(--ddga-space-4); border: 1px solid transparent; border-radius: var(--ddga-radius-md); }
    .alert__icon { font-weight: var(--ddga-font-weight-bold); }
    .alert__body { flex: 1; min-inline-size: 0; }
    .alert__title { display: block; margin-block-end: var(--ddga-space-1); }
    .alert__close { border: 0; background: transparent; color: inherit; font-size: var(--ddga-font-size-xl); cursor: pointer; }
    .alert__close:focus-visible { outline: 2px solid currentColor; outline-offset: 2px; }
    .alert--success { color: var(--ddga-success-800); background: var(--ddga-success-50); border-color: var(--ddga-success-200); }
    .alert--warning { color: var(--ddga-warning-800); background: var(--ddga-warning-50); border-color: var(--ddga-warning-200); }
    .alert--error { color: var(--ddga-error-800); background: var(--ddga-error-50); border-color: var(--ddga-error-200); }
    .alert--info { color: var(--ddga-info-800); background: var(--ddga-info-50); border-color: var(--ddga-info-200); }
  `],
})
export class DgaAlert {
  @Input() variant: Exclude<DgaStatus, 'neutral'> = 'info';
  @Input() title = '';
  @Input() dismissible = false;
  @Output() readonly dismissed = new EventEmitter<void>();

  protected get icon(): DgaIconName {
    const icons: Record<Exclude<DgaStatus, 'neutral'>, DgaIconName> = {
      success: 'check',
      warning: 'alert-triangle',
      error: 'alert-circle',
      info: 'info',
    };
    return icons[this.variant];
  }
}

@Component({
  selector: 'dga-tooltip',
  standalone: true,
  imports: [DgaPopupPortal],
  template: `
    <span class="tooltip" [class.tooltip--open]="open">
      <span #tooltipTrigger class="tooltip__trigger" tabindex="0" [attr.aria-describedby]="tooltipId"
      (focus)="show()" (blur)="hide()" (mouseenter)="show()" (mouseleave)="onMouseLeave($event)"
        (keydown.escape)="dismiss()"><ng-content></ng-content></span>
      <span class="tooltip__content" popover="manual" dgaPopupPortal [dgaPopupPortalOpen]="open"
        [dgaPopupPortalAnchor]="tooltipTrigger" dgaPopupPortalPlacement="top-center"
        role="tooltip" [id]="tooltipId">{{ text }}</span>
    </span>
  `,
  styles: [`
    :host { display: inline-flex; }
    .tooltip { position: relative; display: inline-flex; }
    .tooltip__trigger { border-radius: var(--ddga-radius-xs); }
    .tooltip__trigger:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: 2px; }
    .tooltip__content { position: fixed; z-index: 2; inline-size: max-content; max-inline-size: min(16rem, calc(100vw - var(--ddga-space-8))); padding: var(--ddga-space-2) var(--ddga-space-3); border: 0; border-radius: var(--ddga-radius-sm); background: var(--ddga-gray-900); color: white; font-size: var(--ddga-font-size-xs); opacity: 0; visibility: hidden; pointer-events: none; transform: translateY(2px); transition: opacity 150ms ease, transform 150ms ease, visibility 0s linear 150ms; }
    .tooltip--open .tooltip__content { opacity: 1; transform: none; visibility: visible; transition-delay: 0s; }
    @media (prefers-reduced-motion: reduce) { .tooltip__content { transition: none; } }
  `],
})
export class DgaTooltip {
  @Input() text = '';
  @Input() tooltipId = 'dga-tooltip';
  protected open = false;

  protected show(): void {
    this.open = true;
  }

  protected hide(): void {
    this.open = false;
  }

  protected onMouseLeave(event: MouseEvent): void {
    if (event.currentTarget !== document.activeElement) {
      this.hide();
    }
  }

  protected dismiss(): void {
    this.hide();
  }
}

@Component({
  selector: 'dga-modal',
  standalone: true,
  imports: [DgaIcon, DgaPopupPortal],
  template: `
    <button #trigger class="modal-trigger" type="button" (click)="setOpen(true)">{{ triggerLabel }}</button>
    @if (rendered()) {
      <div class="modal-backdrop" popover="manual" dgaPopupPortal [dgaPopupPortalOpen]="rendered()"
        [dgaPopupPortalViewport]="true" [attr.data-state]="closing() ? 'closed' : 'open'" (click)="onBackdropClick($event)">
        <section #dialog class="modal" role="dialog" aria-modal="true" [attr.aria-labelledby]="titleId" tabindex="-1" (keydown)="onDialogKeydown($event)" (click)="$event.stopPropagation()">
          <header class="modal__header">
            <h3 [id]="titleId">{{ title }}</h3>
            <button class="modal__close" type="button" aria-label="Close dialog" (click)="setOpen(false)"><dga-icon name="close" /></button>
          </header>
          <div class="modal__body"><ng-content></ng-content></div>
          <footer class="modal__footer"><button class="modal__action" type="button" (click)="setOpen(false)">Done</button></footer>
        </section>
      </div>
    }
  `,
  styles: [`
    :host { display: inline-block; }
    .modal-trigger, .modal__action { min-block-size: 2.5rem; padding-inline: var(--ddga-space-4); border: 1px solid var(--ddga-color-primary); border-radius: var(--ddga-radius-md); background: var(--ddga-color-primary); color: var(--ddga-color-primary-foreground); font: inherit; cursor: pointer; }
    .modal-trigger:focus-visible, .modal__action:focus-visible { outline: 2px solid var(--ddga-color-ring); outline-offset: 2px; }
    .modal-backdrop { box-sizing: border-box; position: fixed; z-index: 50; inset: 0; display: grid; place-items: center; padding: var(--ddga-space-4); border: 0; background: rgb(13 18 28 / .55); animation: dga-modal-overlay-in 150ms ease; }
    .modal-backdrop[data-state='closed'] { animation-name: dga-modal-overlay-out; }
    .modal { box-sizing: border-box; inline-size: min(100%, 32rem); max-block-size: min(90dvh, 42rem); overflow: auto; border: 1px solid var(--ddga-color-border); border-radius: var(--ddga-radius-lg); background: var(--ddga-color-card); color: var(--ddga-color-foreground); box-shadow: var(--ddga-shadow-xl); animation: dga-modal-in 180ms cubic-bezier(.16, 1, .3, 1); }
    .modal-backdrop[data-state='closed'] .modal { animation-name: dga-modal-out; }
    .modal__header, .modal__footer { display: flex; align-items: center; justify-content: space-between; gap: var(--ddga-space-4); padding: var(--ddga-space-4) var(--ddga-space-6); }
    .modal__header { border-block-end: 1px solid var(--ddga-color-border); }
    .modal__header h3 { margin: 0; font-size: var(--ddga-font-size-lg); }
    .modal__body { padding: var(--ddga-space-6); }
    .modal__footer { justify-content: flex-end; border-block-start: 1px solid var(--ddga-color-border); }
    .modal__close { border: 0; background: transparent; color: inherit; font-size: var(--ddga-font-size-2xl); cursor: pointer; }
    @keyframes dga-modal-overlay-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes dga-modal-overlay-out { from { opacity: 1; } to { opacity: 0; } }
    @keyframes dga-modal-in { from { opacity: 0; transform: scale(.96); } to { opacity: 1; transform: scale(1); } }
    @keyframes dga-modal-out { from { opacity: 1; transform: scale(1); } to { opacity: 0; transform: scale(.98); } }
    @media (prefers-reduced-motion: reduce) { .modal-backdrop, .modal { animation: none !important; } }
  `],
})
export class DgaModal implements AfterViewChecked, OnDestroy {
  @Input() title = 'Dialog title';
  @Input() titleId = 'dga-modal-title';
  @Input() triggerLabel = 'Open dialog';
  @Output() readonly openChange = new EventEmitter<boolean>();
  @ViewChild('trigger') private trigger?: ElementRef<HTMLButtonElement>;
  @ViewChild('dialog') private dialog?: ElementRef<HTMLElement>;
  protected rendered = signal(false);
  protected closing = signal(false);
  private openState = false;
  private closeTimer: ReturnType<typeof setTimeout> | undefined;
  private previousOpen = false;

  @Input() set open(value: boolean) {
    const wasOpen = this.openState;
    this.openState = value;
    if (value) {
      if (this.closeTimer) clearTimeout(this.closeTimer);
      this.rendered.set(true);
      this.closing.set(false);
    } else if (wasOpen && this.rendered()) {
      this.closing.set(true);
      this.closeTimer = setTimeout(() => {
        this.rendered.set(false);
        this.closing.set(false);
      }, 180);
    }
  }
  get open(): boolean {
    return this.openState;
  }

  ngAfterViewChecked(): void {
    if (this.previousOpen === this.open) {
      return;
    }
    this.previousOpen = this.open;
    (this.open ? this.dialog?.nativeElement : this.trigger?.nativeElement)?.focus();
  }

  protected setOpen(open: boolean): void {
    this.open = open;
    this.openChange.emit(open);
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.setOpen(false);
    }
  }

  protected onDialogKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.setOpen(false);
      return;
    }
    if (event.key !== 'Tab' || !this.dialog) {
      return;
    }
    const dialog = this.dialog.nativeElement;
    const focusable = Array.from(dialog.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (!first || document.activeElement === first || document.activeElement === dialog)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && (!last || document.activeElement === last)) {
      event.preventDefault();
      first?.focus();
    }
  }

  ngOnDestroy(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }
}
