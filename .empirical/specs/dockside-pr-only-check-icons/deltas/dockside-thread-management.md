# Capability Delta: Dockside Thread Management

## MODIFIED Requirements

### Requirement: Rows show semantic pull-request context

Dockside MUST show `#number` followed by the semantic PR-state icon as the
rightmost metadata on quiet PR rows. State/title remain accessible; visible
state words and title prose remain omitted.

#### Scenario: PR is ready

- **Given** a quiet row has a ready-to-merge PR
- **When** it renders
- **Then** the row ends with `#<number>` followed by a success check icon
- **And** the accessible label names Ready and the PR title

### Requirement: Completed rows show only real bounded outcomes

Dockside MUST NOT show Done text or a completion/check icon on ordinary no-PR
roots or children and MUST NOT fetch final output for sidebar completion.

#### Scenario: No-PR thread has final output

- **Given** an ordinary thread is quiet and has final assistant output
- **When** Dockside renders it
- **Then** no check or Done completion metadata appears
- **And** the row retains status glyph, title, location, and age
