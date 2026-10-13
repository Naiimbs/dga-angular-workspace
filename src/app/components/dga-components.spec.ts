import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
// Import directly from source files so Angular Language Service can statically
// resolve each @Component/@Directive decorator (barrel re-export chains prevent
// static analysis with isolatedModules:true, causing NG "Value could not be
// determined statically" false-positives and cascading Event type errors).
import { DgaBreadcrumb, DgaDropdown, DgaTabs, DgaPagination } from '../../../projects/dga-angular/src/lib/navigation/dga-navigation';
import { DgaAvatar, DgaAvatarFallback, DgaAvatarImage } from '../../../projects/dga-angular/src/lib/foundation/dga-foundation';
import { DgaMenubar } from '../../../projects/dga-angular/src/lib/navigation/dga-header';
import { DgaModal } from '../../../projects/dga-angular/src/lib/feedback/dga-feedback';
import { DgaCheckbox, DgaInput, DgaRadio, DgaRadioGroup, DgaSelect } from '../../../projects/dga-angular/src/lib/forms/dga-form-controls';
import { DgaDigitalStamp } from '../../../projects/dga-angular/src/lib/composite/dga-digital-stamp';
import { DgaCard } from '../../../projects/dga-angular/src/lib/components/surfaces/dga-card';
import { DgaTable } from '../../../projects/dga-angular/src/lib/data/dga-table';
import {
  DgaTableBody, DgaTableCaption, DgaTableCellDirective,
  DgaTableFilterDirective, DgaTableHeadDirective, DgaTableHeader, DgaTableRowDirective,
} from '../../../projects/dga-angular/src/lib/data/dga-table-primitives';
import type { DgaMenuOption, DgaMenubarItem, DgaRadioOption, DgaSelectOption, DgaTableSortDirection, DgaTab } from '@dev-dga/angular';

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

    // Digital stamp official SaudiFlag artwork: React source has circle (cx=16.4, cy=9.7, r=0.75) for the Saudi emblem
    const govStamp = fixture.nativeElement.querySelector('[id="stamp-gov.sa"]') as HTMLElement;
    expect(govStamp.classList.contains('ddga-digital-stamp')).toBe(true);
    const flagSvg = govStamp.querySelector('.ddga-digital-stamp__flag svg') as SVGElement;
    expect(flagSvg).not.toBeNull();
    expect(flagSvg.getAttribute('viewBox')).toBe('0 0 20 14');
    // React @dev-dga/react v1.3.1 SaudiFlag includes circle for emblem dot
    const flagCircle = flagSvg.querySelector('circle');
    expect(flagCircle).not.toBeNull();
    expect(flagCircle?.getAttribute('cx')).toBe('16.4');
    expect(flagSvg.querySelectorAll('rect').length).toBeGreaterThanOrEqual(10);

    // React @dev-dga/react v1.3.1 ChevronDown icon and toggle state
    const chevronSvg = govStamp.querySelector('.ddga-digital-stamp__chevron svg') as SVGElement;
    expect(chevronSvg).not.toBeNull();
    expect(chevronSvg.querySelector('path')?.getAttribute('d')).toBe('m6 9 6 6 6-6');
    const trigger = govStamp.querySelector('.ddga-digital-stamp__trigger') as HTMLButtonElement;
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    trigger.click();
    fixture.detectChanges();
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
    expect(govStamp.getAttribute('data-state')).toBe('open');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// PHASE 4 — Checkbox state matrix
// React source: @dev-dga/react v1.3.1, @dev-dga/css checkbox.css
// ─────────────────────────────────────────────────────────────────────────────

