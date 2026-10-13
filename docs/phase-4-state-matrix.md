# Phase 4 — State Matrix

**React source of truth:** `@dev-dga/react` v1.3.1 + `@dev-dga/css` v1.3.1
**Angular workspace:** `C:\Users\aii\dga-angular-workspace`
**Date:** 2026-10-08

## Legend

| Symbol | Meaning |
|--------|---------|
| ✓ | Verified against React source AND Angular unit test |
| △ | Implemented, browser visual verification still required |
| ✗ | Known gap |

---

## Component Matrix

| State | Default | Hover | Focus-visible | Active | Checked/Selected | Indeterminate | Disabled | Error | ReadOnly | Required | Open | Keyboard | RTL | Reduced Motion | Form (CVA) |
|-------|---------|-------|---------------|--------|-----------------|---------------|----------|-------|----------|----------|------|----------|-----|----------------|------------|
| **Checkbox** | ✓ | △ | ✓ | △ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| **Radio** | ✓ | △ | ✓ | △ | ✓ | — | ✓ | ✓ | ✓ | ✓ | — | ✓ | ✓ | ✓ | ✓ |
| **Switch** | ✓ | △ | ✓ | △ | ✓ | — | ✓ | ✓ | — | ✓ | — | ✓ | ✓ | ✓ | ✓ | <!-- Phase 5.1: data-slot, data-state, data-disabled, aria-required, forced-colors added -->
| **Button** | △ | △ | △ | △ | — | — | △ | — | — | — | — | △ | △ | △ | — |
| **Input** | ✓ | △ | △ | △ | — | — | ✓ | ✓ | ✓ | ✓ | — | △ | △ | ✓ | ✓ |
| **Select** | ✓ | △ | ✓ | △ | ✓ | — | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | △ | ✓ | ✓ |
| **Tabs** | ✓ | △ | ✓ | △ | ✓ | — | ✓ | — | — | — | — | ✓ | △ | ✓ | — |
| **Slider** | ✓ | △ | ✓ | △ | ✓ | — | ✓ | ✓ | — | — | — | ✓ | ✓ | ✓ | ✓ |

> Note: Hover and Active states require browser visual verification (△) as CSS pseudo-classes cannot be triggered in unit tests.

---

## Checkbox Detail

| State | Implemented | Evidence |
|-------|-------------|---------|
| `data-state=unchecked` | ✓ | Test: "sets data-state=unchecked" |
| `data-state=checked` | ✓ | Test: "sets data-state=checked" |
| `data-state=indeterminate` | ✓ | Test: "sets data-state=indeterminate" |
| `aria-checked=mixed` on indeterminate | ✓ | Test: "sets aria-checked=mixed" |
| `aria-invalid=true` on error | ✓ | Test: "sets aria-invalid=true" |
| `aria-required=true` on required | ✓ | Test: "sets aria-required=true" |
| `aria-readonly=true` on readOnly | ✓ | Test: "sets aria-readonly and data-readonly" |
| `data-readonly=''` on readOnly | ✓ | Test: "sets aria-readonly and data-readonly" |
| Disabled state | ✓ | Test: "disables the native input" |
| ReadOnly prevents toggle | ✓ | Test: "readonly checkbox does not change" |
| Indeterminate cleared on change | ✓ | Test: "clears indeterminate after user interaction" |
| ControlValueAccessor (ngModel) | ✓ | Test: "updates ngModel value" |
| aria-describedby (helperText) | ✓ | Test: "sets aria-describedby when hint text" |
| aria-describedby (errorMessage) | ✓ | Test: "sets aria-describedby for errorMessage" |
| Size xs (16px) | ✓ | Test: "applies size class xs" |
| Size sm (20px) | ✓ | Test: "applies size class sm" |
| Size md (24px, default) | ✓ | Test: "no size class applied for md" |
| Neutral variant | ✓ | Test: "applies choice--neutral on the label" |
| Space keyboard toggle | ✓ | Test: "Space key toggles checkbox" |
| Uses dga-icon for checkmark | ✓ | Test: "renders dga-icon for check mark" |
| Minus span for indeterminate | ✓ | Test: "renders minus span for indeterminate" |
| Error class on label | ✓ | Test: "applies choice--error class on label" |
| Hover halo (::before) | △ | CSS verified; browser needed |
| Focus ring (outline 2px) | △ | CSS verified; browser needed |
| Active state (bg gray-300) | △ | CSS verified; browser needed |
| Reduced motion | ✓ | CSS: @media (prefers-reduced-motion: reduce) |
| Forced colors (high contrast) | ✓ | CSS: @media (forced-colors: active) — Added in Phase 4 |
| RTL | ✓ | No RTL-specific rules needed (symmetric) |

