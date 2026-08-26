# Board Capture

## Purpose

Allow fast issue capture from a configured project board while retaining the
existing richer composer-assisted creation path.

## ADDED Requirements

### Requirement: Direct project-board issue capture

A configured project board SHALL expose a direct create affordance that opens
the existing provider-aware create dialog without requiring a composer prompt.

#### Scenario: Create from a configured board

- **WHEN** the user activates create from a configured project board
- **THEN** Taskboard opens an editable blank title/description form and loads
  the provider's supported destination, assignee, priority, label, due-date,
  milestone, and issue-type metadata
- **AND** nothing is sent to the provider until the user confirms Create

#### Scenario: Project is not configured

- **WHEN** the selected project has no available tracker connection
- **THEN** direct create is disabled or routes the user to the existing Manage
  guidance instead of opening a broken form

## ADDED Requirements

### Requirement: Composer-assisted create remains available

Direct board capture SHALL coexist with the existing repository-aware
composer-assisted draft flow and SHALL reuse the same validated backend create
operation.

#### Scenario: Create from a composer prompt

- **WHEN** the user invokes Taskboard from a non-empty BB composer prompt
- **THEN** the helper-assisted review workflow behaves as before and may restore
  the same scoped create-assignee default
