# Design

## Status model

Add a pure family-status projection over root plus descendants. Precedence is
Failed (`unread-error` or runtime error), Needs you, Working, Unread, then quiet
age: Stale at seven days and Inactive below it. The projection owns label,
description, icon name, animation, color role, and receded-copy flag. This keeps
card rendering and Settings preview on one vocabulary and never infers Done.
The Working outcome retains its actual live activity subtype: runtime,
workflow, background agent, background command, plan mode, or goal. Each uses a
different animated shape and customizable color while the badge stays Working.

## Two-row card

Restructure only the root card interior as a two-row grid. Row one has a fixed
status control-sized cell, `minmax(0,1fr)` title, and shrink-resistant elapsed
time. Row two starts under the title with a branch/location that truncates, then
a right-aligned flex cluster: compact text badge, root-only PR metadata, and one
child disclosure/count control carrying provider marks. Existing absolute
navigation/selection targets and split props remain. Quiet copy uses muted
foreground opacity; fixed row heights and `min-w-0` prevent a third line.

Status, provider, PR, and disclosure controls use a shared focusable tooltip
pattern (`title`, `aria-label`/screen-reader text, and visible hover/focus bubble)
without making decorative duplicates tabbable.

## Palette

Split the former idle role into `inactive` and `stale`; keep all four presets,
six-digit hex validation, and CSS-variable projection. Defaults use theme tokens
or restrained green/amber/blue/red plus light/dark greys. The Settings preview
renders the actual family badge/icon vocabulary for all six states and swatches
for all PR roles, so each displayed value is the resolved effective color.
PR icon backgrounds are mixed from the effective semantic PR color rather than
the generic primary token, making a ready/check tick visibly green.

## Durable ordering

Add a versioned browser-local order module. One bounded JSON record maps project
IDs to exact root-ID arrays. Parsing accepts only bounded printable identifiers,
unique arrays, and bounded projects/roots. Applying order keeps pinned roots in
their canonical leading partition and uses stored ranks only within each pinned
partition; unknown/new roots fall back to canonical creation order.

A reorder operation receives project ID, canonical full root IDs, source and
target IDs, and direction. It succeeds only for an exact same-project full list,
known distinct IDs, and the same pinned partition. It returns a complete new
permutation which ThreadInbox persists and reapplies before filtering/search.

ProjectGroup exposes native drag events on each family wrapper and Alt+ArrowUp /
Alt+ArrowDown on the root focus target. Reorder enablement is one boolean:
selection off, `all` filter, and blank host search. Disabled attempts do not
write and expose a reason. A polite live region announces moves and boundaries.
Children remain inside ThreadCard and therefore move atomically with the root.

## Verification

Pure tests cover projection precedence/boundary, palette fallback, storage
bounds and exact permutations, pinned/cross-project rejection, and conflict
enablement. Source-contract tests cover the two-row grid, truncation, root-only
PR, tooltips, drag/keyboard wiring, and live announcements. Existing Dockside
tests, typecheck, build, portability/system checks, repository CI, local plugin
reload, and normal/narrow live screenshots complete verification.

## Risks

- Native drag can steal BB split-drag: initiate reorder only from an explicit
  compact drag handle/control and leave the row anchor's split props unchanged.
- Stored order can become stale: merge stored ranks with canonical roots and
  rewrite only after an exact current-list operation.
- Metadata can crowd narrow rows: the branch owns all remaining flexible width;
  the compact cluster never wraps and lower-priority optional marks stay small.