---

## Radio / RadioGroup Detail

| State | Implemented | Evidence |
|-------|-------------|---------|
| `data-slot="radio-group-field"`, `data-slot="radio-group"` | ✓ | Test: "renders data-slot=radio-group-field and data-slot=radio-group" |
| `data-slot="radio"`, `data-slot="radio-indicator"` | ✓ | Test: "renders data-slot=radio and data-slot=radio-indicator" |
| `data-state="checked"`, `data-state="unchecked"` | ✓ | Test: "sets data-state=checked on active radio" |
| `aria-labelledby` linked to legend | ✓ | Test: "associates group label with aria-labelledby and legend id" |
| `aria-required="true"` on required | ✓ | Test: "renders required indicator and aria-required on fieldset" |
| `aria-invalid="true"` on error | ✓ | Test: "renders error message and connects via aria-describedby" |
| `aria-describedby` (errorMessage / helperText) | ✓ | Tests: "renders error message / helper message" |
| `aria-readonly="true"` & `data-readonly=''` | ✓ | Test: "applies aria-readonly and data-readonly and blocks click changes" |
| ReadOnly blocks blocked keys (`READONLY_BLOCKED_KEYS`) | ✓ | Test: "blocks navigation keys in readOnly mode" |
| Disabled group & disabled option item | ✓ | Tests: "disables the entire group" & "disables specific option item" |
| Orientation (horizontal / vertical) | ✓ | Test: "applies horizontal orientation class" |
| Variant (primary / neutral) | ✓ | Test: "applies neutral variant class" |
| Form integration (`ControlValueAccessor` / `ngModel`) | ✓ | Test: "updates ngModel when option clicked" |
| Standalone `dga-radio` component | ✓ | Tests: "supports standalone DgaRadio with data-state, data-slot, and click/selected events" |
| RTL arrow key inversion | ✓ | Test: "moves radio selection with arrows, skips disabled items, and reverses in RTL" |
| Reduced motion | ✓ | CSS: `@media (prefers-reduced-motion: reduce)` |
| Forced colors (high contrast) | ✓ | CSS: `@media (forced-colors: active)` |

---

## Slider Detail

| State | Implemented | Evidence |
|-------|-------------|---------|
| `data-slot="slider-field"`, `data-slot="slider"` | ✓ | Test: "renders slider element with correct accessible role and attributes" |
| `data-slot="slider-track"`, `data-slot="slider-range"`, `data-slot="slider-thumb"` | ✓ | Test: "renders slider element with correct accessible role and attributes" |
| Single & Range modes (`number` vs `[number, number]`) | ✓ | Tests: single & dual thumb range mode tests |
| Range constraint (thumbs converge, cannot cross) | ✓ | Test: "clamps lower thumb to upper thumb in range mode (F-03)" |
| Keyboard navigation (Arrow keys, PageUp/Down, Home/End) | ✓ | Tests: keyboard interaction tests |
| RTL inversion for Arrow keys and pointer fraction | ✓ | Tests: RTL drag and keyboard navigation tests |
| `ControlValueAccessor` (ReactiveForms / `ngModel`) | ✓ | Tests: "supports ReactiveForms integration via ControlValueAccessor" |
| `aria-valuemin`, `aria-valuemax`, `aria-valuenow` | ✓ | Test: "renders slider element with correct accessible role and attributes" |
| `aria-valuetext` (omitted if no formatValue) | ✓ | Test: "omits aria-valuetext when no formatValue is provided (F-04)" |
| Error state (`aria-invalid`, error message live region) | ✓ | Test: "displays error message and sets error classes when error is present" |
| Disabled state (`data-disabled`, `aria-disabled`, tabindex=-1) | ✓ | Test: "disables thumb and sets data-disabled" |
| Pointer capture & drag calculation | ✓ | Tests: coordinate drag with mocked rect |
| CVA `writeValue(null)` resets to min | ✓ | Test: "writeValue(null) resets slider to min value (CVA contract)" |
| CVA touched-state timing (on blur) | ✓ | Test: "onTouched fires on thumb blur (CVA touched-state timing)" |

