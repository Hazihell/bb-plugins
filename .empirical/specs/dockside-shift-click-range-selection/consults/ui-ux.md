# UI/UX Advisory

- Specialist: ui-ux
- Verdict: advisory

## Findings

- Severity: low
  - Category: discoverability
  - Location: eligible root checkboxes in Dockside selection mode
  - Finding: Shift+click is familiar on desktop but currently has no visible or
    assistive instruction in this compact custom selection surface.
  - Recommendation: Keep the native checkbox and 48px row geometry, add concise
    hover text such as “Shift+click to select a range,” and associate a
    screen-reader-only selection hint with enabled checkboxes.

- Severity: low
  - Category: predictability
  - Location: range anchor after filters, search, collapse, or live state change
  - Finding: Selecting hidden or newly protected rows would feel unsafe and
    conflict with the deletion protection model.
  - Recommendation: Resolve actual rendered enabled checkbox order at click
    time and make an invalid anchor fall back to an ordinary single toggle.

## Concrete treatment

Do not add another toolbar button or permanent row. Keep the existing checkbox
as the only selection control. Ordinary click establishes the anchor; Shift+
click selects or deselects the inclusive visible eligible run. Preserve the
current selected-count feedback, disabled protected checkboxes, All, Clear,
delete, cancel, and confirmation dialog.
