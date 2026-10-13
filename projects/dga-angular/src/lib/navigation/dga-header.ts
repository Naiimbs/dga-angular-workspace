import { AfterViewChecked, Component, ElementRef, EventEmitter, HostListener, Input, Output, signal, ViewChild } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { DgaIcon } from '../icons/dga-icon';
import type { DgaIconName } from '../icons/dga-icon';
import { DgaPopupPortal } from '../popup/dga-popup-portal';

export interface DgaHeaderSubmenuItemData {
  label: string;
  href: string;
  description?: string;
  icon?: DgaIconName;
}

@Component({
  selector: 'dga-header',
  standalone: true,
  template: `
    <header class="ddga-header" [class.ddga-header--full-width]="fullWidth">
      <div class="ddga-header__content"><ng-content></ng-content></div>
    </header>
  `,
})
export class DgaHeader {
  @Input() fullWidth = false;
}

@Component({
  selector: 'dga-header-brand',
  standalone: true,
  template: `<div class="ddga-header__brand"><ng-content></ng-content></div>`,
})
export class DgaHeaderBrand {}

@Component({
  selector: 'dga-header-nav',
  standalone: true,
  template: `<nav class="ddga-header__nav" [attr.aria-label]="label"><ul class="ddga-header__list"><ng-content></ng-content></ul></nav>`,
})
export class DgaHeaderNav {
  @Input() label = 'Primary navigation';
}

@Component({
  selector: 'dga-header-item',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <li class="ddga-header__list-item">
      <button class="ddga-header__item" type="button" [disabled]="disabled"
        [attr.data-selected]="selected ? '' : null" [attr.aria-expanded]="expandable ? expanded : null"
        [attr.aria-haspopup]="expandable ? 'true' : null" (click)="activate()">
        @if (icon) { <span class="ddga-header__icon" aria-hidden="true"><dga-icon [name]="icon" /></span> }
        <ng-content></ng-content>
        @if (expandable) { <span class="ddga-header__chevron" aria-hidden="true"><dga-icon name="chevron-down" /></span> }
        <span class="ddga-header__indicator" aria-hidden="true"></span>
      </button>
    </li>
  `,
})
export class DgaHeaderItem {
  @Input() selected = false;
  @Input() disabled = false;
  @Input() expandable = false;
  @Input() expanded = false;
  @Input() icon: DgaIconName | '' = '';
  @Output() readonly expandedChange = new EventEmitter<boolean>();
  @Output() readonly activated = new EventEmitter<void>();

  protected activate(): void {
    if (this.disabled) return;
    if (this.expandable) {
      this.expanded = !this.expanded;
      this.expandedChange.emit(this.expanded);
    }
    this.activated.emit();
  }
}

@Component({
  selector: 'dga-header-actions',
  standalone: true,
  template: `<div class="ddga-header__actions"><ng-content></ng-content></div>`,
})
export class DgaHeaderActions {}

@Component({
  selector: 'dga-header-action',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <button class="ddga-header__action" type="button" [disabled]="disabled"
      [attr.data-selected]="selected ? '' : null" [class.ddga-header__action--icon-only]="iconOnly"
      [class.ddga-header__action--top]="iconPosition === 'top'" (click)="activated.emit($event)">
      @if (icon) { <span class="ddga-header__icon" aria-hidden="true"><dga-icon [name]="icon" /></span> }
      <ng-content></ng-content>
      <span class="ddga-header__indicator" aria-hidden="true"></span>
    </button>
  `,
})
export class DgaHeaderAction {
  @Input() selected = false;
  @Input() disabled = false;
  @Input() icon: DgaIconName | '' = '';
  @Input() iconOnly = false;
  @Input() iconPosition: 'inline' | 'top' = 'inline';
  @Output() readonly activated = new EventEmitter<MouseEvent>();
}

@Component({
  selector: 'dga-header-menu-button',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <button class="ddga-header__menu-button" type="button" [attr.aria-label]="label"
      [attr.aria-expanded]="expanded" (click)="pressed.emit($event)">
      <dga-icon name="menu" />
    </button>
  `,
})
export class DgaHeaderMenuButton {
  @Input() label = 'Open navigation menu';
  @Input() expanded = false;
  @Output() readonly pressed = new EventEmitter<MouseEvent>();
}

@Component({
  selector: 'dga-header-utility-button',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <button class="ddga-header__utility-button" type="button" [attr.aria-label]="label"
      (click)="pressed.emit($event)"><dga-icon name="more-horizontal" /></button>
  `,
})
export class DgaHeaderUtilityButton {
  @Input() label = 'More options';
  @Output() readonly pressed = new EventEmitter<MouseEvent>();
}