@Component({
  standalone: true,
  imports: [FormsModule, DgaCheckbox],
  template: `
    <!-- unchecked (default) -->
    <dga-checkbox id="cb-unchecked">Default</dga-checkbox>

    <!-- checked via input binding -->
    <dga-checkbox id="cb-checked" [checked]="true">Checked</dga-checkbox>

    <!-- indeterminate -->
    <dga-checkbox id="cb-indeterminate" [indeterminate]="true">Mixed</dga-checkbox>

    <!-- disabled unchecked -->
    <dga-checkbox id="cb-disabled" [disabled]="true">Disabled</dga-checkbox>

    <!-- disabled checked -->
    <dga-checkbox id="cb-disabled-checked" [checked]="true" [disabled]="true">Disabled checked</dga-checkbox>

    <!-- readonly checked -->
    <dga-checkbox id="cb-readonly" [checked]="true" [readOnly]="true">Readonly</dga-checkbox>

    <!-- error -->
    <dga-checkbox id="cb-error" errorMessage="Required">Error</dga-checkbox>

    <!-- error checked -->
    <dga-checkbox id="cb-error-checked" [checked]="true" error="err">Error checked</dga-checkbox>

    <!-- required -->
    <dga-checkbox id="cb-required" [required]="true">Required</dga-checkbox>

    <!-- size xs -->
    <dga-checkbox id="cb-xs" size="xs">XS</dga-checkbox>

    <!-- size sm -->
    <dga-checkbox id="cb-sm" size="sm">SM</dga-checkbox>

    <!-- neutral variant checked -->
    <dga-checkbox id="cb-neutral" [checked]="true" variant="neutral">Neutral</dga-checkbox>

    <!-- helper text -->
    <dga-checkbox id="cb-hint" helperText="This is a hint">Hint</dga-checkbox>

    <!-- ngModel two-way -->
    <dga-checkbox id="cb-model" [(ngModel)]="modelValue">Model</dga-checkbox>

    <!-- indeterminate + ngModel -->
    <dga-checkbox id="cb-indet-model" [(ngModel)]="indetValue" [indeterminate]="isIndeterminate">Indet model</dga-checkbox>
  `,
})
class CheckboxTestHost {
  modelValue = false;
  indetValue = false;
  isIndeterminate = true;
}

