# Dockside Expand Child Agent Families

## Request

> Make Dockside mimic the reference agent tree by expanding every root thread family that has child-agent threads by default, including after those children finish, while retaining the user's explicit collapse/expand override and all existing working/unread/status/connector styling. Document that only real BB child threads with parentThreadId can render; provider-internal collaboration workers with no BB thread row are outside the plugin data surface.

## Goal

Make Dockside's parent/child presentation read like the supplied Orca-style
reference: real BB child threads are shown as an open connector tree by
default, the child-count affordance is compact, and project headers do not
duplicate row-level working/unread state with stacked status glyphs.

## Acceptance Criteria

- [ ] [AC-1] [UI] A root thread with one or more real BB child threads
  (`parentThreadId` points to the root) renders its connector tree expanded by
  default even when every child is idle/read/completed.
- [ ] [AC-2] A user's explicit expand/collapse choice still overrides the
  default for that mounted family, while search continues to force matching
  descendants open.
- [ ] [AC-3] [UI] The child toggle contains only the chevron and numeric child
  count; it does not render `agent`/`agents` text. Its accessible name still
  states the action and exact child count.
- [ ] [AC-4] [UI] Project headers no longer render aggregate needs-you,
  working, or unread glyphs side by side. They retain the project initial,
  name, root count, per-project `+`, and collapse chevron; working/unread/input
  states remain visible on the actual root and child rows.
- [ ] [AC-5] The existing provider glyphs, vertical/horizontal connector,
  branch/workspace line, row status text, current-row treatment, child order,
  navigation, context menus, selection safeguards, and project creation remain
  unchanged.
- [ ] [AC-6] Provider-internal collaboration workers that have no BB thread row
  are not fabricated by Dockside; only host-provided real child threads are
  rendered.
- [ ] [AC-7] Automated tests cover default expansion and explicit override
  semantics, and a real BB screenshot shows three completed visible child
  threads expanded beneath this root with the simplified project/toggle chrome.

## Scope

- Change the default child-family expansion rule in `ThreadCard`.
- Replace the wordy child-count button with compact count + chevron chrome.
- Remove the project-level stacked attention glyph cluster and retain its
  screen-reader status summary.
- Add focused pure/tests or a small exported expansion helper as appropriate.

## Non-goals

- Creating synthetic rows for provider collaboration workers absent from BB's
  thread list.
- Fetching or exposing hidden background workers.
- Changing child ordering, recursion depth, provider icons, branch/status copy,
  filters, bulk deletion, or project `+` behavior.
- Persisting expansion state across reloads or clients.

## Verification

- Focused Dockside typecheck/tests and plugin-scoped lint.
- Root typecheck, tests, lint, and frontend build.
- Live watcher reload with Dockside healthy.
- Spawn/read three visible BB child threads under this root, confirm the family
  opens without clicking, and capture wide/compact screenshots.
- Fresh-context UI outcome and committed-diff review.

## Capability Deltas

- `deltas/dockside-thread-management.md`
