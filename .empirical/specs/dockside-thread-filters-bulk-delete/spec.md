# Dockside Thread Filters Bulk Delete

## Request

> Add an Orca-style thread filter and multi-select deletion mode to Dockside's project-first sidebar. Put compact filter and selection controls in the Projects header; preserve project grouping, inline child-agent hierarchy, and working/unread styling; allow selecting eligible inactive threads, selecting all currently filtered eligible threads, showing the selected count, cancelling selection, and deleting through an explicit destructive confirmation that accounts for child threads. Active/running or user-blocked threads must not be silently deleted, and partial failures must remain visible and recoverable.

## Goal

Make a busy Dockside sidebar easy to narrow, create from, and clean up without
losing the project-first hierarchy or making destructive actions casual. The
result should feel like Orca's compact project navigator: controls live in the
existing headers, status remains visually legible, and bulk actions operate on
stable thread families rather than a second management screen.

## Acceptance Criteria

- [ ] [AC-1] [UI] The Projects header contains compact filter and selection
  controls. The filter menu offers All, Working, Needs you, Unread, Quiet,
  Quiet 1d+, and Quiet 7d+ views and visibly indicates when a non-All filter is
  active.
- [ ] [AC-2] Filtering composes with BB's host search field, preserves project
  order and root/child hierarchy, keeps matching children attached to their
  root for context, and does not change Dockside's working/unread styling.
- [ ] [AC-3] [UI] Selection mode adds an accessible checkbox to each root
  thread family. A family is bulk-delete eligible only when neither its root
  nor any visible descendant is working, waiting for input, unread, pinned, or
  the currently open thread; protected families remain visible but disabled
  with an explanatory accessible label.
- [ ] [AC-4] [UI] Selection mode shows the selected family count, Select all
  selects only eligible families in the currently filtered result, Clear
  clears the selection, and Cancel exits selection mode without deleting.
- [ ] [AC-5] [UI] Delete opens an explicit destructive confirmation that names
  the selected root count, reports the authoritative number of child threads
  included, states that deletion is permanent, and requires a separate confirm
  action. Closing or cancelling the confirmation changes nothing.
- [ ] [AC-6] Bulk deletion requires a short-lived server preview token and
  revalidates each selected root immediately before deletion. Threads that
  became active, blocked, unread, or pinned are skipped; individual failures do
  not stop later eligible deletions; deleted ids are removed from selection,
  while skipped/failed ids remain visible and recoverable with a summarized
  result.
- [ ] [AC-7] [UI] Every project header has a compact `+` control that calls
  BB's native new-thread action with that project id and prompt focus. The New
  Thread composer opens with the project selected so BB resolves its configured
  workspace/folder normally, including on compact/mobile navigation.
- [ ] [AC-8] The new controls are keyboard reachable, have visible focus and
  accessible names, avoid nested interactive elements, and preserve existing
  thread shortcut targets, modifier-click splits, context menus, snooze,
  settle, and project collapse behavior.
- [ ] [AC-9] Pure filter/eligibility/selection logic and backend preview/delete
  validation have automated coverage, and a real BB browser check plus
  screenshot demonstrate the filter, selection mode, confirmation, and
  per-project `+` control.

## Scope

- Add a compact filter menu and selection-mode toolbar to Dockside's Projects
  header.
- Add per-project create controls using `openNewThread({ projectId })`.
- Add pure thread-family filter and bulk-eligibility helpers.
- Add a two-step preview/confirm RPC for true multi-thread deletion, including
  authoritative child counts, short-lived confirmation tokens, server-side
  safety revalidation, bounded input, and partial-result reporting.
- Adapt root cards and project headers for selection/create controls without
  changing their status or navigation hierarchy.

## Non-goals

- Changing BB's built-in sidebar, global search field, project settings, or
  workspace/folder resolution.
- Bulk-deleting child-agent rows independently from their root family.
- Silently deleting working, waiting, unread, pinned, or currently open work.
- Replacing the existing one-thread context-menu deletion flow, which continues
  to use BB's host-owned confirmation.
- Adding archive, snooze, settle, rename, or pin bulk actions in this change.
- Persisting filter or selection state across browser reloads or clients.

## Verification

- Focused Dockside typecheck and test suite, including pure filter/eligibility
  tests and backend RPC tests for preview tokens, child confirmation, stale
  state, bounds, partial failure, and idempotent cleanup.
- Root `bun run typecheck`, `bun run test`, `bun run lint`, and `bun run build`.
- Live watcher/reload with Dockside healthy in `bb plugin list`.
- Real browser exercise of every filter, selection controls, cancel path,
  destructive confirmation, partial-result presentation, and project `+`
  navigation; capture a screenshot without deleting protected/current work.
- Fresh-context review of destructive-action safety, accessibility, compact
  layout, and preservation of the existing hierarchy/status behavior.

## Capability Deltas

- `deltas/dockside-thread-management.md`
