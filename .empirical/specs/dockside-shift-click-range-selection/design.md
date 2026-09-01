# Design

## Selection model

- Add a pure `applyRootSelection` helper that receives the current selected
  ids, the ordered currently rendered eligible root ids, the anchor id, target
  id, intended target state, and Shift modifier.
- Ordinary clicks toggle only the target and replace the anchor.
- A Shift+click with a valid visible anchor applies the intended target state
  to the inclusive forward or reverse range and preserves the anchor.
- A Shift+click whose anchor is missing from the eligible order falls back to
  the ordinary-click result and makes the target the new anchor. A missing
  target fails closed without changing selection.
- The helper returns new Set state and never mutates its inputs.

## UI wiring

- ThreadCard passes `event.currentTarget.checked` plus the native Shift modifier
  from its controlled root checkbox.
- ProjectGroup forwards the root id and selection intent without owning range
  state.
- ThreadInbox owns the ephemeral anchor and scopes a DOM query to its own root
  to derive actual rendered, enabled root-checkbox order. Hidden collapsed
  projects and disabled protected rows therefore cannot enter a range.
- Root checkboxes carry a stable data attribute for the scoped adapter plus
  tooltip/screen-reader guidance that Shift+click selects a range.

## Reset and preservation

- Clear, Select all, Cancel, and leaving selection mode clear the anchor.
- Filter/search/root-order changes clear the anchor through a stable visible
  root-order key. A project-collapse or live eligibility change is also safe:
  the next Shift+click cannot find the old anchor in the rendered enabled DOM
  order and falls back to an ordinary toggle.
- Successful deletion clears the anchor; partial results keep only selection
  state, never a stale anchor.
- Existing eligibility, preview, confirmation, revalidation, outcome, and
  navigation code remains unchanged.

## Verification

- Unit-test pure helper behavior and input immutability.
- Source/system assertions cover event modifier/intended state, scoped visible
  checkbox order, stable data attributes, and reset paths.
- Exercise actual selecting, deselecting, protected gaps, filtering/reset, and
  deletion preview in live BB, including a compact screenshot.
