# Dockside Shift Click Range Selection

## Request

> Add Shift+click range selection to Dockside bulk-delete selection mode. Clicking a root checkbox establishes an anchor; Shift+clicking another visible root checkbox selects or deselects the contiguous visible range using the clicked checkbox's intended state. Preserve protected-thread eligibility, ordinary click toggling, select-all, filtering/search/project order, confirmation, deletion, keyboard/accessibility behavior, and clear/reset stale anchors when selection mode or visible roots change. Add focused tests and exercise the live BB sidebar.

## Goal

Let a user select or deselect a contiguous run of visible, deletion-eligible
root thread families with the familiar Shift+click gesture.

## Acceptance Criteria

- [ ] [AC-1] [UI] In selection mode, an ordinary root-checkbox click toggles
  that eligible root and establishes it as the current range anchor.
- [ ] [AC-2] [UI] Shift+clicking another eligible visible root checkbox selects
  the inclusive visible range when the clicked checkbox becomes checked, or
  deselects that range when it becomes unchecked; protected roots are never
  added.
- [ ] [AC-3] A Shift+click with no currently visible eligible anchor behaves as
  an ordinary toggle and establishes the clicked root as the new anchor.
- [ ] [AC-4] Leaving selection mode, Clear, Select all, deletion completion,
  and a changed filter/search/visible-root set clear or safely invalidate stale
  range anchors.
- [ ] [AC-5] Existing eligibility, select-all, filtered/project ordering,
  selected-family visibility, confirmation, revalidation, deletion outcomes,
  navigation suppression, and accessible native checkboxes remain intact.

## Scope

- Pass the checkbox's intended checked state and Shift modifier through the
  ThreadCard and ProjectGroup selection callbacks.
- Resolve the currently rendered eligible checkbox order inside this Dockside
  instance and apply range changes through a pure tested helper.
- Keep one ephemeral anchor in ThreadInbox selection state.

## Non-goals

- Selecting child rows or parked shelves.
- Making protected root families selectable.
- Persisting an anchor across selection sessions, filters, searches, reloads,
  or sidebar remounts.

## Risks

- A filter, search, project collapse, deletion, or live protection change can
  hide the anchor between clicks; the gesture must fall back safely.
- Controlled checkboxes must use the clicked checkbox's intended next state,
  not stale React state, or Shift+deselect will invert incorrectly.
- A range must never bypass the same eligibility checks used by ordinary and
  select-all selection.

## Verification

- Unit-test forward/reverse inclusive ranges, select and deselect behavior,
  missing/hidden anchors, protected gaps, input immutability, and ordinary
  anchor replacement.
- Run Dockside tests/typecheck and repository checks.
- Exercise ordinary click, Shift+click select, Shift+click deselect, protected
  gaps, Clear, filter/search changes, and deletion preview in the live BB
  sidebar; capture UI evidence.

## Capability Deltas

- `deltas/dockside-thread-management.md`