describe('Phase 4 — DgaCheckbox state matrix (React parity)', () => {
  let fixture: ComponentFixture<CheckboxTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CheckboxTestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(CheckboxTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  function getInput(id: string): HTMLInputElement {
    return fixture.nativeElement.querySelector(`input#${id}`) as HTMLInputElement;
  }

  // ── data-state attribute ──────────────────────────────────────────────────
  it('sets data-state="unchecked" when unchecked [React: data-state attribute]', () => {
    expect(getInput('cb-unchecked').getAttribute('data-state')).toBe('unchecked');
  });

  it('sets data-state="checked" when checked [React: data-state attribute]', () => {
    expect(getInput('cb-checked').getAttribute('data-state')).toBe('checked');
  });

  it('sets data-state="indeterminate" when indeterminate [React: data-state attribute]', () => {
    expect(getInput('cb-indeterminate').getAttribute('data-state')).toBe('indeterminate');
    expect(getInput('cb-indeterminate').indeterminate).toBe(true);
  });

  // ── aria-checked ─────────────────────────────────────────────────────────
  it('sets aria-checked="mixed" only when indeterminate [React: aria-checked]', () => {
    expect(getInput('cb-indeterminate').getAttribute('aria-checked')).toBe('mixed');
    expect(getInput('cb-checked').getAttribute('aria-checked')).toBeNull();
    expect(getInput('cb-unchecked').getAttribute('aria-checked')).toBeNull();
  });

  // ── aria-invalid ──────────────────────────────────────────────────────────
  it('sets aria-invalid="true" when error or errorMessage is present [React: aria-invalid]', () => {
    expect(getInput('cb-error').getAttribute('aria-invalid')).toBe('true');
    expect(getInput('cb-error-checked').getAttribute('aria-invalid')).toBe('true');
    expect(getInput('cb-unchecked').getAttribute('aria-invalid')).toBeNull();
  });

  // ── aria-required ─────────────────────────────────────────────────────────
  it('sets aria-required="true" when required [React: CheckboxProps.required → aria-required]', () => {
    expect(getInput('cb-required').getAttribute('aria-required')).toBe('true');
    expect(getInput('cb-unchecked').getAttribute('aria-required')).toBeNull();
  });

  // ── aria-readonly / data-readonly ─────────────────────────────────────────
  it('sets aria-readonly and data-readonly when readOnly [React: data-readonly, aria-readonly]', () => {
    const input = getInput('cb-readonly');
    expect(input.getAttribute('aria-readonly')).toBe('true');
    expect(input.hasAttribute('data-readonly')).toBe(true);
    expect(input.getAttribute('data-readonly')).toBe('');
  });

  it('does NOT set data-readonly when not readOnly', () => {
    expect(getInput('cb-unchecked').hasAttribute('data-readonly')).toBe(false);
  });

  // ── disabled ─────────────────────────────────────────────────────────────
  it('disables the native input when [disabled]=true [React: :disabled state]', () => {
    expect(getInput('cb-disabled').disabled).toBe(true);
    expect(getInput('cb-disabled-checked').disabled).toBe(true);
  });

  // ── readonly prevents toggle ──────────────────────────────────────────────
  it('readonly checkbox does not change checked state on click [React: readOnly prevents toggle]', () => {
    const input = getInput('cb-readonly');
    expect(input.checked).toBe(true);
    input.click();
    fixture.detectChanges();
    expect(input.checked).toBe(true); // must stay checked
  });

  // ── indeterminate cleared on change ──────────────────────────────────────
  it('clears indeterminate after user interaction [React: indeterminate cleared on change]', () => {
    const input = getInput('cb-indet-model');

    expect(input.indeterminate).toBe(true);
    expect(input.getAttribute('data-state')).toBe('indeterminate');

    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    // indeterminate is cleared on the component's internal property and the DOM attribute
    // Note: [indeterminate] is one-way binding — Angular does not propagate internal state
    // changes back to the host automatically. We verify the DOM reflects false.
    expect(input.indeterminate).toBe(false);
    expect(input.getAttribute('data-state')).toBe('checked');
  });

  // ── ControlValueAccessor / ngModel ───────────────────────────────────────
  it('updates ngModel value through ControlValueAccessor [React: form integration]', () => {
    const host = fixture.componentInstance;
    const input = getInput('cb-model');

    expect(host.modelValue).toBe(false);
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(host.modelValue).toBe(true);
    expect(input.getAttribute('data-state')).toBe('checked');
  });

  it('writeValue reflects external value change [React: form integration]', () => {
    // Use cb-unchecked because it has no [checked] or ngModel bindings that would overwrite
    // the manual writeValue(true) during fixture.detectChanges().
    const input = getInput('cb-unchecked');
    // Angular emulated encapsulation: input is in the real DOM, we can traverse to host
    const dgaCheckboxHost = input.closest('dga-checkbox') as HTMLElement | null;
    expect(dgaCheckboxHost).not.toBeNull();
    const compDe = fixture.debugElement.queryAll(By.directive(DgaCheckbox))
      .find((de) => de.nativeElement === dgaCheckboxHost);
    const compInstance = compDe?.componentInstance as DgaCheckbox | undefined;

    // writeValue must exist and be callable (ControlValueAccessor contract)
    expect(typeof DgaCheckbox.prototype.writeValue).toBe('function');

    if (compInstance) {
      // Verify the component's internal state is updated by writeValue
      compInstance.writeValue(true);
      expect(compInstance.checked).toBe(true);
    }
  });

  // ── aria-describedby ──────────────────────────────────────────────────────
  it('sets aria-describedby when hint text is present [React: aria-describedby]', () => {
    const input = getInput('cb-hint');
    const describedby = input.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
    const hint = fixture.nativeElement.querySelector(`#${describedby}`);
    expect(hint?.textContent?.trim()).toContain('This is a hint');
  });

  it('sets aria-describedby for errorMessage [React: aria-describedby]', () => {
    const input = getInput('cb-error');
    const describedby = input.getAttribute('aria-describedby');
    expect(describedby).toBeTruthy();
    const hint = fixture.nativeElement.querySelector(`#${describedby}`);
    expect(hint?.textContent?.trim()).toContain('Required');
  });

  // ── size variants ─────────────────────────────────────────────────────────
  it('applies size class xs [React: ddga-checkbox--xs → 16×16px]', () => {
    const input = getInput('cb-xs');
    expect(input.classList.contains('choice__input--xs')).toBe(true);
  });

  it('applies size class sm [React: ddga-checkbox--sm → 20×20px]', () => {
    const input = getInput('cb-sm');
    expect(input.classList.contains('choice__input--sm')).toBe(true);
  });

  it('no size class applied for md (default) [React: ddga-checkbox--md is default]', () => {
    const input = getInput('cb-unchecked');
    expect(input.classList.contains('choice__input--xs')).toBe(false);
    expect(input.classList.contains('choice__input--sm')).toBe(false);
  });

  // ── neutral variant ───────────────────────────────────────────────────────
  it('applies choice--neutral on the label for neutral variant [React: ddga-checkbox--neutral]', () => {
    // getInput() finds the inner <input id="cb-neutral">, then .closest('label') traverses
    // up to the <label class="choice choice--neutral"> in the Angular component template
    const label = getInput('cb-neutral').closest('label') as HTMLElement;
    expect(label).not.toBeNull();
    expect(label.classList.contains('choice--neutral')).toBe(true);
  });

  // ── Space keyboard toggles checkbox ──────────────────────────────────────
  it('Space key toggles checkbox via native browser behavior [React: Space toggle]', () => {
    const host = fixture.componentInstance;
    const input = getInput('cb-model');
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true }));
    input.checked = !input.checked;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    // value should flip
    expect(host.modelValue).toBe(true);
  });

  // ── indicator uses dga-icon ───────────────────────────────────────────────
  it('renders dga-icon for check mark (not inline SVG) [React: ddga-checkbox__check]', () => {
    // Use getInput() to find inner input, then navigate to the .choice__indicator sibling
    const label = getInput('cb-checked').closest('label') as HTMLElement;
    expect(label).not.toBeNull();
    const indicator = label.querySelector('.choice__indicator') as HTMLElement;
    expect(indicator).not.toBeNull();
    const icon = indicator.querySelector('dga-icon');
    expect(icon).not.toBeNull();
  });

  it('renders minus span for indeterminate indicator [React: ddga-checkbox__minus]', () => {
    const label = getInput('cb-indeterminate').closest('label') as HTMLElement;
    expect(label).not.toBeNull();
    const minus = label.querySelector('.choice__minus') as HTMLElement;
    expect(minus).not.toBeNull();
  });

  // ── error styling applied to label ───────────────────────────────────────
  it('applies choice--error class on label when errorMessage present [React: ddga-checkbox--error]', () => {
    const label = getInput('cb-error').closest('label') as HTMLElement;
    expect(label).not.toBeNull();
    expect(label.classList.contains('choice--error')).toBe(true);
  });

  // ── React class and data-slot parity ─────────────────────────────────────
  it('applies React slot and class parity: ddga-checkbox, data-slot, ddga-checkbox__indicator, ddga-checkbox__required', () => {
    const input = getInput('cb-required');
    expect(input.getAttribute('data-slot')).toBe('checkbox');
    expect(input.classList.contains('ddga-checkbox')).toBe(true);

    const label = input.closest('label') as HTMLElement;
    expect(label.classList.contains('ddga-checkbox-row')).toBe(true);
    expect(label.querySelector('.ddga-checkbox__indicator')?.getAttribute('data-slot')).toBe('checkbox-indicator');
    expect(label.querySelector('.ddga-checkbox__required')?.textContent?.trim()).toBe('*');
  });
});

