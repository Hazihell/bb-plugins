# Plugin Git distribution

## ADDED Requirements

### Requirement: Patch-release version coherence

When a repository plugin patch release is prepared, its active manifest,
workspace lock record, changelog or release-facing documentation, distribution
guards, and generated BB metadata MUST agree on the exact version while the
package remains private and Git-only. Preparation MUST NOT create or move a
remote tag or release without separate authorization.

#### Scenario: Prepare the three local patch releases

- **WHEN** Taskboard `0.3.2`, Host Monitor `0.1.1`, and Usage Tracker `0.1.4`
  are prepared together
- **THEN** every active version-bearing surface and build artifact reports its
  plugin’s exact new version
- **AND** no commit, push, tag, publication, GitHub Release, or marketplace
  mutation occurs.
