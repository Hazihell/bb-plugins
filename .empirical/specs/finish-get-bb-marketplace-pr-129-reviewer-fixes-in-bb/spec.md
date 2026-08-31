# Finish Get Bb Marketplace Pr 129 Reviewer Fixes In Bb

## Request

> Finish get-bb/marketplace PR #129 reviewer fixes. In bb-plugins, make Taskboard cleanly install and build from its Git subdirectory after production-only dependency installation; address the hidden issue-drafting agent's auto-approved permission risk instead of merely relabeling it; scrub the GitHub CLI child-process environment to the minimum deliberate variables needed; update tests and user-facing disclosure; bump Taskboard from 0.3.2 to 0.3.3 consistently without changing Usage Tracker 0.1.4 or Host Monitor 0.1.2; run focused, clean-install, root, and live reload verification. Then prepare the Marketplace PR #129 refresh with Taskboard range ^0.3.3, Usage Tracker ^0.1.4, the vendored Taskboard icon, accurate AI/model-usage disclosure, and current-main merge resolution. Stop before any new source push, tag, GitHub Release, Marketplace push, PR edit, or comment until the exact remote mutations are presented for approval.

## Goal

Ship a reviewable Taskboard `0.3.3` source candidate that installs and builds
from its Git subdirectory with production dependencies only, preserves manual
composer-to-issue capture without launching an auto-approved hidden agent,
and invokes GitHub CLI with an explicit bounded environment. Prepare the
corresponding current-main Marketplace PR #129 files locally while preserving
Usage Tracker `0.1.4` and stopping before every remote mutation.

## Acceptance Criteria

- [ ] [AC-1] `bb-plugin-taskboard@0.3.3` declares the exact
  `@get-bb/plugin-sdk` build-time runtime import in `dependencies`, and a
  repository-independent Taskboard subtree succeeds with
  `npm install --ignore-scripts --omit=dev --omit=optional` followed by
  `bb plugin build .`.
- [ ] [AC-2] Composer-assisted issue capture opens the visible review form
  with an editable title and description derived from the user's prompt, never
  spawns an agent thread or spends model usage, and still requires the user to
  press **Create issue** before any tracker mutation. Activation cleans up any
  valid legacy running helper-thread records left by an older version.
- [ ] [AC-3] Every Taskboard `gh` subprocess receives only fixed locale/prompt
  controls and an explicit cross-platform allowlist for executable lookup,
  GitHub authentication/configuration, proxies, certificates, and temporary
  storage; unrelated server environment variables are excluded and focused
  tests prove both preservation and exclusion.
- [ ] [AC-4] Taskboard reports `0.3.3` consistently in its manifest, workspace
  lock record, direct-install documentation, distribution tests, living
  capability contracts, and generated metadata. Usage Tracker remains
  `0.1.4` and Host Monitor remains `0.1.2`.
- [ ] [AC-5] Focused Taskboard typecheck/tests/build, root workspace checks,
  package-shape checks, `git diff --check`, and the live installed/reloaded
  Taskboard surface pass without unrelated source changes.
- [ ] [AC-MKT-1] The refreshed Marketplace PR #129 candidate is based on
  current `get-bb/marketplace:main` and differs by exactly three additions:
  `entries/taskboard.json`, `entries/usage-tracker.json`, and the vendored
  `icons/taskboard-0b77950c.svg`. The entries use Git ranges `^0.3.3` and
  `^0.1.4` with correct subdirectories/tag prefixes and make no obsolete claim
  about model-assisted drafting.
- [ ] [AC-MKT-2] Marketplace dependency install and schema/build validation
  pass; exact public Taskboard and Usage Tracker tag/ref liveness is verified.
  Any repository-wide liveness failure caused by an unrelated existing entry
  is identified precisely rather than attributed to these entries.
- [ ] [AC-REMOTE-1] No source push, tag, GitHub Release, Marketplace push, PR
  edit, comment, or review request occurs until the authenticated account,
  release commit/version/tag, destinations, and exact remote commands are
  presented for approval.

## Scope

- Taskboard manifest/lock/version/documentation and build distribution tests.
- Composer-assisted issue-capture code, legacy draft-worker cleanup, and UI
  copy for the manual prompt-derived review flow.
- GitHub CLI child-process environment construction and focused tests.
- A clean production-only Taskboard subtree install/build rehearsal.
- Local preparation and validation of Marketplace PR #129's two entries and
  Taskboard icon.

## Non-goals

- Replacing the removed drafting worker with another un-enforced "read-only"
  agent mode or a direct third-party model API.
- Changing provider issue-create semantics, tracker credentials, Taskboard
  browsing/filter behavior, Usage Tracker runtime behavior, or Host Monitor.
- Publishing npm packages or changing either plugin's Git source layout.
- Performing any remote release or pull-request mutation before the explicit
  release boundary.

## Risks

- Removing repository-aware model drafting reduces automatic rewriting; the
  prompt-derived visible review form must preserve the fast capture path.
- Older versions may leave a running hidden helper record; cleanup must stop
  only a validated recorded thread id and remain idempotent.
- An overly narrow `gh` environment can break authentication, proxies,
  certificates, Windows executable lookup, or temp-file behavior; tests and a
  live status call must cover the deliberate allowlist.
- A production-only build can pass accidentally through hoisted workspace
  dependencies; verification must use a repository-independent subtree.
- Marketplace-wide liveness currently depends on unrelated public sources;
  direct release verification must be reported separately.

## Verification

- Run focused Taskboard typecheck, tests, build, and build-metadata checks.
- Export/copy a clean Taskboard-only source subtree outside the workspace, run
  production-only npm installation, then build it with the pinned BB CLI.
- Run the configured root workspace checks/full CI and `git diff --check`.
- Inspect generated metadata, dependency placement, packed/source closure,
  and live `bb plugin list`/Taskboard UI after the watcher reload.
- Merge current Marketplace `main` into the local PR #129 branch without a
  force push, restore the icon, validate the exact three-file diff, run
  marketplace install/build/check, and verify both public release tags.
- Obtain fresh-context review before integration and stop at the remote
  authorization boundary.

## Capability Deltas

- `deltas/board-capture.md`
- `deltas/taskboard-distribution.md`
- `deltas/taskboard-github-cli.md`
- `deltas/plugin-git-distribution.md`
