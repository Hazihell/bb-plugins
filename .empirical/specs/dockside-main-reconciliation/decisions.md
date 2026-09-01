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
