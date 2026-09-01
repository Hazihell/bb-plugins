# Design: Dockside Main Reconciliation

## Merge boundary

- Preserve history with `git merge --no-ff origin/main`; do not rebase,
  force-push, or synthesize an ours merge.
- Treat commit `57fe6fd649f15d9ff2aa19f0ec0431d2623c0e84` as the immutable
  pre-reconciliation Dockside/evidence reference and `origin/main` at
  `a63ff36722fac30a1845eb1abf988fa7e8d49b02` as the main reference.
- Resolve the shared t3sidebar rename split by retaining both complete final
  directories rather than selecting either rename globally.

## Authority map

- `plugins/dockside/**` and prior Dockside Empirical feature history come from
  the feature branch without source edits.
- `plugins/{host-monitor,save-my-model,taskboard,usage-tracker}/**`, current
  GitHub workflows, npm root manifest, `package-lock.json`, and main repository
  conventions come from `origin/main`.
- Files/plugins deleted by main stay deleted; old Bun orchestration and
  `bun.lock` do not survive.
- Root collection/catalog/docs/notices are based on main and receive only the
  minimum additive Dockside entries.
- `.empirical/policy.json` keeps main's `workspace-check` and adds npm-era
  Dockside focused/contract/system/portability commands. Empirical's strict
  promotion schema requires the exact adapter `bun run ci`; the sole `ci`
  package script delegates directly to `npm run check`. GitHub CI, dependency
  installation, workspaces, package lock, and product checks remain npm.
- Generated Empirical context is refreshed from the reconciled tree instead of
  resolving stale generated files manually.

## Package/workspace integration

- The root remains the npm workspace from main. `plugins/dockside/package.json`
  remains an ordinary `plugins/*` workspace and pins its own SDK/tooling.
- Regenerate `package-lock.json` with npm after Dockside is present; do not
  transplant the branch Bun lock.
- Root dev tooling pins `bb-app@0.40.0` and the published SDK 0.4.29 export
  manifest. The latter lets the stable builder recognize Dockside's `UrlLink`
  and provider hooks while the verified plugin retains its legacy vendored
  declaration layout.
- A root Dockside check wrapper restores those two generated declaration files
  after `bb plugin build`, matching main CI's clean-tree rule without changing
  application source or hiding any other generated change.
- Build/type scripts that invoke `bb` continue clearing `BB_CLI` as required by
  the repository guide.

## Documentation and collection

- Add Dockside to the root plugin table, quick-start section, source-build
  examples, direct Git install examples, and release/catalog prose.
- Add Dockside to `.bb/plugins.json` while retaining all main entries exactly.
- Base root third-party notices on main and include only notices needed by the
  unchanged Dockside package; the package's own notice remains authoritative.

## Verification design

- Use Git tree comparisons to prove Dockside is unchanged from the pre-merge
  reference and every other retained plugin is unchanged from main.
- Add a reconciliation QA script that asserts merge ancestry, inventory,
  package-manager authority, catalog alignment, no unmerged entries/conflict
  markers/t3sidebar, and unchanged tree hashes.
- Run npm clean installation, Dockside test/typecheck/build, root `npm run
  check`, live plugin reload/default inspection, fresh-context QA, committed
  diff review, and an independent integration replay.

## Failure handling

- Do not use broad recursive ours/theirs checkout. Resolve exact roots by the
  authority map and inspect the staged inventory before committing.
- If main's workspace cannot install Dockside unchanged, adjust only root
  integration metadata or Dockside package metadata required by npm, document
  the deviation, and rerun exact-tree verification with an explicit exception.
