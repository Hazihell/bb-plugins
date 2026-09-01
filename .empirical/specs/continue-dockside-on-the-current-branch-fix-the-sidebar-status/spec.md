# Continue Dockside On The Current Branch Fix The Sidebar Status

## Request

> Continue Dockside on the current branch. Fix the sidebar status presentation with exactly two compact rows per parent: row 1 semantic activity/status icon, truncated title, far-right elapsed time; row 2 truncated branch and a compact right cluster with readable status badge, parent-only PR metadata, and child disclosure/count/provider icon. Use distinct accessible Working, Needs you, Unread, Failed, Inactive, and Stale states; never show Done without a genuine BB completed state; make inactive/stale visually recede; add hover/focus tooltips for ambiguous status, PR, provider, and disclosure icons. Make every semantic color customizable in Dockside Settings with presets, hex validation, missing stale role, and accurate previews. Add persistent drag sorting of complete root/child families within the same project, preserve children, persist reload order, reject cross-project moves, disable reorder during bulk selection/filter/search, and provide keyboard-accessible move controls with announcements. Preserve all existing Dockside behaviors and parent-only PR metadata. Add focused tests for all specified states, stale classification, colors, truncation and child/PR edge cases, persisted/invalid ordering and interaction conflicts. Verify live normal/narrow sidebar, capture a screenshot showing all six states without clipping or a third row, run Dockside tests/typecheck/build and repository checks, commit, push the current branch, and update PR #26.

## Goal

Make every Dockside root family readable at a glance in a compact two-row card,
with accessible semantic status and durable within-project family ordering.

## Acceptance Criteria

- [ ] [AC-UI-1] [UI] Every root card uses exactly two fixed rows: semantic icon,
  truncated title, and far-right elapsed time on row one; truncated branch and a
  compact status/PR/child/provider cluster on row two, without clipping at normal
  or narrow sidebar widths.
- [ ] [AC-1] Root families classify as Failed, Needs you, Working, Unread,
  Inactive, or Stale with stable precedence and explicit readable labels; quiet
  families become Stale after seven days, and no ordinary thread is called Done.
- [ ] [AC-UI-2] [UI] Working is green and animated, Needs you amber with an
  attention shape, Unread blue with an unread shape, Failed red with an error
  shape, Inactive muted light grey, and Stale dimmer grey; inactive/stale title
  and branch text recede while accessible text remains.
- [ ] [AC-UI-3] [UI] Every ambiguous status, PR, provider, and child-disclosure
  icon has hover and keyboard-focus help, and color is never the only signal.
- [ ] [AC-2] Default, High contrast, Colorblind-friendly, and Custom palettes
  resolve every effective state including separate Inactive and Stale roles;
  invalid custom hex values fall back safely and Settings previews every state.
- [ ] [AC-3] Users can reorder complete root/descendant families only within the
  same project by drag, the exact order persists across reloads, children remain
  attached, malformed/cross-project/incomplete reorder requests are rejected,
  and pinned roots retain their protected leading partition.
- [ ] [AC-UI-4] [UI] Reordering is disabled during selection mode, non-All
  filters, or host search; keyboard users can move a focused family up/down with
  announced success or boundary/conflict feedback.
- [ ] [AC-4] Parent-only PR lookup/rendering, expansion, navigation, modifier
  split drag, unread/activity behavior, filters, Shift-range selection, bulk
  deletion, project creation, settings, and zero/multiple-child/no-PR cases keep
  working.
- [ ] [AC-5] Focused tests cover all six states, inactive/stale boundaries,
  custom colors, long/narrow text, zero/multiple children, no PR, persistence,
  invalid reorder requests, and interaction conflicts; Dockside and repository
  test/typecheck/build checks pass.
- [ ] [AC-UI-5] [UI] A live normal/narrow BB screenshot contains immediately
  distinguishable Working, Needs you, Unread, Failed, Inactive, and Stale
  examples with no third row or clipping.

## Scope

- Dockside frontend status derivation, cards, hierarchy controls, settings
  preview, preference parsing, and browser-local per-project root ordering.
- Focused tests, live BB validation, screenshot evidence, documentation, commit,
  current-branch push, and PR #26 update.

## Non-goals

- Inventing a BB completion state or showing Done for idle output.
- Reordering projects, children independently, pinned roots across the pinned
  boundary, or families across projects.
- Reordering an incomplete visible subset produced by search/filter/selection.
- Changing BB thread records or introducing cross-device/cloud ordering storage.
- Repeating PR metadata on child rows or changing unrelated plugins.

## Verification

- Run focused Dockside tests including new status/order/layout/settings cases.
- Run Dockside typecheck and production build, then `npm install` and the
  repository-required `npm run check`/CI command.
- Install/reload the local Dockside plugin, exercise normal and narrow BB
  sidebars with all six states plus keyboard/drag conflicts, and capture PNG
  evidence.
- Perform fresh-context review and Empirical integration before delivery.

## Capability Deltas

- `deltas/dockside-thread-management.md`
