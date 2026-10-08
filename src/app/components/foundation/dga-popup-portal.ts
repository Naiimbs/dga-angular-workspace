import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  Directive,
  ElementRef,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  SimpleChanges,
  booleanAttribute,
} from '@angular/core';

@Directive({
  selector: '[dgaPopupPortal]',
  standalone: true,
})
export class DgaPopupPortal implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input({ transform: booleanAttribute }) dgaPopupPortalOpen = false;
  @Input() dgaPopupPortalAnchor: HTMLElement | null = null;
  @Input({ transform: booleanAttribute }) dgaPopupPortalMatchAnchor = false;
  @Input({ transform: booleanAttribute }) dgaPopupPortalViewport = false;
  @Input() dgaPopupPortalPlacement: 'bottom-start' | 'top-center' | 'inline-end' | 'inline-start' = 'bottom-start';

  private readonly browser: boolean;
  private initialized = false;
  private readonly popup: HTMLElement & { showPopover?: () => void; hidePopover?: () => void };
  private readonly reposition = (): void => this.updatePosition();

  constructor(
    element: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) platformId: object,
  ) {
    this.browser = isPlatformBrowser(platformId);
    this.popup = element.nativeElement as HTMLElement & { showPopover?: () => void; hidePopover?: () => void };
  }

  ngOnInit(): void {
    if (this.browser && typeof this.popup.showPopover === 'function') {
      this.popup.setAttribute('popover', 'manual');
    } else {
      this.popup.removeAttribute('popover');
    }
  }

  ngAfterViewInit(): void {
    this.initialized = true;
    if (this.browser) {
      window.addEventListener('resize', this.reposition);
      window.addEventListener('scroll', this.reposition, true);
    }
    this.syncOpenState();
  }

  ngOnChanges(_changes: SimpleChanges): void {
    if (this.initialized) {
      this.syncOpenState();
    }
  }

  ngOnDestroy(): void {
    if (this.browser) {
      window.removeEventListener('resize', this.reposition);
      window.removeEventListener('scroll', this.reposition, true);
    }
    if (this.isOpen()) {
      this.popup.hidePopover?.();
    }
  }

  private syncOpenState(): void {
    if (!this.browser || typeof this.popup.showPopover !== 'function') {
      return;
    }
    if (this.dgaPopupPortalOpen) {
      if (!this.isOpen()) {
        this.popup.showPopover();
      }
      this.updatePosition();
    } else if (this.isOpen()) {
      this.popup.hidePopover?.();
    }
  }

  private updatePosition(): void {
    const anchor = this.dgaPopupPortalAnchor;
    if (!this.browser || !this.isOpen()) {
      return;
    }
    if (this.dgaPopupPortalViewport) {
      this.popup.style.position = 'fixed';
      this.popup.style.inset = '0';
      this.popup.style.margin = '0';
      this.popup.style.width = '100vw';
      this.popup.style.height = '100vh';
      return;
    }
    if (!anchor) return;
    const rect = anchor.getBoundingClientRect();
    const viewportWidth = document.documentElement.clientWidth;
    const viewportHeight = document.documentElement.clientHeight;
    const naturalWidth = this.popup.scrollWidth;
    const width = Math.min(
      this.dgaPopupPortalMatchAnchor ? rect.width : Math.max(rect.width, naturalWidth),
      Math.max(0, viewportWidth - 16),
    );
    const height = Math.min(this.popup.scrollHeight, Math.max(0, viewportHeight - 16));
    const rtl = getComputedStyle(anchor).direction === 'rtl';
    const inlinePlacement = this.dgaPopupPortalPlacement === 'inline-end' || this.dgaPopupPortalPlacement === 'inline-start';
    const towardInlineEnd = this.dgaPopupPortalPlacement === 'inline-end';
    let left = inlinePlacement
      ? ((towardInlineEnd !== rtl) ? rect.right + 4 : rect.left - width - 4)
      : this.dgaPopupPortalPlacement === 'top-center'
        ? rect.left + (rect.width - width) / 2
        : rtl ? rect.right - width : rect.left;
    let top = inlinePlacement ? rect.top : this.dgaPopupPortalPlacement === 'top-center' ? rect.top - height - 4 : rect.bottom + 4;
    const spaceBelow = viewportHeight - rect.bottom - 8;
    const spaceAbove = rect.top - 8;
    if (inlinePlacement && (left < 8 || left + width > viewportWidth - 8)) {
      left = ((towardInlineEnd !== rtl) ? rect.left - width - 4 : rect.right + 4);
    }
    if (this.dgaPopupPortalPlacement === 'top-center') {
      if (top < 8 && rect.bottom + height + 4 <= viewportHeight - 8) {
        top = rect.bottom + 4;
      }
    } else if (!inlinePlacement) {
      if (top + height > viewportHeight - 8 && (rect.top - height - 4 >= 8 || spaceAbove > spaceBelow)) {
        top = rect.top - height - 4;
      }
    }
    left = Math.min(Math.max(8, left), Math.max(8, viewportWidth - width - 8));
    top = Math.min(Math.max(8, top), Math.max(8, viewportHeight - height - 8));
    this.popup.style.position = 'fixed';
    this.popup.style.inset = 'auto';
    this.popup.style.margin = '0';
    this.popup.style.boxSizing = 'border-box';
    this.popup.style.maxHeight = `${Math.max(100, viewportHeight - 16)}px`;
    this.popup.style.width = this.dgaPopupPortalMatchAnchor ? `${width}px` : '';
    this.popup.style.left = `${left}px`;
    this.popup.style.top = `${top}px`;
  }

  private isOpen(): boolean {
    return typeof this.popup.hidePopover === 'function' && this.popup.matches(':popover-open');
  }
}
