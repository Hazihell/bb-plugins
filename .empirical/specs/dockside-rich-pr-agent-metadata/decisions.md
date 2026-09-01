# Decisions: Dockside Rich Pr Agent Metadata

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Render PR state from BB's lazy row hook

Status: Accepted

### Evidence

- BB already exposes `number`, `title`, `url`, `state`, and rolled-up
  `attention` through `experimental_useSidebarThreadPullRequest`.
- Dockside currently calls it only for roots and renders only `#number`.
- Expanded child rows are independently mounted components, providing the
  correct lazy lookup boundary.

### Options

- Query GitHub directly in Dockside.
- Keep only the root PR number.
- Reuse BB's hook on roots and mounted children, map its stable state/attention
  values to one semantic presentation model, and render pill + linked title.

### Chosen approach

Reuse BB's hook. Derive a pure semantic presentation with the priority Draft,
Changes, Blocked, Checks, In review, Ready, Merged, Closed, Open. Render PR
metadata ahead of final-output metadata on that row.

### Trade-offs and risks

Expanded families perform one host-cached PR lookup per mounted row. A null or
failed lookup degrades to no PR line. Dockside owns no git-host credentials or
retry policy.

### Verification

Pure mapping matrix tests plus live rows with and without PRs.

## D-002: Fetch bounded final summaries lazily through local RPC

Status: Accepted

### Evidence

- The sidebar DTO intentionally omits messages and final output.
- BB's backend SDK exposes `threads.output`, while expanded ThreadCard already
  knows the bounded family and each row's `updatedAt`.
- Idle alone cannot distinguish an untouched thread from completed work.

### Options

- Infer Done from idle/read state.
- Fetch output for every sidebar row.
- Batch only quiet mounted family rows through local RPC, cache sanitized
  results by `threadId:updatedAt`, and show Done only for non-empty output.

### Chosen approach

Use a strict batch RPC capped at 50 rows. Revalidate id/timestamp/status,
normalize output to one control-free line capped at 120 characters, keep an
in-memory 200-entry LRU, and clear per-thread cache keys on deletion. The
frontend refetches automatically when the family rows' timestamps change.

### Trade-offs and risks

Expanded completed families cause a bounded local read and may briefly render
without summary. No output is persisted, and collapse unmounts child consumers.
The summary may quote user-sensitive assistant text, but only inside the user's
authenticated local BB UI and only at a short bounded length requested here.

### Verification

Normalization, status/timestamp mismatch, bounds, cache hit/eviction, deletion
invalidation, and Done gating tests plus live completed children.

## D-003: Express family work through one line and the connector

Status: Accepted

### Evidence

- The reference uses `Waiting for agents` and a colored connector rather than
  stacked aggregate icons.
- Dockside already derives child working/attention and draws one connector.

### Options

- Add another icon to the project or root header.
- Replace all row status with family status.
- Keep row status unchanged and add one root metadata line plus connector tint
  only while a child is working.

### Chosen approach

Derive `waitingForAgents` from working children. Render one activity-glyph line
on the root and tint existing connector segments with the primary token; keep
all row statuses and neutral idle connectors unchanged.

### Trade-offs and risks

The root can show Waiting while its own trailing status still says Working;
those answer different questions (family orchestration vs. row runtime) and are
visually separated. No additional aggregate project indicator is added.

### Verification

Pure derivation tests and a controlled live child run with before/after images.