@Component({
  selector: 'dga-header-submenu',
  standalone: true,
  template: `
    <section class="ddga-header__submenu" [class.ddga-header__submenu--dark]="background === 'dark'"
      [attr.data-state]="open ? 'open' : 'closed'" [hidden]="!open" [attr.aria-label]="label"
      (keydown.escape)="closeMenu($event)">
      @if (closeLabel) {
        <button class="ddga-header__submenu-close" type="button" (click)="close.emit()">{{ closeLabel }}</button>
      }
      <div class="ddga-header__submenu-content"><ng-content></ng-content></div>
    </section>
  `,
})
export class DgaHeaderSubmenu {
  @Input() open = false;
  @Input() background: 'default' | 'dark' = 'default';
  @Input() closeLabel = '';
  @Input() label = 'Navigation submenu';
  @Output() readonly close = new EventEmitter<void>();

  protected closeMenu(event: Event): void {
    event.preventDefault();
    this.close.emit();
  }
}

@Component({
  selector: 'dga-header-submenu-group',
  standalone: true,
  template: `
    <section class="ddga-header__submenu-group">
      @if (label) { <h2 class="ddga-header__submenu-label">{{ label }}</h2> }
      <ul class="ddga-header__submenu-list"><ng-content></ng-content></ul>
    </section>
  `,
})
export class DgaHeaderSubmenuGroup {
  @Input() label = '';
}

