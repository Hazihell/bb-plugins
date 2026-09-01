# Decisions: Dockside Main Reconciliation

## D-001: Preserve both rename descendants with a normal merge

Status: Accepted

### Evidence

The merge base contains t3sidebar; current main renamed that tree to Taskboard,
while the feature branch renamed and evolved it as Dockside. Git reports
rename/rename and rename/delete conflicts across the shared ancestor.

### Options

Rebase/force-push; choose one rename; use an ours merge; or create a normal
merge that retains both final plugin directories.

### Chosen approach

Create a normal two-parent merge and retain both Taskboard and Dockside. Do not
rewrite history or hide conflicts with a strategy merge.

### Trade-offs and risks

Root integration must be reconciled explicitly, but both independently useful
plugins and both histories remain reviewable.

### Verification

Assert both merge parents, both plugin directories, no t3sidebar, no unmerged
entries, and GitHub mergeability.

## D-002: Main owns the workspace; the branch owns Dockside

Status: Accepted

### Evidence

Main intentionally reduced the repository to four npm workspaces and retired
the old Bun orchestration. The feature branch contains the already verified
Dockside source and evidence.

### Options

Keep the old Bun monorepo; replace the branch wholesale with main; or use an
explicit path authority map.

### Chosen approach

Take main's root/npm/CI and retained plugin trees as authoritative, preserve
the branch's Dockside tree, and add only the root metadata needed for Dockside.

### Trade-offs and risks

Branch-only retired plugins disappear as main intended; Dockside needs a new
npm lock entry and catalog/docs entry.

### Verification

Compare plugin trees to their authority commits and assert exact inventory.

## D-003: Regenerate derived integration state

Status: Accepted

### Evidence

Both sides changed package locks and generated Empirical context for different
repository inventories; textual conflict resolution would leave stale derived
state.

### Options

Choose either generated side, hand-merge derived files, or regenerate from the
resolved source tree.

### Chosen approach

Regenerate `package-lock.json` with npm and Empirical context through
`empirical_context`; keep the policy source hand-authored and npm-native.

### Trade-offs and risks

Generated diffs are larger but accurately describe the final tree.

### Verification

Run frozen/clean npm install in an independent checkout and require an
Empirical context report with no stale, missing, or refinement-required paths.

## D-004: Verify reconciliation structurally and behaviorally

Status: Accepted

### Evidence

Passing Dockside tests alone would not detect a deleted Taskboard, resurrected
plugin, stale lockfile, or hidden conflict marker.

### Options

Rely on GitHub mergeability; run only root checks; or combine exact tree and
inventory assertions with package/runtime checks.

### Chosen approach

Add a deterministic reconciliation QA script, run npm/Dockside/root checks,
inspect the live plugin defaults, obtain fresh-context review, and verify PR
mergeability after push.

### Trade-offs and risks

This adds deliberate verification work but protects both repository lineages.

### Verification

Every acceptance criterion must have a passing matrix receipt and the final PR
head must match the clean local branch.

## D-005: Provide Dockside's runtime export manifest at the npm root

Status: Accepted

### Evidence

Main's stable builder can bundle Dockside, but its dynamic runtime shim sees
the root SDK 0.4.6 export manifest and rejects `UrlLink` and
`experimental_useProviders`. Published SDK 0.4.29 declares both exports and
builds the unchanged Dockside source successfully. The build also rewrites a
legacy plugin's vendored declarations even when their verified content is
intentional.

### Options

Remove the two Dockside capabilities; modify installed builder code; migrate
the plugin during conflict resolution; or supply the published export manifest
at the root and restore only generated declarations after CI builds.

### Chosen approach

Pin root build tooling to `bb-app@0.40.0` and
`@get-bb/plugin-sdk@0.4.29`. Keep Dockside byte-identical and run its
typecheck/test/build through a root wrapper that snapshots and restores only
the two generated declaration files in `finally`.

### Trade-offs and risks

The root carries two build-only dependencies and a compatibility wrapper until
Dockside is deliberately migrated in a separate feature. Runtime application
code and persisted behavior remain unchanged.

### Verification

Run the wrapper in the working tree and an archive without Git metadata;
require a successful bundle and byte-clean Dockside tree afterward.

## D-006: Isolate Empirical's mandatory promotion adapter from workspace CI

Status: Accepted

### Evidence

Empirical Policy v2 rejects any `full-ci` command except the exact argv
`bun run ci`. Current main intentionally uses npm for its workspace, lockfile,
GitHub workflow, installation, and check command.

### Options

Restore Bun workspace orchestration; leave promotion unverifiable; patch the
Empirical runtime; or provide the required adapter as a one-line delegation to
the canonical npm check.

### Chosen approach

Keep the Policy v2 promotion command as exact `bun run ci`, and define the sole
root `ci` script as a tiny Node wrapper that spawns the existing `npm`
executable with fixed `run check` arguments and no shell. This prevents Bun
from rewriting a literal package-script `npm run` into recursive `bun run`
without adding another package. Do not add a Bun lock, Bun dependencies, Bun
workspace scripts, or Bun GitHub CI. Treat this as an Empirical protocol
adapter, not repository package-manager authority.

### Trade-offs and risks

Agents need Bun only when recording the mandatory Empirical promotion receipt;
developers and GitHub use npm exclusively. The indirection is explicit and
covered by the same npm check.

### Verification

Require Policy v2 doctor validation, `bun run ci` success, GitHub's npm CI
success, and absence of `bun.lock` or other Bun orchestration files.
