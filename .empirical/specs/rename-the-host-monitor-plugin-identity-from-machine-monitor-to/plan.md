# Plan: Host Monitor Identity Migration

1. Freeze the baseline: current `main`, merged PR #16, legacy annotated/peeled
   tag refs, marketplace PR #128 files/head, installed source/status, and the
   three non-secret threshold settings.
2. Move the canonical plugin to `plugins/host-monitor`; mechanically rename the
   exact active `machine-monitor` namespace across package metadata, source
   symbol, route/RPC ids, JSX/CSS selectors/keyframes, and tests while
   preserving machine-domain terminology and historical workflow records.
3. Update `.bb/plugins.json`, root/leaf README install and migration copy,
   third-party notice path, living Git-distribution capability, and custom
   repository context pages to the new id/path/prefix.
4. Run `npm install` to regenerate workspace links/lockfile, derive the id with
   the marketplace helper, and add identity assertions that reject old active
   routes/selectors/package metadata.
5. Run the complete focused Host Monitor check, inspect server/app/host metadata,
   run the root check and diff/ignored-output audits, and repair only rename
   regressions.
6. Mirror the reviewed identity rename into the non-Git Bun development source
   without overwriting its deliberate publication/tooling manifest differences;
   refresh its lockfile/watcher and prove focused/root Bun checks.
7. Cut over local BB safely: ensure no process action is open, snapshot config,
   disable old, install/configure new, verify one visible entry/sampler and two
   refresh cycles, then remove the disabled retired id.
8. Exercise `/plugins/host-monitor/machines` in a real browser: cards/rows,
   masked inspector, process search/sort without termination, sidebar
   outside-click, keyboard floating movement, network/assets/new route, retired
   route unavailable, and a sanitized screenshot.
9. Prepare a clean local marketplace PR #128 checkout with renamed entry/icon,
   new subdir/prefix/title/body/screenshot targets; run schema/build validation
   and record the expected pre-tag/repository-wide liveness boundary.
10. Run security and final code review, collect immutable test/browser/review
    receipts, integrate the capability delta in an independent main worktree,
    and create one local reviewed rename commit.
11. Present the authenticated account, repository, exact commit/package/version,
    new `host-monitor/v0.1.0` tag, retained legacy tag/head-branch exceptions,
    and every remote command; stop for separate release approval.
12. Only after approval, push the branch/tag, open the unmerged main rename PR,
    push the marketplace branch update, edit PR #128 in place, wait for relevant
    CI, verify both public tags/PRs, and report the delivered result.
