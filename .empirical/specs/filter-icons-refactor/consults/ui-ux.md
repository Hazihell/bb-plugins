# UI/UX Specialist Advisory

- **Specialist:** ui-ux
- **Verdict:** advisory

The presentation-only design is coherent and the existing icon vocabulary is
recognizable. Apply these controls.

## Findings

### 1. Reuse the exact vocabulary everywhere

- **Severity:** medium
- **Category:** consistency
- **Location:** Wide chips, constrained headings, and Manage cards
- **Recommendation:** Read icon and label from the same
  `FILTER_PRESENTATION` entry on all three surfaces; do not substitute similar
  icons, especially between State group and Status.

### 2. Preserve wide-chip density

- **Severity:** low
- **Category:** density
- **Location:** Wide filter chips
- **Recommendation:** Keep icons near 14px, shrink-proof, with the existing
  small gap and label/count order. Do not add icons to selected values or active
  counts.

### 3. Use one icon per compact section

- **Severity:** medium
- **Category:** clarity
- **Location:** Constrained filter menu
- **Recommendation:** Render one decorative icon beside each visible section
  heading. Retain only the existing generic filter-trigger glyph; do not add
  facet icons to the trigger, count, or ordinary option rows.

### 4. Keep Manage checkbox hierarchy

- **Severity:** low
- **Category:** hierarchy
- **Location:** Manage visible-filter cards
- **Recommendation:** Put the icon beside the card title, secondary to the
  native checkbox, with the existing description beneath it. Do not enlarge the
  card or alter its click target.

### 5. Keep State group neutral

- **Severity:** low
- **Category:** semantic ambiguity
- **Location:** State group presentation
- **Recommendation:** Render `Circle` as an unfilled neutral decorative icon,
  never with status color, so it does not imply radio selection.

### 6. Hide decorative icons from accessibility APIs

- **Severity:** medium
- **Category:** accessibility
- **Location:** Every filter icon rendering
- **Recommendation:** Apply `aria-hidden="true"`, retain visible text, and keep
  icons out of focus and existing menu/checkbox semantics.
