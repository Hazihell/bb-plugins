# Project View Preferences Specification

## Purpose

Define durable device-local browsing and creation defaults without mixing them
with server-side project configuration or leaking values across projects.

## Requirements

### Requirement: Project-scoped browse memory

Taskboard SHALL store one versioned, validated, device-local browse preference
record per BB project and selected provider, plus an independent Across projects
record. The full board and right panel SHALL share the same project record,
including the active search query.

#### Scenario: Return from issue detail

- **GIVEN** the user entered a search query for project A
- **WHEN** they open an issue and return to either Taskboard surface
- **THEN** project A's query and filtered results remain active
- **AND** project B and Across projects retain their independent queries

#### Scenario: Parse a legacy record

- **WHEN** a valid version-1 record created before search persistence has no
  query field
- **THEN** Taskboard preserves its saved filters and supplies an empty query

### Requirement: Separate create-assignee memory

Taskboard SHALL remember the last confirmed provider-native assignee ID by
project, provider, destination, and issue type, independently of browse filters.

#### Scenario: Provider omits a requested assignee

- **GIVEN** a scope already remembers assignee A
- **WHEN** issue creation succeeds but the provider response does not confirm
  newly submitted assignee B
- **THEN** Taskboard warns about partial success and keeps assignee A remembered

#### Scenario: Confirmed unassigned creation

- **WHEN** issue creation succeeds with no assignee requested
- **THEN** Taskboard clears the remembered assignee only for that submitted scope

### Requirement: Clear filters is scope-local

Clear filters SHALL reset only the active project's selected filters and search
query while preserving its view/collapse state, every other scope, and durable
Manage settings. Provider reconciliation SHALL also drop the old provider's
query with its derived selections.

#### Scenario: Clear project A

- **WHEN** the user clears filters while viewing project A
- **THEN** project A's query and facets reset
- **AND** project B and Across projects retain their own saved selections
