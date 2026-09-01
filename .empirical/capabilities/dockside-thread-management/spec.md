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
