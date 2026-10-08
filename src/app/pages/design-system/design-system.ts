import { Component } from '@angular/core';
import { TitleCasePipe, UpperCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  DgaAlert,
  DgaAccordion,
  DgaAvatar,
  DgaAvatarFallback,
  DgaAvatarGroup,
  DgaAvatarImage,
  DgaBadge,
  DgaBreadcrumb,
  DgaButtonComponent,
  DgaCard,
  DgaCheckbox,
  DgaDivider,
    DgaDigitalStamp,
  DgaDropdown,
  DgaEmptyState,
  DgaIconButton,
  DgaIcon,
  DgaCardHeader,
  DgaCardTitle,
  DgaCardDescription,
  DgaCardContent,
  DgaCardFooter,
  DgaCardIcon,
  DgaCardImage,
  DgaCardExpandableContent,
  DgaHeader,
  DgaHeaderActions,
  DgaHeaderAction,
  DgaHeaderBrand,
  DgaHeaderItem,
  DgaHeaderMenuButton,
  DgaHeaderNav,
  DgaHeaderSubmenu,
  DgaHeaderSubmenuGroup,
  DgaHeaderSubmenuItem,
  DgaHeaderUtilityButton,
  DgaMenubar,
  DgaSidebar,
  DgaSlideoutMenu,
  DgaInput,
  DgaModal,
  DgaPagination,
  DgaProgress,
  DgaRadioGroup,
  DgaSelect,
  DgaSkeleton,
  DgaSpinner,
  DgaSwitch,
  DgaTable,
  DgaTableBody,
  DgaTableCaption,
  DgaTableCellDirective,
  DgaTableFilterDirective,
  DgaTableFooter,
  DgaTableHeadDirective,
  DgaTableHeader,
  DgaTableRowDirective,
  DgaTabs,
  DgaTag,
  DgaTextarea,
  DgaTooltip,
} from '../../components';
import type { DgaButtonSize, DgaButtonVariant } from '../../components';
import type { DgaBreadcrumbItem, DgaMenuOption, DgaMenubarItem, DgaSelectOption, DgaTab } from '../../components';
import type { DgaTableColumn, DgaTableRow, DgaTableSortDirection } from '../../components';
import type { DgaIconName } from '../../components';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    TitleCasePipe,
    UpperCasePipe,
    FormsModule,
    DgaAlert,
    DgaAccordion,
    DgaAvatar,
    DgaAvatarFallback,
    DgaAvatarGroup,
    DgaAvatarImage,
    DgaBadge,
    DgaBreadcrumb,
    DgaButtonComponent,
    DgaCard,
    DgaCheckbox,
    DgaDivider,
      DgaDigitalStamp,
    DgaDropdown,
    DgaEmptyState,
    DgaIconButton,
    DgaIcon,
    DgaCardHeader,
    DgaCardTitle,
    DgaCardDescription,
    DgaCardContent,
    DgaCardFooter,
    DgaCardIcon,
    DgaCardImage,
    DgaCardExpandableContent,
    DgaHeader,
    DgaHeaderActions,
    DgaHeaderAction,
    DgaHeaderBrand,
    DgaHeaderItem,
    DgaHeaderMenuButton,
    DgaHeaderNav,
    DgaHeaderSubmenu,
    DgaHeaderSubmenuGroup,
    DgaHeaderSubmenuItem,
    DgaHeaderUtilityButton,
    DgaMenubar,
    DgaSidebar,
    DgaSlideoutMenu,
    DgaInput,
    DgaModal,
    DgaPagination,
    DgaProgress,
    DgaRadioGroup,
    DgaSelect,
    DgaSkeleton,
    DgaSpinner,
    DgaSwitch,
    DgaTable,
    DgaTableBody,
    DgaTableCaption,
    DgaTableCellDirective,
    DgaTableFilterDirective,
    DgaTableFooter,
    DgaTableHeadDirective,
    DgaTableHeader,
    DgaTableRowDirective,
    DgaTabs,
    DgaTag,
    DgaTextarea,
    DgaTooltip,
  ],
  templateUrl: './design-system.html',
})
export class DesignSystemComponent {
  readonly palettes = [
    { title: 'SA Green', key: 'sa', steps: ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] },
    { title: 'Gray', key: 'gray', steps: ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] },
    { title: 'Error', key: 'error', steps: ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] },
    { title: 'Warning', key: 'warning', steps: ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] },
    { title: 'Success', key: 'success', steps: ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] },
    { title: 'Info', key: 'info', steps: ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] },
    { title: 'Gold', key: 'gold', steps: ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] },
    { title: 'Lavender', key: 'lavender', steps: ['25', '50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'] },
  ] as const;

  readonly typeSamples = [
    { label: '2xs', token: '2xs' },
    { label: 'xs', token: 'xs' },
    { label: 'sm', token: 'sm' },
    { label: 'base', token: 'base' },
    { label: 'lg', token: 'lg' },
    { label: 'xl', token: 'xl' },
    { label: '2xl', token: '2xl' },
    { label: '3xl', token: '3xl' },
    { label: 'Display sm', token: 'display-sm' },
    { label: 'Display md', token: 'display-md' },
    { label: 'Display lg', token: 'display-lg' },
    { label: 'Display xl', token: 'display-xl' },
    { label: 'Display 2xl', token: 'display-2xl' },
  ] as const;

  readonly spaces = ['1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'] as const;
  readonly radii = ['none', 'xs', 'sm', 'md', 'lg', 'xl', 'full'] as const;
  readonly shadows = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl'] as const;
  readonly iconNames: readonly DgaIconName[] = [
    'home', 'search', 'menu', 'check', 'chevron-down', 'arrow-left', 'arrow-right',
    'external-link', 'link', 'lock', 'info', 'alert-circle', 'alert-triangle',
    'calendar', 'upload', 'plus', 'minus', 'close', 'more-horizontal', 'saudi-flag',
  ];

  readonly buttonVariants: readonly DgaButtonVariant[] = [
    'primary', 'secondary', 'outline', 'ghost', 'destructive', 'link',
  ];
  readonly buttonSizes: readonly DgaButtonSize[] = ['sm', 'md', 'lg'];
  readonly selectOptions: readonly DgaSelectOption[] = [
    { label: 'Digital identity', value: 'identity' },
    { label: 'Business services', value: 'business' },
    { label: 'Public sector', value: 'public' },
  ];
  readonly radioOptions = [
    { label: 'Citizen', value: 'citizen' },
    { label: 'Business', value: 'business' },
    { label: 'Government entity', value: 'government', disabled: true },
  ] as const;
  readonly menuOptions: readonly DgaMenuOption[] = [
    { label: 'Edit details', value: 'edit' },
    { label: 'Share service', value: 'share' },
    { label: 'Archive', value: 'archive' },
  ];
  readonly menuBarItems: readonly DgaMenubarItem[] = [
    { label: 'File', items: [
      { label: 'New request', value: 'new' },
      { label: 'Open request', value: 'open', shortcut: 'Ctrl+O' },
      { type: 'separator', label: '' },
      { type: 'checkbox', label: 'Show hidden items', value: 'hidden', checked: true },
      { type: 'radio-group', label: 'View density', group: 'density', items: [
        { type: 'radio', label: 'Compact', value: 'compact', checked: true },
        { type: 'radio', label: 'Comfortable', value: 'comfortable' },
      ] },
      { type: 'submenu', label: 'More options', items: [
        { label: 'Manage preferences', value: 'preferences' },
        { type: 'submenu', label: 'Advanced', items: [{ label: 'Keyboard shortcuts', value: 'shortcuts' }] },
      ] },
    ] },
    { label: 'Services', items: [
      { label: 'Browse services', value: 'browse' },
      { label: 'Manage access', value: 'access' },
      { type: 'group', label: 'Tools', items: [{ label: 'Service status', value: 'status' }] },
    ] },
    { label: 'Help', disabled: true, items: [] },
  ] as const;
  readonly sidebarItems = [
    { label: 'Overview', value: 'overview', icon: 'home' },
    { label: 'Applications', value: 'applications', icon: 'calendar' },
    { label: 'Documents', value: 'documents', icon: 'upload' },
  ] as const;
  readonly tabItems: readonly DgaTab[] = [
    { label: 'Overview', value: 'overview', content: 'A concise overview of the selected government service.' },
    { label: 'Details', value: 'details', content: 'Service owner, eligibility, and delivery information.' },
    { label: 'Documents', value: 'documents', content: 'Required forms and supporting documents.' },
  ];
  readonly breadcrumbItems: readonly DgaBreadcrumbItem[] = [
    { label: 'Home', routerLink: '/' },
    { label: 'Services', routerLink: '/design-system' },
    { label: 'Current service' },
  ];
  readonly breadcrumbOverflowItems: readonly DgaBreadcrumbItem[] = [
    { label: 'Citizen services', href: '#navigation' },
    { label: 'Licensing', href: '#data' },
  ];
  readonly tableColumns: readonly DgaTableColumn[] = [
    { key: 'service', label: 'Service' },
    { key: 'status', label: 'Status' },
    { key: 'owner', label: 'Owner' },
  ];
  readonly tableRows: readonly DgaTableRow[] = [
    { service: 'Digital Identity', status: 'Active', owner: 'Digital Government' },
    { service: 'Business License', status: 'In review', owner: 'Service Center' },
    { service: 'National Address', status: 'Active', owner: 'Municipal Services' },
  ];
  readonly emptyTableRows: readonly DgaTableRow[] = [];
  readonly accordionItems = [
    { value: 'identity', title: 'Digital identity', content: 'Secure identity services help people access government services using a trusted digital account.' },
    { value: 'business', title: 'Business services', content: 'Connected services support organizations as they start, operate, and grow in the Kingdom.' },
    { value: 'accessibility', title: 'Accessibility standards', content: 'Services should be usable with assistive technology, keyboard navigation, and clear language.', disabled: true },
  ] as const;

  name = '';
  email = '';
  description = '';
  selectedService = '';
  acceptedTerms = true;
  notificationsEnabled = true;
  selectedRadio = 'citizen';
  currentPage = 2;
  overflowPage = 50;
  tableSortDirection: DgaTableSortDirection = 'none';
  statusFilterActive = false;
  accordionValue = 'identity';
  selectedSideNav = 'overview';
  sidebarExpanded = true;
  mobileMenuOpen = false;
  headerSubmenuOpen = false;
}
