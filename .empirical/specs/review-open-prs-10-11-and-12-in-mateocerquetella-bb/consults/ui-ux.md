# Final UI/UX and Accessibility Review

- Specialist: ui-ux
- Verdict: advisory
- Candidate: `fb74be3f9f81f2d9f00de073ef79bc395485b7ce` on
  `integrate-community-prs`
- Scope: final committed integration tree, including the Taskboard preset menu,
  Save dialog, Apply path, Manage editor, realtime and reconnect states,
  responsive behavior, Usage Tracker Compact limit, and the current-main Host
  Monitor reconciliation

## Current finding

### Finding UIUX-001: Retained-error retry controls need deterministic keyboard focus

- Severity: low
- Category: keyboard navigation and async error recovery
- Location: `plugins/taskboard/app.tsx:2519-2532`,
  `plugins/taskboard/app.tsx:6277-6291`, and
  `plugins/taskboard/app.tsx:1661`
- Evidence: the Presets menu's retained-refresh `Try again` control is a plain
  button nested inside Radix menu content rather than a registered
  `DropdownMenuItem`. Radix's arrow-key collection therefore does not include
  it, and menu Tab handling does not provide a reliable route to it. In both
  that menu and Manage, starting the background retry immediately clears
  `refreshError`, which removes the pressed retry control without assigning a
  next focus target.
- Impact: pointer users can retry normally and the last authoritative preset
  list remains usable, but a keyboard user may be unable to invoke the menu
  retry or may lose their place after activating retry in Manage. Automatic
  realtime/reconnect refresh remains available, so this is not a merge blocker.
- Recommendation: render the menu retry as a `DropdownMenuItem` so selection
  closes back to the trigger, and either retain a disabled `Refreshing…`
  control/status until the Manage request settles or move focus to the preset
  heading/list before removing the retry button.
- Verification: with only a background refresh error present, reach and invoke
  retry using keyboard alone in both full and constrained menus, then in
  Manage; assert focus returns to a visible logical control and the retained
  rows/drafts never unmount.

## Final assessment

No blocking UI, responsive, or accessibility finding remains. The final source
now establishes all of the following:

- Full and constrained Presets menus share bounded scrolling, a fixed Save
  action, accessible loading/error/empty states, and tracker-readiness guards.
- Applying a preset validates project and provider scope, replaces the complete
  released browse-preference snapshot through the shared store, and announces
  the named result.
- The Save dialog describes the captured filters/search/layout/collapse state,
  prevents duplicate submission, keeps the entered name after failure, and
  associates a persistent inline alert with the input.
- Realtime, reconnect, and post-mutation preset reconciliation is background,
  revision- and project-scoped, and non-destructive. Failed refreshes preserve
  authoritative rows and dirty rename drafts.
- Manage serializes rename/reorder/delete, announces success and failure,
  restores logical focus after each mutation, restores adjacent focus after
  deletion, and uses a wrapping `min-w-0` composition with coarse-pointer
  sizing instead of horizontal overflow.
- Usage Tracker retains Weekly as the normalized default, updates the selected
  compact reading without reload, chooses a fresh preferred or fresh
  alternative window before last-known data, keeps both windows in expanded
  details, and names configured, actual, last-known, and fallback states for
  assistive technology.
- The Host Monitor merge has no Taskboard or Usage Tracker UI regression in the
  reviewed working tree.

Focused evidence passes: Taskboard typecheck and 109/109 tests, including the
new preset source guards; Usage Tracker typecheck and 17/17 tests, including
fresh-alternative ordering and distinct configured/fallback accessible text.
The focused Taskboard UI tests remain source-level guards, so the retry-focus
advisory above should receive a rendered keyboard check when it is addressed.
