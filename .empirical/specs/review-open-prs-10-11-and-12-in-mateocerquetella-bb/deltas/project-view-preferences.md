# Project View Preferences Delta

## MODIFIED Requirements

### Requirement: Project-scoped browse memory

Taskboard SHALL retain one versioned, validated, device-local browse preference
record per BB project/provider plus the independent Across projects scope. It
SHALL additionally store explicitly named preset snapshots per BB project in the
plugin database. Presets SHALL reuse the complete released browse preference
shape and SHALL apply only on explicit user/CLI action through the ordinary
preference update path.

#### Scenario: Apply a named preset

- **GIVEN** project A has a preset containing query, filters, List/Kanban view,
  and collapse overrides
- **WHEN** the user applies it from project A's filter bar
- **THEN** every preset field replaces project A's current browse state
- **AND** the full board and right panel immediately share the result
- **AND** project B and Across projects remain unchanged

#### Scenario: Return later

- **GIVEN** a preset was applied to project A
- **WHEN** the user reloads or returns from issue detail
- **THEN** the existing device-local project preference record restores the
  applied state
- **AND** no separate server filter-state writer races with it

## ADDED Requirements

### Requirement: Safe project preset management

Preset names and state SHALL be bounded and strictly validated. Names SHALL be
case-insensitively unique using locale-independent normalization; ordering SHALL
be deterministic and reorder writes SHALL require an exact permutation of the
visible project preset IDs. Corrupt rows SHALL be omitted individually, and
deleting an absent preset SHALL be idempotent.

#### Scenario: Duplicate name

- **WHEN** a user saves a preset whose normalized name already exists in the
  same project
- **THEN** the write is rejected without modifying either preset

#### Scenario: Corrupt stored preset

- **WHEN** one stored row fails strict state validation
- **THEN** valid presets still list and can be reordered against the parseable
  subset

### Requirement: Preset CLI parity

The Taskboard CLI SHALL list, save, rename, and delete project presets and SHALL
accept `list --preset <name>`. Explicit source/query flags SHALL override the
preset's source/query; remaining preset facets SHALL use the same pure filter
function as the UI.

#### Scenario: List with explicit override

- **GIVEN** preset `My work` stores query `bug` and source `linear`
- **WHEN** the user runs `bb taskboard list --preset "My work" --query urgent`
- **THEN** `urgent` overrides the preset query
- **AND** the preset's remaining facets still narrow results
