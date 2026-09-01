# Design: rich PR and agent outcome metadata

## Overview

Add one restrained third metadata line to Dockside rows. The line is sourced
from BB rather than inferred: PR rows use the host's lazy PR hook, completed
rows use a bounded local final-output RPC, and active families use child
activity already present in the sidebar DTO. Project chrome and existing row
status remain unchanged.

## Pure presentation models

### Pull requests

Add `lib/pull-request-presentation.ts` with one pure priority mapping:

1. merged state/attention -> `MERGED`, success
2. closed state/attention -> `CLOSED`, muted
3. draft state/attention -> `DRAFT`, muted
4. changes requested -> `CHANGES`, destructive
5. blocked, failed checks, or conflicts -> `BLOCKED`, destructive
6. checks pending -> `CHECKS`, warning
7. review requested -> `IN REVIEW`, warning
8. ready to merge -> `READY`, success
9. other open -> `OPEN`, muted

Each result contains label, existing Dockside icon name, and semantic token
classes. No git-host logic or arbitrary colors live in components.

### Final output

Add `lib/thread-summary.ts`:

- `normalizeFinalOutput(value, 120)` removes C0/C1 controls, converts all
  whitespace/newlines to one space, trims, returns null when empty, and truncates
  with a single ellipsis without exceeding 120 characters.
- `BoundedSummaryCache` stores nullable summaries by `threadId:updatedAt`,
  refreshes recency on get, caps at 200, and removes every key for a deleted id.
- `familyWaitingForAgents(children)` is true when any child satisfies the
  established `threadIsWorking` rule.

## Backend RPC

Extend `docksideRpcContract`:

```text
listThreadSummaries({ threads: [{ threadId, updatedAt }] }) ->
  { summaries: [{ threadId, updatedAt, text: string|null }] }
```

Input is strict, unique, 1–50 rows. For each uncached request:

1. `threads.get` revalidates that the thread exists, is not deleted, has the
   requested `updatedAt`, and status is idle or error.
2. `threads.output` reads only the final assistant output.
3. Normalize and cache the nullable value.
4. A per-row read failure logs the id and returns null without failing siblings.

Cache is server-generation memory only. The existing `thread.deleted` handler
also clears every summary key for that id. Timestamp changes produce a new key,
so normal sidebar lifecycle updates invalidate naturally.

## Frontend summary hook

Add `hooks/use-thread-summaries.ts`:

- accepts the root and, only while expanded, its mounted children;
- requests only rows that are not working or waiting for input;
- batches one family into one RPC;
- keys effects by sorted `id:updatedAt`, cancels stale promises, and returns a
  read-only map;
- clears rows no longer in the requested family.

No browser/localStorage persistence or polling is added.

## Row UI

### Reusable metadata

Add `components/inbox/row-metadata.tsx`:

- `PullRequestMetadata` uses `UrlLink`, compact pill, and truncated linked title.
- `DoneMetadata` uses a check pill plus truncated normalized summary.
- `WaitingForAgentsMetadata` uses one Workflow/activity glyph and primary text.

Pills use existing theme tokens and 2xs typography. Metadata is pointer-enabled
above the row's full-bleed navigation anchor and remains one line.

### Root row

Keep current title, trailing status/time, branch/workspace, pin, PR number
behavior only as superseded by the richer PR line. Render beneath location:

1. `Waiting for agents` while any child works.
2. Root PR metadata when present.
3. Otherwise root Done metadata when a real summary exists.

Two lines may coexist only for waiting + PR/Done; the family line and row line
answer different questions.

### Child row

Call `experimental_useSidebarThreadPullRequest(thread.id)` inside the child
component, so it exists only while expanded. Add a third line:

- PR metadata when a PR exists;
- otherwise Done metadata when a summary exists;
- otherwise no line and current two-line density remains.

## Connector activity

When `familyWaitingForAgents` is true, tint the existing vertical border and
child horizontal stubs with `border-primary/70`. Do not change thickness,
geometry, project headers, or idle color. Child/root Working labels remain.

## Failure and performance behavior

- PR null/loading/error: no line.
- Summary RPC failure: no Done line; branch/status remain.
- Active/new/untouched thread: no output request or Done inference.
- Output may contain sensitive text: local authenticated RPC only, maximum 120
  characters, memory-only, expanded-family scope.
- Maximum work per family: 50 summaries, 200 cache entries globally per plugin
  generation; no polling and no direct GitHub request.

## Verification

- Pure exhaustive PR mapping tests.
- Output control/whitespace/length/null tests and cache hit/LRU/deletion tests.
- Waiting derivation tests.
- Typecheck of RPC/hook/UrlLink use and unchanged Dockside suite.
- Live completed demo children show Done summaries; a controlled active child
  shows Waiting and connector tint; available PR branch shows pill/title/link.
