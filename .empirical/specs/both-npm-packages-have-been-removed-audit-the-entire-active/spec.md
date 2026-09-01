# Active Git-only Distribution Audit

## Request

> Both npm packages have been removed. Audit the entire active repository and remove any remaining npm-distribution references for Taskboard and Usage Tracker from README files and all other active docs, manifests, CI/CD, release scripts, badges, package links, install/update commands, credential/config paths, changelogs, and marketplace-facing metadata, while preserving npm only as build/dependency tooling and preserving immutable historical Empirical records.

## Goal

Make every current user-facing and automated distribution surface consistently
Git-only for Taskboard and Usage Tracker after both registry packages were
removed, without deleting the package manifests or JavaScript tooling BB Git
installs still require.

## Acceptance Criteria

- [ ] [AC-1] The root, Taskboard, and Usage Tracker READMEs contain no npm
  package badge, npm package URL, `npm:` plugin source, registry installation,
  registry update, or registry-release wording for either plugin; their primary
  installation paths are BB Community shorthand and immutable Git ranges.
- [ ] [AC-2] Other active documentation and generated repository context contain
  no stale claim that either plugin distributes through npm. Legitimate
  development commands and the pinned `@get-bb/plugin-sdk` dependency remain
  clearly build-only facts.
- [ ] [AC-3] Both plugin manifests remain private and omit `publishConfig`,
  `files`, and `prepack`; the root has no npm publish credential config, token,
  publish/unpublish script, or publishing CI job.
- [ ] [AC-4] Marketplace-facing Taskboard and Usage Tracker entries use the
  public Git repository, correct plugin subdirectories, semver ranges, and
  plugin-specific tag prefixes, with no npm source object.
- [ ] [AC-5] Plugin package names, package manifests, workspaces, lockfile
  dependency records, npm install/run development commands, and source entry
  points remain intact because BB Git installation and local builds require
  them.
- [ ] [AC-6] Immutable historical Empirical specifications, receipts, and
  release artifacts remain byte-valid and are not rewritten to erase the
  accurate earlier npm timeline.
- [ ] [AC-7] A repository-wide active-file audit and root plugin checks pass,
  including focused regression guards for both packages.

## Scope

- Current root/plugin READMEs, Usage Tracker changelog, generated Empirical
  context, manifests, CI, scripts, config, tests, and marketplace entries.
- Clear classification of registry distribution references versus necessary
  package/build tooling.

## Non-goals

- Removing Node/npm as the dependency and build runner.
- Deleting or renaming `package.json`, plugin package names, workspace entries,
  lockfile dependency records, or `@get-bb/plugin-sdk`.
- Rewriting historical `.empirical/specs/**` records or existing Git tags.
- Performing any GitHub push, tag, Release, PR merge, or marketplace remote
  update without the separate exact release approval.

## Verification

- Repository-wide `rg` audit excluding generated bundles, dependencies, and
  immutable historical Empirical records.
- Focused distribution tests and root `npm run check`.
- Manifest/CI/config assertions plus private-workspace publish refusals.
- Marketplace schema build and, after public tags exist, Git-source liveness.
- Historical receipt-artifact digest audit.

## Capability Deltas

- `deltas/plugin-git-distribution.md`
