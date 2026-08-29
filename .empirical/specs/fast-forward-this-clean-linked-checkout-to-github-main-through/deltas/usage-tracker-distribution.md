# Usage Tracker distribution

## MODIFIED Requirements

### Requirement: Immutable Usage Tracker Git release

Every Usage Tracker release SHALL bind one reviewed commit with matching active
manifest, lockfile, changelog, documentation, distribution tests, and build
metadata to one new annotated `usage-tracker/vX.Y.Z` tag and one GitHub Release.
Existing tags SHALL never move, Usage Tracker SHALL remain a private,
non-publishable npm workspace distributed from Git, and preparation SHALL stop
before remote mutation unless exact authorization is supplied.

#### Scenario: Prepare Usage Tracker 0.1.4 locally

- **WHEN** the complete merged provider/window behavior is prepared as `0.1.4`
- **THEN** every active Usage Tracker version reference and artifact reports
  `0.1.4`
- **AND** the proposed future tag is `usage-tracker/v0.1.4`
- **AND** no tag or GitHub Release is created during preparation.
