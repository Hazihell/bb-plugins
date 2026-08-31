# Dockside thread management

## Purpose

Define the compact project-level controls that let a Dockside user narrow a
large sidebar, start work in the correct project, and permanently remove
multiple quiet thread families without endangering active or unread work.

## ADDED Requirements

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
