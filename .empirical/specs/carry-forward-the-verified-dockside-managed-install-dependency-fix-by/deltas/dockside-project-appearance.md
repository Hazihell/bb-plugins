# Dockside Project Appearance Delta

## Purpose

Define stable, accessible, individually configurable project identity colors
for Dockside's existing project letter badges.

## ADDED Requirements

### Requirement: Project letter badges have stable accessible colors

Dockside SHALL assign every project letter badge a deterministic background
from a curated palette using stable project ID, not display name. It SHALL
derive a readable foreground color and SHALL preserve the existing project
name, count, controls, order, and thread-state semantics.

#### Scenario: Project is renamed

- **GIVEN** a project uses its automatic badge color
- **WHEN** its display name changes but project ID stays the same
- **THEN** the badge letter follows the new name
- **AND** its automatic background color remains unchanged

### Requirement: Users can override each project color in settings

Dockside SHALL list current projects in its settings section with badge
previews, accessible native color inputs, Save behavior, and per-project Reset.
Overrides SHALL persist by project ID in bounded plugin storage and update
mounted settings/sidebar surfaces through realtime invalidation.

#### Scenario: User saves one project color

- **WHEN** the user selects a valid six-digit color for project A
- **THEN** project A's preview and sidebar badge update without reload
- **AND** the override survives reload and project rename
- **AND** project B is unchanged

#### Scenario: User resets one project color

- **WHEN** the user resets project A
- **THEN** only project A's stored override is removed
- **AND** project A returns to its deterministic automatic color

### Requirement: Project color persistence fails closed

Dockside SHALL accept only bounded project IDs belonging to current BB
projects and canonical six-digit hex colors. It SHALL cap stored rows and RPC
payloads, ignore malformed persisted rows, and never interpolate arbitrary
stored text into CSS.

#### Scenario: Invalid color reaches the server

- **WHEN** an RPC supplies an alpha color, CSS expression, oversized value, or
  unknown project ID
- **THEN** the request is rejected without changing stored colors
