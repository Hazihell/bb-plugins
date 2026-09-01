# Dockside Thread Management Specification

## Purpose

Define the compact project-level controls that let a Dockside user narrow a
large sidebar, start work in the correct project, and permanently remove
multiple quiet thread families without endangering active or unread work.

## Requirements

### Requirement: Dockside filters its project-first hierarchy by intent

Dockside MUST offer compact All, Working, Needs you, Unread, Quiet, Quiet 1d+,
and Quiet 7d+ presets. Filtering MUST compose with host search while preserving
project order, root context for matching children, and existing status styling.

#### Scenario: User narrows the sidebar to old quiet work

- **Given** projects contain working, unread, recent quiet, and old quiet roots
- **When** the user chooses `Quiet 7d+`
- **Then** only quiet families at least seven days old remain
- **And** their project and child hierarchy is unchanged
- **And** the Projects header shows that a filter is active

### Requirement: Bulk deletion is explicit and state-safe

Dockside MUST allow multi-selection only for root families whose root and
descendants are not working, waiting, unread, pinned, or currently open. Bulk
deletion MUST preview authoritative descendant counts, require an explicit
permanent-action confirmation, consume a short-lived preview token, revalidate
state, and report per-root deleted, skipped, or failed outcomes.

#### Scenario: A selected root starts working before confirmation

- **Given** two quiet roots are selected and a delete preview is open
- **And** one root starts working before the user confirms
- **When** the user confirms deletion
- **Then** the still-quiet root is deleted with its confirmed child tree
- **And** the newly working root is skipped and remains selected
- **And** the result explains the partial outcome

#### Scenario: User cancels bulk deletion

- **Given** multiple quiet families are selected
- **When** the user closes or cancels the destructive confirmation
- **Then** no thread is deleted
- **And** the selection remains available for review

### Requirement: Every project can start a native project-scoped thread

Each Dockside project header MUST expose an accessible `+` control that opens
BB's native New Thread composer with that project selected and prompt focus.
BB MUST remain responsible for resolving the project's configured
workspace/folder.

#### Scenario: User starts a thread from a project header

- **Given** a project has a configured default source/workspace
- **When** the user activates its `+` button
- **Then** BB opens the native New Thread composer
- **And** that project is selected
- **And** its normal workspace/folder context is used
- **And** compact/mobile sidebar navigation closes correctly

### Requirement: Real child-thread families default to an open connector tree

Dockside MUST expand a root family by default whenever BB reports one or more
real child threads, including when those children are completed and read. A
user MUST still be able to collapse or reopen the family during that mounted
session, and search MUST reveal matching descendants.

#### Scenario: Three dummy children finish

- **Given** a visible root has three visible BB child threads
- **And** all three children become idle and read
- **When** Dockside renders the family without a user override
- **Then** all three child rows remain visible below the root
- **And** the vertical/horizontal connector and row status presentation remain

### Requirement: Aggregate headers avoid duplicate status chrome

The child disclosure MUST use a numeric count and chevron without the words
`agent` or `agents`. Project headers MUST NOT stack needs-you, working, and
unread glyphs; they MUST retain their name, count, create action, chevron, and
accessible status summary while row-level status remains authoritative.

#### Scenario: Project contains working and unread roots

- **Given** one project has both a working root and an unread root
- **When** its project header renders
- **Then** no working/unread glyph pair is drawn in the project header
- **And** each root row still displays its own Working or Unread treatment

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
