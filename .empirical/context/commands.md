# Commands

Commands below are verified from workspace and plugin manifests.

## Setup

- `npm install` — install shared workspace dependencies after a fresh checkout
  or dependency/lockfile change.
- `bb plugin install ./plugins/taskboard` — register the local Taskboard path in
  BB for live verification.
- `bb plugin install git:https://github.com/MateoCerquetella/bb-plugins.git@^0.3.3 --subdirectory plugins/taskboard --tag-prefix taskboard/`
  — install the released Taskboard Git range directly.
- `bb plugin install ./plugins/usage-tracker` — register Usage Tracker locally.
- `bb plugin install git:https://github.com/MateoCerquetella/bb-plugins.git@^0.1.4 --subdirectory plugins/usage-tracker --tag-prefix usage-tracker/`
  — install the released Usage Tracker Git range directly.
- `bb plugin install ./plugins/host-monitor` — register Host Monitor locally.
- `bb plugin install git:https://github.com/MateoCerquetella/bb-plugins.git@^0.1.2 --subdirectory plugins/host-monitor --tag-prefix host-monitor/`
  — install the released Host Monitor Git range directly.

## Run, test, and build

- `npm run build` — build every plugin workspace that declares a build script.
- `npm run typecheck` — typecheck every plugin workspace.
- `npm run test` — run every plugin test suite.
- `npm run check` — run each plugin's complete check contract.
- `npm run dev --workspace bb-plugin-taskboard` — Taskboard watch/build/reload
  loop after the local path is installed.
- `npm run typecheck --workspace bb-plugin-taskboard` and
  `npm test --workspace bb-plugin-taskboard` — focused Taskboard iteration.
- `npm run check --workspace bb-plugin-taskboard` — Taskboard typecheck, tests,
  build, and build-metadata verification. Distribution tests enforce its exact
  production SDK dependency because `bb plugin types` currently assumes the
  SDK is development-only.
- `npm run dev --workspace bb-plugin-host-monitor` — Host Monitor
  watch/build/reload loop after local-path installation.
- `npm run typecheck --workspace bb-plugin-host-monitor` and
  `npm test --workspace bb-plugin-host-monitor` — focused Host Monitor
  iteration; the test suite covers semantic orb mapping, neutral fallbacks,
  accessible privacy-safe state explanations, rail-free neutral host
  containers, hover/focus tooltip behavior, no-pill status/filter presentation,
  valid fixed-tab registration, and the dot-free trigger.
- `npm run check --workspace bb-plugin-host-monitor` — Host Monitor SDK-type
  check, typecheck, complete Node/TSX test suite, and BB build.
- `bb taskboard presets list|save|rename|delete` — manage named presets for the
  current or explicitly selected BB project.
- `bb taskboard list --preset <name>` — apply a named preset to CLI listing;
  explicit `--source` and `--query` flags take precedence.

## Verification evidence

- Run root `npm run check` before repository handoff; CI uses the same workspace
  contract from `.github/workflows/ci.yml`.
- UI/runtime changes also require the active plugin dev loop and a real BB
  surface exercise. A successful build alone does not verify layout, focus,
  overlays, responsive behavior, or reload state.
- After a local manifest version bump, `bb plugin install ./plugins/host-monitor`
  refreshes BB's same-path inventory and server metadata; the watcher continues
  to rebuild/reload subsequent source changes.
- Plugin build/type scripts clear `BB_CLI` so they use the workspace-pinned BB
  toolchain rather than whichever application launched the agent.
- Do not publish, push, or reload unrelated live plugin installations without
  explicit user authorization.
- Marketplace PR preparation is validated against current
  `get-bb/marketplace:main` with `npm ci`, `npm run build`, and
  `npm run check`. A passing local validation does not authorize pushing its
  branch, commenting on the PR, or publishing the required plugin tag.
