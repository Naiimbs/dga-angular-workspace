# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- Migrated all DGA components into `@dev-dga/angular` library package.
- Exposed comprehensive public API for Foundation, Forms, Feedback, Navigation, and Data components.
- Added `DgaIconRegistry` for centralized icon management without heavy SVG bundling.
- Exposed DGA tokens via `@dev-dga/angular/styles`.
- Created official library documentation at `/design-system/docs`.
- Added `DgaSlider` supporting single & dual-thumb range modes with full ControlValueAccessor, pointer drag, ARIA accessibility, and RTL inversion.
- Verified ControlValueAccessor compatibility for Checkbox and other form elements.
- Ensured React parity states and ARIA attributes remain completely intact.
