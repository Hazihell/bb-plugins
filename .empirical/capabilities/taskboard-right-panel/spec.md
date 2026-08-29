# Taskboard Right Panel Specification

## Purpose

Keep Taskboard recognizable and behaviorally stable when it is opened beside a
BB thread.

## Requirements

### Requirement: Branded thread-header shortcut

The Taskboard thread-header shortcut MUST use Taskboard’s ticket-shaped icon
and MUST retain the existing “Pin Taskboard on the right” accessible label,
tooltip, persistence, panel-open action, sizing, and error handling.

#### Scenario: Pin Taskboard beside a thread

- **GIVEN** an existing BB thread renders the Taskboard header shortcut
- **WHEN** the shortcut is displayed
- **THEN** its visible glyph is the Taskboard ticket rather than `PanelRight`
- **WHEN** the user activates it
- **THEN** Taskboard is stored as pinned and opens in the thread’s right panel.
