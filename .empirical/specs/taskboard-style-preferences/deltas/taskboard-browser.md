# Taskboard Browser

## Purpose

Define the restrained, responsive List/detail/filter behavior adapted for
Taskboard while preserving its full-width Kanban mode.

## ADDED Requirements

### Requirement: Restrained responsive List presentation

Taskboard SHALL render List rows as compact flat content with semantic state
shape and restrained color, neutral sticky group headings, stable aligned
metadata, and a readable capped List measure. Kanban SHALL retain full available
width and existing movement behavior.

#### Scenario: Wide List and Kanban

- **WHEN** the user switches a wide project board between List and Kanban
- **THEN** List content is capped near 56rem while Kanban uses the full board
  width
- **AND** neither mode loses provider status names or actions

### Requirement: Collapsible terminal groups

Finished and cancelled groups SHALL start collapsed, expose an accessible
toggle, remember explicit toggles per project, and open temporarily during
search.

#### Scenario: Search a collapsed Done group

- **WHEN** a matching issue exists inside a collapsed Done group and the user
  enters a search query
- **THEN** the group opens for the search result without destroying the saved
  collapsed preference after search clears

### Requirement: Constrained filter control

Constrained Taskboard surfaces SHALL replace the horizontally crowded chip row
with one compact filter control that exposes every enabled facet and clearly
indicates active selections.

#### Scenario: Pinned right panel

- **WHEN** Taskboard renders beside a chat at constrained width
- **THEN** one filter control opens the enabled facets with saved options checked
- **AND** search, clear, and List/Kanban behavior remain reachable

### Requirement: Quiet detail conversation hierarchy

Task detail SHALL use hairline-separated sections and a single comment rail or
divider hierarchy instead of a separate bordered card around every comment.

#### Scenario: Several comments

- **WHEN** an issue contains several comments
- **THEN** comments read as one chronological conversation with author/time and
  Markdown content preserved
