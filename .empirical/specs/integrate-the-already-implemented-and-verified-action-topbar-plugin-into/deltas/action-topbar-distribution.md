# Action Topbar distribution

## Purpose

Make the experimental Action Topbar source installable from the plugin
repository while preventing accidental use with an incompatible BB core or
marketplace publication before its required SDK surface is accepted.

## ADDED Requirements

### Requirement: Installable experimental plugin source

The repository SHALL include the complete Action Topbar plugin source as an npm
workspace package under `plugins/action-topbar`.

#### Scenario: Install from Git

- GIVEN a BB installation with Plugin SDK 0.4.33 and the matching experimental
  core split-drag API
- WHEN a user runs the documented Git install command against `main`
- THEN BB installs the Action Topbar plugin from `plugins/action-topbar`

#### Scenario: Install from a local checkout

- GIVEN a local checkout of the plugin repository
- WHEN a user runs the documented local-path install command
- THEN BB installs Action Topbar from the local plugin directory

### Requirement: Experimental compatibility warning

The plugin documentation SHALL state that Action Topbar changes and depends on
an experimental Plugin SDK/core surface and is not intended for marketplace
submission until that SDK change is accepted.

#### Scenario: User evaluates compatibility

- GIVEN a user reads the Action Topbar README before installation
- THEN the required SDK version, matching-core dependency, and marketplace
  restriction are visible before the install commands
