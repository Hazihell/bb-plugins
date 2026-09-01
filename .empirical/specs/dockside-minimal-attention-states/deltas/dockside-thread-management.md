# Capability Delta: Dockside Thread Management

## MODIFIED Requirements

### Requirement: Rows show semantic pull-request context

Dockside MUST use BB's pull-request state and attention data to show one compact
semantic status pill plus PR number on quiet roots and mounted expanded
children. The supplied PR title MUST remain in accessible/tooltip context but
MUST NOT add visible prose or another row. Missing PR data MUST degrade to no
state without disturbing the row.

#### Scenario: Child branch is awaiting review

- **Given** an expanded quiet child has an open PR with review requested
- **When** its row renders
- **Then** its branch line shows `IN REVIEW #<number>` with primary treatment
- **And** the visible row does not repeat the PR title
- **And** activation still opens BB's supplied PR URL

### Requirement: Completed rows show only real bounded outcomes

Dockside MUST show `DONE` only when BB returns a non-empty final assistant
output for a quiet mounted row with matching `updatedAt`. It MUST retain the
bounded memory-only verification path but display only the Done state, never
assistant-output prose, hover detail, or another metadata line.

#### Scenario: Completed child has no PR

- **Given** an expanded quiet child has a final assistant output and no PR
- **When** Dockside's lazy summary request completes
- **Then** its branch line shows one success-treated `DONE` pill
- **And** no assistant output text is visible or persisted by Dockside

### Requirement: Active child work has one family orchestration signal

While any child is working, Dockside MUST show `Agents working` as the root's
single branch-line state and tint the existing family connector. Live/attention
states MUST outrank passive PR/Done metadata and use explicit semantic text and
color treatments. The connector and state MUST return to quiet metadata when
work ends.

#### Scenario: One of three children starts work

- **Given** a root family is expanded with three children
- **When** one child enters a working state
- **Then** the root branch line shows only `Agents working`
- **And** the working child shows its primary-treated `Working` state
- **And** the existing connector receives the primary activity tint
- **And** no project-level aggregate status glyph or third metadata line is
  added
