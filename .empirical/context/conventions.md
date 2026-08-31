# Conventions

## Code and structure

- Installable package names are unscoped `bb-plugin-<id>` and live at
  `plugins/<id>`. The `bb-plugin-` segment is part of plugin identity and is
  required by root script filters.
- Manifest `bb.server`, `bb.app`, and `bb.host` fields point to source files,
  never generated bundles. `dist/` is ignored and must not be edited manually.
- Runtime imports belong in leaf `dependencies`; repository-wide tools belong
  at the root. The Amp plugin intentionally remains on zod v3.
- Generated SDK declarations are refreshed through bb tooling and are never
  hand-edited. Hand-maintained CSS-module declarations are an exception.
- UI component, library, and hook copies are plugin-owned even when currently
  identical. Deliberate divergence is allowed.

## Testing and delivery

- Prefer pure modules with unit tests. SDK harnesses are adopted deliberately
  per plugin and do not replace live bb UI checks.
- Before handoff run root typecheck, test, and lint; run the root build when
  bundle or build inputs changed.
- Do not commit, push, publish, create pull requests, or split work into stacked
  branches unless the user requested that external action.
- Preserve unrelated working-tree changes and use non-destructive Git
  operations. Do not clean generated output as a routine development step.

## Repository-specific constraints

- The root `@ampcode/cli` override and Bun hoisted linker are load-bearing.
- Every publishable plugin ships a byte-identical copy of the root MIT license;
  third-party code or artwork must be recorded both globally and in the leaf
  package notice when shipped there.
- Private plugins remain excluded from `scripts/publish.ts` and synchronized
  with README visibility rules.
- Tarballs must include every declared source entrypoint and its transitive
  source closure so bb's stale-SDK fallback remains loadable.
- `.worktrees/`, `.snapshots/`, and `.clones/` are local storage helpers, not
  product source; their dependency trees are disposable and ignored.
