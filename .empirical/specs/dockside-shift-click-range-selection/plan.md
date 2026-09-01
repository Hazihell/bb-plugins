# Plan

1. Add and unit-test the pure root range-selection helper for ordinary,
   forward/reverse Shift-select, Shift-deselect, protected-gap, invalid-anchor,
   and immutable-input behavior.
2. Wire intended checked state and Shift modifier from ThreadCard through
   ProjectGroup to ThreadInbox; derive scoped rendered eligible order, own the
   anchor, and reset it across Clear, All, Cancel, visibility changes, and
   deletion completion.
3. Add checkbox discoverability/accessibility guidance and live/system coverage.
4. Run Dockside tests/typecheck, exercise live BB selection and deletion
   preview, capture a screenshot, then complete verification and review.
