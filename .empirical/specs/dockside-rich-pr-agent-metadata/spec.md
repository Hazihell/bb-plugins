# Dockside Rich Pr Agent Metadata

## Request

> Add rich Orca-style metadata to Dockside thread families: semantic PR status pills and truncated PR titles on root rows and expanded child rows using BB's lazy pull-request hook; derive a single family-level Waiting for agents state and subtle activity tint from child work without stacking icons; lazily fetch and cache bounded final assistant output summaries for completed expanded rows through a typed backend RPC keyed by thread id and updatedAt, with live invalidation and privacy/performance safeguards; infer Done only when a final output exists; preserve filters, bulk selection/deletion, hierarchy, navigation, project creation, and compact layout.

## Goal

Bring the remaining useful information from the Orca-style reference into
Dockside without returning to noisy aggregate chrome: PR state/title lives on
the relevant root or child row, final output produces a truthful Done summary,
and active child work produces one family-level waiting signal plus connector
tint.

## Acceptance Criteria

- [ ] [AC-1] [UI] Root rows and mounted expanded child rows with a pull request
  show a compact semantic pill and truncated PR title. Activating the metadata
  opens the PR URL with normal anchor behavior.
- [ ] [AC-2] PR presentation maps BB data deterministically: Draft; Changes
  requested; Blocked for failed checks/conflicts/blocked; Checks for pending
  checks; In review for review requested; Ready for ready-to-merge; Merged;
  Closed; otherwise Open. Semantic theme tokens, not hardcoded colors, style
  each state.
- [ ] [AC-3] Child PR lookups are lazy because `ChildThreadRow` mounts only in
  an expanded family. A missing/failed PR lookup draws nothing and does not
  disturb branch, time, status, or navigation.
- [ ] [AC-4] [UI] A quiet completed root/child with a non-empty final assistant
  output and no PR shows a `DONE` pill plus a one-line summary. Dockside never
  infers Done from idle alone and never replaces a PR line with a synthetic
  completion state.
- [ ] [AC-5] Final outputs are fetched through a typed local RPC only for quiet
  mounted family rows, normalized to a single control-free whitespace line,
  truncated to 120 characters, cached in server memory by `threadId:updatedAt`,
  bounded to 200 entries, never persisted, and invalidated naturally when the
  row timestamp changes or explicitly on deletion.
- [ ] [AC-6] [UI] While any child is working, the root family shows one
  `Waiting for agents` line with a single activity glyph and primary tint; the
  vertical/horizontal connector uses the same subtle tint. It returns to
  neutral after child work ends and does not add project-level status icons.
- [ ] [AC-7] Metadata precedence is stable: an active family waiting line is
  shown at the root; a row PR line is shown when a PR exists; otherwise a real
  final-output Done line may be shown. Existing Working, Unread, Failed, Needs
  you, relative time, branch/workspace, provider glyph, and current-row
  treatment remain authoritative.
- [ ] [AC-8] Filters, search, default-open child trees, explicit collapse,
  selection/bulk delete protections, context menus, split navigation, project
  `+`, and compact layout remain unchanged.
- [ ] [AC-9] Pure tests cover every PR mapping and summary normalization/cache
  rule; live BB evidence shows PR metadata when available, truthful Done
  summaries for the three completed demo children, and Waiting for agents with
  connector tint during a controlled active child.

## Scope

- Add pure PR presentation and final-output normalization/cache helpers.
- Extend Dockside RPC with a bounded batch final-summary method.
- Add a family-scoped summary hook keyed by current thread timestamps.
- Add reusable PR/Done/Waiting metadata components to root and child rows.
- Tint only the existing connector while child work is live.

## Non-goals

- Querying GitHub directly or duplicating BB's PR host integration.
- Fetching final output for collapsed families, parked shelves, or every
  sidebar row globally.
- Persisting assistant output in Dockside's database or browser storage.
- Rendering raw Markdown, multiline output, URLs as rich content, tool output,
  or full conversation history in the sidebar.
- Integrating Linear/Tasks status or inventing issue workflow states.
- Changing project-header aggregate chrome or adding stacked status icons.

## Verification

- Focused pure tests for PR mapping, output normalization, cache bounds, Done
  gating, and waiting-family derivation.
- Dockside typecheck/tests/lint and live watcher health.
- Root typecheck, test, lint, and build.
- Live expanded family with real child outputs, controlled child activity, and
  any available repository PR; capture wide/compact screenshots.
- Fresh-context outcome QA and committed-diff review.

## Capability Deltas

- `deltas/dockside-thread-management.md`
