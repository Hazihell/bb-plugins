# UI/UX Specialist Advisory

- **Specialist:** ui-ux
- **Verdict:** advisory

The direction is coherent and restrained. The following findings make the
interface concrete enough to implement consistently.

## Findings

### 1. Keep view navigation separate from filters

- **Severity:** high
- **Category:** information architecture
- **Location:** `design.md` — Width and filter modes
- **Recommendation:** In constrained panels, put search on its own row and a
  compact List/Kanban segmented control beside a separate `Filters · N` trigger.
  Count active facet categories rather than every selected value.

### 2. Make direct capture discoverable

- **Severity:** high
- **Category:** action discoverability
- **Location:** `design.md` — Direct board capture
- **Recommendation:** Use a labeled `New issue` button in the full header and
  reserve icon-only `+` for constrained panels with tooltip, accessible name,
  focus ring, and a minimum 36px target. Name project/provider in the dialog.

### 3. Define stable row geometry

- **Severity:** medium
- **Category:** list hierarchy and density
- **Location:** `design.md` — State glyphs and rows
- **Recommendation:** Use a 16px state glyph, fixed identifier, one-line title,
  right-aligned metadata, and roughly 36–40px height. Reveal actions on hover
  and focus-within without reflow.

### 4. Make the whole group header interactive

- **Severity:** medium
- **Category:** grouping interaction
- **Location:** `design.md` — Groups
- **Recommendation:** Use a neutral opaque 28–32px sticky toggle with chevron,
  label, count, focus ring, and expanded state. Search opens only matching
  groups temporarily and never persists that transient expansion.

### 5. Structure long filter vocabularies

- **Severity:** medium
- **Category:** filter usability
- **Location:** `design.md` — Width and filter modes
- **Recommendation:** Use named sections, checked values, an active summary,
  fixed Clear footer, and internal search/progressive disclosure for long
  assignee/label sets.

### 6. Preserve accessible status text

- **Severity:** medium
- **Category:** accessibility
- **Location:** `design.md` — State glyphs and rows
- **Recommendation:** Treat shape/color as supplementary, retain accessible
  status text, mark decorative SVGs, and verify theme contrast.

### 7. Flatten the detail composition

- **Severity:** medium
- **Category:** detail composition
- **Location:** `design.md` — Detail comments
- **Recommendation:** Put core issue data directly on the canvas, cap long
  descriptions near 48–52rem, then render chronological comments on one muted
  rail with no individual cards.

### 8. Align constrained and wide layouts

- **Severity:** low
- **Category:** responsive layout
- **Location:** `spec.md` — AC-UI-1, AC-UI-3, AC-UI-4
- **Recommendation:** Align the wide toolbar/groups/rows to the 56rem measure;
  keep Kanban full width. Constrained order is title/create, search, then view
  toggle plus filter trigger.
