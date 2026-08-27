# Design: Host Monitor Identity Migration

## Overview

Rename the merged main-line plugin as one coherent identity migration on a new
branch from `fc4a1b9`. BB derives identity from the package name, so the result
is intentionally a new plugin id rather than an alias or display-only change.
Preserve product behavior and historical release evidence while making
`host-monitor` the sole active repository, runtime, Git-release, and
marketplace identity.

The visible naming hierarchy does not change: **Host Monitor** remains the
human label and page/surface title, `host-monitor` is the technical identity,
and “machine”/“machines” continues to name monitored resources.

## Active repository rename boundary

1. Move `plugins/machine-monitor` to `plugins/host-monitor` with Git rename
   detection intact.
2. Change the package name to `bb-plugin-host-monitor` and align homepage,
   repository directory, keywords, collection name/source, root/leaf docs,
   notices, and npm workspace/lockfile records.
3. Mechanically replace the exact active-source namespace `machine-monitor`
   with `host-monitor` throughout the plugin's TypeScript, JSX, CSS, tests, and
   selectors. This includes:
   - fallback route and fake-host/RPC ids;
   - page CSS classes and animation names;
   - app source class names and source-guard assertions;
   - backend factory symbol `machineMonitorPlugin` → `hostMonitorPlugin`.
4. Keep ordinary domain language such as “machine”, `MachineRow`, and service
   name `machine-sampler`; these describe monitored machines and are not the
   former compound plugin identity.
5. Regenerate `package-lock.json` through `npm install`; never hand-edit its
   workspace graph.

## History and compatibility boundary

- Do not rewrite the completed
  `integrate-the-released-host-monitor-plugin-into-mateocerquetella-bb-plug`
  Empirical record, existing commits/PR #16, or the legacy annotated tag. They
  remain accurate evidence of the first release's old identity.
- Update the living `plugin-git-distribution` capability and repository context
  to the new identity; refresh generated context rather than replacing paths by
  hand in its manifest/index.
- Permit the old literal only in immutable/historical records, the new rename
  feature, the legacy peeled-tag assertion, the one-time remove command, and
  marketplace PR #128's preserved head ref.
- Do not ship an alias package, duplicate collection row, redirect route, or
  compatibility sampler. The user explicitly requested a complete rename.

## Local BB cutover

The current install has no secrets, schedules, database, or KV state. Preserve
these non-secret settings exactly:

- `sidebarThresholdColors=true`
- `attentionThresholdPercent="70"`
- `criticalThresholdPercent="85"`

Cut over only when no process confirmation/action is open:

1. Capture the settings and verify the old sampler is healthy.
2. Disable `machine-monitor`; require disabled status and zero services before
   proceeding. This also prevents its content script from colliding with the
   new id's already-`host-monitor` DOM events/localStorage keys.
3. Install the renamed main-line local path as `host-monitor`.
4. Apply threshold colors, attention 70, then critical 85; applying attention
   first avoids a transient invalid threshold pair.
5. Verify config, one sampler, four-host refresh, page/RPC/assets, processes,
   sidebar behavior, and two refresh cycles. Keep the old disabled id as the
   rollback during this window.
6. Remove the disabled old id only after success. Do not manually delete its
   historical logs or artifact cache.

At every user-visible stage exactly one enabled Host Monitor navigation/sidebar
surface may exist. Rollback disables the new id before re-enabling the old.
The 70/85 thresholds and masked-address default are checked visually as well as
through config so the cutover preserves the user's experience.

## Verification design

- Use the marketplace `derive-plugin-id.mjs` helper and assert `host-monitor`.
- Add/adjust identity guards so tests prove package, route, selectors, and
  frontend registrations use only the new id.
- Run focused `npm run check --workspace bb-plugin-host-monitor`, root
  `npm run check`, `git diff --check`, ignored-output checks, and inspect all
  three built metadata files.
- Run an active-identity scan that reports every remaining old literal and
  requires each to belong to the explicit historical/migration allowlist.
- Exercise a real browser on `/plugins/host-monitor/machines`: cards/rows,
  masked inspector, process search/sort without termination, sidebar
  outside-click dismissal, and keyboard-movable floating monitor. Inspect
  network/asset URLs for the new plugin path, refresh once more, and collect a
  sanitized capture. Visiting the retired route must use BB's normal
  unavailable/not-found experience; do not add a silent redirect.

## Release and PR design

Remote changes remain forbidden until the marketplace workflow's separate
approval. Prepare one local rename commit on `feat/rename-host-monitor`; that
commit is the proposed release commit and receives a new annotated
`host-monitor/v0.1.0` tag only after approval.

After approval, in order:

1. Push `feat/rename-host-monitor` and the new annotated tag; never alter the
   old tag.
2. Open a new PR to `main` because PR #16 is already merged. Do not merge it.
3. In a clean checkout of the marketplace fork's existing PR branch, rename
   the entry and icon files, set id/subdirectory/tag prefix to `host-monitor`,
   update title/body/screenshot URLs/release commit, and validate the catalog.
4. Keep the fork head branch `submit-machine-monitor` as the one internal
   exception because renaming an open PR head branch closes the PR. Preserve
   PR #128 rather than replacing its review history.

Marketplace entry target:

- entry: `entries/host-monitor.json`
- id: `host-monitor`
- icon: `icons/host-monitor-11256331.svg` (same reviewed bytes/hash)
- subdirectory: `plugins/host-monitor`
- range: `^0.1.0`
- tag prefix: `host-monitor/`

## Failure handling

- If focused/root checks fail, repair only identity integration and rerun from
  the failed layer.
- If new local activation fails, disable/remove only the new id and re-enable
  the still-disabled old id; do not remove the rollback prematurely.
- If the public tag cannot be proven, do not update or push marketplace source.
- If marketplace liveness still fails only for unrelated legacy entries,
  disclose that exact repository-wide condition while requiring Host Monitor's
  own source check to pass.
