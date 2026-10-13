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
  DgaFooter,
  DgaHero,
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
  DgaRadio,
  DgaRadioGroup,
  DgaSelect,
  DgaSkeleton,
  DgaSlider,
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
} from '@dev-dga/angular';
import type { DgaButtonSize, DgaButtonVariant } from '@dev-dga/angular';
import type { DgaBreadcrumbItem, DgaMenuOption, DgaMenubarItem, DgaSelectOption, DgaTab } from '@dev-dga/angular';
import type { DgaTableColumn, DgaTableRow, DgaTableSortDirection } from '@dev-dga/angular';
import type { DgaIconName } from '@dev-dga/angular';
import type { DgaHeroSlide, DgaFooterLink, DgaFooterLinkGroup, DgaFooterLogo } from '@dev-dga/angular';
import { DgaIconRegistry } from '@dev-dga/angular';
import { inject } from '@angular/core';

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
    DgaFooter,
    DgaHero,
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
    DgaRadio,
    DgaRadioGroup,
    DgaSelect,
    DgaSkeleton,
    DgaSlider,
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
  sliderValue = 65;
  sliderRange: [number, number] = [20, 80];
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

  private iconRegistry = inject(DgaIconRegistry);
  iconSearch = '';
  selectedVariant = 'default';

  readonly iconVariants = [
    'default',
    'solid',
    'featured',
    'stroke-rounded',
    'twotone-rounded',
    'duotone-rounded',
    'solid-rounded',
    'bulk-rounded',
  ] as const;

  get catalogIcons() {
    const all = this.iconRegistry.getAllIcons();
    const query = this.iconSearch.toLowerCase().trim();
    if (!query) return all.slice(0, 60);
    return all.filter(
      (ic) => ic.name.toLowerCase().includes(query) || (ic.fontClass && ic.fontClass.toLowerCase().includes(query))
    ).slice(0, 80);
  }

  get totalDiscoveredIcons(): number {
    return this.iconRegistry.getAllIcons().length;
  }

  // --- Hero slider content ---
  readonly heroSlides: DgaHeroSlide[] = [
    {
      title: 'Hero Section',
      description: 'Here you can add a brief description about the purpose of the portal followed with a call to action button and an image or an illustration on the left hand side.',
      imageSrc: 'images/hero-photo.jpg',
      imageAlt: '',
      action: { label: 'Primary Button', href: '#doc-getting-started' },
    },
    {
      title: 'Accessible by design',
      description: 'Every component ships with keyboard support, ARIA semantics, RTL layouts, reduced-motion and forced-colors handling out of the box.',
      imageSrc: 'images/hero-photo.jpg',
      imageAlt: '',
      action: { label: 'Browse Components', href: '#buttons' },
    },
    {
      title: 'Built with DGA tokens',
      description: 'A thoughtful component foundation for Saudi Arabia\'s digital government services, built on the official DGA-inspired token set and native Angular.',
      imageSrc: 'images/hero-photo.jpg',
      imageAlt: '',
      action: { label: 'Get Started', href: '#doc-getting-started' },
    },
  ];

  // --- Footer content (dark DGA layout) ---
  readonly footerGroups: DgaFooterLinkGroup[] = [
    { links: [
      { label: 'About [name of the portal]', href: '#' },
      { label: 'Privacy and terms of use', href: '#' },
      { label: 'How to use [name of the portal]', href: '#' },
      { label: 'News and events', href: '#' },
      { label: 'Service level agreement statistics', href: '#' },
    ] },
    { links: [
      { label: 'National service portal', href: '#' },
      { label: 'Open government data', href: '#' },
      { label: 'National strategy for data & Artificial intelligence', href: '#' },
      { label: 'Open data portal', href: '#' },
      { label: 'E-Participation portal', href: '#' },
    ] },
    { links: [
      { label: 'Customer hub', href: '#' },
      { label: 'Contact us', href: '#' },
      { label: 'Engage with Us', href: '#' },
      { label: 'Submit complaint', href: '#' },
      { label: 'Report corruption', href: '#' },
    ] },
  ];
  readonly footerSocial: DgaFooterLink[] = [
    { label: 'X (Twitter)', href: '#', icon: 'new-twitter' },
    { label: 'LinkedIn', href: '#', icon: 'linkedin-01' },
    { label: 'Instagram', href: '#', icon: 'instagram' },
  ];
  readonly footerLegalLinks: DgaFooterLink[] = [
    { label: 'Sitemap', href: '#' },
    { label: 'RSS', href: '#' },
    { label: 'Mobile App', href: '#' },
  ];
  readonly footerLogos: DgaFooterLogo[] = [
    { src: 'images/year-of-ai-logo-white.svg', alt: 'Year of Artificial Intelligence' },
    { src: 'images/logo-placeholder-48.svg', alt: 'Platform logo' },
  ];
}
