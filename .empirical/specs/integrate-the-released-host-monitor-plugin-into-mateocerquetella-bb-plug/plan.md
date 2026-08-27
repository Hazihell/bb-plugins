# Plan: Main-line Host Monitor Integration

1. Create a focused branch from the clean public `main` baseline and record
   the release tag/marketplace PR invariants.
2. Copy `plugins/machine-monitor` from reviewed release commit `9db09cc`,
   excluding generated output.
3. Adapt only Host Monitor's manifest distribution/tooling fields for this
   Git-only npm workspace: private package, main-line homepage, BB 0.40 build
   tool, exact SDK 0.4.21, Node test runner, types/check scripts.
4. Add Host Monitor to `.bb/plugins.json`, the root README catalog and install
   sections, root third-party notices, and source-build examples.
5. Run `npm install` and inspect the lockfile/workspace dependency changes.
6. Run focused Host Monitor checks and repair only integration-relevant
   failures.
7. Run root `npm run check`, `git diff --check`, and review the complete diff
   for generated or unrelated files.
8. Install/reload the copied local path in BB and execute the documented UI
   evidence checklist for dashboard, rows, inspector, processes, sidebar, and
   floating monitor. Store sanitized screenshot/browser evidence.
9. Reconfirm the immutable release tag and marketplace PR source, complete
   Empirical context/capability integration and evidence receipts, then commit
   the focused change.
10. Push a main-based review branch and open a pull request to
    `MateoCerquetella/bb-plugins:main`; do not merge it.
