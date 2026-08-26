# Commands

Commands below are verified from workspace and plugin manifests.

## Setup

- `npm install` — install shared workspace dependencies after a fresh checkout
  or dependency/lockfile change.
- `bb plugin install ./plugins/taskboard` — register the local Taskboard path in
  BB for live verification.
- `bb plugin install ./plugins/usage-tracker` — register Usage Tracker locally.

## Run, test, and build

- `npm run build` — build every plugin workspace that declares a build script.
- `npm run typecheck` — typecheck every plugin workspace.
- `npm run test` — run every plugin test suite.
- `npm run check` — run each plugin's complete check contract.
- `npm run dev --workspace bb-plugin-taskboard` — Taskboard watch/build/reload
  loop after the local path is installed.
- `npm run typecheck --workspace bb-plugin-taskboard` and
  `npm test --workspace bb-plugin-taskboard` — focused Taskboard iteration.
- `npm run check --workspace bb-plugin-taskboard` — Taskboard SDK-type check,
  typecheck, tests, build, and packed-output verification.
- `npm run types:refresh --workspace bb-plugin-taskboard` followed by
  `npm install` — deliberate SDK declaration pin refresh when the minimum BB
  release changes.

## Verification evidence

- Run root `npm run check` before repository handoff; CI uses the same workspace
  contract from `.github/workflows/ci.yml`.
- UI/runtime changes also require the active plugin dev loop and a real BB
  surface exercise. A successful build alone does not verify layout, focus,
  overlays, responsive behavior, or reload state.
- Plugin build/type scripts clear `BB_CLI` so they use the workspace-pinned BB
  toolchain rather than whichever application launched the agent.
- Do not publish, push, or reload unrelated live plugin installations without
  explicit user authorization.
