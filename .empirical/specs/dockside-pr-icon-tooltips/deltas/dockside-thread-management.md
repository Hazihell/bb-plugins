# Capability Delta: Dockside Thread Management

## MODIFIED Requirements

### Requirement: Rows show semantic pull-request context

Dockside MUST render PR number followed by a semantic state icon and MUST show
state, number, and title in a themed hover/focus tooltip. In review uses Eye;
Ready/Merged Check; Changes/Blocked/Closed CircleX; Checks Loading; Open/Draft
GitBranch.

#### Scenario: PR awaits review

- **Given** a quiet row has a review-requested PR
- **When** it renders
- **Then** the row ends in `#number` and an eye icon
- **And** hover/focus reveals `In review · #number · title`
