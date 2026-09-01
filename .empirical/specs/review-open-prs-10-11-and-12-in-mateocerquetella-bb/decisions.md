# Decisions: Community PR Integration

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Integrate all PRs through one authorship-preserving branch

Status: Accepted

### Evidence

PR #10 is independent. PR #12 is stacked directly on #11: #11 head `445e5ac`
is an ancestor of #12 head `91037db`, which adds seven commits. The repository
allows merge commits and each original commit carries the contributor identity.

### Options

- Squash or reimplement each PR independently.
- Merge #10, #11, and #12 in dependency order on one integration branch and
  preserve original heads as parents.

### Chosen approach

Use normal merge parents in order #10, #11, #12, then merge the reviewed
integration branch normally into main. Never amend, squash, rebase, or force
push contributor commits.

### Trade-offs and risks

History gains intentional merge commits, but GitHub attribution and the true
stack relationship stay intact. An owner branch avoids risky writes to
contributors' forks.

### Verification

Check all three exact PR head SHAs are ancestors of the final main commit and
that Stephen Dolan/Andrii Los remain commit authors and visible README credits.

## D-002: Merge PR #10 as submitted

Status: Accepted

### Evidence

A synthetic merge against current main is conflict-free. Isolated root checks
pass with Usage Tracker 15/15 tests, and the change touches only seven Usage
Tracker source/docs/test files. Values are enum-constrained and normalized at
browser and RPC boundaries.

### Options

- Reimplement or defer the compact-limit setting.
- Retain the original commit through a normal merge.

### Chosen approach

Merge PR #10 normally and preserve Weekly as the default plus Five-hour as the
alternative, with runtime fallback when the preferred window is absent.

### Trade-offs and risks

The contributor did not add a DOM/RPC integration test, so live verification
remains necessary. No manifest version or release is created in this task.

### Verification

Run preference/usage tests, root checks, and live toggling that confirms compact
percentage/bar changes while expanded details continue to show both windows.

## D-003: Record PR #11 with an ours merge

Status: Accepted

### Evidence

Current main already satisfies the remembered-filter user outcome with a safer,
richer device-local architecture. PR #11's auto-merged non-conflicting files
would still introduce a second server writer, unbounded stale schema, collision,
races, and lost released fields even if conflict markers were resolved.

### Options

- Blindly merge and reconcile two persistence systems.
- Close #11 as superseded and lose merged status/ancestry.
- Use Git's whole-tree `ours` merge to retain authentic contributor history
  while preserving current behavior.

### Chosen approach

Merge exact #11 head using `git merge -s ours --no-ff`; add Andrii Los credit
and assertions that the obsolete files/RPC/table remain absent.

### Trade-offs and risks

The contributor commits become history without their old implementation tree
entering current code. Visible credit and the review record explain why: their
requested outcome is already shipped, while the old mechanics are unsafe now.

### Verification

Diff the pre/post ours-merge trees, check forbidden symbols/files are absent,
exercise all released preference scopes, and retain the original commit authors.

## D-004: Port PR #12 presets to current BrowsePreferences

Status: Accepted

### Evidence

The seven unique preset commits provide valuable module/store/RPC/UI/CLI work,
but depend on #11's obsolete `BoardFilterState` and predate current Taskboard UI,
query/collapse/provider fields, Git-only manifest, and provider-safety changes.

### Options

- Merge the entire stale stack verbatim.
- Drop named presets.
- Merge the original preset commits, then adapt their boundaries in the
  conflict-resolution commit.

### Chosen approach

Preserve the unique #12 commits as a merge parent and port preset state,
application, UI placement, RPC/CLI, and tests onto current
`browsePreferencesV1Schema` and observable store.

### Trade-offs and risks

The semantic resolution is substantial and must be independently reviewed.
It preserves contributor authorship while avoiding duplicate automatic state
ownership and an npm-era manifest regression.

### Verification

Test strict state/name/order/project behavior, UI save/apply/manage, CLI CRUD and
list precedence, root regression suite, live reload, and Git ancestry.

## D-005: Credit contributors in history and documentation

Status: Accepted

### Evidence

The repository has no existing Contributors convention. The user explicitly
requested contributor credit, and GitHub credit alone is not visible in product
documentation.

### Options

- Rely only on Git history.
- Add only generic thanks.
- Preserve commits and add named linked credits.

### Chosen approach

Add a root Contributors section linking Stephen Dolan and Andrii Los, plus
concise feature-specific credit in the relevant plugin documentation.

### Trade-offs and risks

Credits must stay factual and not imply ownership or endorsement beyond the
merged contributions.

### Verification

Assert exact GitHub links in documentation and original author emails/names in
reachable commits.
