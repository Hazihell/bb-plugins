# Design: Action Topbar Main Integration

## Repository integration

Use the clean `integrate/action-topbar-main` worktree based on the current
`origin/main`. Bring in only the Action Topbar package, root catalog entry,
third-party notice, and npm lockfile changes. Do not carry over unrelated files
from the original dirty development worktree.

## Compatibility boundary

Keep the split-drag bridge experimental. The plugin manifest requires Plugin
SDK 0.4.33 or newer, and its README explains that the matching BB core fork is
also required. This prevents the source integration from implying that current
stock BB releases support the feature.

## Installation documentation

Document two supported development installation paths:

- Git installation from the `main` branch and `plugins/action-topbar`
  subdirectory.
- Local-path installation from an existing repository checkout.

Marketplace publication remains explicitly out of scope.

## Verification and integration

Install npm workspace dependencies, run Action Topbar tests and typechecking,
and attempt the package build. Inspect the staged diff before completing the
existing cherry-pick. Push the resulting commit directly to `origin/main` and
verify that the remote ref matches the local commit.
