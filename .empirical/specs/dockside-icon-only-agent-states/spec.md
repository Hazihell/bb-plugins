# Dockside Icon Only Agent States

## Request

> Replace Dockside's visible state text with compact accessible icons and remove Done completion state from all child/sub-agent rows. Keep PR state understandable through a colored semantic icon plus number and accessible label/tooltip, keep root output-verified completion as an icon only, use an activity icon plus connector tint for working child families, rely on existing row glyphs for child live status, and preserve all filters, hierarchy, deletion, project creation, navigation, and compact behavior.

## Goal

Reduce Dockside to icon-led state signals: roots may show one accessible
activity, PR, or verified-completion icon; child rows show no Done state and
rely on their existing status glyph for live work.

## Acceptance Criteria

- [ ] [AC-1] [UI] A quiet no-PR root with verified final output shows one
  success-colored check icon with accessible `Done` label/tooltip and no Done
  text or output prose.
- [ ] [AC-2] [UI] Child/sub-agent rows never show Done, a completion icon, or
  assistant-output detail. Quiet completed children retain title, provider,
  branch, time, and neutral connector only.
- [ ] [AC-3] [UI] A quiet root or mounted child with a PR shows a semantic
  state icon plus `#number`; state and PR title remain in the accessible label
  and tooltip, while no visible state word or title prose is rendered.
- [ ] [AC-4] [UI] While any child works, the root branch line shows one primary
  activity icon and the existing connector tint. It shows no `Agents working`
  text, and child live state is conveyed only by the existing left status
  glyph rather than a second state word/icon.
- [ ] [AC-5] Root live status is conveyed by its existing left status glyph;
  the trailing slot shows age rather than duplicating Working, Unread, Failed,
  or Needs you text. All icon-only states have accessible labels/tooltips.
- [ ] [AC-6] Root precedence remains family activity, then PR, then verified
  completion. Child precedence is live status glyph, then PR; child output is
  not fetched or presented for completion.
- [ ] [AC-7] Filters, search, family expansion/collapse, bulk-delete safety,
  context menus, split navigation, project `+`, lifecycle shelves, connector
  geometry, and compact routing remain unchanged.
- [ ] [AC-8] Focused tests cover icon mapping and root/child precedence; real
  wide and compact BB screenshots show icon-only root state and three quiet
  child rows without Done badges.

## Scope

- Restore semantic icon selection to PR presentation.
- Convert root Done/family activity and PR metadata to accessible icons.
- Remove child summary requests and child Done/status-line presentation.
- Use the existing thread glyph as the sole live-status signal per row.

## Non-goals

- Removing root output verification or BB's lazy PR integration.
- Removing state meaning from accessibility/tooltip text.
- Changing state truth, PR mapping, connector behavior, or management actions.

## Risks

- Icons can be ambiguous; stable shapes, semantic colors, accessible labels,
  and tooltips retain meaning without permanent text.
- Removing child completion makes quiet children less explicit; their idle
  glyph/time and completed conversation remain available when opened.

## Verification

- Pure PR icon and precedence tests, existing Dockside suites, and typecheck.
- Running plugin plus wide/compact screenshots with three quiet children.
- Root typecheck, tests, lint, build, fresh-context QA, review, and integration.

## Capability Deltas

- `deltas/dockside-thread-management.md`
