# Fast Forward This Clean Linked Checkout To Github Main Through

## Request

> Fast-forward this clean linked checkout to GitHub main through PR #21; preserve and reapply the verified local Taskboard ticket-icon change, Host Monitor notification-dot removal, and Usage Tracker missing-provider safety improvement on top of the complete merged PR #20/#21 implementation. Bump Taskboard 0.3.1 to 0.3.2, Host Monitor 0.1.0 to 0.1.1, and Usage Tracker 0.1.3 to 0.1.4 everywhere the repository's Git-release contracts require, including the lockfile and changelogs/release-facing docs/tests. Run the full repository checks, install all three local paths from this checkout, keep the dev loop running, and live-test the relevant UI/RPC behavior. Stop at integrated; do not commit, push, tag, publish, create GitHub releases, or update the marketplace.

## Goal

Provide one coherent local checkout and live BB installation that contains all
merged behavior through GitHub main `203f910`, retains the three verified local
fixes, and is internally versioned for the next patch releases without making
any remote release mutation.

## Acceptance Criteria

- [ ] [AC-1] The consolidated checkout is based on GitHub main `203f910` and
  retains the functional changes merged by PRs #18, #20, and #21.
- [ ] [AC-2] Active Taskboard, Host Monitor, and Usage Tracker version
  references are coherently bumped to `0.3.2`, `0.1.1`, and `0.1.4`
  respectively across manifests, the lockfile, changelogs/release-facing
  documentation, distribution guards, and generated build metadata.
- [ ] [AC-3] All three plugins remain private, Git-only packages; no npm/Git
  publication hook, tag, GitHub Release, marketplace mutation, commit, or push
  is introduced or executed.
- [ ] [AC-UI-1] [UI] Taskboard’s thread-header “Pin Taskboard on the right”
  action displays the ticket-shaped Taskboard icon and still pins/opens the
  right panel.
- [ ] [AC-UI-2] [UI] Host Monitor’s movable sidebar trigger has no overlaid
  notification dot while its accessible status text, popover, and floating
  monitor behavior remain available.
- [ ] [AC-UI-3] [UI] Usage Tracker exposes the merged configurable compact
  limit and all-window expanded UI, maps current/legacy provider keys, and
  isolates an omitted provider without losing healthy provider data.
- [ ] [AC-4] BB runs Taskboard, Host Monitor, and Usage Tracker from this one
  consolidated checkout with healthy plugin status and matching bumped
  versions.
- [ ] [AC-5] Focused suites, the repository-root check, build metadata checks,
  Git whitespace validation, live RPC exercises, browser walkthroughs, and
  independent review pass at the final tree.

## Scope

- Fast-forward the already approved clean linked checkout to GitHub main
  through PR #21.
- Port the Taskboard ticket icon and Host Monitor dot-removal changes with
  focused regression coverage; retain the missing-provider behavior already
  present on main.
- Apply patch-version alignment for Taskboard `0.3.2`, Host Monitor `0.1.1`,
  and Usage Tracker `0.1.4` in every active release-contract surface.
- Install all three local plugin paths from the consolidated checkout, keep
  their development watchers running, and verify the real BB UI/RPC surfaces.

## Non-goals

- Committing, pushing, tagging, publishing, creating GitHub Releases, or
  editing/submitting marketplace metadata.
- Moving existing immutable tags or rewriting completed Empirical history.
- Changing Taskboard, Host Monitor, or Usage Tracker behavior beyond the
  merged PRs and the three explicitly requested fixes.
- Migrating SDK layouts, changing BB engine floors, or renaming another plugin.

## Verification

- Run focused plugin typechecks/tests while editing.
- Run root `npm run check` plus `git diff --check` from the consolidated
  checkout and inspect all server/app/host metadata versions.
- Confirm live Usage Tracker RPC data for the primary machine and current
  thread host.
- Use a real BB browser to verify Taskboard pin/open, Host Monitor trigger and
  popover, Usage Tracker compact selection/details/refresh, and capture
  screenshot evidence.
- Independently review the final diff and replay capability deltas against a
  separate clean target before reporting integrated completion.

## Capability Deltas

- `deltas/taskboard-right-panel.md`
- `deltas/host-monitor-sidebar.md`
- `deltas/plugin-git-distribution.md`
- `deltas/taskboard-distribution.md`
- `deltas/usage-tracker-distribution.md`
