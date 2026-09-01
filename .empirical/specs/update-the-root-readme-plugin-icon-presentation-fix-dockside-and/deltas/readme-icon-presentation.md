# README icon presentation

## Purpose

Define the root README's plugin icon sizing and stroke rendering contract.

## ADDED Requirements

### Requirement: Plugin icons render at the requested size
The root README MUST render every plugin catalog/header icon at 128×128 pixels.

#### Scenario: README icon dimensions
- **WHEN** a reader opens the root README
- **THEN** each plugin icon preview has width and height `128`

### Requirement: Violet outline icons preserve stroke-only artwork
Dockside and Host Monitor icon assets MUST keep violet outline paths without a
global fill override that turns those paths into solid shapes.

#### Scenario: Stroke icon rendering
- **WHEN** the Dockside or Host Monitor icon is rendered
- **THEN** the glyph is an outlined violet icon and not a solid purple square