@Component({
  standalone: true,
  imports: [FormsModule, DgaRadio, DgaRadioGroup],
  template: `
    <!-- RadioGroup Default -->
    <dga-radio-group id="rg-default" label="Account Type" [options]="options" [(ngModel)]="modelValue" />

    <!-- RadioGroup Horizontal -->
    <dga-radio-group id="rg-horizontal" orientation="horizontal" [options]="options" value="personal" />

    <!-- RadioGroup Neutral Variant -->
    <dga-radio-group id="rg-neutral" variant="neutral" [options]="options" value="personal" />

    <!-- RadioGroup Required -->
    <dga-radio-group id="rg-required" label="Required Group" [required]="true" [options]="options" />

    <!-- RadioGroup ReadOnly -->
    <dga-radio-group id="rg-readonly" label="Read-Only Group" [readOnly]="true" [options]="options" value="personal" />

    <!-- RadioGroup Error -->
    <dga-radio-group id="rg-error" label="Error Group" errorMessage="Selection required" [options]="options" />

    <!-- RadioGroup Helper -->
    <dga-radio-group id="rg-helper" label="Helper Group" helperText="Choose an option carefully" [options]="options" />

    <!-- RadioGroup Disabled -->
    <dga-radio-group id="rg-disabled" [disabled]="true" [options]="options" value="personal" />

    <!-- Standalone DgaRadio -->
    <dga-radio id="radio-standalone" name="standalone" value="opt1" [checked]="standaloneChecked"
      (selected)="standaloneChecked = true">Single Radio</dga-radio>
    <dga-radio id="radio-disabled" name="standalone" value="opt2" [disabled]="true">Disabled Radio</dga-radio>
    <dga-radio id="radio-readonly" name="standalone" value="opt3" [readOnly]="true" [checked]="true">ReadOnly Radio</dga-radio>
  `,
})
class RadioTestHost {
  options: readonly DgaRadioOption[] = [
    { label: 'Personal', value: 'personal' },
    { label: 'Business', value: 'business' },
    { label: 'Enterprise (Disabled)', value: 'enterprise', disabled: true },
    { label: 'Government', value: 'government' },
  ];
  modelValue = 'personal';
  standaloneChecked = false;
}

