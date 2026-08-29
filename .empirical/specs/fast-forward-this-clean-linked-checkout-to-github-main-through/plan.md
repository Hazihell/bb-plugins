# Implementation plan

1. Confirm the worktree is based on `203f910`, record current manifests and
   live plugin sources, and keep older dirty checkouts untouched.
2. Apply the two reviewed Taskboard source/test hunks: use `Ticket` only in
   `TaskboardThreadHeaderAction` and add its scoped regression guard.
3. Apply the reviewed Host Monitor CSS/test hunks: remove every movable-trigger
   dot state and dead reduced-motion reference, update the old positive CSS
   assertion, and add the accessible-text regression guard.
4. Retain main’s complete Usage Tracker PR #20 implementation unchanged and
   prove current/legacy key mapping, missing-provider isolation, compact-limit
   selection, all-window details, and keyboard behavior through its tests.
5. Bump manifests to Taskboard `0.3.2`, Host Monitor `0.1.1`, and Usage Tracker
   `0.1.4`; update root/leaf direct-Git commands, Usage Tracker changelog, and
   the shared distribution test (including new Host Monitor coverage).
6. Run `npm install` to synchronize package-lock workspace records and installed
   dependencies, then inspect the exact version-bearing diff for accidental
   dependency-version edits or historical-record rewrites.
7. Run focused checks for all three plugins, root `npm run check`,
   `git diff --check`, and inspect server/app/host metadata ids and versions.
8. Move the three BB path installations to this checkout using local-path
   install, confirm settings/status/services, and start one persistent dev
   watcher per plugin.
9. In the real BB browser, exercise and capture Taskboard ticket pin/open, Host
   Monitor dot-free trigger/popover, and Usage Tracker setting/compact/details/
   refresh/Escape/focus behavior; exercise Usage RPC for primary and thread
   host scopes.
10. Record immutable test/browser/screenshot evidence, run independent
    security and final code review, resolve any blockers, refresh repository
    context, and replay capability deltas against an independent clean target.
11. Stop at integrated completion. Do not commit, push, tag, publish, create a
    GitHub Release, or update the marketplace.
