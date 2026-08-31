# Plan: Usage Tracker 0.1.3 Release Preparation

## 1. Lock release identity and collision state

- Confirm the branch starts at merged PR #20 on public `main`.
- Confirm authenticated GitHub account, origin URL, current package/tag/Release,
  and absence of `usage-tracker/v0.1.3`.
- Record `0.1.3`, the plugin-specific tag, Git source, subdirectory, and tag
  prefix as immutable preparation inputs.

Coverage: AC-4, AC-6, AC-7.

## 2. Advance the active repository version surface

- Run npm's workspace version command with Git tagging disabled to update the
  Usage Tracker manifest and lockfile together.
- Promote `Unreleased` into the dated 0.1.3 changelog with the Compact limit and
  both provider/window fix families.
- Update root/plugin direct Git installs, marketplace PR links, Taskboard's
  distribution guard, and living command context.
- Search and classify remaining active `0.1.2` literals without editing history.

Coverage: AC-1, AC-2.

## 3. Verify the release tree and build artifacts

- Run focused Usage Tracker check and root `npm run check`.
- Inspect ignored server/app build metadata for id/version and prove generated
  output is untracked.
- Run `git diff --check`, review the complete release diff, and record immutable
  test/review evidence.

Coverage: AC-1 through AC-6.

## 4. Prepare the existing marketplace PR branch locally

- Clone the current `MateoCerquetella: bump-taskboard-v0.3.1` PR #129 head into
  a fresh directory and verify the `get-bb/marketplace` upstream.
- Before executing repository code, pin the exact GitHub PR head/upstream base,
  allowlist the complete declarative changed-path set, and prove manifests,
  lockfiles, scripts, workflows, and executable code unchanged.
- Read current README, schema, icon rules, and at least two live entries from
  that checkout before editing.
- Preserve Taskboard's Git migration and replace only Usage Tracker's npm source
  with the exact `^0.1.3` Git source/subdirectory/tag prefix.
- With release credentials removed, run ignored-script dependency install and
  marketplace build/repository checks; document that exact-tag proof awaits
  publication.

Coverage: AC-MKT-1, AC-MKT-2, AC-7.

## 5. Review and commit local preparation

- Run independent repository release and marketplace reviews; repair any
  blocking finding and rerun affected checks.
- Create one local repository release commit and one local marketplace commit
  proposal, with clean working trees and no remote refs changed.
- Record exact hashes and the marketplace liveness state.

Coverage: all criteria at the verified preparation ceiling.

## 6. Present the exact remote approval packet

- Show account, repository/remote, commits, package/version, tag/source/range,
  and every push/PR/merge/tag/Release/marketplace command.
- Stop for explicit approval before the first remote release mutation.
- After approval only: execute in dependency order, require clean CI and public
  source verification, then push/update marketplace PR #129.

Coverage: AC-4, AC-6, AC-MKT-2, AC-7; publication is outside this Empirical
ceiling.
