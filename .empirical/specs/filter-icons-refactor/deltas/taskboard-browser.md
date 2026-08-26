# Taskboard Browser Delta

## MODIFIED Requirements

### Requirement: Constrained filter control

Constrained Taskboard surfaces SHALL replace the horizontally crowded chip row
with one compact filter control that exposes every enabled facet and clearly
indicates active selections. Source, State group, Status, Assignee, Priority,
Project, and Labels SHALL use one consistent, decorative icon vocabulary across
wide filter chips, compact section headings, and filter configuration cards.
Text labels, checked state, active counts, search, Clear, persistence, and
keyboard behavior SHALL remain authoritative and unchanged.

#### Scenario: Pinned right panel

- **WHEN** Taskboard renders beside a chat at constrained width
- **THEN** one filter control opens the enabled facets with saved options checked
- **AND** each named section has its canonical decorative icon
- **AND** search, Clear, and List/Kanban behavior remain reachable

#### Scenario: Wide project board

- **WHEN** Taskboard renders the wide filter chip row
- **THEN** each chip uses the same icon and label as its compact menu section
- **AND** choosing or clearing a filter behaves exactly as before

#### Scenario: Configure visible filters

- **WHEN** the user opens Manage and reviews visible filters
- **THEN** each filter card uses its canonical icon, label, and description
- **AND** saving the configuration writes the same filter-field values as before
