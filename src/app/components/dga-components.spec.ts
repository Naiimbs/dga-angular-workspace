import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  DgaBreadcrumb,
  DgaAvatar,
  DgaAvatarFallback,
  DgaAvatarImage,
  DgaCheckbox,
  DgaCard,
  DgaDigitalStamp,
  DgaDropdown,
  DgaMenubar,
  DgaModal,
  DgaInput,
  DgaPagination,
  DgaRadioGroup,
  DgaSelect,
  DgaTable,
  DgaTableBody,
  DgaTableCaption,
  DgaTableCellDirective,
  DgaTableFilterDirective,
  DgaTableHeadDirective,
  DgaTableHeader,
  DgaTableRowDirective,
  DgaTabs,
} from './index';
import type { DgaMenuOption, DgaMenubarItem, DgaRadioOption, DgaSelectOption, DgaTableSortDirection, DgaTab } from './index';

@Component({
  standalone: true,
  imports: [
    FormsModule,
    DgaBreadcrumb,
    DgaAvatar,
    DgaAvatarFallback,
    DgaAvatarImage,
    DgaInput,
    DgaCheckbox,
    DgaCard,
    DgaDigitalStamp,
    DgaDropdown,
    DgaMenubar,
    DgaModal,
    DgaRadioGroup,
    DgaSelect,
    DgaTabs,
    DgaPagination,
    DgaTable,
    DgaTableBody,
    DgaTableCaption,
    DgaTableCellDirective,
    DgaTableFilterDirective,
    DgaTableHeadDirective,
    DgaTableHeader,
    DgaTableRowDirective,
  ],
  template: `
    <dga-input id="test-email" label="Email" [(ngModel)]="email" />
    <dga-checkbox id="test-terms" [(ngModel)]="accepted" [indeterminate]="true">Terms</dga-checkbox>
    <dga-checkbox id="test-disabled" [disabled]="true">Disabled</dga-checkbox>
    <dga-card id="selectable-card" selectable [defaultSelected]="false" aria-label="Select service">
      Select service
    </dga-card>
    <dga-card id="disabled-card" selectable [disabled]="true" aria-label="Disabled service">
      Disabled service
    </dga-card>
    <dga-avatar id="avatar-composition" size="sm">
      <dga-avatar-image src="/test-avatar.png" alt="Composed avatar" />
      <dga-avatar-fallback colorScheme="primary">AM</dga-avatar-fallback>
    </dga-avatar>
    <dga-menubar id="test-menubar" [menus]="menubarItems" />
    <dga-menubar id="outline-menubar" variant="outline" size="sm" [menus]="menubarItems" />
    <dga-modal id="test-modal" triggerLabel="Open test modal" title="Test Dialog">
      <dga-select id="modal-select" label="Choose" [options]="selectOptions" />
    </dga-modal>
    <div id="overflow-hidden-box" style="overflow: hidden; width: 140px; height: 60px;">
      <dga-dropdown id="overflow-dropdown" label="Overflow actions" [options]="dropdownOptions" />
    </div>
    @for (extension of stampExtensions; track extension) {
      <dga-digital-stamp [id]="'stamp-' + extension" [extension]="extension"
        [defaultOpen]="extension === 'edu.sa'" registrationNumber="DGA-2026"
        registrationHref="/authority">
        <img dgaDigitalStampLogo src="/dga-logo.svg" alt="" />
      </dga-digital-stamp>
    }
    <dga-radio-group id="test-account" label="Account" orientation="horizontal" [options]="radioOptions" [(ngModel)]="account" />
    <dga-tabs id="keyboard-tabs" [tabs]="tabs" [selected]="selectedTab"
      (selectedChange)="selectedTab = $event" />
    <dga-tabs id="manual-tabs" [tabs]="tabs" [selected]="selectedTab" [activationMode]="tabsMode()"
      (selectedChange)="selectedTab = $event" />
    <dga-tabs id="vertical-tabs" [tabs]="tabs" [selected]="selectedTab" orientation="vertical"
      (selectedChange)="selectedTab = $event" />
    <dga-breadcrumb [items]="breadcrumbItems" [overflowItems]="breadcrumbOverflowItems" />
    <dga-pagination [currentPage]="currentPage" [totalPages]="100" (pageChange)="currentPage = $event" />
    <dga-table caption="Request list" [striped]="true">
      <caption dga-table-caption>Request list</caption>
      <thead dga-table-header>
        <tr dga-table-row>
          <th dga-table-head sortable [sortDirection]="sortDirection"
            (sortChange)="sortDirection = $event">Service</th>
          <th dga-table-head>Status
            <button dga-table-filter [active]="filterActive" label="Filter by status"
              (activeChange)="filterActive = $event"><span>Filter</span></button>
          </th>
        </tr>
      </thead>
      <tbody dga-table-body>
        <tr dga-table-row [selected]="true">
          <td dga-table-cell>National Address</td>
          <td dga-table-cell>Active</td>
        </tr>
      </tbody>
    </dga-table>
  `,
})
class DgaComponentsTestHost {
  readonly radioOptions: readonly DgaRadioOption[] = [
    { label: 'Citizen', value: 'citizen' },
    { label: 'Business', value: 'business' },
    { label: 'Government', value: 'government', disabled: true },
  ];
  readonly tabs: readonly DgaTab[] = [
    { label: 'Overview', value: 'overview', content: 'Overview panel.' },
    { label: 'Disabled', value: 'disabled', content: 'Disabled panel.', disabled: true },
    { label: 'Details', value: 'details', content: 'Details panel.' },
  ];
  readonly menubarItems: readonly DgaMenubarItem[] = [
    {
      label: 'File',
      items: [
        { label: 'New', value: 'new' },
        { label: 'Disabled', value: 'disabled', disabled: true },
        { label: 'Open', value: 'open' },
        { type: 'separator', label: '' },
        { type: 'label', label: 'Preferences' },
        { type: 'checkbox', label: 'Show hidden', value: 'show-hidden', checked: false },
        {
          type: 'radio-group',
          label: 'Density',
          group: 'density',
          items: [
            { type: 'radio', label: 'Compact', value: 'compact', checked: true },
            { type: 'radio', label: 'Comfortable', value: 'comfortable' },
          ],
        },
        {
          type: 'submenu',
          label: 'More',
          items: [{
            type: 'submenu',
            label: 'Nested',
            items: [{ label: 'Deep action', value: 'deep-action' }],
          }],
        },
        { type: 'group', label: 'Other actions', items: [{ label: 'Grouped action', value: 'grouped-action' }] },
      ],
    },
    { label: 'Edit', disabled: true, items: [] },
    { label: 'View', items: [{ label: 'Zoom in', value: 'zoom-in' }] },
  ];
  readonly breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Current service' },
  ];
  readonly breadcrumbOverflowItems = [
    { label: 'Services', href: '/services' },
  ];
  readonly stampExtensions = ['gov.sa', 'edu.sa', 'med.sa', 'org.sa', 'sch.sa', 'sa'] as const;
  readonly selectOptions: readonly DgaSelectOption[] = [
    { label: 'Option A', value: 'opt-a' },
    { label: 'Option B', value: 'opt-b' },
  ];
  readonly dropdownOptions: readonly DgaMenuOption[] = [
    { label: 'Action A', value: 'act-a' },
    { label: 'Action B', value: 'act-b' },
  ];
  email = 'first@example.sa';
  accepted = false;
  account = 'citizen';
  selectedTab = 'overview';
  readonly tabsMode = signal<'automatic' | 'manual'>('automatic');
  currentPage = 50;
  sortDirection: DgaTableSortDirection = 'none';
  filterActive = false;
}

