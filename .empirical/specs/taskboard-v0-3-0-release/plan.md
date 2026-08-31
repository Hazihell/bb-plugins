# Plan: Taskboard 0.3.0 Release

## 1. Version and verify the source release

- Bump Taskboard and matching lock metadata to `0.3.0` without tagging.
- Rebuild, run Taskboard/root checks, validate build metadata, confirm npm/tag
  absence, create the real release tarball with scripts disabled, inspect its
  exact paths and exclusions, and record its SHA-256 digest.

## 2. Prepare the immutable release commit

- Review all source, documentation, Empirical capability, and version diffs.
- Commit the complete release candidate locally as
  `release: Taskboard v0.3.0` and point local `agent/taskboard-v0.3.0` at it.
- Re-run clean-tree package verification at the release commit.

## 3. Prepare the marketplace update

- Clone the submitter fork into a new narrow directory and branch from current
  upstream main as `taskboard-v0.3.0-marketplace`.
- Change only Taskboard's npm range to `^0.3.0`; preserve the existing vendored
  icon and all other entry fields.
- Install marketplace dependencies without scripts, run schema/build checks,
  inspect the one-file diff, and commit locally.

## 4. Review and approval gate

- Independently review both local commits and release/tarball provenance.
- Present exact accounts, URLs, commit hashes, package/version, tag, marketplace
  source/branch, and every remote-changing command.
- Stop for explicit approval before any push, PR, merge, tag, npm publish,
  GitHub release, marketplace push, or marketplace PR.

## 5. Execute only after approval

- Push/open/merge the source release PR, push the immutable tag, recheck and
  publish the exact approved tarball with scripts disabled and a process-scoped
  token, confirm npm, create the GitHub release, pass marketplace source
  verification, then push/open the marketplace PR.
- Never retry an uncertain publication until querying the exact public version.
