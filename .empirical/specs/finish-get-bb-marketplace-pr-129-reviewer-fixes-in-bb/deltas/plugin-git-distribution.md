# Plugin Git distribution

## MODIFIED Requirements

### Requirement: Patch-release version coherence

When a repository plugin patch release is prepared, its active manifest,
workspace lock record, release-facing documentation, distribution guards, and
generated BB metadata MUST agree on the exact version while the package
remains private and Git-only. Preparation MUST NOT create or move a remote tag
or release without separate authorization.

#### Scenario: Prepare the current local patch releases

- **WHEN** Taskboard `0.3.3`, Host Monitor `0.1.2`, and Usage Tracker `0.1.4`
  are present together
- **THEN** every active version-bearing surface and build artifact reports its
  plugin's exact current version
- **AND** no remote release or marketplace mutation occurs before exact
  authorization.
