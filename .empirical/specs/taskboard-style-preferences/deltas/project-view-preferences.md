# Project View Preferences

## Purpose

Define durable device-local browsing and creation defaults without mixing them
with server-side project configuration or leaking values across projects.

## ADDED Requirements

### Requirement: Project-scoped browse memory

Taskboard SHALL store one versioned, validated, device-local browse preference
record per BB project and selected provider, plus an independent Across projects
record. The full board and right panel SHALL share the same project record.

#### Scenario: Restore one project without leaking another

- **WHEN** the user selects assignee and status filters in project A, chooses a
  different view in project B, and later reloads BB
- **THEN** project A restores only A's selections and project B restores only
  B's view
- **AND** the full and right-panel surfaces show the same active state

#### Scenario: Malformed or unavailable storage

- **WHEN** stored JSON is invalid, from an unsupported version, or browser
  storage throws
- **THEN** Taskboard renders usable defaults without crashing or overwriting
  valid project configuration

#### Scenario: Provider changes

- **WHEN** a project changes from one tracker provider to another
- **THEN** provider-specific selections from the previous provider are not
  applied to the new provider

### Requirement: Separate create-assignee memory

Taskboard SHALL remember the last successfully used provider-native assignee ID
by project, provider, destination, and issue type, independently of browse
filters.

#### Scenario: Restore a still-valid assignee

- **WHEN** fresh creation metadata for the same scope includes the saved ID
- **THEN** the create form preselects that assignee

#### Scenario: Ignore a removed assignee

- **WHEN** fresh metadata no longer includes the saved ID
- **THEN** Taskboard leaves the assignee unset and does not submit the stale ID

## ADDED Requirements

### Requirement: Clear filters is scope-local

Clear filters SHALL reset only the active project's selected filters and search
state while preserving other projects' preferences and durable Manage settings.

#### Scenario: Clear project A

- **WHEN** the user clears filters while viewing project A
- **THEN** project B and Across projects retain their own saved selections
