# Commands

## Setup

- `bun install` installs the hoisted workspace after a fresh checkout or a
  package/lockfile change.
- `bun run dev` starts the standard all-plugin watcher. Re-running it is safe;
  plugin development should use this live loop rather than repeated one-shot
  reloads.
- `bun run build` builds every installable plugin through `bb plugin build` and
  is required after a fresh clone because `dist/` is generated.

## Run, test, and build

- `bun run --filter 'bb-plugin-<id>' typecheck` performs a fast leaf check.
- `bun run --filter 'bb-plugin-<id>' test` runs one plugin's suite.
- `bun run typecheck`, `bun run test`, and `bun run lint` are the required root
  handoff checks.
- `bun run build` is additionally required for manifest, frontend bundle, build
  input, dependency, or workspace-tooling changes.
- `bun run logs <id> -f` follows live plugin logs when runtime behavior or
  reload status is unclear.
- `bun run sdk-types:check` validates generated SDK types during bb-version
  work; `bun run sdk-types:refresh` is reserved for a pinned bb upgrade.
- `bun run publish:dry` validates package tarballs without publishing.

## Verification evidence

- UI and runtime behavior must be exercised in the running bb with the existing
  dev watcher; frontend harnesses do not reproduce the host application's full
  layout and CSS.
- Root typecheck, tests, and lint establish repository-wide static evidence.
- Build output is evidence only for bundle compatibility, not live UI behavior.
- Packaging, license, icon, and SDK scripts enforce repository-specific
  distribution invariants and should be included when their inputs change.
