# Filter Icons Refactor

## Request

> Add a consistent icon to every Taskboard filter section and optimize the duplicated filter presentation metadata without changing filter semantics, saved preferences, responsive behavior, provider contracts, or existing project configuration.

## Goal

Give every filter surface the same scannable icon vocabulary while replacing
duplicated labels/icons/descriptions with one exhaustive presentation model.

## Acceptance Criteria

- [ ] [AC-UI-1] [UI] Source, State group, Status, Assignee, Priority,
  Project, and Labels use the same recognizable icon wherever they appear as a
  wide filter chip or constrained filter-section heading; project filter
  settings also show the corresponding icon.
- [ ] [AC-1] One typed, exhaustive presentation map owns the canonical label,
  icon, and Manage description for each configurable filter, plus Source's
  presentation, eliminating duplicated literals without runtime lookup risk.
- [ ] [AC-2] Section icons are decorative and do not replace text; active
  counts, checked values, search, Clear, saved preferences, filter semantics,
  responsive composition, and keyboard behavior remain unchanged.
- [ ] [AC-3] Focused source tests, Taskboard/root checks, and real BB wide and
  constrained screenshots verify icon consistency and no behavior regression.

## Scope

- Filter presentation metadata and small rendering helpers in `app.tsx`.
- Wide filter chips, compact filter menu section headings, and Manage visible-
  filter cards.
- Focused source tests plus live screenshots.

## Non-goals

- New filter fields, filter-value icons, provider-specific filter behavior, or
  changes to persisted preference schemas.
- Backend, RPC, provider adapter, credential, cache, or creation changes.
- Reworking the compact filter layout, counts, search, or Clear behavior.

## Risks

- Too many icons can add noise or crowd narrow surfaces.
- Inconsistent hardcoded labels could drift from the canonical map.
- Exposed decorative SVGs could add redundant accessibility announcements.

## Verification

- Source assertions for one exhaustive map and icon-bearing menu/settings
  labels without duplicated chip literals.
- Taskboard typecheck/tests/build, root workspace check, and `git diff --check`.
- Live wide and constrained filter screenshots; exercise a checked filter and
  Clear without changing provider data.

## Capability Deltas

- `deltas/taskboard-browser.md`
