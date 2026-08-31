# Integrate The Released Host Monitor Plugin Into Mateocerquetella Bb Plug

## Request

> Integrate the released Host Monitor plugin into MateoCerquetella/bb-plugins main-line monorepo on a focused branch: copy plugins/machine-monitor from release commit 9db09cc35553493113f31e5352a44911ae92bc73, add it to .bb/plugins.json and root catalog/docs/notices/workspace lock as required, preserve the immutable v0.1.0 release and marketplace PR, run all repository checks and live plugin verification, then push a review branch and open a pull request without merging.

## Goal

Track the released Host Monitor source as a first-class plugin in the public
`main` workspace without merging the unrelated release-branch history or
changing the immutable `machine-monitor/v0.1.0` release.

## Acceptance Criteria

- [ ] [AC-1] `plugins/machine-monitor` contains the reviewed Host Monitor
  release source, tests, assets, screenshots, license, and notices, excluding
  generated `dist/` and `node_modules/` output.
- [ ] [AC-2] The plugin manifest follows this repository's Git-only workspace
  conventions, pins the BB 0.40 / plugin SDK 0.4.21 toolchain, and exposes a
  complete `npm run check` contract.
- [ ] [AC-3] `.bb/plugins.json` lists `machine-monitor`, and the root README
  catalog, quick start, source-build examples, and third-party notices describe
  Host Monitor honestly.
- [ ] [AC-4] `package-lock.json` records the new workspace and resolves all
  dependencies from a clean `npm install`.
- [ ] [AC-5] Focused Host Monitor checks and root `npm run check` pass from the
  main-line workspace.
- [ ] [AC-UI-1] [UI] A local-path install opens the released Host Monitor
  dashboard in BB with its card fleet, inspector, process ledger, and sidebar
  control available; screenshots or equivalent browser evidence record the
  exercised surface.
- [ ] [AC-6] The integration is delivered on a focused branch and pull request
  based on `main`, without merging it, moving the v0.1.0 tag, or modifying the
  existing marketplace PR.

## Scope

- Transplant the released plugin directory into the main-line monorepo.
- Make only repository-convention adaptations needed for npm-workspace build,
  test, and Git-only distribution.
- Update the collection manifest, root documentation/notices, and lockfile.
- Verify package, workspace, and live BB behavior.
- Push a review branch and open a pull request to `main`.

## Non-goals

- Merge unrelated Git histories or rewrite `main`.
- Move, replace, or delete `machine-monitor/v0.1.0`.
- Change Host Monitor product behavior, UI, schemas, or release version.
- Publish to npm, modify marketplace PR #128, or merge either pull request.
- Refactor Taskboard or Usage Tracker beyond dependency-lock consequences.

## Verification

- `npm install`
- `npm run check --workspace bb-plugin-machine-monitor`
- `npm run check`
- `git diff --check`
- Local-path BB install/build/reload and browser exercise of the human UI.
- Review the final branch diff and verify the release tag and marketplace PR
  remain unchanged.

## Capability Deltas

- `deltas/plugin-git-distribution.md` modifies the active Git-only plugin
  distribution capability to include Host Monitor.
