# Rename The Host Monitor Plugin Identity From Machine Monitor To

## Request

> Rename the Host Monitor plugin identity from machine-monitor to host-monitor everywhere: plugin directory and package identity, collection manifest, routes/keys/channels/tests/docs/install commands, tracked main-repository PR #16, local bb installation, Git release tag prefix, and marketplace PR #128. Preserve the immutable legacy machine-monitor/v0.1.0 tag without moving it, eliminate active split identity, validate the full workspace and live UI, and prepare exact new host-monitor release mutations for separate approval before any commit push, new tag push, or marketplace PR update.

## Goal

Make `host-monitor` the single active public and runtime identity for Host
Monitor across the repository, local BB installation, Git distribution, and
the pending community-marketplace submission, while preserving immutable
history under the retired `machine-monitor` identity.

## Acceptance Criteria

- [ ] [AC-1] The plugin lives at `plugins/host-monitor`, its package is named
  `bb-plugin-host-monitor`, BB derives plugin id `host-monitor`, and no active
  `plugins/machine-monitor` package or collection entry remains.
- [ ] [AC-2] Every active identity-bound route, RPC URL, CSS namespace,
  animation name, source symbol, test fixture, package/lock record, collection
  field, and repository metadata value uses `host-monitor`; an allowlisted
  audit contains only historical records and the immutable retired tag.
- [ ] [AC-3] Root and leaf documentation, repository context, notices,
  development commands, update/remove commands, screenshots, and direct Git
  installation instructions consistently use `host-monitor`,
  `plugins/host-monitor`, `bb-plugin-host-monitor`, and the `host-monitor/`
  tag prefix.
- [ ] [AC-4] A local BB migration snapshots all non-secret Host Monitor
  settings, starts `host-monitor` successfully with those exact effective
  values, and removes the retired local `machine-monitor` installation only
  after the new sampler is healthy, leaving exactly one Host Monitor plugin
  and one sampler running.
- [ ] [AC-5] Focused Host Monitor checks and the complete repository check pass
  after a clean dependency/lockfile refresh, and generated `dist/` and
  `node_modules/` output remains untracked.
- [ ] [AC-UI-1] [UI] The renamed local-path plugin opens at
  `/plugins/host-monitor/machines`; its dashboard, inspector, processes,
  sidebar summary, outside-click dismissal, and floating monitor work without
  requests or assets under `/plugins/machine-monitor`.
- [ ] [AC-6] Release preparation identifies one new immutable
  `host-monitor/v0.1.0` tag at the reviewed rename commit, while the existing
  `machine-monitor/v0.1.0` annotated tag continues to peel to
  `9db09cc35553493113f31e5352a44911ae92bc73` and is never moved or deleted.
- [ ] [AC-7] After separate explicit release approval, a new main-based rename
  PR and marketplace PR #128 expose only the `host-monitor` entry, icon name,
  source subdirectory, tag prefix, title, body, and sanitized screenshot URLs;
  no npm publication occurs and neither PR is merged by this workflow.

## Scope

- Rename the active plugin directory, package/id, source/UI namespaces,
  collection entry, lockfile records, documentation, and living repository
  knowledge.
- Preserve behavior, privacy boundaries, process safeguards, version `0.1.0`,
  and BB 0.40 / SDK 0.4.21 compatibility.
- Safely migrate the current local path installation and its three non-secret
  settings.
- Prepare and, only after exact approval, push the rename commit and new
  plugin-specific tag, open the main rename PR, and update marketplace PR #128.

## Non-goals

- Rewrite Git history, move/delete the legacy tag, or edit immutable historical
  Empirical evidence to pretend the old identity never existed.
- Preserve the old plugin id as an alias, compatibility package, duplicate
  collection entry, second running sampler, or marketplace listing.
- Change telemetry, thresholds, network colors, process controls, UI design,
  engine ranges, or release version beyond identity-bound text and selectors.
- Publish to npm, merge the repository PR, or merge marketplace PR #128.
- Perform any remote commit, tag, branch, or PR mutation before the separate
  release approval required by the marketplace workflow.

## Risks

- BB scopes settings and host artifacts by plugin id; an unsafe swap could
  lose settings or briefly run two samplers. Snapshot, install/configure,
  verify, then remove the retired id.
- A partial rename can make BB reject manifest/artifact identities or leave
  stale routes and CSS. Derive the id with BB's helper, scan active paths, and
  verify built metadata plus the live network/asset surface.
- Moving the existing tag would break BB's immutable-tag protection. Create a
  new tag prefix on a new commit and prove both public peeled refs.
- Marketplace source validation cannot pass until the new tag is public, so
  validate locally first and stop for release approval before remote mutation.

## Verification

- Derive the plugin id from `plugins/host-monitor/package.json` with the
  marketplace helper.
- Run `npm install`, focused `npm run check --workspace
  bb-plugin-host-monitor`, root `npm run check`, and `git diff --check`.
- Inspect server/app/host build metadata for plugin id `host-monitor`, BB
  `0.40.0`, and plugin SDK `0.4.21`.
- Run an active-identity scan with explicit historical/legacy allowlisting.
- Install the renamed local path, migrate settings, exercise the real BB UI in
  a browser, and inspect plugin status/logs with exactly one sampler.
- Verify public tag refs, repository PR contents/checks, and marketplace
  entry/icon/source/checks after approved remote delivery.

## Capability Deltas

- `deltas/plugin-git-distribution.md` changes Host Monitor's active Git-only
  identity and preserves the retired release as immutable history.
