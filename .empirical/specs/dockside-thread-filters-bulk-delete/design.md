# Design: Dockside thread filters, bulk delete, and project create

## Overview

Extend the existing replacement thread list in place. The project-first tree,
lifecycle shelves, native search field, row navigation, and status visuals stay
the source structure; a small management layer filters `ThreadFamily` values,
selects eligible root families, and asks the Dockside backend for a guarded
bulk-delete preview/confirmation. Project creation remains entirely host-owned
through `openNewThread({ projectId, focusPrompt: true })`.

## UI anatomy

### Projects header

Keep the current 32px header. The left side retains Folder, `PROJECTS`, and the
visible project count. The right side adds two 24px icon buttons:

1. Filter (sliders icon). Opens a small anchored menu with All, Working, Needs
   you, Unread, Quiet, Quiet 1d+, and Quiet 7d+. The active row is checked; the
   trigger receives the primary tint and an accessible label naming the preset
   whenever filtering is active.
2. Select (check-list icon). Enters root-family selection mode.

Selection mode adds one compact toolbar directly below the header: selected
count, Select all, Clear, Delete, and Cancel. Delete is disabled at zero. The
toolbar does not scroll away independently from the list. At narrow widths it
uses short labels and icon buttons with accessible tooltips rather than
wrapping or shrinking the project list.

### Project header

Replace the single full-width button with a non-interactive row containing:

- one flexing collapse button with project initial, name, count, attention
  indicators, and chevron;
- one separate `+` button labelled `New thread in <project>`.

This avoids nested interactive elements. Activating `+` stops collapse, calls
`openNewThread({ projectId, focusPrompt: true })`, and then `onNavigate()` so
compact clients close the drawer and host search clears. BB owns the selected
project's default workspace/folder.

### Thread family selection

When selection mode is off, `ThreadCard` is unchanged. When on, its root row
gets a leading checkbox button. The checkbox represents the entire family:
root plus descendants. It is disabled when `bulkEligibility` reports a
protected reason. The accessible label states either `Select <title>` or why
the family cannot be selected; the same reason is available as a title so a
visible skipped checkbox never looks broken. Existing anchor shortcut
attributes, split drag,
context menu, park buttons, and child expansion remain in place.

The UI retains selected ids even if a family becomes protected after selection;
the server preview/confirm can then explain the skip. Missing/deleted ids are
pruned. Select all adds only eligible root ids in the currently filtered and
searched result.

### Destructive confirmation

Use a native modal `<dialog>` so it enters the browser top layer without a new
overlay dependency. Preview loading happens before the dialog becomes ready.
The ready state shows up to five root titles plus `and N more`, root count,
authoritative child count, total permanent deletions, skipped-preview warnings,
and `Cancel` / `Delete permanently`. Cancel receives initial focus; Escape,
backdrop close, and Cancel do not call confirm, and the container itself does
not submit on Enter. The confirm button is busy while the RPC runs.

After confirmation, show a toast/result summary. Remove deleted ids from the
selection. Keep skipped and failed ids selected so the user can inspect them;
exit selection only when nothing remains.

## Filter model

Add pure functions in `lib/thread-management.ts`:

- `familyIsWorking`, `familyNeedsUser`, `familyIsUnread`, `familyIsQuiet`
- `familyUpdatedAt` (maximum updated timestamp across root and children)
- `filterProjectThreadGroups(groups, preset, now)`
- `bulkEligibility(family, activeThreadId)` returning an eligible result or a
  stable reason (`current`, `working`, `waiting`, `unread`, `pinned`)
- set helpers for Select all/pruning where useful

Filter at the family layer after `groupThreadsByProject` and before the existing
hierarchy-preserving search. Empty project groups disappear. Quiet age presets
use the family maximum `updatedAt`, with inclusive 24-hour and 7-day cutoffs.
Filtering never mutates or re-sorts incoming values.

