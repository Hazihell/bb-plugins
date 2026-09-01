# Integrate Action Topbar Into Main

## Request

> Integrate the already implemented and verified Action Topbar plugin into bb-plugins main, preserve its experimental SDK compatibility warning, and document Git and local installation without marketplace publication.

## Goal

Publish the existing Action Topbar source on the repository's `main` branch so
users of a compatible BB fork can install it directly, while clearly stating
that the plugin is experimental and must not be submitted to the marketplace
until the required Plugin SDK surface is accepted upstream.

## Acceptance Criteria

- [ ] [AC-1] `plugins/action-topbar` is present on `main` with its source,
  manifest, tests, assets, license, and third-party notices.
- [ ] [AC-2] The root catalog links to Action Topbar and identifies it as
  experimental.
- [ ] [AC-3] Documentation warns that Action Topbar depends on the matching BB
  core and experimental Plugin SDK 0.4.33 and is not marketplace-ready.
- [ ] [AC-4] Documentation provides working Git and local-path install commands.
- [ ] [AC-5] Action Topbar tests and typechecking pass from the npm workspace.
- [ ] [AC-6] The resulting commit is integrated into the repository's `main`
  branch without including unrelated changes from the original dirty worktree.

## Scope

- Integrate the already implemented Action Topbar plugin package.
- Update the workspace lockfile and repository catalog/notices.
- Verify the package in the clean integration worktree.
- Push the reviewed commit to the repository's `main` branch.

## Non-goals

- Submit or publish Action Topbar to the BB marketplace.
- Stabilize or publish the experimental Plugin SDK API.
- Merge BB core changes into the upstream `get-bb/bb` repository without
  maintainer permission.
- Include unrelated Empirical changes from the original plugin worktree.

## Verification

- Run `npm run test --workspace=bb-plugin-action-topbar`.
- Run `npm run typecheck --workspace=bb-plugin-action-topbar`.
- Run `npm run build --workspace=bb-plugin-action-topbar` when the local BB CLI
  supports SDK 0.4.33; otherwise record the compatibility block explicitly.
- Inspect the final diff and confirm the remote `main` commit.

## Capability Deltas

- `deltas/action-topbar-distribution.md`
