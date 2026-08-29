# Host Monitor sidebar

## Purpose

Keep Host Monitor’s compact sidebar entry quiet while retaining accessible and
interactive fleet status.

## ADDED Requirements

### Requirement: Dot-free movable trigger

The movable Host Monitor sidebar trigger MUST NOT draw a pseudo-element
notification/status dot. Fleet state MUST remain available through its
dynamically updated accessible label and title, and activating or dragging the
trigger MUST retain the existing popover and floating-monitor behavior.

#### Scenario: Critical fleet without a notification dot

- **GIVEN** one or more monitored hosts need attention
- **WHEN** the sidebar trigger renders
- **THEN** no overlaid dot is drawn on the trigger
- **AND** assistive text still reports the fleet state
- **WHEN** the user activates the trigger
- **THEN** the Host Monitor popover opens normally.
