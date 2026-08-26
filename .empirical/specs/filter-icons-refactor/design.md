# Filter Icons Refactor Design

## Overview

Centralize Taskboard's filter presentation vocabulary and reuse it in three
surfaces: wide filter chips, constrained menu section headings, and Manage's
visible-filter cards. Filtering state and option rendering remain untouched.

## Presentation model

Define an exhaustive `FILTER_PRESENTATION` record keyed by `source` plus every
`WorkItemFilterField`. Each entry owns:

- canonical human label;
- one existing `IconName`; and
- a concise Manage description.

Use `satisfies Record<FilterPresentationKey, FilterPresentation>` so adding or
removing a filter field produces a TypeScript error until its presentation is
defined. Derive `BOARD_FILTER_OPTIONS` from an ordered field tuple rather than
duplicating labels and descriptions.

The vocabulary remains restrained and already familiar in Taskboard:

| Filter | Icon |
| --- | --- |
| Source | `GitBranch` |
| State group | `Circle` |
| Status | `Workflow` |
| Assignee | `UserRound` |
| Priority | `AlertCircle` |
| Project | `Folder` |
| Labels | `Layers` |

## Rendering

Add a small `FilterSectionLabel` wrapper around `DropdownMenuLabel`. It reads
the canonical presentation entry, renders a 13–14px decorative icon, and keeps
the text label visible. Constrained sections use it consistently.

Wide `FilterChip` call sites read their icon/label from the same map. Manage
cards add the corresponding icon beside the existing label while retaining the
description and native checkbox.

Do not convert filter option lists or state transitions into a generic renderer:
Source radio-like behavior, state glyphs, and each facet's update callback have
meaningful differences. The optimization is presentation-only.

## Compatibility boundaries

- No change to persisted preference shapes or values.
- No change to `enabledFilters`, active-category counting, checked options,
  search matching, Clear behavior, or List/Kanban selection.
- No provider, server, RPC, credentials, cache, or creation change.
- Icons use current host-compatible names and are `aria-hidden`; text remains
  the accessible section identity.
- Layout dimensions and menu scrolling remain unchanged.

## Verification

- Source guards prove exhaustive metadata reuse in chips, headings, and Manage.
- Existing preference/filter tests continue to cover behavior.
- Taskboard/root checks prove type/build closure.
- Live wide and constrained screenshots verify visual consistency, checked
  state, active count, search, and reachable Clear.
