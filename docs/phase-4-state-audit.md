# Phase 4 — State Audit (React Parity)

**Source of Truth (React):** `@dev-dga/react` v1.3.1 + `@dev-dga/css` v1.3.1 (`C:\Users\aii\dga-react-lab`)  
**Angular Library Source:** `projects/dga-angular/src/lib/` (`C:\Users\aii\dga-angular-workspace`)  
**Public API:** `projects/dga-angular/src/public-api.ts`  
**Date:** 2026-10-08  

---

## 1. Checkbox (`DgaCheckbox`)
- **Status:** Complete & Verified (23 tests)
- **DOM & Slots:** `.ddga-checkbox`, `data-state="checked|unchecked|indeterminate"`, `aria-checked="mixed"`, `data-readonly`, `aria-readonly`, `aria-required`, `aria-invalid`, `aria-describedby`.
- **Icon:** Uses `<dga-icon name="check" />` and `.choice__minus` for indeterminate.

---

## 2. Radio & RadioGroup (`DgaRadio`, `DgaRadioGroup`)

### React Source Audit (`@dev-dga/react/dist/components/Radio`, `Radio.tsx` / Radix UI Primitive)
- **DOM Structure:**
  - Field container: `<div data-slot="radio-group-field" class="ddga-field">`
  - Group container: `<fieldset data-slot="radio-group" class="ddga-radio-group ddga-radio-group--[vertical|horizontal] ddga-radio-group--[neutral|error|readonly]">`
  - Label: `<legend id="[id]-label" class="ddga-radio-group__label">` + `<span class="ddga-radio-group__required" aria-hidden="true">*</span>`
  - Item row: `<div class="ddga-radio-row">`
  - Radio Item: `<input type="radio" class="ddga-radio radio-option__input" data-slot="radio" data-state="checked|unchecked" data-readonly aria-readonly aria-invalid />`
  - Circle & Indicator: `<span class="ddga-radio__circle"><span class="ddga-radio__indicator" data-slot="radio-indicator"><span class="ddga-radio__dot"></span></span></span>`
  - Item Label: `<span class="ddga-radio__label">`
  - Error Message: `<span id="[id]-error" class="ddga-field-message ddga-field-message--error">`
  - Helper Message: `<span id="[id]-helper" class="ddga-field-message ddga-field-message--helper">`
- **ARIA & Keyboard Behavior:**
  - Arrow keys: Up/Down, Left/Right (with RTL inversion: ArrowRight increments in LTR, ArrowLeft increments in RTL) move focus and selection among enabled options.
  - ReadOnly mode: Prevents selection changes upon click, prevents keydown events for `[' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']`.
  - High Contrast / Forced Colors: Outlines and highlight colors mapped to system `Highlight`, `CanvasText`, `GrayText`.
  - Dark Mode: Surface hover halo adapts to `--ddga-gray-700`, neutral checked border to `--ddga-gray-100`.

### Angular Implementation (`projects/dga-angular/src/lib/forms/dga-form-controls.ts`)
- Implemented full DOM matching React structure with `data-slot`, `data-state`, `data-readonly`, `aria-readonly`, `aria-required`, `aria-labelledby`, `aria-describedby`.
- Standalone `<dga-radio>` component with `label` input or content projection, supporting `checked`, `disabled`, `readOnly`, `error`, `selected` EventEmitter.
- Form integration via Angular `ControlValueAccessor` (`ngModel` / Reactive Forms).
- Dynamic `groupName` computation preventing radio collision across multiple group instances.

---
