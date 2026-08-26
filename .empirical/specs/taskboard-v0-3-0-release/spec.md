# Taskboard 0.3.0 Release

## Request

> Prepare the Taskboard 0.3.0 npm release and BB Community marketplace update locally: bump the plugin/package lock version, preserve release contents and compatibility, validate the exact npm tarball, prepare the marketplace range change from ^0.1.2 to ^0.3.0 against current contracts, and stop before npm publication, Git push/tag/GitHub release, marketplace push, or PR until exact remote commands receive separate approval.

## Goal

Produce a locally committed, reproducible Taskboard `0.3.0` release candidate
and a validated marketplace update, with secrets protected and every remote
mutation held for explicit final approval.

## Acceptance Criteria

- [ ] [AC-1] Only Taskboard's package and workspace lock metadata advance from
  `0.2.0` to `0.3.0`; plugin ID, npm package name, engines, entry points,
  branding, license, and Usage Tracker version remain unchanged.
- [ ] [AC-2] The production build and dry-run npm tarball identify
  `bb-plugin-taskboard@0.3.0`, include all declared source/build/license files,
  exclude secrets and unrelated generated files, and pass the package's build
  metadata verifier.
- [ ] [AC-3] A clean marketplace branch changes only
  `entries/taskboard.json` from npm range `^0.1.2` to `^0.3.0`, preserving ID,
  description, author, engines, tags, and the existing content-hashed vendored
  icon; current schema/build validation passes locally.
- [ ] [AC-4] Root workspace checks pass, `0.3.0` is absent from npm and the Git
  tag namespace before release, and the release commit is reviewable with no
  uncommitted release changes.
- [ ] [AC-5] Before any remote mutation, the user receives the exact GitHub/npm
  account, repository, release commit, package/version, tag/source, marketplace
  branch, and every publish/push/release/PR command for separate approval.
- [ ] [AC-6] npm credentials remain only in the ignored secure dotenv file and
  temporary environment/config references; no secret appears in Git, command
  output, artifacts, marketplace data, or chat.

## Scope

- Taskboard package version and root `package-lock.json` workspace metadata.
- Full Taskboard/root build, tests, package verification, and dry-run tarball.
- A clean local clone/branch of `MateoCerquetella/marketplace` based on current
  `get-bb/marketplace:main`, updating only Taskboard's npm semver range.
- Local release commit and exact remote-release plan.

## Non-goals

- Publishing to npm, pushing Git commits/tags, creating a GitHub release,
  pushing the marketplace branch, or opening its PR before final approval.
- Changing Taskboard behavior, engines, package contents, branding, source
  location, author, tags, or marketplace icon.
- Releasing Usage Tracker or changing other marketplace entries.

## Risks

- A stale build can stamp `0.2.0` into packaged metadata after the manifest bump.
- npm pre-1.0 caret ranges exclude later minor versions, so the current
  `^0.1.2` listing cannot resolve `0.3.0`.
- Publishing before the release commit/tag or moving a tag breaks provenance.
- A token can leak through argv, npmrc content, logs, or tracked files.
- Marketplace source checks cannot pass until npm publicly exposes `0.3.0`.

## Verification

- `npm run check`, `git diff --check`, and focused Taskboard package checks.
- `npm pack --dry-run --ignore-scripts --json` after the versioned build.
- Inspect packed paths, versioned build metadata, Git status, and secret
  exclusion without reading the secret file.
- Marketplace `npm ci --ignore-scripts` and `npm run build` before publication;
  run full `npm run check` after public npm confirmation and before PR.
- Independent release-diff review and exact remote-command approval gate.

## Capability Deltas

- `deltas/taskboard-distribution.md`
