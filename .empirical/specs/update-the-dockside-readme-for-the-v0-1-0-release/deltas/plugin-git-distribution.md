# Plugin Git Distribution Delta

## ADDED Requirements

### Requirement: Dockside release documentation is source-verifiable

Dockside's user-facing README SHALL identify its immutable Git release source,
provide a working monorepo subdirectory/tag-prefix install command, and show
theme-accurate compact screenshots of the released sidebar and inline child
agents. It SHALL NOT describe an open marketplace submission as already merged
or imply that the similarly named npm package is an approved source.

#### Scenario: User installs or evaluates Dockside v0.1.0

- **GIVEN** `dockside/v0.1.0` peels to the reviewed main merge
- **WHEN** a user reads the Dockside README
- **THEN** the direct Git command resolves `plugins/dockside` with the
  `dockside/` tag prefix and `^0.1.0` range
- **AND** light, dark, and expanded-subagent screenshots load from the plugin's
  own documentation media
- **AND** marketplace availability is described according to the current pull
  request state
