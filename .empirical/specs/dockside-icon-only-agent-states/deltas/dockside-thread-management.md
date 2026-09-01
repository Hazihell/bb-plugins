# Capability Delta: Dockside Thread Management

## MODIFIED Requirements

### Requirement: Rows show semantic pull-request context

Dockside MUST show a semantic PR-state icon plus PR number on quiet roots and
mounted children. State/title MUST remain accessible and available as a native
tooltip, while visible state words and PR-title prose are omitted.

#### Scenario: Child PR awaits review

- **Given** an expanded quiet child has a review-requested PR
- **When** its row renders
- **Then** it shows the primary review icon and `#number`
- **And** the accessible label names In review and the title

### Requirement: Completed rows show only real bounded outcomes

Dockside MUST use verified output only to show an accessible success check on
root rows. Child/sub-agent rows MUST NOT request or render Done completion
metadata.

#### Scenario: Three children are complete

- **Given** a root and three children are quiet with final output
- **When** the family renders
- **Then** the root may show one accessible completion check
- **And** no child shows Done text, a completion icon, or output prose

### Requirement: Active child work has one family orchestration signal

While a child works, Dockside MUST show one primary activity icon on the root
and tint the existing connector. The child MUST rely on its existing left
status glyph and MUST NOT add a second live-status word or icon.

#### Scenario: One child starts work

- **Given** an expanded family has one working child
- **When** Dockside renders it
- **Then** the root shows one accessible activity icon
- **And** the connector is tinted
- **And** no Agents working or Working text is added
