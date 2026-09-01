# Dockside Pr Icon Tooltips

## Request

> Finish Dockside PR presentation now: keep compact visible #number followed by semantic PR-state icon at the far right; use an eye icon for In review, check for Ready/Merged, x for Changes/Blocked/Closed, spinner for Checks, branch for Open/Draft; add a real hover/focus tooltip showing state, PR number, and title; never show generic completion checks on ordinary threads; preserve provider identity and all management/layout behavior.

## Goal

Make PR state unmistakable without permanent prose: every PR row ends with its
number and semantic state icon, and hover/focus reveals the full state/title.

## Acceptance Criteria

- [ ] [AC-1] [UI] Quiet PR rows render `#number` followed by the state icon as
  the rightmost metadata: eye for In review, check for Ready/Merged, circle-x
  for Changes/Blocked/Closed, spinner for Checks, branch for Open/Draft.
- [ ] [AC-2] [UI] Hovering or keyboard-focusing PR metadata shows a themed
  tooltip containing state, `#number`, and truncated PR title; the link keeps
  its accessible label and BB UrlLink behavior.
- [ ] [AC-3] Ordinary no-PR threads never render completion/check metadata;
  check remains PR-specific.
- [ ] [AC-4] Provider marks, activity/status glyphs, branch/time, filters,
  hierarchy, deletion, navigation, project creation, and compact layout remain.

## Scope

- Add Eye to Dockside's icon abstraction and PR mapping.
- Add a CSS hover/focus tooltip inside PullRequestMetadata.
- Preserve number-before-icon order and ordinary completion removal.

## Non-goals

- Creating synthetic PRs or querying GitHub outside BB's PR hook.
- Restoring permanent PR title/status prose.

## Risks

- Tooltip clipping in the sidebar; position it right-aligned above the row with
  bounded width and pointer-events disabled.

## Verification

- Exhaustive icon mapping tests, source/system checks, and live plugin health.
- Root checks, fresh QA, review, integration, commits.

## Capability Deltas

- `deltas/dockside-thread-management.md`
