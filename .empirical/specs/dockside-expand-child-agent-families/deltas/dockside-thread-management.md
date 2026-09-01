# Dockside thread management

## Purpose

Refine the project-first child-agent tree so completed real child threads stay
structurally visible without noisy duplicate status chrome.

## ADDED Requirements

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
