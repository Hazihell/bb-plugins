# Action Topbar distribution

## MODIFIED Requirements

### Requirement: Experimental compatibility warning

Action Topbar documentation SHALL use product-owned language, retain the
experimental Plugin SDK/core warning, and show real light-mode and dark-mode BB
screenshots of the topbar and Action launcher.

#### Scenario: User evaluates Action Topbar before installation

- GIVEN a user opens the Action Topbar README
- THEN no third-party comparison name appears
- AND the matching-core and SDK 0.4.33 warning remains visible
- AND light and dark screenshots show the installed topbar and searchable
  Action launcher

#### Scenario: Repository wording audit

- WHEN authored repository files are searched case-insensitively
- THEN the removed third-party product name has no matches outside generated
  dependencies or immutable historical evidence
