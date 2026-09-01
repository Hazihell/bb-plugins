# Dockside Thread Management Delta

## MODIFIED Requirements

### Requirement: Semantic presentation is persistently customizable

Dockside MUST derive one readable family state with precedence Failed, Needs
you, Working, Unread, Stale, then Inactive. Stale means a quiet family whose
latest member update is at least seven days old. Each state MUST retain a
distinct icon shape, accessible label, hover/focus explanation, and customizable
effective color. Inactive and Stale MUST use separate muted roles and visually
recede. Ordinary threads MUST NOT be labelled Done.

#### Scenario: Old quiet family recedes

- **Given** a read family has no live work, failure, or pending interaction
- **And** its latest member update was at least seven days ago
- **When** Dockside renders it
- **Then** its state is Stale with the dim stale icon/badge and muted copy
- **And** it is not called Done

#### Scenario: Custom stale color is invalid

- **Given** Custom palette is selected
- **When** the stale field is not a six-digit hex color
- **Then** Dockside uses the safe stale default
- **And** Settings previews the same effective fallback

## ADDED Requirements

### Requirement: Root family cards have exactly two semantic rows

Every root MUST render exactly two compact fixed rows. Row one MUST contain the
family state/activity icon, truncated title, and far-right elapsed time. Row two
MUST contain truncated branch text and one shrink-resistant right cluster with
the readable state badge, root-only PR metadata, and child disclosure/count plus
provider identity. Children MUST never render PR metadata. Ambiguous icons MUST
offer hover and keyboard-focus help.

#### Scenario: Narrow multi-child PR family

- **Given** a root has a long title, long branch, a PR, and multiple children
- **When** the sidebar is narrow
- **Then** title and branch truncate before metadata
- **And** PR appears only on the root
- **And** the card remains exactly two rows without clipping

### Requirement: Root family order is durable and project-local

Dockside MUST let a user move an entire root/descendant family within its own
project using drag or keyboard controls. It MUST validate an exact permutation
of the project's visible canonical root IDs, preserve the pinned-leading
partition, persist the order in bounded versioned browser storage, ignore
malformed records safely, and announce keyboard outcomes. Reordering MUST be
disabled whenever selection mode, a non-All filter, or host search makes visible
order incomplete. Cross-project and stale/incomplete requests MUST fail closed.

#### Scenario: Keyboard move survives reload

- **Given** the unfiltered project list is complete
- **When** a keyboard user moves family C above family B
- **Then** C and all descendants move together
- **And** an accessible announcement describes the move
- **And** the order is restored after reload

#### Scenario: Search blocks reorder

- **Given** host search hides one family
- **When** the user attempts drag or keyboard reorder
- **Then** no order is stored or changed
- **And** accessible help explains that search must be cleared

### Requirement: Project order is durable without extra chrome

Dockside MUST let users drag the existing project header to reorder complete
project groups and MUST persist that bounded project-ID order across reloads.
The existing header MUST also expose Alt+Arrow keyboard moves and announcements;
no dedicated project drag icon may be added. Search, non-All filters, and bulk
selection MUST disable project sorting together with family sorting.

#### Scenario: User drags a project header

- **Given** the complete unfiltered project list is visible
- **When** the user drags project C's existing header above project B
- **Then** C and all of its families move together
- **And** the order survives reload
- **And** no drag icon appears in either project header
