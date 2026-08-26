# Board Capture Specification

## Purpose

Allow fast issue capture from a configured project board while retaining the
existing richer composer-assisted creation path.

## Requirements

### Requirement: Direct project-board issue capture

A configured project board SHALL expose a direct create affordance that opens
the provider-aware dialog. After any provider create request is dispatched,
Taskboard SHALL prevent a duplicate retry unless the response proves rejection;
partial field application SHALL be reported without treating the missing field
as a successfully remembered default.

#### Scenario: Create response is lost after dispatch

- **WHEN** Linear or Jira may have committed an issue but Taskboard cannot
  confirm the mutation response or required post-create detail
- **THEN** the form remains open with outcome-uncertain guidance
- **AND** Create stays disabled until the user refreshes and checks the provider

#### Scenario: Provider confirms the requested assignee

- **WHEN** the returned provider-native issue identity confirms the submitted
  assignee ID
- **THEN** Taskboard may save that ID as the scoped default

### Requirement: Composer-assisted create remains available

Direct board capture SHALL coexist with the existing repository-aware
composer-assisted draft flow and SHALL reuse the same validated backend create
operation.

#### Scenario: Create from a composer prompt

- **WHEN** the user invokes Taskboard from a non-empty BB composer prompt
- **THEN** the helper-assisted review workflow behaves as before and may restore
  the same scoped create-assignee default
