import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import {
  DgaHeaderNav,
  DgaHeaderItem,
  DgaHeaderAction,
  DgaHeaderMenuButton,
  DgaMenubar,
  DgaSidebar,
  DgaSlideoutMenu,
  DgaMenubarItem,
  DgaSidebarItem,
} from './dga-header';

describe('DgaHeader navigation suite', () => {
  // ---------------------------------------------------------------- Nav
  describe('DgaHeaderNav', () => {
    it('renders a <nav> with the default and custom aria-label', () => {
      const f = TestBed.createComponent(DgaHeaderNav);
      f.detectChanges();
      const nav = f.nativeElement.querySelector('nav.ddga-header__nav') as HTMLElement;
      expect(nav).toBeTruthy();
      expect(nav.getAttribute('aria-label')).toBe('Primary navigation');
      f.componentRef.setInput('label', 'Service navigation');
      f.detectChanges();
      expect(nav.getAttribute('aria-label')).toBe('Service navigation');
    });
  });

  // --------------------------------------------------------------- Item
  describe('DgaHeaderItem', () => {
    @Component({
      standalone: true,
      imports: [DgaHeaderItem],
      template: `<dga-header-item [selected]="selected()" [disabled]="disabled()" [expandable]="expandable()"
        [icon]="icon()" (activated)="activations = activations + 1"
        (expandedChange)="lastExpanded = $event">Home</dga-header-item>`,
    })
    class ItemHost {
      selected = signal(false);
      disabled = signal(false);
      expandable = signal(false);
      icon = signal<string>('');
      activations = 0;
      lastExpanded: boolean | undefined;
    }

    function setup() {
      const f = TestBed.createComponent(ItemHost);
      f.detectChanges();
      const btn = () => f.nativeElement.querySelector('button.ddga-header__item') as HTMLButtonElement;
      return { f, btn };
    }

    it('projects content and renders an enabled button by default', () => {
      const { f, btn } = setup();
      expect(btn().textContent).toContain('Home');
      expect(btn().disabled).toBe(false);
      expect(btn().getAttribute('aria-haspopup')).toBeNull();
      expect(btn().getAttribute('aria-expanded')).toBeNull();
    });

    it('reflects selected and disabled', () => {
      const { f, btn } = setup();
      f.componentInstance.selected.set(true);
      f.componentInstance.disabled.set(true);
      f.detectChanges();
      expect(btn().hasAttribute('data-selected')).toBe(true);
      expect(btn().disabled).toBe(true);
    });

    it('exposes expandable state (aria-expanded + aria-haspopup + chevron) and toggles on activate', () => {
      const { f, btn } = setup();
      f.componentInstance.expandable.set(true);
      f.detectChanges();
      expect(btn().getAttribute('aria-haspopup')).toBe('true');
      expect(btn().getAttribute('aria-expanded')).toBe('false');
      expect(f.nativeElement.querySelector('.ddga-header__chevron')).toBeTruthy();
      btn().click();
      f.detectChanges();
      expect(btn().getAttribute('aria-expanded')).toBe('true');
      expect(f.componentInstance.lastExpanded).toBe(true);
      expect(f.componentInstance.activations).toBe(1);
    });

    it('does nothing on click when disabled', () => {
      const { f, btn } = setup();
      f.componentInstance.disabled.set(true);
      f.detectChanges();
      btn().click();
      f.detectChanges();
      expect(f.componentInstance.activations).toBe(0);
    });

    it('renders an icon when provided', () => {
      const { f } = setup();
      f.componentInstance.icon.set('home');
      f.detectChanges();
      const iconWrap = f.nativeElement.querySelector('.ddga-header__icon');
      expect(iconWrap).toBeTruthy();
      expect(iconWrap.querySelector('dga-icon')).toBeTruthy();
    });
  });

  // ------------------------------------------------------------- Action
  describe('DgaHeaderAction', () => {
    it('emits the MouseEvent on activate and applies the icon-only modifier', () => {
      const f = TestBed.createComponent(DgaHeaderAction);
      f.componentRef.setInput('iconOnly', true);
      f.detectChanges();
      let evt: MouseEvent | undefined;
      f.componentInstance.activated.subscribe((e) => (evt = e));
      const btn = f.nativeElement.querySelector('button.ddga-header__action') as HTMLButtonElement;
      expect(btn.classList).toContain('ddga-header__action--icon-only');
      btn.click();
      expect(evt).toBeInstanceOf(MouseEvent);
    });
  });

  // -------------------------------------------------------- Menu button
  describe('DgaHeaderMenuButton', () => {
    it('has an accessible label, reflects expanded, renders the menu icon, and emits pressed', () => {
      const f = TestBed.createComponent(DgaHeaderMenuButton);
      f.detectChanges();
      const btn = f.nativeElement.querySelector('button.ddga-header__menu-button') as HTMLButtonElement;
      expect(btn.getAttribute('aria-label')).toBe('Open navigation menu');
      expect(btn.getAttribute('aria-expanded')).toBe('false');
      expect(f.nativeElement.querySelector('dga-icon[name="menu"]')).toBeTruthy();
      f.componentRef.setInput('expanded', true);
      f.detectChanges();
      expect(btn.getAttribute('aria-expanded')).toBe('true');
      let pressed = false;
      f.componentInstance.pressed.subscribe(() => (pressed = true));
      btn.click();
      expect(pressed).toBe(true);
    });
  });

  // ------------------------------------------------------------ Menubar
  describe('DgaMenubar', () => {
    const menus: DgaMenubarItem[] = [
      { label: 'File', items: [{ type: 'item', label: 'New', value: 'new' }, { type: 'separator', label: '' }, { type: 'item', label: 'Open', value: 'open' }] },
      { label: 'Edit', items: [{ type: 'submenu', label: 'More', items: [{ type: 'item', label: 'Deep', value: 'deep' }] }] },
    ];

    it('renders role=menubar with an aria-label and one menuitem trigger per menu', () => {
      const f = TestBed.createComponent(DgaMenubar);
      f.componentRef.setInput('menus', menus);
      f.componentRef.setInput('label', 'Main menu');
      f.detectChanges();
      const bar = f.nativeElement.querySelector('[role="menubar"]') as HTMLElement;
      expect(bar).toBeTruthy();
      expect(bar.getAttribute('aria-label')).toBe('Main menu');
      const triggers = f.nativeElement.querySelectorAll('[role="menuitem"]');
      expect(triggers.length).toBeGreaterThanOrEqual(2);
      expect((triggers[0] as HTMLElement).textContent).toContain('File');
    });

    it('marks root triggers with aria-haspopup=menu when they have children', () => {
      const f = TestBed.createComponent(DgaMenubar);
      f.componentRef.setInput('menus', menus);
      f.detectChanges();
      const firstTrigger = f.nativeElement.querySelector('.ddga-menubar__trigger') as HTMLElement;
      expect(firstTrigger.getAttribute('aria-haspopup')).toBe('menu');
      expect(firstTrigger.getAttribute('aria-expanded')).toBe('false');
    });
  });

  // ------------------------------------------------------------ Sidebar
  describe('DgaSidebar', () => {
    const items: DgaSidebarItem[] = [
      { label: 'Dashboard', value: 'dash', icon: 'home' },
      { label: 'Reports', value: 'reports' },
      { label: 'Disabled', value: 'x', disabled: true },
    ];

    it('renders items, marks the selected one with aria-current=page, and disables flagged items', () => {
      const f = TestBed.createComponent(DgaSidebar);
      f.componentRef.setInput('items', items);
      f.componentRef.setInput('selectedValue', 'dash');
      f.detectChanges();
      const buttons = f.nativeElement.querySelectorAll('button.ddga-sidebar__menu-button') as NodeListOf<HTMLButtonElement>;
      expect(buttons.length).toBe(3);
      expect(buttons[0].getAttribute('aria-current')).toBe('page');
      expect(buttons[1].getAttribute('aria-current')).toBeNull();
      expect(buttons[2].disabled).toBe(true);
    });

    it('emits selectedChange and toggles expanded via the trigger', () => {
      const f = TestBed.createComponent(DgaSidebar);
      f.componentRef.setInput('items', items);
      f.componentRef.setInput('expanded', true);
      f.detectChanges();
      let selected: string | undefined;
      let expanded: boolean | undefined;
      f.componentInstance.selectedChange.subscribe((v) => (selected = v));
      f.componentInstance.expandedChange.subscribe((v) => (expanded = v));
      (f.nativeElement.querySelector('button.ddga-sidebar__menu-button') as HTMLButtonElement).click();
      expect(selected).toBe('dash');
      (f.nativeElement.querySelector('button.ddga-sidebar__trigger') as HTMLButtonElement).click();
      expect(expanded).toBe(false);
    });
  });

  // ------------------------------------------------------- Slideout menu
  describe('DgaSlideoutMenu (modal dialog)', () => {
    it('opens from the trigger, exposes dialog semantics, and closes on Escape', () => {
      const f = TestBed.createComponent(DgaSlideoutMenu);
      f.componentRef.setInput('triggerLabel', 'Menu');
      f.detectChanges();
      const emitted: boolean[] = [];
      f.componentInstance.openChange.subscribe((v) => emitted.push(v));

      (f.nativeElement.querySelector('button.ddga-slideout-menu__trigger') as HTMLButtonElement).click();
      f.detectChanges();
      const panel = f.nativeElement.querySelector('section.ddga-slideout-menu') as HTMLElement;
      expect(panel).toBeTruthy();
      expect(panel.getAttribute('role')).toBe('dialog');
      expect(panel.getAttribute('aria-modal')).toBe('true');
      expect(panel.getAttribute('aria-label')).toBe('Navigation menu');

      panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      f.detectChanges();
      expect(emitted).toEqual([true, false]);
    });

    it('closes when the close button is pressed', () => {
      const f = TestBed.createComponent(DgaSlideoutMenu);
      f.componentRef.setInput('open', true);
      f.detectChanges();
      const emitted: boolean[] = [];
      f.componentInstance.openChange.subscribe((v) => emitted.push(v));
      (f.nativeElement.querySelector('button.ddga-slideout-menu__close') as HTMLButtonElement).click();
      f.detectChanges();
      expect(emitted).toEqual([false]);
    });
  });
});