## Backend boundary

### RPC contracts

Extend `docksideRpcContract` with:

```text
previewBulkDelete({ threadIds[1..50], protectedThreadId? }) ->
  { token?, expiresAt?, included[], skipped[], rootCount, childCount,
    totalThreadCount }

confirmBulkDelete({ token }) ->
  { deleted[], skipped[], failed[] }
```

Every skipped entry has a stable reason and display-safe message. Failed
entries include a bounded normalized error message. Tokens are opaque UUIDs,
live for 60 seconds, stored only in the server generation's memory, consumed
before mutations, and periodically pruned on preview/confirm.

### Authoritative family read

For each requested root:

1. `threads.get({ threadId })` reads the root.
2. Recursively page `threads.list({ parentThreadId, includeHidden: true })` to
   collect all non-deleted descendants, with global depth/count guards.
3. Reject overlapping requested roots and batches over 50 roots or 500 total
   descendants.
4. Protect a family when any member has live status/activity, pending input,
   unread attention, or a pin; also protect the preview's current thread id.

The server's unread rule is `latestAttentionAt > (lastReadAt ?? 0)`. Live work
includes non-idle active lifecycle status and every activity counter exposed by
the SDK.

### Confirmation and partial failure

Preview stores each included root id with the exact sorted descendant identity
set the user reviewed, plus the protected thread id and expiry. Confirm removes
the token first, then handles
roots in stable request order:

1. Re-read the full family and re-run protection.
2. Compare the exact descendant identity set and skip any topology drift so the
   cascade cannot grow or shrink beyond the confirmation counts.
3. Skip changed/protected roots.
4. Call `threads.delete({ threadId, childThreadsConfirmed: childCount > 0 })`.
5. Catch one root's failure and continue.

This makes cancellation mutation-free, replay impossible, stale state safe,
and partial failure recoverable.

## Module changes

- `lib/thread-management.ts`: pure frontend family filters/eligibility.
- `lib/bulk-delete.ts`: pure coordinator with injected read/delete/clock/token
  adapter, so destructive behavior is unit-testable without loading BB.
- `server.ts`: RPC schemas and thin BB SDK adapter for recursive family reads.
- `components/inbox/thread-inbox.tsx`: filter/selection/dialog state and header.
- `components/inbox/project-group.tsx`: separate collapse and project `+`.
- `components/inbox/thread-card.tsx`: optional family checkbox contract.
- `components/inbox/filter-menu.tsx` and `bulk-delete-dialog.tsx`: focused UI.
- `components/ui/icon.tsx`: plus, sliders, trash, and square-check glyphs.

## Error and concurrency behavior

- Preview errors leave selection unchanged and show an error toast/status.
- An expired/used token returns a stable error and requires a fresh preview.
- Realtime thread updates can change the list at any point; confirm trusts only
  its re-read, not frontend eligibility.
- Selection mode merges retained selected families back into the filtered and
  searched view, so a family that becomes protected cannot disappear before it
  is inspected. Per-id skipped/failed outcomes remain inline beside the list.
- A deleted/missing root is reported as skipped rather than failing the batch.
- Deletion results are not retried automatically because the operation is
  irreversible; a retained failed selection requires a new explicit preview.
- The existing one-row context menu continues to use `requestDelete` and BB's
  host confirmation.

## Verification design

- Pure filter tests cover every preset, exact age cutoffs, mixed child status,
  protected reasons, group removal, order, and immutability.
- Pure coordinator tests cover bounds, duplicate/overlap rejection, preview
  child totals, token expiry/consumption, revalidation, current-thread
  protection, missing rows, partial delete failure, and stable result order.
- Typecheck proves exact app/RPC/SDK signatures.
- Live BB checks validate layout, keyboard/focus, project `+`, native composer
  selection, selection toolbar, protected rows, dialog copy/counts, cancel,
  and a controlled deletion of disposable test threads only.
