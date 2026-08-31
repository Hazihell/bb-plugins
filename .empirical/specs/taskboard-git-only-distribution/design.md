# Taskboard Git-only Distribution Design

## Manifest boundary

Set `plugins/taskboard/package.json` to `private: true`. Remove only Taskboard's
`publishConfig`, npm `files` allowlist, and `prepack` hook. Keep the package
name/version because BB derives plugin identity and build metadata from them;
keep dependencies, workspaces, package lock, and npm scripts because Git installs
and local development still use npm to install/build/test the source.

Advance Taskboard to patch version `0.3.1` so a new immutable
`taskboard/v0.3.1` tag contains the Git-only manifest; never move the existing
`taskboard/v0.3.0` release. Usage Tracker remains `0.1.2` and receives its first
plugin-specific `usage-tracker/v0.1.2` tag at the same reviewed source commit.

The user's later explicit instruction to remove both unpublished npm packages
supersedes the initial Taskboard-only boundary. Usage Tracker is also private
and loses publishConfig/files/prepack. Root `.npmrc.publish` and the local
credential are removed because no plugin publishes to npm. The deny-only
`.npm-publish.env` ignore entry remains so legacy credential files in other
clones cannot become accidentally stageable; it is not a publication path.
Root package-manager commands and registry lock entries remain because both Git
installs still use npm to install dependencies and build source.

## Installation documentation

Remove Taskboard's npm badge, npm package link, and npm install/update wording.
Document two supported paths:

1. `bb plugin install taskboard` after the BB Community entry is merged.
2. Direct Git tracking:
   `bb plugin install git:https://github.com/MateoCerquetella/bb-plugins.git@^0.3.0 --subdirectory plugins/taskboard --tag-prefix taskboard/`.

Usage Tracker receives the parallel direct command with range `^0.1.2`,
subdirectory `plugins/usage-tracker`, and tag prefix `usage-tracker/`. Keep
`bb plugin outdated`, `update`, `reload`, and `remove`; those commands also
apply to managed Git ranges.

## Guard and verification

Add a focused source-level distribution test that proves Taskboard is private,
has no publish/prepack/files contract, retains its BB manifest/build scripts,
contains the exact Git install command, and exposes no Taskboard npm URL/install
text in active root/plugin documentation. The same guard proves Usage Tracker is
also private/Git-only and that shared npm publish credentials/config are absent.
Actual `npm publish --dry-run --ignore-scripts` verification for both workspaces
must emit npm's `Skipping workspace ... marked as private` refusal; npm currently
returns exit zero for that skip, so the warning—not exit status—is authoritative.

Run Taskboard and root checks, verify the public tag, and rerun marketplace Git
build/liveness. Re-audit every immutable Empirical receipt artifact after active
capability integration.

## External npm registry status

The explicitly approved `npm unpublish bb-plugin-taskboard --force` attempt is
recorded operationally as rejected with `EOTP`. The user subsequently completed
the destructive npm website action: cache-bypassed registry queries now report
Taskboard unpublished at `2026-08-26T23:00:34.123Z` and Usage Tracker unpublished
at `2026-08-26T23:00:13.963Z`. Active code/docs now remove both stale npm paths.

## Git immutability trust boundary

The project never moves or replaces `taskboard/v*` tags. BB records the resolved
tag and commit for managed Git installs and refuses a tag that later points
elsewhere; release evidence anchors `taskboard/v0.3.0` to peeled commit
`3cbd919bcce696131b1cc16480c54f3049401ea9` and its GitHub Release. GitHub
administrator control remains an explicit operational trust assumption rather
than a claim that this change installs an undeletable hosting rule.

Usage Tracker receives the same operational rule through a new annotated
`usage-tracker/v0.1.2` tag anchored to the reviewed source commit and a Git
marketplace range that records/resolves the tag commit.
