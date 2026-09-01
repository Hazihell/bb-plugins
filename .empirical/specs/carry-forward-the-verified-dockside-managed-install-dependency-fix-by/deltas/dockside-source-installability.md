# Dockside Source Installability Delta

## Purpose

Define the production dependency metadata required for BB to install and build
Dockside from managed Git source.

## ADDED Requirements

### Requirement: Unshimmed runtime imports are production dependencies

Dockside SHALL declare `@hugeicons/react`, `@hugeicons/core-free-icons`, and
`zod` as runtime dependencies in both its manifest and workspace lockfile so a
managed install using `--omit=dev` can build its frontend and backend entries.

#### Scenario: BB builds a clean managed source install

- **WHEN** BB installs production dependencies only and builds Dockside
- **THEN** both Hugeicons imports and Zod resolve
- **AND** `dist/app.js` and `dist/server.js` are produced

#### Scenario: Dependency classification regresses

- **WHEN** a required runtime package moves to development-only metadata
- **THEN** Dockside's distribution contract test fails