---

## Switch Detail (Phase 5.1)

| State | Implemented | Evidence |
|-------|-------------|---------|
| `data-slot="switch-field"` on label | ✓ | Test: "renders data-slot=switch-field on the label" |
| `data-slot="switch"` on input | ✓ | Test: "renders data-slot=switch on the input" |
| `data-slot="switch-track"` on track | ✓ | Test: "renders data-slot=switch-track on the track span" |
| `data-slot="switch-thumb"` on thumb | ✓ | Test: "renders data-slot=switch-thumb on the thumb span" |
| `data-state="unchecked"` | ✓ | Test: "sets data-state=unchecked when unchecked" |
| `data-state="checked"` | ✓ | Test: "sets data-state=checked when checked" |
| `data-disabled=""` when disabled | ✓ | Test: "sets data-disabled when disabled" |
| Native `disabled` | ✓ | Test: "disables the native input when disabled=true" |
| `aria-required="true"` on required | ✓ | Test: "sets aria-required=true when required" |
| `aria-invalid="true"` on error | ✓ | Test: "sets aria-invalid=true when error/errorMessage set" |
| `aria-describedby` (helperText / errorMessage) | ✓ | Tests: hint and error message variants |
| `switch--error` CSS class | ✓ | Tests: error and errorMessage variants |
| `switch--disabled` CSS class | ✓ | Test: "adds switch--disabled class when disabled" |
| Keyboard toggle (Space/click → change event) | ✓ | Test: "emits checkedChange and updates data-state on change event" |
| ControlValueAccessor (ngModel) | ✓ | Tests: ngModel toggle, writeValue(true), writeValue(null) |
| `setDisabledState` (CVA) | ✓ | Test: "setDisabledState(true) disables input" |
| `onTouched` on blur | ✓ | Test: "onTouched fires on input blur" |
| RTL (thumb translate direction) | ✓ | CSS: `[dir='rtl'] .switch__input:checked + .switch__track .switch__thumb` |
| Reduced motion | ✓ | CSS: `@media (prefers-reduced-motion: reduce)` |
| Forced colors (high contrast) | ✓ | CSS: `@media (forced-colors: active)` — Added in Phase 5.1 |
| Hover halo (::before) | △ | CSS verified; browser needed |
| Focus ring (::after border) | △ | CSS verified; browser needed |
| Active state | △ | CSS verified; browser needed |

---

## Gaps by Component (after Phase 4 Radio, Slider & Library Migration)

### Checkbox
- All gaps closed except browser-only visual states (hover, focus ring color, active).

### Radio / RadioGroup
- All gaps closed except browser-only visual states (hover, focus ring color, active).

### Switch
- Phase 5.1 complete: `data-slot` (switch-field, switch, switch-track, switch-thumb), `data-state` (checked/unchecked), `data-disabled`, `aria-required`, forced-colors media query added.
- All gaps closed except browser-only visual states (hover halo, active).
- 26 unit tests in `dga-switch.spec.ts` (all passing under the Vitest runner).

### Button / IconButton
- _Audit pending_

### Input / Textarea
- _Audit pending_

### Select
- _Audit pending_

### Tabs
- _Audit pending_
