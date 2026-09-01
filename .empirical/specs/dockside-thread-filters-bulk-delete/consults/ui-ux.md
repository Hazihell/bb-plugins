# UI/UX advisory: Dockside thread management

Specialist: ui-ux

Verdict: advisory

## Findings

### UX-001: Preserve the narrow sidebar's visual hierarchy

- Severity: medium
- Category: layout
- Location: Projects header and selection toolbar
- Finding: Two icon buttons fit the 32px Projects header, but full text actions
  for Select all, Clear, Delete, and Cancel can crowd a 280–320px sidebar.
- Recommendation: keep the normal header icon-only with accessible tooltips;
  let selection mode use one compact second row, a flexible selected count,
  short `All` / `Clear` labels, a destructive trash icon with count, and an
  icon-only Cancel where necessary. Verify at the compact width before adding
  any persistent labels.

### UX-002: Make the active filter unmistakable without recoloring rows

- Severity: medium
- Category: state clarity
- Location: filter trigger and menu
- Finding: Thread status colors are already meaningful; using those rows to
  imply filtering would conflate attention with view state.
- Recommendation: tint only the filter trigger when non-All, show the preset
  name in its tooltip/accessible label, and put a checkmark on the active menu
  row. Keep row status glyphs and text exactly as they are.

### UX-003: Explain protected selection in place

- Severity: high
- Category: destructive-action safety
- Location: family checkbox
- Finding: A disabled checkbox alone can look broken, especially when Select
  all skips a visible family.
- Recommendation: retain the family in the result, use a disabled checkbox
  with a reason-specific accessible label and title (`Working`, `Unread`,
  `Pinned`, `Currently open`, or `Needs you`), and report how many visible
  families Select all skipped.

### UX-004: Confirmation should expose identity as well as totals

- Severity: high
- Category: destructive-action safety
- Location: bulk delete dialog
- Finding: Counts catch scale mistakes but not selecting the wrong similarly
  sized set.
- Recommendation: show up to five selected root titles plus an `and N more`
  summary, then separate `root threads`, `child agents`, and total counts. Use
  the exact action label `Delete permanently`; make Cancel the initial focus
  and do not submit on Enter from the dialog container.

### UX-005: Keep project creation distinct from collapse

- Severity: medium
- Category: interaction clarity
- Location: project header
- Finding: A `+` inside the collapse button creates nested controls and an
  accidental-collapse path.
- Recommendation: use sibling buttons in one row, keep the `+` in a 24px hit
  target immediately before the chevron/collapse edge, label it `New thread in
  <project>`, and call `onNavigate` after the native composer action.

### UX-006: Selection mode must not erase navigation context

- Severity: medium
- Category: recoverability
- Location: selected/failed rows
- Finding: Removing or hiding newly protected/failed rows makes partial
  deletion look more successful than it was.
- Recommendation: retain checked ids across state changes, remove only
  confirmed deleted ids, keep skipped/failed families visible and selected,
  and summarize results in both a toast and a small inline status until the
  next selection change.
