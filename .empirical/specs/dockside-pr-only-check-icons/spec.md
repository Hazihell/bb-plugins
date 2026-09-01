# Dockside Pr Only Check Icons

## Request

> Remove Dockside completion checks from every ordinary no-PR thread; Done should not render anywhere because it is visually confused with PR approval. Preserve PR state only as #number followed by its semantic colored icon at the far right of the branch line, with state/title in accessibility and tooltip context. Keep provider marks after child count and first on quiet children, preserve activity/status glyphs, filters, hierarchy, deletion, project creation, navigation, and compact layout.

## Goal

Make check icons unambiguously PR-specific: ordinary threads never show a
completion check, while PR metadata ends with its semantic icon after the PR
number at the far right of the secondary line.

## Acceptance Criteria

- [ ] [AC-1] [UI] No ordinary no-PR root or child renders Done text, a check
  icon, or assistant-output completion metadata, regardless of final output.
- [ ] [AC-2] [UI] A quiet PR row renders visible `#number` followed by its
  colored semantic PR-state icon. The icon is the final/rightmost PR metadata
  element; state and title remain in the link's accessible label and tooltip.
- [ ] [AC-3] Ready/Merged may use a check because the check now means PR state;
  Open/Draft use branch, In review uses target, Checks uses loading, and
  Changes/Blocked/Closed use circle-x with existing semantic tones.
- [ ] [AC-4] Root activity, existing left status glyphs, provider marks after
  child count, provider-first quiet children, time, branch, and connector
  behavior remain unchanged.
- [ ] [AC-5] Filters, search, hierarchy/collapse, protected bulk deletion,
  menus, split navigation, project `+`, shelves, and compact layout remain
  unchanged; tests and real screenshots show no ordinary checks.

## Scope

- Remove root Done selection/rendering and summary requests from ThreadCard.
- Delete unused Done UI and summary hook/backend/cache plumbing.
- Reorder PR metadata to number then semantic icon at the line's right edge.

## Non-goals

- Changing PR mapping, provider identity, live status, or management behavior.
- Showing completion for ordinary threads in another form.

## Risks

- Removing Done reduces passive completion detail; quiet glyph/time and the
  thread conversation remain canonical.
- Check meaning must stay PR-specific; accessibility continues to name state.

## Verification

- PR order/icon tests and absence assertions for ordinary completion plumbing.
- Dockside/root checks, live wide/compact screenshots, fresh QA and review.

## Capability Deltas

- `deltas/dockside-thread-management.md`