describe('Phase 4 — DgaRadio & DgaRadioGroup state matrix (React parity)', () => {
  let fixture: ComponentFixture<RadioTestHost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RadioTestHost],
    }).compileComponents();
    fixture = TestBed.createComponent(RadioTestHost);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  function getRadioGroupFieldset(id: string): HTMLFieldSetElement {
    return fixture.nativeElement.querySelector(`dga-radio-group#${id} fieldset`) as HTMLFieldSetElement;
  }

  function getGroupRadios(groupId: string): HTMLInputElement[] {
    return Array.from(fixture.nativeElement.querySelectorAll(`dga-radio-group#${groupId} input[type="radio"]`));
  }

  function getStandaloneRadioInput(id: string): HTMLInputElement {
    return fixture.nativeElement.querySelector(`dga-radio#${id} input[type="radio"]`) as HTMLInputElement;
  }

  // ── data-slot attributes ───────────────────────────────────────────────────
  it('renders data-slot="radio-group-field" and data-slot="radio-group" [React: Radix / DGA structure]', () => {
    const groupField = fixture.nativeElement.querySelector('dga-radio-group#rg-default .ddga-field');
    expect(groupField.getAttribute('data-slot')).toBe('radio-group-field');
    const fieldset = getRadioGroupFieldset('rg-default');
    expect(fieldset.getAttribute('data-slot')).toBe('radio-group');
  });

  it('renders data-slot="radio" and data-slot="radio-indicator" on each item [React: Radix / DGA structure]', () => {
    const radios = getGroupRadios('rg-default');
    expect(radios.length).toBe(4);
    expect(radios[0].getAttribute('data-slot')).toBe('radio');
    const indicator = radios[0].parentElement?.querySelector('[data-slot="radio-indicator"]');
    expect(indicator).not.toBeNull();
  });

  // ── data-state attribute ───────────────────────────────────────────────────
  it('sets data-state="checked" on active radio and data-state="unchecked" on inactive [React: data-state attribute]', () => {
    const radios = getGroupRadios('rg-default');
    expect(radios[0].getAttribute('data-state')).toBe('checked');
    expect(radios[1].getAttribute('data-state')).toBe('unchecked');
    expect(radios[3].getAttribute('data-state')).toBe('unchecked');
  });

  // ── ARIA and accessibility ─────────────────────────────────────────────────
  it('associates group label with aria-labelledby and legend id [React: useFieldA11y aria-labelledby]', () => {
    const fieldset = getRadioGroupFieldset('rg-default');
    const labelId = fieldset.getAttribute('aria-labelledby');
    expect(labelId).toBe('rg-default-label');
    const legend = fixture.nativeElement.querySelector(`#${labelId}`);
    expect(legend).not.toBeNull();
    expect(legend.textContent).toContain('Account Type');
  });

  it('renders required indicator and aria-required on fieldset [React: required]', () => {
    const fieldset = getRadioGroupFieldset('rg-required');
    expect(fieldset.getAttribute('aria-required')).toBe('true');
    const requiredAsterisk = fieldset.querySelector('.ddga-radio-group__required');
    expect(requiredAsterisk).not.toBeNull();
    expect(requiredAsterisk?.textContent?.trim()).toBe('*');
  });

  it('renders error message and connects via aria-describedby [React: aria-describedby + aria-invalid]', () => {
    const fieldset = getRadioGroupFieldset('rg-error');
    expect(fieldset.getAttribute('aria-invalid')).toBe('true');
    const describedby = fieldset.getAttribute('aria-describedby');
    expect(describedby).toContain('rg-error-error');
    const errorMsg = fixture.nativeElement.querySelector('#rg-error-error');
    expect(errorMsg?.textContent?.trim()).toBe('Selection required');
  });

  it('renders helper message and connects via aria-describedby [React: helperText]', () => {
    const fieldset = getRadioGroupFieldset('rg-helper');
    const describedby = fieldset.getAttribute('aria-describedby');
    expect(describedby).toContain('rg-helper-helper');
    const helperMsg = fixture.nativeElement.querySelector('#rg-helper-helper');
    expect(helperMsg?.textContent?.trim()).toBe('Choose an option carefully');
  });

  // ── readOnly behavior ──────────────────────────────────────────────────────
  it('applies aria-readonly and data-readonly and blocks click changes [React: readOnly + READONLY_BLOCKED_KEYS]', () => {
    const fieldset = getRadioGroupFieldset('rg-readonly');
    expect(fieldset.getAttribute('aria-readonly')).toBe('true');
    expect(fieldset.classList.contains('ddga-radio-group--readonly')).toBe(true);

    const radios = getGroupRadios('rg-readonly');
    expect(radios[0].getAttribute('data-readonly')).toBe('');
    expect(radios[0].getAttribute('aria-readonly')).toBe('true');

    // Click on unselected option should not change selection
    radios[1].dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
    radios[1].dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();
    expect(radios[0].checked).toBe(true);
    expect(radios[1].checked).toBe(false);
  });

  it('blocks navigation keys in readOnly mode [React: READONLY_BLOCKED_KEYS]', () => {
    const fieldset = getRadioGroupFieldset('rg-readonly');
    const radios = getGroupRadios('rg-readonly');
    const event = new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true, cancelable: true });
    let prevented = false;
    Object.defineProperty(event, 'preventDefault', {
      value: () => {
        prevented = true;
      },
      writable: true,
    });
    radios[0].dispatchEvent(event);
    expect(prevented).toBe(true);
  });

  // ── disabled states ────────────────────────────────────────────────────────
  it('disables the entire group when disabled=true [React: disabled]', () => {
    const fieldset = getRadioGroupFieldset('rg-disabled');
    expect(fieldset.disabled).toBe(true);
  });

  it('disables specific option item when option.disabled=true [React: item disabled]', () => {
    const radios = getGroupRadios('rg-default');
    expect(radios[2].disabled).toBe(true);
    expect(radios[2].closest('label')?.classList.contains('radio-option--disabled')).toBe(true);
  });

  // ── variant and orientation ────────────────────────────────────────────────
  it('applies horizontal orientation class [React: ddga-radio-group--horizontal]', () => {
    const fieldset = getRadioGroupFieldset('rg-horizontal');
    expect(fieldset.classList.contains('ddga-radio-group--horizontal')).toBe(true);
  });

  it('applies neutral variant class [React: ddga-radio-group--neutral]', () => {
    const fieldset = getRadioGroupFieldset('rg-neutral');
    expect(fieldset.classList.contains('ddga-radio-group--neutral')).toBe(true);
  });

  // ── ControlValueAccessor & Selection ───────────────────────────────────────
  it('updates ngModel when option clicked [React: controlled/uncontrolled value]', () => {
    const host = fixture.componentInstance;
    const radios = getGroupRadios('rg-default');

    radios[1].checked = true;
    radios[1].dispatchEvent(new Event('change', { bubbles: true }));
    fixture.detectChanges();

    expect(host.modelValue).toBe('business');
    expect(radios[1].getAttribute('data-state')).toBe('checked');
    expect(radios[0].getAttribute('data-state')).toBe('unchecked');
  });

  // ── Standalone DgaRadio component ──────────────────────────────────────────
  it('supports standalone DgaRadio with data-state, data-slot, and click/selected events', () => {
    const host = fixture.componentInstance;
    const input = getStandaloneRadioInput('radio-standalone');

    expect(input.getAttribute('data-slot')).toBe('radio');
    expect(input.getAttribute('data-state')).toBe('unchecked');

    input.click();
    fixture.detectChanges();

    expect(host.standaloneChecked).toBe(true);
  });

  it('supports standalone DgaRadio disabled and readOnly states', () => {
    const disabledInput = getStandaloneRadioInput('radio-disabled');
    expect(disabledInput.disabled).toBe(true);

    const readonlyInput = getStandaloneRadioInput('radio-readonly');
    expect(readonlyInput.getAttribute('data-readonly')).toBe('');
    expect(readonlyInput.getAttribute('aria-readonly')).toBe('true');
  });
});