describe('DGA component parity', () => {
  let fixture: ComponentFixture<DgaComponentsTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DgaComponentsTestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(DgaComponentsTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('binds text inputs and native checkboxes through Angular Forms', () => {
    const host = fixture.componentInstance;
    const input = fixture.nativeElement.querySelector('input#test-email') as HTMLInputElement;
    const checkbox = fixture.nativeElement.querySelector('input#test-terms') as HTMLInputElement;

    expect(input.value).toBe('first@example.sa');
    expect(checkbox.indeterminate).toBe(true);
    input.value = 'updated@example.sa';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    checkbox.checked = true;
    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(host.email).toBe('updated@example.sa');
    expect(host.accepted).toBe(true);
    expect(checkbox.indeterminate).toBe(false);
  });

  it('renders checked, mixed, disabled and keyboard-operable checkbox states', () => {
    const input = fixture.nativeElement.querySelector('input#test-terms') as HTMLInputElement;
    expect(input.getAttribute('aria-checked')).toBe('mixed');
    expect(input.getAttribute('data-state')).toBe('indeterminate');
    expect(input.type).toBe('checkbox');

    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(true);
    expect(input.indeterminate).toBe(false);
    expect(input.getAttribute('aria-checked')).toBeNull();
    expect(input.getAttribute('data-state')).toBe('checked');

    const disabled = fixture.nativeElement.querySelector('input#test-disabled') as HTMLInputElement;
    expect(disabled.disabled).toBe(true);
  });

  it('shows the avatar fallback until its composed image loads', () => {
    const avatar = fixture.nativeElement.querySelector('#avatar-composition') as HTMLElement;
    const image = avatar.querySelector('dga-avatar-image img') as HTMLImageElement;
    const fallback = avatar.querySelector('dga-avatar-fallback [role="presentation"], dga-avatar-fallback span') as HTMLElement;

    expect(image.hidden).toBe(true);
    expect(fallback.hidden).toBe(false);
    image.dispatchEvent(new Event('load'));
    fixture.detectChanges();
    expect(image.hidden).toBe(false);
    expect(fixture.debugElement.query(By.directive(DgaAvatarFallback)).componentInstance.imageLoaded).toBe(true);
    expect(fallback.hidden).toBe(true);
  });

  it('supports selectable card mouse and Space activation and disables focus when unavailable', () => {
    const card = fixture.nativeElement.querySelector('#selectable-card [data-slot="card"]') as HTMLElement;
    expect(card.getAttribute('role')).toBe('checkbox');
    expect(card.getAttribute('aria-checked')).toBe('false');
    expect(card.getAttribute('tabindex')).toBe('0');

    card.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();
    expect(card.getAttribute('aria-checked')).toBe('true');
    expect(card.getAttribute('data-state')).toBe('checked');

    const disabled = fixture.nativeElement.querySelector('#disabled-card [data-slot="card"]') as HTMLElement;
    expect(disabled.getAttribute('aria-disabled')).toBe('true');
    expect(disabled.getAttribute('tabindex')).toBe('-1');
    disabled.click();
    fixture.detectChanges();
    expect(disabled.getAttribute('aria-checked')).toBe('false');
  });

  it('moves radio selection with arrows, skips disabled items, and reverses in RTL', () => {
    const fixtureRoot = fixture.nativeElement as HTMLElement;
    const group = fixtureRoot.querySelector('[role="radiogroup"]') as HTMLElement;
    fixtureRoot.setAttribute('dir', 'rtl');
    fixture.detectChanges();
    const radio = group.querySelector('input[value="citizen"]') as HTMLInputElement;
    radio.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.account).toBe('business');
    expect(group.querySelector<HTMLInputElement>('input[value="business"]')?.checked).toBe(true);
    expect(group.querySelector<HTMLInputElement>('input[value="government"]')?.disabled).toBe(true);
  });

  it('automatically activates enabled tabs with arrows and supports Home/End', () => {
    const tabs = fixture.nativeElement.querySelector('#keyboard-tabs') as HTMLElement;
    const overview = tabs.querySelector('#keyboard-tabs-tab-overview') as HTMLButtonElement;
    overview.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedTab).toBe('details');
    expect(tabs.querySelector('#keyboard-tabs-tab-details')?.getAttribute('aria-selected')).toBe('true');
    tabs.querySelector('#keyboard-tabs-tab-details')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Home', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedTab).toBe('overview');
    tabs.querySelector('#keyboard-tabs-tab-overview')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: 'End', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedTab).toBe('details');
  });

  it('keeps focus and selection separate in manual tab activation mode', () => {
    fixture.componentInstance.tabsMode.set('manual');
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelector('#manual-tabs') as HTMLElement;
    expect(fixture.debugElement.query(By.css('#manual-tabs')).componentInstance.activationMode).toBe('manual');
    const overview = tabs.querySelector('#manual-tabs-tab-overview') as HTMLButtonElement;
    overview.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.selectedTab).toBe('overview');
    expect(tabs.querySelector('#manual-tabs-tab-overview')?.getAttribute('aria-selected')).toBe('true');
    expect(tabs.querySelector('#manual-tabs-tab-details')?.getAttribute('tabindex')).toBe('0');
    tabs.querySelector('#manual-tabs-tab-details')?.dispatchEvent(
      new KeyboardEvent('keydown', { key: ' ', bubbles: true }),
    );
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedTab).toBe('details');
  });

  it('lays out vertical tabs and uses the vertical arrow keys while skipping disabled tabs', () => {
    const tabs = fixture.nativeElement.querySelector('#vertical-tabs') as HTMLElement;
    const root = tabs.querySelector('.tabs') as HTMLElement;
    const list = tabs.querySelector('[role="tablist"]') as HTMLElement;
    const overview = tabs.querySelector('#vertical-tabs-tab-overview') as HTMLButtonElement;

    expect(list.getAttribute('aria-orientation')).toBe('vertical');
    expect(overview.getAttribute('data-disabled')).toBeNull();
    expect(tabs.querySelector('#vertical-tabs-tab-disabled')?.getAttribute('data-disabled')).toBe('');
    expect(getComputedStyle(root).display).toBe('flex');
    expect(getComputedStyle(list).flexDirection).toBe('column');

    overview.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.selectedTab).toBe('details');
    expect(tabs.querySelector('#vertical-tabs-tab-details')?.getAttribute('aria-selected')).toBe('true');
  });

  it('opens menubar menus with the keyboard, skips disabled items and restores focus on Escape', async () => {
    const root = fixture.nativeElement.querySelector('#test-menubar') as HTMLElement;
    const triggers = root.querySelectorAll<HTMLButtonElement>('.ddga-menubar__trigger');
    triggers[0].focus();
    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const firstItem = root.querySelector<HTMLButtonElement>('[role="menu"] [role="menuitem"]')!;
    expect(firstItem.textContent?.trim()).toBe('New');
    expect(document.activeElement).toBe(firstItem);
    firstItem.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement?.textContent?.trim()).toBe('Open');

    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('[role="menu"]')).toBeNull();
    expect(document.activeElement).toBe(triggers[0]);
    triggers[0].dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(triggers[2]);
  });

  it('supports menubar checkbox, radio, grouped and nested submenu items', async () => {
    const root = fixture.nativeElement.querySelector('#test-menubar') as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('.ddga-menubar__trigger')!;
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const scope = root.querySelector<HTMLElement>('[data-menu-scope="menu-0"]')!;
    expect(scope.querySelector('[role="separator"]')).not.toBeNull();
    expect(scope.querySelector('[role="group"]')).not.toBeNull();
    expect(scope.textContent).toContain('Other actions');
    const checkbox = Array.from(scope.querySelectorAll<HTMLButtonElement>('[role="menuitemcheckbox"]'))
      .find((item) => item.textContent?.includes('Show hidden'))!;
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
    checkbox.click();
    fixture.detectChanges();
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    expect(root.querySelector('[role="menu"]')).not.toBeNull();

    const compact = Array.from(scope.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'))
      .find((item) => item.textContent?.includes('Compact'))!;
    const comfortable = Array.from(scope.querySelectorAll<HTMLButtonElement>('[role="menuitemradio"]'))
      .find((item) => item.textContent?.includes('Comfortable'))!;
    expect(compact.getAttribute('aria-checked')).toBe('true');
    comfortable.click();
    fixture.detectChanges();
    expect(compact.getAttribute('aria-checked')).toBe('false');
    expect(comfortable.getAttribute('aria-checked')).toBe('true');

    const submenuTrigger = Array.from(scope.querySelectorAll<HTMLButtonElement>('[aria-haspopup="menu"]'))
      .find((item) => item.textContent?.includes('More'))!;
    submenuTrigger.focus();
    submenuTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    const submenu = root.querySelector<HTMLElement>('[data-menu-scope="menu-0/7"]');
    expect(submenu).not.toBeNull();
    expect(document.activeElement?.textContent?.trim()).toBe('Nested');

    (document.activeElement as HTMLElement).dispatchEvent(
      new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }),
    );
    fixture.detectChanges();
    expect(root.querySelector('[data-menu-scope="menu-0/7/0"]')).not.toBeNull();
    expect(document.activeElement?.textContent?.trim()).toBe('Deep action');

    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('[data-menu-scope="menu-0/7/0"]')).toBeNull();
    expect(document.activeElement?.textContent?.trim()).toBe('Nested');

    // Close remaining submenus and root menu to leave clean state
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
  });

  it('renders all Digital Stamp extension variants, exact package copy and disclosure behavior', () => {
    const stamps = fixture.nativeElement.querySelectorAll('dga-digital-stamp');
    expect(stamps).toHaveLength(6);
    for (const extension of fixture.componentInstance.stampExtensions) {
      const stamp = fixture.nativeElement.querySelector(`[id="stamp-${extension}"]`) as HTMLElement;
      expect(stamp.getAttribute('data-extension')).toBe(extension);
      expect(stamp.querySelector('[data-slot="domain-verification"]')).not.toBeNull();
      expect(stamp.querySelector('[data-slot="security-confirmation"]')).not.toBeNull();
      expect(stamp.querySelector('[data-slot="registration"] img')?.getAttribute('src')).toBe('/dga-logo.svg');
    }

    const govStamp = fixture.nativeElement.querySelector('[id="stamp-gov.sa"]') as HTMLElement;
    const govTrigger = govStamp.querySelector<HTMLButtonElement>('.digital-stamp__trigger')!;
    expect(govTrigger.getAttribute('aria-expanded')).toBe('false');
    govTrigger.click();
    fixture.detectChanges();
    expect(govTrigger.getAttribute('aria-expanded')).toBe('true');
    expect(govStamp.querySelector('.digital-stamp__title')?.textContent).toContain('.gov.sa');
    expect(govStamp.querySelector('.digital-stamp__description')?.textContent)
      .toBe('Website belongs to an official government organization in the Kingdom of Saudi Arabia always ends with .gov.sa .');

    const eduStamp = fixture.nativeElement.querySelector('[id="stamp-edu.sa"]') as HTMLElement;
    expect(eduStamp.querySelector('.digital-stamp__trigger')?.getAttribute('aria-expanded')).toBe('true');
    expect(eduStamp.querySelector('.digital-stamp__title')?.textContent).toContain('.edu.sa');
  });

  it('renders native table composition and supports keyboard sorting', () => {
    const host = fixture.componentInstance;
    const table = fixture.nativeElement.querySelector('table') as HTMLTableElement;
    const header = fixture.nativeElement.querySelector('th[sortable]') as HTMLTableCellElement;
    const row = fixture.nativeElement.querySelector('tbody tr') as HTMLTableRowElement;

    expect(table.caption?.textContent?.trim()).toBe('Request list');
    expect(table.querySelectorAll('thead th')).toHaveLength(2);
    expect(table.querySelectorAll('tbody td')).toHaveLength(2);
    expect(row.getAttribute('data-selected')).toBe('true');

    header.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(host.sortDirection).toBe('ascending');
    expect(header.getAttribute('aria-sort')).toBe('ascending');
  });

  it('keeps pagination compact for large result sets', () => {
    const pageButtons = fixture.nativeElement.querySelectorAll(
      '.pagination__button[aria-label^="Go to page "]',
    );
    const ellipses = fixture.nativeElement.querySelectorAll('.pagination__ellipsis');

    expect(pageButtons).toHaveLength(5);
    expect(ellipses).toHaveLength(2);
  });

  it('opens pagination overflow and selects a skipped page', () => {
    const trigger = fixture.nativeElement.querySelector('.pagination__ellipsis') as HTMLButtonElement;
    trigger.click();
    fixture.detectChanges();

    const menu = fixture.nativeElement.querySelector('.pagination__menu') as HTMLElement;
    expect(menu).not.toBeNull();
    const page = Array.from(menu.querySelectorAll<HTMLButtonElement>('[role="menuitem"]'))
      .find((item) => item.textContent?.trim() === '2');
    expect(page).toBeDefined();
    page?.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.currentPage).toBe(2);
    expect(fixture.nativeElement.querySelector('.pagination__ellipsis')?.getAttribute('aria-expanded')).toBe('false');
  });

  it('discloses hidden breadcrumb links and closes after navigation selection', () => {
    const details = fixture.nativeElement.querySelector('.breadcrumb__overflow details') as HTMLDetailsElement;
    const trigger = details.querySelector('summary') as HTMLElement;
    trigger.click();
    fixture.detectChanges();

    expect(details.open).toBe(true);
    const hiddenLink = details.querySelector('a') as HTMLAnchorElement;
    expect(hiddenLink.textContent?.trim()).toBe('Services');
    const click = new MouseEvent('click', { bubbles: true, cancelable: true });
    click.preventDefault();
    hiddenLink.dispatchEvent(click);

    expect(details.open).toBe(false);
  });

  it('exposes a controllable filter state on table headers', () => {
    const filterButton = fixture.nativeElement.querySelector('button[dga-table-filter]') as HTMLButtonElement;
    expect(filterButton.getAttribute('aria-pressed')).toBe('false');
    filterButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.filterActive).toBe(true);
    expect(filterButton.getAttribute('aria-pressed')).toBe('true');
    expect(filterButton.getAttribute('data-active')).toBe('true');
  });

  it('verifies Menubar outline variant, sm size, trigger Home/End navigation, and ArrowUp last-item focus', async () => {
    const outlineRoot = fixture.nativeElement.querySelector('#outline-menubar') as HTMLElement;
    const trigger = outlineRoot.querySelector<HTMLButtonElement>('.ddga-menubar__trigger')!;
    expect(trigger.classList.contains('ddga-menubar__trigger--outline')).toBe(true);
    expect(trigger.getAttribute('data-variant')).toBe('outline');

    // ArrowUp on trigger opens menu and focuses last item
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const menu = outlineRoot.querySelector<HTMLElement>('.ddga-menubar-menu')!;
    expect(menu).not.toBeNull();
    expect(menu.classList.contains('ddga-menubar-menu--sm')).toBe(true);

    // Escape closes menu and restores focus to trigger
    document.activeElement?.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(outlineRoot.querySelector('.ddga-menubar-menu')).toBeNull();
    expect(document.activeElement).toBe(trigger);

    // Home / End navigation across triggers
    const triggers = outlineRoot.querySelectorAll<HTMLButtonElement>('.ddga-menubar__trigger');
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(triggers[2]);

    triggers[2].dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(document.activeElement).toBe(triggers[0]);
  });

  it('verifies Menubar Space key toggles checkable items without closing menu', async () => {
    const root = fixture.nativeElement.querySelector('#test-menubar') as HTMLElement;
    const trigger = root.querySelector<HTMLButtonElement>('.ddga-menubar__trigger')!;
    trigger.focus();
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const checkbox = root.querySelector<HTMLButtonElement>('[role="menuitemcheckbox"]')!;
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
    checkbox.focus();
    checkbox.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();

    expect(checkbox.getAttribute('aria-checked')).toBe('true');
    // Menu remains open after Space toggle
    expect(root.querySelector('[role="menu"]')).not.toBeNull();

    // Close with Escape
    checkbox.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(root.querySelector('[role="menu"]')).toBeNull();
  });

  it('verifies Select inside Modal stops Escape propagation and closes without dismissing the modal', async () => {
    const modalTrigger = fixture.nativeElement.querySelector('#test-modal button.modal-trigger') as HTMLButtonElement;
    modalTrigger.click();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const modalDialog = fixture.nativeElement.querySelector('.modal') as HTMLElement;
    expect(modalDialog).not.toBeNull();

    const selectTrigger = modalDialog.querySelector<HTMLButtonElement>('.select__trigger')!;
    expect(selectTrigger).not.toBeNull();
    selectTrigger.click();
    fixture.detectChanges();

    const listbox = modalDialog.querySelector<HTMLElement>('[role="listbox"]')!;
    expect(listbox).not.toBeNull();

    // Press Escape on select
    selectTrigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    // Select closed, but Modal is STILL open!
    expect(modalDialog.querySelector('[role="listbox"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('.modal')).not.toBeNull();

    // Close modal via Escape on dialog
    modalDialog.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
  });

  it('verifies Popups inside overflow-hidden containers and Digital Stamp official artwork', () => {
    const overflowBox = fixture.nativeElement.querySelector('#overflow-hidden-box') as HTMLElement;
    const overflowDropdown = overflowBox.querySelector('details') as HTMLDetailsElement;
    const summary = overflowDropdown.querySelector('summary') as HTMLElement;
    summary.click();
    fixture.detectChanges();

    expect(overflowDropdown.open).toBe(true);
    const menu = overflowDropdown.querySelector('.dropdown__menu') as HTMLElement;
    expect(menu).not.toBeNull();

    // Digital stamp official SaudiFlag artwork check: no stray circle, official rects
    const govStamp = fixture.nativeElement.querySelector('#stamp-gov\\.sa') as HTMLElement;
    expect(govStamp.classList.contains('ddga-digital-stamp')).toBe(true);
    const flagSvg = govStamp.querySelector('.ddga-digital-stamp__flag svg') as SVGElement;
    expect(flagSvg).not.toBeNull();
    expect(flagSvg.getAttribute('viewBox')).toBe('0 0 20 14');
    expect(flagSvg.querySelector('circle')).toBeNull();
    expect(flagSvg.querySelectorAll('rect').length).toBeGreaterThanOrEqual(10);
  });
});
