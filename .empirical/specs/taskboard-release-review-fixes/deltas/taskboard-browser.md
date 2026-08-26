# Taskboard Browser Delta

## ADDED Requirements

### Requirement: Accessible constrained filters and creation feedback

The constrained Taskboard filter menu SHALL make its visible value-search field
keyboard reachable and prevent provider values from creating horizontal
scrolling. Provider creation metadata failures SHALL expose the safe underlying
message through an announced alert while retaining Retry.

#### Scenario: Keyboard-filter a constrained board

- **WHEN** a keyboard user opens the constrained Filters menu
- **THEN** focus moves to the visible filter-value search input
- **AND** long values wrap or clip without horizontal scrolling

#### Scenario: Creation metadata fails

- **WHEN** provider metadata cannot load and Create is disabled
- **THEN** the dialog announces the safe provider error as an alert
- **AND** exposes the existing Retry action

#### Scenario: Restore differently-cased facet values

- **WHEN** a persisted selection differs only by case from a fresh option ID
- **THEN** the visible option renders checked with one canonical value
- **AND** toggling it off removes the filter completely

### Requirement: Provider-native value fidelity

Provider list/detail mapping SHALL retain every provider value that Taskboard
allows the user to submit, up to the declared field-selection limit.

#### Scenario: Create a Linear issue with many labels

- **WHEN** Taskboard accepts up to 100 Linear label selections
- **THEN** subsequent Linear issue payloads request at least 100 labels
