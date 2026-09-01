# Capability Delta: Dockside Thread Management

## MODIFIED Requirements

### Requirement: Bulk deletion is explicit and state-safe

Dockside MUST allow ordinary checkbox toggling and Shift+click range selection
for visible eligible root families. An ordinary click MUST establish the range
anchor. A Shift+click MUST apply the clicked checkbox's intended checked state
to the inclusive visible eligible range. Missing or hidden anchors MUST fall
back to an ordinary toggle. Protected families MUST remain unselectable, and
range anchors MUST remain ephemeral to the current visible selection session.

All existing preview, confirmation, one-use token, descendant binding,
revalidation, partial outcome, and protected-family guarantees remain.

#### Scenario: User Shift-selects across visible roots

- **Given** selection mode shows eligible roots A, B, and C in that order
- **And** the user ordinarily checks A
- **When** the user Shift+clicks unchecked C
- **Then** A, B, and C are selected
- **And** A remains the range anchor

#### Scenario: User Shift-deselects a range containing a protected gap

- **Given** eligible A and C are selected with protected B between them
- **And** A is the visible anchor
- **When** the user Shift+clicks checked C
- **Then** A and C are deselected
- **And** B remains unselected and disabled

#### Scenario: The anchor is no longer visible

- **Given** A was the range anchor
- **And** a filter, search, project collapse, deletion, or protection change
  removes A from the visible eligible checkbox order
- **When** the user Shift+clicks B
- **Then** only B is toggled
- **And** B becomes the new anchor
