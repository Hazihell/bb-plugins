# Dockside Main Reconciliation

## Request

> Reconcile the current Dockside PR branch with origin/main without losing Dockside or current main work. Preserve the complete plugins/dockside implementation and its Empirical evidence, retain origin/main's Taskboard, Host Monitor, Save My Model, and Usage Tracker plugins, adopt origin/main's current npm workspace, package lock, catalog, documentation, and CI conventions, remove only files origin/main intentionally retired, make Dockside independently installable in that workspace, resolve the shared t3sidebar rename history without duplicate or conflict markers, and leave PR #26 mergeable. Run Dockside and full repository npm install/check requirements, review the committed merge result, commit and push the merge resolution, and update PR #26.

## Goal

Make PR #26 mergeable against current `origin/main` while preserving two
independently evolved descendants of the former t3sidebar tree: main's
Taskboard and this branch's Dockside. The result follows main's current npm
workspace and contains Dockside as one additional installable BB plugin without
resurrecting plugins or tooling that main retired.

## Acceptance Criteria

- [ ] [AC-1] The branch contains a normal merge of current `origin/main`, has no
  unresolved entries or conflict markers, and GitHub reports PR #26 as
  mergeable rather than `DIRTY`.
- [ ] [AC-2] `plugins/dockside` is preserved byte-for-byte from the verified
  pre-merge branch tree, `plugins/taskboard` and every other plugin retained by
  `origin/main` are preserved from main, and `plugins/t3sidebar` is absent.
- [ ] [AC-3] The root adopts `origin/main`'s npm workspace,
  `package-lock.json`, scripts, CI conventions, and four-plugin catalog as the
  authority, adding only Dockside package/catalog/install entries. Files and
  plugins intentionally retired by main remain retired.
- [ ] [AC-4] `.bb/plugins.json`, root documentation, licensing notices, and
  workspace manifests consistently list Host Monitor, Save My Model,
  Taskboard, Usage Tracker, and Dockside with no duplicate plugin identity.
- [ ] [AC-5] A clean npm install succeeds; Dockside tests, typecheck, and build
  pass; and the repository's required `npm run check` passes for every retained
  plugin.
- [ ] [AC-6] Existing Dockside status palettes/settings, full-row Shift
  selection, protected deletion, two-row cards, child behavior, and live BB
  installation remain unchanged by the merge resolution.
- [ ] [AC-7] The merge result, verification, and review are committed and
  pushed to the existing PR branch, and PR #26 describes the npm-based result.

## Scope

- Merge current `origin/main` without rebasing or rewriting branch history.
- Resolve the common-ancestor rename split by retaining both complete plugin
  directories under their final identities.
- Reconcile root manifests, lockfiles, catalog/docs/notices, collection
  metadata, CI/policy, and generated Empirical context for the combined tree.
- Verify the clean combined npm workspace and existing live Dockside install.

## Non-goals

- Refactor or redesign Dockside or Taskboard.
- Port retired branch-only plugins into the streamlined main workspace.
- Restore Bun-only root orchestration that main intentionally removed.
- Publish packages, merge PR #26, force-push, rebase, or rewrite history.
- Change user Dockside settings or destructive-thread data.

## Risks

- Git models the independent renames as rename/delete and rename/rename;
  choosing one side wholesale could silently delete Dockside or Taskboard.
- Mixing root package-manager generations could leave an unusable lockfile or
  scripts that pass only in the old worktree.
- Broad ours/theirs conflict resolution could resurrect retired plugins or
  overwrite current main behavior.
- Regenerated context must describe the reconciled repository rather than
  copying either stale side.

## Verification

- Compare `plugins/dockside` to pre-merge commit
  `57fe6fd649f15d9ff2aa19f0ec0431d2623c0e84` and each retained non-Dockside
  plugin tree to `origin/main`.
- Assert merge parents, clean index, absent conflict markers/t3sidebar, and the
  exact collection/workspace plugin inventory.
- Run `npm install`, Dockside `test`, `typecheck`, and `build`, then root
  `npm run check` with `BB_CLI` cleared where required.
- Reload the local Dockside path and confirm its live settings defaults.
- Review the committed reconciliation diff, push it, and confirm PR #26 no
  longer reports `DIRTY`.

## Capability Deltas

See `deltas/dockside-thread-management.md`.
