/*
 * Public API Surface of dga-angular
 */

export * from './lib/dga-angular';

export { DgaButtonComponent, DgaButtonComponent as DgaButton } from './lib/components/dga-button/dga-button';
export type { DgaButtonSize, DgaButtonVariant } from './lib/components/dga-button/dga-button';

export { DgaInput, DgaTextarea, DgaSelect, DgaCheckbox, DgaRadio, DgaRadioGroup, DgaSwitch } from './lib/forms/dga-form-controls';
export type { DgaSelectOption, DgaRadioOption, DgaFieldVariant, DgaFieldSize } from './lib/forms/dga-form-controls';

export { DgaSlider } from './lib/forms/dga-slider';
export type { DgaSliderValue, DgaSliderSize } from './lib/forms/dga-slider';

export { DgaIconButton, DgaAvatar, DgaAvatarImage, DgaAvatarFallback, DgaAvatarGroup, DgaDivider, DgaSpinner, DgaSkeleton } from './lib/foundation/dga-foundation';
export type { DgaAvatarSize } from './lib/foundation/dga-foundation';

export { DgaIcon } from './lib/icons/dga-icon';
export type { DgaIconName } from './lib/icons/dga-icon';
export { DgaIconRegistry } from './lib/icons/dga-icon-registry';
export type { DgaIconDefinition, DgaIconVariant } from './lib/icons/dga-icon-registry';

export { DgaPopupPortal } from './lib/popup/dga-popup-portal';

export { DgaBadge, DgaTag, DgaAlert, DgaTooltip, DgaModal } from './lib/feedback/dga-feedback';
export type { DgaStatus } from './lib/feedback/dga-feedback';

export { DgaDropdown, DgaTabs, DgaBreadcrumb, DgaPagination } from './lib/navigation/dga-navigation';
export type { DgaMenuOption, DgaTab, DgaBreadcrumbItem } from './lib/navigation/dga-navigation';

export {
  DgaHeader,
  DgaHeaderBrand,
  DgaHeaderNav,
  DgaHeaderItem,
  DgaHeaderActions,
  DgaHeaderAction,
  DgaHeaderMenuButton,
  DgaHeaderUtilityButton,
  DgaHeaderSubmenu,
  DgaHeaderSubmenuGroup,
  DgaHeaderSubmenuItem,
  DgaMenubar,
  DgaSidebar,
  DgaSlideoutMenu,
} from './lib/navigation/dga-header';
export type {
  DgaHeaderSubmenuItemData,
  DgaMenubarItem,
  DgaMenubarEntry,
  DgaMenubarEntryType,
  DgaSidebarItem,
} from './lib/navigation/dga-header';

export {
  DgaCard,
  DgaCardHeader,
  DgaCardTitle,
  DgaCardDescription,
  DgaCardContent,
  DgaCardFooter,
  DgaCardIcon,
  DgaCardImage,
  DgaCardExpandableContent,
} from './lib/components/surfaces/dga-card';
export type { DgaCardVariant, DgaCardPadding, DgaCardOrientation } from './lib/components/surfaces/dga-card';

export { DgaTable } from './lib/data/dga-table';
export type { DgaTableColumn, DgaTableRow } from './lib/data/dga-table';

export {
  DgaTableHeader,
  DgaTableBody,
  DgaTableFooter,
  DgaTableRowDirective,
  DgaTableHeadDirective,
  DgaTableFilterDirective,
  DgaTableCellDirective,
  DgaTableCaption,
} from './lib/data/dga-table-primitives';
export type { DgaTableAlignment, DgaTableSortDirection } from './lib/data/dga-table-primitives';

export { DgaHero } from './lib/sections/dga-hero';
export type { DgaHeroAction, DgaHeroSlide } from './lib/sections/dga-hero';

export { DgaFooter } from './lib/sections/dga-footer';
export type { DgaFooterLink, DgaFooterLinkGroup, DgaFooterLogo } from './lib/sections/dga-footer';

export {
  DgaAccordion,
  DgaProgress,
  DgaEmptyState,
  DgaDigitalStamp,
} from './lib/composite';
export type {
  DgaAccordionItem,
  DgaAccordionValue,
  DgaProgressVariant,
  DgaProgressState,
  DgaEmptyStateVariant,
  DgaDigitalStampExtension,
} from './lib/composite';
