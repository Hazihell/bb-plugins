# Prepare Usage Tracker V0 1 3 From The Merged Main

## Request

> Prepare Usage Tracker v0.1.3 from the merged main commit: bump all active version, lockfile, changelog, documentation, distribution-test, and context references; run complete verification; create one local release commit; and prepare the BB marketplace Git-source migration and ^0.1.3 range locally. Stop before any remote release-branch push, tag, GitHub Release, marketplace push, or marketplace PR so the exact release can receive separate approval.

## Goal

Produce one clean, fully verified local release commit for Usage Tracker 0.1.3
and one locally prepared marketplace patch that resolves the immutable Git
release, while leaving every remote release and marketplace mutation pending
the separate exact approval.

## Acceptance Criteria

- [ ] [AC-1] The Usage Tracker manifest, workspace lockfile, active repository
  and plugin documentation, distribution guard, and living command context all
  identify version/range `0.1.3` without rewriting historical records.
- [ ] [AC-2] The changelog releases the accumulated configurable compact-limit
  feature plus fixes for current provider keys, provider-local failures, and
  complete additional-window details/cache behavior under `0.1.3` dated
  2026-08-27.
- [ ] [AC-3] A production build emits ignored server/app metadata with plugin id
  `usage-tracker` and plugin version `0.1.3`; generated `dist/` remains
  untracked.
- [ ] [AC-4] The proposed immutable source is the new annotated tag
  `usage-tracker/v0.1.3` on one local release commit containing merged PR #20
  and every `0.1.3` release-metadata change.
- [ ] [AC-5] Focused Usage Tracker verification and the repository-root
  `npm run check` pass with no tracked build drift.
- [ ] [AC-6] Public Git/GitHub checks confirm that version, tag, and Release do
  not already exist before approval.
- [ ] [AC-MKT-1] A clean local checkout of the current marketplace PR #129 head
  contains a Usage Tracker Git source with repository URL, plugin subdirectory,
  `^0.1.3` range, and `usage-tracker/` tag prefix while retaining the Taskboard
  Git migration required for repository-wide liveness.
- [ ] [AC-MKT-2] Marketplace install/build/schema checks pass locally before
  approval; public source-liveness check is explicitly deferred until the
  approved `usage-tracker/v0.1.3` tag exists and must pass before marketplace
  push/PR update.
- [ ] [AC-7] The release and marketplace checkouts are clean at their local
  commits, and no branch, tag, GitHub Release, marketplace push, or marketplace
  PR mutation occurs during preparation.

## Scope

- Version and release metadata for `plugins/usage-tracker` plus every active
  cross-workspace guard/reference discovered by repository tests.
- Complete focused/root build verification and inspection of ignored metadata.
- Read-only collision/auth/remote checks for the proposed Git release.
- A separate clean local checkout of the existing marketplace PR #129 branch,
  changing only the coupled Taskboard/Usage Tracker source migration needed for
  a green catalog.
- One local release commit and one local marketplace commit proposal.

## Non-goals

- Changing Usage Tracker runtime behavior, minimum BB/plugin-SDK versions,
  package identity, branding, or npm publication state.
- Publishing to npm; Usage Tracker remains private and Git-only.
- Pushing or merging the release branch, creating/pushing a tag, creating a
  GitHub Release, updating the marketplace fork branch/PR, or merging upstream.
- Rewriting prior changelog entries, immutable tags, completed Empirical
  records, or historical install instructions inside evidence.

## Risks

- Monorepo version literals in tests/docs/context can drift from the manifest
  and make an apparently successful release uninstallable or fail CI.
- Tagging the merge commit before release metadata exists would bind the wrong
  tree; tagging the local release commit before it reaches `main` would expose
  an unreviewed source.
- Marketplace PR #129 is coupled: either legacy npm entry left unchanged makes
  repository-wide liveness fail, so both Git migrations must stay together.
- Marketplace liveness cannot prove an unpublished tag; it must be rerun after
  approved release publication and before the marketplace branch is pushed.

## Verification

- Check current package/tag/GitHub Release absence and authenticated account.
- Update release metadata mechanically, inspect the exact diff, and run focused
  Usage Tracker check plus root `npm run check` and `git diff --check`.
- Inspect `dist/server.meta.json` and `dist/app.meta.json` while keeping them
  ignored/untracked.
- In the marketplace checkout, run `npm ci --ignore-scripts`, `npm run build`,
  JSON/schema inspection, and diff checks; record the intentionally pending
  source-liveness gate.
- Commit locally, prove both checkouts clean, and record exact hashes/remote
  commands for release approval.

## Capability Deltas

- `deltas/usage-tracker-distribution.md` adds immutable Usage Tracker release
  alignment and marketplace Git-source requirements.
