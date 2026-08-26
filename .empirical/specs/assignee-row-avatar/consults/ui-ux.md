# UI/UX Specialist Advisory

- **Specialist:** ui-ux
- **Verdict:** advisory

The 20px provider-neutral initials avatar is clear and appropriately scoped.
Proceed with the following controls.

## Findings

### 1. Keep identity deterministic across locales

- **Severity:** medium
- **Category:** deterministic identity
- **Location:** `design.md` — Identity derivation
- **Recommendation:** Normalize with NFKC and collapsed whitespace, use
  locale-independent `toLowerCase()`, and feed a fixed unsigned hash into the
  ordered palette. Avoid locale-sensitive casing for names such as Turkish I.

### 2. Name the marker without making it interactive

- **Severity:** medium
- **Category:** accessibility
- **Location:** `design.md` — Visual treatment
- **Recommendation:** Put `role="img"` and `aria-label="Assigned to <full name>"`
  on the marker, with initials in an `aria-hidden` child. Retain the parent
  row/card label because button descendant semantics may be flattened.

### 3. Keep tiny text ink-heavy

- **Severity:** medium
- **Category:** contrast and hierarchy
- **Location:** `design.md` — Visual treatment
- **Recommendation:** Use accent primarily in surface/ring mixes and keep every
  9px foreground mixed strongly toward host ink. Avoid raw warning, success, or
  destructive colors that imply workflow meaning; inspect all six tones in
  light and dark themes.

### 4. Lock dense geometry

- **Severity:** low
- **Category:** dense geometry
- **Location:** `.tb-assignee-mark`
- **Recommendation:** Lock inline/block/min/max size to 20px, border-box sizing,
  `flex: 0 0 20px`, 9px/700 initials, and at most a 1px outer ring. Preserve the
  compact-width hiding rule and add no hover scale or motion.

### 5. Handle Unicode and punctuation safely

- **Severity:** low
- **Category:** Unicode fallback
- **Location:** `design.md` — Identity derivation
- **Recommendation:** Select the first Unicode letter or number from each
  meaningful token, cap output at two initials, and return `?` when none exists.

### 6. Preserve row click behavior

- **Severity:** low
- **Category:** tooltip behavior
- **Location:** List trailing metadata and `AssigneeMark`
- **Recommendation:** Do not make the avatar a nested interactive element or
  enable it alone inside pointer-disabled row metadata. Keep the tooltip and
  accessible name without creating a dead click zone.