@Component({
  selector: 'dga-header-submenu-item',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <li><a class="ddga-header__submenu-item" [href]="href">
      @if (icon) { <span class="ddga-header__submenu-icon" [class.ddga-header__submenu-icon--boxed]="iconStyle === 'boxed'" aria-hidden="true"><dga-icon [name]="icon" /></span> }
      <span class="ddga-header__submenu-item-label"><ng-content></ng-content></span>
      @if (description) { <span class="ddga-header__submenu-desc">{{ description }}</span> }
    </a></li>
  `,
})
export class DgaHeaderSubmenuItem {
  @Input({ required: true }) href = '#';
  @Input() icon: DgaIconName | '' = '';
  @Input() iconStyle: 'simple' | 'boxed' = 'simple';
  @Input() description = '';
}

@Component({
  selector: 'dga-menubar',
  standalone: true,
  imports: [DgaPopupPortal, NgTemplateOutlet, DgaIcon],
  template: `
    <div class="ddga-menubar" role="menubar" [attr.aria-label]="label"
      (keydown)="onKeydown($event)" (focusout)="onFocusout($event)">
      @for (menu of menus; track menu.label; let index = $index) {
        <div class="ddga-menubar__group">
          <button #trigger class="ddga-menubar__trigger"
            [class.ddga-menubar__trigger--default]="(menu.variant || variant) === 'default'"
            [class.ddga-menubar__trigger--outline]="(menu.variant || variant) === 'outline'"
            type="button" role="menuitem"
            [attr.data-variant]="menu.variant || variant"
            [attr.data-menu-index]="index" [attr.tabindex]="rovingTabIndex(index)"
            [disabled]="menu.disabled" [attr.data-disabled]="menu.disabled ? '' : null"
            [attr.data-state]="openIndex === index ? 'open' : 'closed'"
            [attr.data-highlighted]="focusedIndex === index ? '' : null"
            [attr.aria-haspopup]="menu.items.length ? 'menu' : null"
            [attr.aria-expanded]="menu.items.length ? openIndex === index : null"
            (focus)="focusedIndex = index" (click)="toggle(index)">{{ menu.label }}</button>
          @if (openIndex === index) {
            <div class="ddga-menubar-menu ddga-menubar__menu"
              [class.ddga-menubar-menu--sm]="size === 'sm'"
              [class.ddga-menubar-menu--md]="size === 'md'"
              popover="manual" dgaPopupPortal
              [dgaPopupPortalOpen]="openIndex === index" [dgaPopupPortalAnchor]="trigger"
              role="menu" data-state="open" [attr.data-menu-scope]="rootScope(index)">
              <ng-container [ngTemplateOutlet]="menuEntries"
                [ngTemplateOutletContext]="{ $implicit: menu.items, parentPath: rootScope(index), groupKey: '' }" />
            </div>
          }
        </div>
      }
    </div>
    <ng-template #menuEntries let-entries let-parentPath="parentPath" let-groupKey="groupKey">
      @for (item of entries; track entryTrack(item, $index); let itemIndex = $index) {
        @switch (item.type) {
          @case ('separator') {
            <div class="ddga-menubar-menu__separator ddga-menubar__separator" role="separator"></div>
          }
          @case ('label') {
            <div class="ddga-menubar-menu__group-label ddga-menubar__label" role="presentation">{{ item.label }}</div>
          }
          @case ('group') {
            @let groupPath = entryPath(parentPath, itemIndex);
            <div class="ddga-menubar__item-group" role="group">
              @if (item.label) { <div class="ddga-menubar-menu__group-label ddga-menubar__label">{{ item.label }}</div> }
              <ng-container [ngTemplateOutlet]="menuEntries"
                [ngTemplateOutletContext]="{ $implicit: item.items ?? [], parentPath: groupPath, groupKey: groupKey }" />
            </div>
          }
          @case ('radio-group') {
            @let radioGroupKey = item.group ?? entryPath(parentPath, itemIndex);
            <div class="ddga-menubar__item-group" role="group" [attr.aria-label]="item.label || null">
              <ng-container [ngTemplateOutlet]="menuEntries"
                [ngTemplateOutletContext]="{ $implicit: item.items ?? [], parentPath: entryPath(parentPath, itemIndex), groupKey: radioGroupKey }" />
            </div>
          }
          @case ('submenu') {
            @let submenuPath = entryPath(parentPath, itemIndex);
            <div class="ddga-menubar__submenu">
              <button #submenuTrigger type="button" class="ddga-menubar-menu__item ddga-menubar-menu__item--sub ddga-menubar__item ddga-menubar__item--submenu"
                role="menuitem" [attr.data-entry-path]="submenuPath"
                [attr.data-haspopup]="'menu'" [attr.aria-haspopup]="'menu'"
                [attr.aria-expanded]="isSubmenuOpen(submenuPath)"
                [attr.data-state]="isSubmenuOpen(submenuPath) ? 'open' : 'closed'"
                [attr.data-highlighted]="highlightedPath === submenuPath ? '' : null"
                [disabled]="item.disabled" [attr.data-disabled]="item.disabled ? '' : null"
                (focus)="setHighlighted(submenuPath)"
                (click)="toggleSubmenu(submenuPath)"
                (pointerenter)="!item.disabled && openSubmenuFromPointer(submenuPath)">
                @if (item.icon) { <span class="ddga-menubar-menu__icon ddga-menubar__item-icon" aria-hidden="true"><dga-icon [name]="item.icon" /></span> }
                <span class="ddga-menubar-menu__label ddga-menubar__item-label">{{ item.label }}</span>
                <dga-icon class="ddga-menubar-menu__sub-chevron ddga-menubar__submenu-chevron" name="chevron-right" />
              </button>
              @if (isSubmenuOpen(submenuPath)) {
                <div class="ddga-menubar-menu ddga-menubar-menu__sub-content ddga-menubar__menu ddga-menubar__submenu-content"
                  [class.ddga-menubar-menu--sm]="size === 'sm'"
                  [class.ddga-menubar-menu--md]="size === 'md'"
                  popover="manual" dgaPopupPortal
                  [dgaPopupPortalOpen]="isSubmenuOpen(submenuPath)" [dgaPopupPortalAnchor]="submenuTrigger"
                  dgaPopupPortalPlacement="inline-end" role="menu" data-state="open" [attr.data-menu-scope]="submenuPath">
                  <ng-container [ngTemplateOutlet]="menuEntries"
                    [ngTemplateOutletContext]="{ $implicit: item.items ?? [], parentPath: submenuPath, groupKey: groupKey }" />
                </div>
              }
            </div>
          }
          @case ('checkbox') {
            <button type="button" class="ddga-menubar-menu__item ddga-menubar-menu__item--checkable ddga-menubar__item ddga-menubar__item--checkable"
              role="menuitemcheckbox" [attr.data-entry-path]="entryPath(parentPath, itemIndex)"
              [attr.data-highlighted]="highlightedPath === entryPath(parentPath, itemIndex) ? '' : null"
              [attr.aria-checked]="isChecked(item, entryPath(parentPath, itemIndex))"
              [attr.data-checked]="isChecked(item, entryPath(parentPath, itemIndex)) ? '' : null"
              [disabled]="item.disabled" [attr.data-disabled]="item.disabled ? '' : null"
              (focus)="setHighlighted(entryPath(parentPath, itemIndex))"
              (click)="toggleChecked(item, entryPath(parentPath, itemIndex))">
              <span class="ddga-menubar-menu__indicator ddga-menubar__indicator" aria-hidden="true">
                @if (isChecked(item, entryPath(parentPath, itemIndex))) { <dga-icon class="ddga-menubar-menu__indicator-icon" name="check" /> }
              </span>
              <span class="ddga-menubar-menu__label ddga-menubar__item-label">{{ item.label }}</span>
              @if (item.shortcut) { <span class="ddga-menubar-menu__shortcut ddga-menubar__shortcut" aria-hidden="true">{{ item.shortcut }}</span> }
            </button>
          }
          @case ('radio') {
            <button type="button" class="ddga-menubar-menu__item ddga-menubar-menu__item--checkable ddga-menubar__item ddga-menubar__item--checkable"
              role="menuitemradio" [attr.data-entry-path]="entryPath(parentPath, itemIndex)"
              [attr.data-highlighted]="highlightedPath === entryPath(parentPath, itemIndex) ? '' : null"
              [attr.aria-checked]="isRadioChecked(item, entryPath(parentPath, itemIndex), groupKey)"
              [attr.data-checked]="isRadioChecked(item, entryPath(parentPath, itemIndex), groupKey) ? '' : null"
              [disabled]="item.disabled" [attr.data-disabled]="item.disabled ? '' : null"
              (focus)="setHighlighted(entryPath(parentPath, itemIndex))"
              (click)="selectRadio(item, entryPath(parentPath, itemIndex), groupKey)">
              <span class="ddga-menubar-menu__indicator ddga-menubar__indicator" aria-hidden="true">
                @if (isRadioChecked(item, entryPath(parentPath, itemIndex), groupKey)) { <span class="ddga-menubar-menu__radio-dot ddga-menubar__radio-dot"></span> }
              </span>
              <span class="ddga-menubar-menu__label ddga-menubar__item-label">{{ item.label }}</span>
              @if (item.shortcut) { <span class="ddga-menubar-menu__shortcut ddga-menubar__shortcut" aria-hidden="true">{{ item.shortcut }}</span> }
            </button>
          }
          @default {
            <button type="button" class="ddga-menubar-menu__item ddga-menubar__item" role="menuitem"
              [attr.data-entry-path]="entryPath(parentPath, itemIndex)"
              [attr.data-highlighted]="highlightedPath === entryPath(parentPath, itemIndex) ? '' : null"
              [attr.data-destructive]="item.destructive ? '' : null"
              [disabled]="item.disabled" [attr.data-disabled]="item.disabled ? '' : null"
              (focus)="setHighlighted(entryPath(parentPath, itemIndex))"
              (click)="select(item.value ?? item.label, $event)">
              @if (item.icon) { <span class="ddga-menubar-menu__icon ddga-menubar__item-icon" aria-hidden="true"><dga-icon [name]="item.icon" /></span> }
              <span class="ddga-menubar-menu__label ddga-menubar__item-label">{{ item.label }}</span>
              @if (item.shortcut) { <span class="ddga-menubar-menu__shortcut ddga-menubar__shortcut" aria-hidden="true">{{ item.shortcut }}</span> }
            </button>
          }
        }
      }
    </ng-template>
  `,
})
export class DgaMenubar implements AfterViewChecked {
  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  @Input() label = 'Application menu';
  @Input() menus: readonly DgaMenubarItem[] = [];
  @Input() variant: 'default' | 'outline' = 'default';
  @Input() size: 'sm' | 'md' = 'md';
  @Output() readonly selected = new EventEmitter<string>();
  @Output() readonly checkedChange = new EventEmitter<{ value: string; checked: boolean }>();
  protected openIndex = -1;
  protected focusedIndex = -1;
  private focusFirstItemAfterRender = false;
  private focusAfterRender: { scope: string; edge: 'first' | 'last' } | undefined;
  private openSubmenus = new Set<string>();
  private highlightedPath = '';
  private checkedValues = new Map<string, boolean>();
  private radioValues = new Map<string, string>();

  ngAfterViewChecked(): void {
    if (this.focusFirstItemAfterRender && this.openIndex >= 0) {
      this.focusFirstItemAfterRender = false;
      this.focusAfterRender = { scope: this.rootScope(this.openIndex), edge: 'first' };
    }
    if (!this.focusAfterRender) return;
    const pending = this.focusAfterRender;
    this.focusAfterRender = undefined;
    const menu = Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLElement>('[data-menu-scope]'))
      .find((element) => element.dataset['menuScope'] === pending.scope);
    const items = this.directMenuItems(menu);
    (pending.edge === 'last' ? items.at(-1) : items[0])?.focus();
  }

  protected rovingTabIndex(index: number): number {
    if (this.menus[index]?.disabled) return -1;
    const enabledIndex = this.focusedIndex >= 0 && !this.menus[this.focusedIndex]?.disabled
      ? this.focusedIndex
      : this.menus.findIndex((menu) => !menu.disabled);
    return index === enabledIndex ? 0 : -1;
  }

  protected toggle(index: number): void {
    this.openIndex = this.openIndex === index ? -1 : index;
    this.openSubmenus = new Set();
    if (this.openIndex >= 0) {
      this.focusFirstItemAfterRender = true;
    }
  }

  protected select(value: string, event: MouseEvent): void {
    this.selected.emit(value);
    const scope = (event.currentTarget as HTMLElement).closest<HTMLElement>('[data-menu-scope]');
    this.closeAll();
    this.focusTrigger(this.openIndexFromScope(scope?.dataset['menuScope'] ?? ''));
  }

  protected onKeydown(event: KeyboardEvent): void {
    const root = event.currentTarget as HTMLElement;
    const triggers = Array.from(root.querySelectorAll<HTMLButtonElement>('.ddga-menubar__trigger:not(:disabled)'));
    const target = event.target as HTMLElement;
    const currentTrigger = target.closest<HTMLButtonElement>('.ddga-menubar__trigger');
    const scope = target.closest<HTMLElement>('[data-menu-scope]');
    const rtl = getComputedStyle(root).direction === 'rtl';
    if (event.key === 'Escape' && (scope || this.openIndex >= 0)) {
      if (scope && this.isNestedScope(scope.dataset['menuScope'] ?? '')) {
        const currentScope = scope.dataset['menuScope'] ?? '';
        this.closeSubmenu(currentScope);
        this.focusEntry(currentScope);
      } else {
        const openIndex = this.openIndex;
        this.closeAll();
        this.focusTrigger(openIndex);
      }
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    const focusedMenuItem = target.closest<HTMLButtonElement>('[data-entry-path]');
    if (scope && focusedMenuItem) {
      const items = this.directMenuItems(scope);
      const currentIndex = items.indexOf(focusedMenuItem);
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Home' || event.key === 'End') {
        const forward = event.key === 'ArrowDown';
        const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1
          : (currentIndex + (forward ? 1 : -1) + items.length) % items.length;
        items[nextIndex]?.focus();
        event.preventDefault();
        return;
      }
      const forwardKey = (event.key === 'ArrowRight') !== rtl;
      const isSubmenu = focusedMenuItem.getAttribute('aria-haspopup') === 'menu';
      if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && forwardKey && isSubmenu) {
        const entryPath = focusedMenuItem.dataset['entryPath'] ?? '';
        this.openSubmenu(entryPath);
        event.preventDefault();
        return;
      }
      if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && !forwardKey) {
        const currentScope = scope.dataset['menuScope'] ?? '';
        if (this.isNestedScope(currentScope)) {
          this.closeSubmenu(currentScope);
          this.focusEntry(currentScope);
        } else {
          const nextIndex = this.nextEnabledMenu(this.openIndex, -1);
          this.closeAll();
          this.focusTrigger(nextIndex);
        }
        event.preventDefault();
        return;
      }
      if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        const currentScope = scope.dataset['menuScope'] ?? '';
        if (!this.isNestedScope(currentScope)) {
          const nextIndex = this.nextEnabledMenu(this.openIndex, 1);
          this.openIndex = nextIndex;
          this.openSubmenus = new Set();
          this.focusTrigger(nextIndex);
          this.focusFirstItemAfterRender = nextIndex >= 0;
          event.preventDefault();
          return;
        }
      }
      if (event.key === 'Enter' || event.key === ' ') {
        if (isSubmenu) {
          this.openSubmenu(focusedMenuItem.dataset['entryPath'] ?? '');
        } else if (focusedMenuItem.getAttribute('role') === 'menuitemcheckbox') {
          focusedMenuItem.click();
        } else if (focusedMenuItem.getAttribute('role') === 'menuitemradio') {
          focusedMenuItem.click();
        } else {
          focusedMenuItem.click();
        }
        event.preventDefault();
        return;
      }
    }
    if (currentTrigger && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
      const index = Number(currentTrigger.dataset['menuIndex']);
      if (event.key === 'Enter' || event.key === ' ') {
        this.toggle(index);
      } else {
        this.openIndex = index;
        this.openSubmenus = new Set();
        this.focusAfterRender = { scope: this.rootScope(index), edge: event.key === 'ArrowUp' ? 'last' : 'first' };
      }
      event.preventDefault();
      return;
    }
    if (currentTrigger && (event.key === 'Home' || event.key === 'End')) {
      const targetIndex = event.key === 'Home' ? this.nextEnabledMenu(-1, 1) : this.nextEnabledMenu(this.menus.length, -1);
      this.focusTrigger(targetIndex);
      event.preventDefault();
      return;
    }
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    const index = Number(currentTrigger?.dataset['menuIndex']);
    if (!currentTrigger || !Number.isInteger(index) || triggers.length === 0) return;
    const forward = (event.key === 'ArrowRight') !== rtl ? 1 : -1;
    this.focusTrigger(this.nextEnabledMenu(index, forward));
    event.preventDefault();
  }

  protected onFocusout(event: FocusEvent): void {
    const root = event.currentTarget as HTMLElement;
    if (!root.contains(event.relatedTarget as Node | null)) this.openIndex = -1;
  }

  @HostListener('document:pointerdown', ['$event'])
  protected onOutsidePointerDown(event: PointerEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) this.closeAll();
  }

  protected rootScope(index: number): string { return `menu-${index}`; }
  protected entryPath(parentPath: string, index: number): string { return `${parentPath}/${index}`; }
  protected entryTrack(item: DgaMenubarEntry, index: number): string { return `${item.type ?? 'item'}-${item.value ?? item.label}-${index}`; }
  protected isSubmenuOpen(path: string): boolean { return this.openSubmenus.has(path); }
  protected setHighlighted(path: string): void { this.highlightedPath = path; }
  protected openSubmenuFromPointer(path: string): void { this.openSubmenu(path); }
  protected toggleSubmenu(path: string): void {
    if (this.isSubmenuOpen(path)) {
      this.closeSubmenu(path);
      this.focusEntry(path);
    } else {
      this.openSubmenu(path);
    }
  }

  protected isChecked(item: DgaMenubarEntry, path: string): boolean {
    return this.checkedValues.get(path) ?? item.checked ?? false;
  }

  protected isRadioChecked(item: DgaMenubarEntry, path: string, groupKey: string): boolean {
    const group = item.group || groupKey || path;
    const selected = this.radioValues.get(group);
    return selected === undefined ? !!item.checked : selected === (item.value ?? item.label);
  }

  protected toggleChecked(item: DgaMenubarEntry, path: string): void {
    if (item.disabled) return;
    const checked = !this.isChecked(item, path);
    this.checkedValues.set(path, checked);
    this.checkedChange.emit({ value: item.value ?? item.label, checked });
  }

  protected selectRadio(item: DgaMenubarEntry, path: string, groupKey: string): void {
    if (item.disabled) return;
    this.radioValues.set(item.group || groupKey || path.split('/').slice(0, -1).join('/') || path, item.value ?? item.label);
    this.selected.emit(item.value ?? item.label);
  }

  private nextEnabledMenu(currentIndex: number, direction: number): number {
    if (!this.menus.length) return -1;
    for (let offset = 1; offset <= this.menus.length; offset += 1) {
      const index = (currentIndex + direction * offset + this.menus.length * 2) % this.menus.length;
      if (!this.menus[index]?.disabled) return index;
    }
    return -1;
  }

  private directMenuItems(scope: HTMLElement | undefined): HTMLButtonElement[] {
    if (!scope) return [];
    return Array.from(scope.querySelectorAll<HTMLButtonElement>('button[data-entry-path]'))
      .filter((item) => !item.disabled && item.closest('[data-menu-scope]') === scope);
  }

  private openSubmenu(path: string): void {
    const next = new Set(this.openSubmenus);
    const parts = path.split('/');
    for (let i = 1; i < parts.length; i += 1) next.add(parts.slice(0, i + 1).join('/'));
    this.openSubmenus = next;
    this.focusAfterRender = { scope: path, edge: 'first' };
  }

  private closeSubmenu(path: string): void {
    this.openSubmenus = new Set([...this.openSubmenus].filter((openPath) => openPath !== path && !openPath.startsWith(`${path}/`)));
  }

  private closeAll(): void {
    this.openIndex = -1;
    this.openSubmenus = new Set();
  }

  private isNestedScope(scope: string): boolean {
    return scope.includes('/');
  }

  private focusEntry(path: string): void {
    const trigger = Array.from(this.elementRef.nativeElement.querySelectorAll<HTMLButtonElement>('[data-entry-path]'))
      .find((element) => element.dataset['entryPath'] === path);
    trigger?.focus();
  }

  private openIndexFromScope(scope: string): number {
    const match = /^menu-(\d+)/.exec(scope);
    return match ? Number(match[1]) : this.openIndex;
  }

  private focusTrigger(index: number): void {
    if (index < 0) return;
    this.focusedIndex = index;
    this.elementRef.nativeElement.querySelector<HTMLButtonElement>(
      `.ddga-menubar__trigger[data-menu-index="${index}"]`,
    )?.focus();
  }
}

export type DgaMenubarEntryType = 'item' | 'checkbox' | 'radio' | 'separator' | 'label' | 'group' | 'radio-group' | 'submenu';

export interface DgaMenubarEntry {
  type?: DgaMenubarEntryType;
  label: string;
  value?: string;
  disabled?: boolean;
  checked?: boolean;
  group?: string;
  destructive?: boolean;
  shortcut?: string;
  icon?: DgaIconName;
  items?: readonly DgaMenubarEntry[];
}

export interface DgaMenubarItem {
  label: string;
  items: readonly DgaMenubarEntry[];
  disabled?: boolean;
  variant?: 'default' | 'outline';
}

export interface DgaSidebarItem {
  label: string;
  value: string;
  icon?: DgaIconName;
  disabled?: boolean;
}

@Component({
  selector: 'dga-sidebar',
  standalone: true,
  imports: [DgaIcon],
  template: `
    <aside class="ddga-sidebar" [attr.data-state]="expanded ? 'expanded' : 'collapsed'"
      [attr.data-collapsible]="collapsible" [attr.data-side]="side" [attr.data-variant]="variant">
      @if (collapsible !== 'none') {
        <button class="ddga-sidebar__trigger" type="button" [attr.aria-expanded]="expanded"
          [attr.aria-label]="expanded ? collapseLabel : expandLabel" (click)="toggle()">
          <dga-icon [name]="expanded ? 'arrow-left' : 'arrow-right'" />
        </button>
      }
      <nav [attr.aria-label]="label">
        <ul class="ddga-sidebar__menu">
          @for (item of items; track item.value) {
            <li><button class="ddga-sidebar__menu-button" type="button" [disabled]="item.disabled"
              [attr.data-active]="selectedValue === item.value ? 'true' : null"
              [attr.aria-current]="selectedValue === item.value ? 'page' : null"
              [attr.title]="expanded ? null : item.label"
              (click)="activate(item.value)">
              @if (item.icon) { <span class="ddga-sidebar__icon" aria-hidden="true"><dga-icon [name]="item.icon" /></span> }
              <span class="ddga-sidebar__menu-label">{{ item.label }}</span>
            </button></li>
          }
        </ul>
      </nav>
    </aside>
  `,
})
export class DgaSidebar {
  @Input() items: readonly DgaSidebarItem[] = [];
  @Input() label = 'Sidebar navigation';
  @Input() selectedValue = '';
  @Input() collapsible: 'icon' | 'offcanvas' | 'none' = 'icon';
  @Input() side: 'start' | 'end' = 'start';
  @Input() variant: 'sidebar' | 'floating' | 'inset' = 'sidebar';
  @Input() keyboardShortcut = true;
  @Input() collapseLabel = 'Collapse sidebar';
  @Input() expandLabel = 'Expand sidebar';
  @Input() expanded = true;
  @Output() readonly expandedChange = new EventEmitter<boolean>();
  @Output() readonly selectedChange = new EventEmitter<string>();

  protected toggle(): void {
    this.expanded = !this.expanded;
    this.expandedChange.emit(this.expanded);
  }

  protected activate(value: string): void {
    this.selectedValue = value;
    this.selectedChange.emit(value);
  }

  @Output() readonly shortcutUsed = new EventEmitter<void>();

  @HostListener('document:keydown', ['$event'])
  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.keyboardShortcut || !(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'b') return;
    if ((event.target as HTMLElement | null)?.closest('input, textarea, select, [contenteditable="true"]')) return;
    event.preventDefault();
    this.toggle();
    this.shortcutUsed.emit();
  }
}

@Component({
  selector: 'dga-slideout-menu',
  standalone: true,
  imports: [DgaIcon],
  template: `
    @if (triggerLabel) {
      <button #trigger class="ddga-slideout-menu__trigger" type="button" [attr.aria-expanded]="open"
        [attr.aria-label]="triggerLabel" (click)="setOpen(!open)">{{ triggerLabel }}</button>
    }
    @if (rendered()) {
    <div class="ddga-slideout-menu__overlay" [attr.data-state]="closing() ? 'closed' : 'open'"
        (click)="onOverlayClick($event)">
        <section #panel class="ddga-slideout-menu" [class.ddga-slideout-menu--start]="side === 'start'"
          [class.ddga-slideout-menu--end]="side === 'end'" [class.ddga-slideout-menu--white]="background === 'white'"
        [attr.data-state]="closing() ? 'closed' : 'open'" role="dialog" aria-modal="true" tabindex="-1"
          [attr.aria-label]="label" (keydown)="onPanelKeydown($event)" (click)="$event.stopPropagation()">
          <header class="ddga-slideout-menu__header">
            <strong>{{ title }}</strong>
            <button class="ddga-slideout-menu__close" type="button" [attr.aria-label]="closeLabel"
              (click)="setOpen(false)"><dga-icon name="close" /></button>
          </header>
          <div class="ddga-slideout-menu__body"><ng-content></ng-content></div>
        </section>
      </div>
    }
  `,
})
export class DgaSlideoutMenu {
  private openState = false;
  private controlledOpen: boolean | undefined;
  private interacted = false;
  private closeTimer: ReturnType<typeof setTimeout> | undefined;
  private previousOpen = false;
  protected rendered = signal(false);
  protected closing = signal(false);

  @Input() triggerLabel = '';
  @Input() title = 'Navigation';
  @Input() label = 'Navigation menu';
  @Input() closeLabel = 'Close navigation';
  @Input() side: 'start' | 'end' = 'start';
  @Input() background: 'gray' | 'white' = 'gray';
  @Output() readonly openChange = new EventEmitter<boolean>();
  @ViewChild('trigger') private trigger?: ElementRef<HTMLButtonElement>;
  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;
  @Input() set open(value: boolean | undefined) {
    const wasOpen = this.open;
    this.controlledOpen = value;
    if (value !== undefined) this.transition(wasOpen, value);
  }
  get open(): boolean {
    return this.controlledOpen ?? this.openState;
  }

  private transition(wasOpen: boolean, value: boolean): void {
    if (value) {
      if (this.closeTimer) clearTimeout(this.closeTimer);
      this.rendered.set(true);
      this.closing.set(false);
    } else if (wasOpen && this.rendered()) {
      this.closing.set(true);
      this.closeTimer = setTimeout(() => {
        this.rendered.set(false);
        this.closing.set(false);
      }, 220);
    }
  }

  @Input() set defaultOpen(value: boolean) {
    if (this.controlledOpen === undefined && !this.interacted) {
      const wasOpen = this.open;
      this.openState = value;
      this.transition(wasOpen, value);
    }
  }

  protected setOpen(value: boolean): void {
    if (this.open === value) return;
    if (this.controlledOpen === undefined) {
      const wasOpen = this.open;
      this.interacted = true;
      this.openState = value;
      this.transition(wasOpen, value);
    }
    this.openChange.emit(value);
  }

  protected onOverlayClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.setOpen(false);
  }

  protected onPanelKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.setOpen(false);
      return;
    }
    if (event.key !== 'Tab') return;
    const panel = event.currentTarget as HTMLElement;
    const focusable = Array.from(panel.querySelectorAll<HTMLElement>(
      'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])',
    ));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (!first || document.activeElement === first || document.activeElement === panel)) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && (!last || document.activeElement === last)) {
      event.preventDefault();
      first?.focus();
    }
  }

  ngAfterViewChecked(): void {
    if (this.previousOpen === this.open) return;
    this.previousOpen = this.open;
    if (this.open) {
      this.panel?.nativeElement.focus();
    } else {
      this.trigger?.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    if (this.closeTimer) clearTimeout(this.closeTimer);
  }
}
