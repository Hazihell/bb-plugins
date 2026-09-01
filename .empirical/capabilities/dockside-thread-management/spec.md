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

During selection mode, the complete eligible root row MUST act as the native
checkbox selection target. Ordinary row click MUST toggle one family and set
the anchor. Shift+click MUST apply the target's intended selected state across
the inclusive visible eligible range. Checkbox clicks MUST retain identical
behavior. Protected row clicks MUST neither select nor navigate.

All preview, confirmation, one-use token, descendant binding, revalidation,
partial outcome, filter/search/order, and protected-family guarantees remain.

#### Scenario: User Shift-selects by clicking row titles

- **Given** selection mode shows eligible A, protected B, and eligible C
- **And** the user clicks anywhere on A's root row
- **When** the user Shift+clicks anywhere on C's root row
- **Then** A and C are selected
- **And** B remains disabled and unselected
- **And** no thread opens

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

Dockside MUST show one PR indicator per family on the root only. The root's
trailing column MUST show elapsed time first and `#number` plus semantic icon
directly beneath it. Child rows MUST NOT look up or render PR metadata.

#### Scenario: Root and three children share a branch PR

- **Given** an expanded root has three children on the same PR branch
- **When** Dockside renders the family
- **Then** the root shows one PR number/icon below elapsed time
- **And** no child repeats that PR metadata

### Requirement: Completed rows show only real bounded outcomes

Dockside MUST NOT show Done text or a completion/check icon on ordinary no-PR
roots or children and MUST NOT fetch final output for sidebar completion.

#### Scenario: No-PR thread has final output

- **Given** an ordinary thread is quiet and has final assistant output
- **When** Dockside renders it
- **Then** no check or Done completion metadata appears
- **And** the row retains status glyph, title, location, and age

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

### Requirement: Semantic presentation is persistently customizable

Dockside MUST expose persistent plugin settings for semantic status/PR palette,
row density, default child expansion, provider marks, root PR metadata, and
relative time. Default values MUST preserve existing behavior. Palette options
MUST include Default, High contrast, Colorblind-friendly, and validated Custom
colors. Invalid values MUST fall back without applying arbitrary CSS.

Color customization MUST NOT remove state labels, icon shapes, animation,
tooltips, disabled semantics, or PR precedence.

#### Scenario: User chooses the colorblind-friendly preset

- **Given** Dockside settings are open
- **When** the user chooses Colorblind-friendly
- **Then** working, stalled/waiting, unread, error, idle, and PR icon colors use
  the documented preset
- **And** the sidebar updates without a reload
- **And** each state retains its original icon, label, and animation

#### Scenario: User supplies an invalid custom color

- **Given** Custom palette is selected
- **When** a color field is not a valid six-digit hex value
- **Then** Dockside uses that role's safe default
- **And** the invalid value is never projected into inline CSS

#### Scenario: User hides optional metadata

- **Given** provider icons, PR metadata, and relative time are visible by default
- **When** the user disables one or more settings
- **Then** only those optional elements disappear
- **And** status, title, branch, hierarchy, selection, and navigation remain
