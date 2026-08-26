# UI/UX Consult

specialist: ui-ux

verdict: advisory

## Assessment

Yes. The revised design is the clearest interface for the stated criteria: it
keeps search in the existing list field, value search inside its constrained
menu, and metadata recovery in the create form. It adds no new navigation or
conceptual surface, while now defining the state, keyboard, overflow, and error
contracts that were previously ambiguous.

## Concrete interface recommendation

- Search state: the existing issue-search input displays the active project's
  persisted query on the first rendered full or right-panel list. Detail/back
  and BB reload restore that same value. Project switch, browse clear, and
  provider reset update the scoped input immediately and invalidate stale list
  work; a filtered empty state keeps its visible Clear action.
- Focus: opening a constrained filter menu focuses its value-search input.
  Printable and editing keys remain owned by the input, Down enters the filtered
  options, and Escape closes the menu and restores focus to its trigger. An
  empty filtered set displays the non-selectable `No matching values` row.
- Error: failed creation-metadata loading displays a stable inline alert with a
  concise heading, the actual safe message, and Retry. Create remains disabled
  and references that alert through `aria-describedby`; Retry exposes loading
  and rejects duplicate activation until the attempt settles.
- Overflow: constrained value menus retain their intended width, wrap long or
  unbroken provider values, clip horizontal overflow, and scroll only
  vertically. Selected-state affordances remain visible beside wrapped labels.

## Findings

None. Severity, category, location, and recommendation are not applicable
because the revised design resolves the previously identified interface gaps.

## Residual UX risk

Residual risk is implementation-level: the menu library may race autofocus or
misroute editing keys, request invalidation may still permit a stale visual
frame, an extreme provider value may clip a focus indicator at narrow panel
width, and an alert may be announced more than once across Retry renders. Live
evidence should therefore cover keyboard-only open/search/Down/Escape/reopen; a
long unbroken value in the right panel; metadata failure and loading-protected
Retry with announcement; and rapid typing followed by detail/back, project
switch, clear, and provider reset. No current UX findings remain in the revised
design.
