# Dockside thread management

## Purpose

Add truthful row-local pull-request and completion context plus one restrained
family orchestration signal to Dockside's open child-agent tree.

## ADDED Requirements

### Requirement: Rows show semantic pull-request context

Dockside MUST use BB's pull-request state and attention data to show a compact
semantic status pill, truncated linked PR title, and normal URL activation on
roots and mounted expanded children. Missing PR data MUST degrade to no line.

#### Scenario: Child branch is awaiting review

- **Given** an expanded child has an open PR with review requested
- **When** its row renders
- **Then** it shows an `IN REVIEW` pill and the PR title
- **And** activating the metadata opens BB's supplied PR URL

### Requirement: Completed rows show only real bounded outcomes

Dockside MUST show `DONE` only when BB returns a non-empty final assistant
output for a quiet mounted row with matching `updatedAt`. The summary MUST be a
single control-free line capped at 120 characters, cached only in bounded server
memory, and omitted when a PR exists or output is unavailable.

#### Scenario: Completed child has no PR

- **Given** an expanded quiet child has a final assistant output and no PR
- **When** Dockside's lazy summary request completes
- **Then** the row shows a `DONE` pill and truncated one-line result
- **And** no conversation or output content is persisted by Dockside

### Requirement: Active child work has one family orchestration signal

While any child is working, Dockside MUST show `Waiting for agents` on the root
and tint the existing family connector. It MUST leave row-level status intact
and return the connector to neutral when no child is working.

#### Scenario: One of three children starts work

- **Given** a root family is expanded with three children
- **When** one child enters a working state
- **Then** the root shows `Waiting for agents`
- **And** the connector receives the primary activity tint
- **And** no project-level aggregate status glyph is added
