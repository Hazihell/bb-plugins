# Taskboard Github Cli Specification

## Purpose

Keep Taskboard's GitHub CLI integration usable for normal and enterprise
environments without forwarding unrelated BB server secrets to child
processes.

## Requirements

### Requirement: Deliberate GitHub CLI process environment

Taskboard SHALL launch `gh` with fixed non-interactive locale controls and an
explicit allowlist covering executable lookup, GitHub authentication and
configuration, standard home/system locations, proxies, certificate stores,
and temporary storage. It SHALL NOT forward any other server environment key.

#### Scenario: Preserve required GitHub configuration

- **GIVEN** the server environment contains supported GitHub auth, home,
  proxy, CA, path, system, and temp variables
- **WHEN** Taskboard invokes `gh`
- **THEN** those values are available to the child together with fixed locale
  and non-interactive controls.

#### Scenario: Exclude unrelated secrets

- **GIVEN** the server environment also contains unrelated API tokens,
  database credentials, or plugin secrets
- **WHEN** Taskboard constructs the `gh` child environment
- **THEN** none of those unlisted keys is present.
