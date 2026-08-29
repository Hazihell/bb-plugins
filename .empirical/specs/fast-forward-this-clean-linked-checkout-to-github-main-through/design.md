# Design: consolidated patch-release checkout

## Baseline and ownership

The source worktree is fast-forwarded to GitHub main commit `203f910`, which
contains the Host Monitor identity rename and the complete Usage Tracker PR
#20/#21 behavior. The older dirty checkouts remain untouched as evidence and
are not copied wholesale. Product edits, version preparation, verification,
and live path installs all use this one consolidated worktree.

## Port the verified local fixes

### Taskboard

Change only the icon rendered by `TaskboardThreadHeaderAction` from
`PanelRight` to the existing typed `Ticket` glyph. Add the established
component-scoped source regression asserting the accessible label, requiring
`Ticket`, and rejecting `PanelRight`. Leave Taskboard’s genuine internal
sidebar-collapse `PanelRight` unchanged.

### Host Monitor

Remove only the movable trigger’s `::after` base/status/loading rules and the
now-dead reduced-motion selector. Update the existing threshold CSS assertion
that expected the error dot, then add the focused regression that rejects any
trigger `::after` while requiring the source’s dynamic `aria-label` and title.
Keep trigger status data, click/drag behavior, popover, and floating monitor.

### Usage Tracker

Preserve main’s implementation rather than copying the older local plugin.
Main already maps current and legacy provider keys, isolates missing providers
as local errors, retains every usage window, supports the configurable compact
limit, and includes the expanded UI/accessibility tests. Verify these contracts
and bump the version; do not regress them with the narrower `0.1.1` source.

## Version preparation

Apply patch versions:

- Taskboard `0.3.2`
- Host Monitor `0.1.1`
- Usage Tracker `0.1.4`

Edit the three leaf manifests with `apply_patch`, then run `npm install` to
refresh the workspace lock records. Update active direct-Git install examples
in the root and leaf READMEs, the distribution-test constants and manifest
assertions, and Usage Tracker’s existing changelog. Completed Empirical records
and historical release evidence are immutable and remain untouched.

The new install ranges will not resolve publicly until a later authorized tag
and GitHub Release are created. This task prepares and verifies those references
locally but deliberately performs no remote mutation.

## Build, install, and live verification

1. Run focused checks for all changed plugins.
2. Run root `npm run check` and `git diff --check`; inspect every built metadata
   file for plugin id/version/SDK consistency.
3. Move each existing local path installation to this worktree with
   `bb plugin install path:<plugin> --yes`, preserving plugin settings.
4. Start one development watcher per installed plugin and keep them running.
5. Exercise Taskboard’s header ticket/panel action, Host Monitor’s dot-free
   trigger/popover, and Usage Tracker’s setting, compact/expanded windows,
   refresh, Escape/focus, and live RPC data in the real BB browser.
6. Capture sanitized screenshot/browser evidence and run independent review.

## Risks and mitigations

- **Mixed source generations:** all installs are repointed to one absolute
  worktree and verified with `bb plugin source`.
- **Version drift:** tests and metadata assertions cover manifests, lockfile,
  active docs, and bundles.
- **Regressing PR #20:** Usage Tracker source is retained from main and its full
  focused suite must pass.
- **Settings loss:** local path installs are moved in place; plugins are not
  removed.
- **Accidental release:** no commit, push, tag, GitHub Release, publication, or
  marketplace command appears in the implementation plan.
