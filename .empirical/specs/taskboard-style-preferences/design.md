# Taskboard Style Preferences Design

## Overview

This milestone adds a small project-scoped browser preference subsystem, reuses
the existing provider-aware creation flow for direct capture, hardens agent
context, and reshapes the List/detail presentation without changing provider
adapters or Kanban semantics.

## Preference architecture

Create `plugins/taskboard/browse-preferences.ts` as a pure, testable owner for:

- strict version-1 browse and create-default schemas;
- bounded normalization and safe fallback;
- project and Across-project scope keys;
- provider-change reconciliation;
- terminal-group collapse override semantics;
- a storage adapter interface so tests use an in-memory implementation;
- a module-local observable store that notifies every mounted surface in the
  same BB window and writes best-effort to `window.localStorage`.

The persisted browse record contains `provider`, view, state categories,
statuses, assignees, priorities, external projects, labels, and group-collapse
overrides. Search and the debounced committed query remain session state and are
not restored after a BB reload.

Full and right-panel `TrackerList` instances use the same scope key
(`project:<projectId>`). Across projects uses `across-projects`. The right panel
no longer prefixes its scope. A React `useSyncExternalStore` binding hydrates
before the first preference write, preventing default state from overwriting a
valid stored record.

When the selected project provider becomes known, a mismatched stored provider
retains provider-neutral view choice but clears provider-derived facet values
and collapse overrides before saving the new provider identity.

Public `main` predates Taskboard's locally completed provider-native creation
metadata work. Before wiring defaults, port that repository-owned implementation
from `.snapshots/taskboard-release`: strict metadata/options RPC schemas,
provider adapter `createMetadata`, expanded create input/result warnings, and
the assignee/priority/label/due-date/milestone/type form controls. Reconcile it
to this checkout rather than replacing unrelated files wholesale.

Create defaults then use a separate versioned key derived from project,
provider, destination, and issue type. The dialog loads the candidate only
after fresh metadata arrives, applies it only when `assigneeOptions` contains
the ID, and writes it only after the provider confirms issue creation.

## External task context

Move Taskboard's agent-context assembly through one helper that emits:

1. a trusted warning that the following block is external reference data and
   not instructions;
2. a clear start delimiter carrying provider/project/key identity;
3. the existing useful issue facts and description;
4. a clear end delimiter.

Mention resolution and any handoff that calls `formatWorkItemContext` receive
the same boundary. Tests use instruction-like issue text to prove the warning
cannot be placed inside attacker-controlled content.

## Browser and detail presentation

### State glyphs and rows

Replace the row-only colored dot with a small SVG `WorkStateGlyph` keyed solely
to `WorkStateCategory`: muted/dashed backlog, empty todo, partial in-progress,
checked done, and slashed cancelled. Color remains derived from host theme
tokens and the existing semantic category mapping; unknown English status names
never choose a random semantic meaning.

List rows remain keyboard-accessible buttons. Use flat transparent rows,
fixed-width monospace identifiers, a one-line flexible title, and right-aligned
priority/status metadata in a stable roughly 36–40px grid. Color is reserved for
glyph/urgent-high priority/selection. Secondary actions appear on hover and
`focus-within`, never hover alone. Keep a textual/accessibility status name and
existing status movement controls intact.

### Groups

`ListStateGroups` receives collapse overrides and a toggle callback. Terminal
categories (`done`, `canceled`) are collapsed by default; the stored list records
explicit toggles away from that default. Search forces groups open without
mutating the stored overrides, and only groups containing matches open. The
complete 28–32px group heading is an accessible toggle with chevron, label,
count, opaque neutral sticky background, focus ring, and expanded state.

### Width and filter modes

List and Across-project list content render inside a centered `max-w-[56rem]`
reading measure. Kanban and its horizontal scroller remain full width.

`TrackerList` accepts a surface mode. Full mode retains the efficient visible
filter chips. Constrained mode, used by the pinned/right panel, renders search
on its own row followed by a compact two-option List/Kanban segmented control
and a separate `Filters · N` trigger, where N counts active facet categories
rather than selected values. The filter surface uses named sections, checked
restored values, a persistent active summary, and a fixed clear-current-scope
footer. Menus have bounded height plus internal search/progressive disclosure
for large assignee and label vocabularies. The wide toolbar, headings, and rows
share the centered 56rem List measure; Kanban remains full width.

### Detail comments

Remove the outer detail card-within-card treatment where it duplicates BB's
panel frame. Put title, identifier, status, and metadata directly on the canvas;
cap long description text around 48–52rem. After one divider, render comments
as a chronological section with a muted vertical rail; preserve Markdown,
author, and time without per-comment borders/shadows/backgrounds. No new
comment mutation is introduced.

## Direct board capture

Generalize `CreateIssueDialog` to support `composer-assisted` and `direct`
launches. Direct mode starts with empty editable title/description, skips hidden
draft-helper creation, and immediately loads the selected project's provider
context and metadata. Composer mode retains current helper, fallback, and
mention-insertion behavior.

Add a labeled `New issue` control to the full Taskboard header. The right-panel
header uses an icon-only `+` with tooltip, accessible name, visible focus ring,
and at least a 36px target. The dialog header names the destination BB project
and provider. If the project is unavailable, the control is disabled with
Manage guidance. Both modes call the existing `createIssue` RPC; no provider
adapter is duplicated.

## Files and interfaces

- New: `plugins/taskboard/browse-preferences.ts`.
- Update: `app.tsx`, `app.css`, `browse.ts`, `contract.ts`, `server.ts`, the
  provider adapter interface/implementations, context formatting, and relevant
  README/notice files.
- Tests: new preference tests; extend browse/context/UI source/CSS tests.
- No database migration. The provider adapter gains the already-designed
  creation metadata contract but no new post-creation mutation surface.

## Failure handling

- Storage parse/write exceptions degrade to defaults and never block browsing.
- Stale create assignees are ignored rather than submitted.
- Provider changes clear only provider-derived UI values.
- Realtime remains an invalidation for work data; browser preference updates use
  the local observable store and browser `storage` events.
- Direct creation keeps existing create error/toast behavior and cannot send
  until explicit confirmation.

## Verification design

Pure tests exercise storage/version/scope/reconciliation/collapse logic without
a browser. Existing Node tests cover filtering and agent context. Source/CSS
guards cover registration and visual invariants that the current harness cannot
render. Root checks prove package/type/build closure. Final UI evidence uses the
local path plugin in BB across wide, right-panel, reload, List/Kanban,
light/dark, direct-create, and detail scenarios.
