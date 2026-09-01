# Dockside Root Only Pr Position

## Request

> Show Dockside PR metadata once per family on the root only. Remove child PR lookup/rendering entirely. Move root #number plus semantic icon out of the branch line into the far-right trailing column directly below elapsed time; preserve tooltip/accessibility, child provider identity, child count, hierarchy, navigation, management, and compact layout. Commit and update the open PR.

## Goal

Show one PR state per family in a stable right-aligned location without
repeating the same branch PR on every child.

## Acceptance Criteria

- [ ] [AC-1] [UI] Root PR metadata renders in the root trailing column directly
  below elapsed time as `#number` followed by semantic icon, with existing
  hover/focus tooltip and accessible link behavior.
- [ ] [AC-2] [UI] Child rows perform no PR lookup and render no PR number, icon,
  or tooltip; provider, title, branch, time, status glyph, and connector remain.
- [ ] [AC-3] Child count/provider marks, root activity, filters, hierarchy,
  deletion, menus, navigation, project creation, and compact layout remain.

## Scope

- Move root PullRequestMetadata into the right column below ThreadStatusLabel.
- Remove PullRequestMetadata and PR hook from ChildThreadRow.

## Non-goals

- Changing PR icon mapping/tooltip content or underlying PR truth.
- Changing child provider/status behavior.

## Risks

- The fixed right column is narrow; compact PR metadata must stay one line and
  tooltip remains right-aligned above it.

## Verification

- Source/system assertions for one root lookup and no child PR hook.
- Dockside checks, live screenshot, root checks, review, integration, PR update.

## Capability Deltas

- `deltas/dockside-thread-management.md`
