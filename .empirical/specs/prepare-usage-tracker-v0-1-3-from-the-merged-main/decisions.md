# Decisions: Prepare Usage Tracker V0 1 3 From The Merged Main

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Release the accumulated work as 0.1.3

Status: Accepted

### Evidence

- The latest Usage Tracker release is `0.1.2`; no `0.1.3` tag or GitHub Release
  exists.
- Since `0.1.2`, main gained the additive Compact limit setting plus compatible
  provider-key and complete-window fixes without breaking plugin identity,
  settings, RPC output IDs, or declared engine ranges.
- Existing `^0.1.2` consumers track compatible `0.1.x` releases.

### Options

1. Publish `0.1.3` as the next compatible patch in the established line.
2. Publish `0.2.0` and require every pre-1.0 range to advance.

### Chosen approach

Choose option 1. The accumulated feature is additive and the fixes restore the
documented contract; no consumer migration justifies a new pre-1.0 minor line.

### Trade-offs and risks

The release notes must name the additive Compact limit as well as the fixes so a
patch bump does not hide user-visible behavior. Full checks protect compatibility.

### Verification

Assert every active version/range, changelog section, build metadata file, tag
absence, and direct install command resolves to `0.1.3`.

## D-002: Tag the reviewed source commit only after main integration

Status: Accepted

### Evidence

- Existing `usage-tracker/v0.1.2` points to the reviewed source commit rather
  than the repository PR merge commit.
- The merged fix commit does not yet contain `0.1.3` release metadata.
- Git tag immutability means a prematurely tagged commit cannot be repaired by
  moving the ref.

### Options

1. Tag merged PR #20 immediately.
2. Tag the local release commit before it is reviewed/merged.
3. Push/review/merge the release commit, prove it is reachable from `main`, then
   tag that exact reviewed source commit.

### Chosen approach

Choose option 3 and create the annotated tag message
`Release Usage Tracker v0.1.3` only after release PR CI and merge succeed.

### Trade-offs and risks

The tag does not point at the later merge commit, but it binds the exact reviewed
plugin source and matches repository precedent. An ancestry check makes the
relationship explicit.

### Verification

Before tagging, prove the release SHA is an ancestor of public `main`; after
push, inspect both annotated and peeled remote refs.

## D-003: Keep active versions synchronized and history immutable

Status: Accepted

### Evidence

- The manifest version is repeated in the workspace lockfile, two install
  commands, a distribution test, and living command context.
- Completed changelog/Empirical records are historical evidence, not active
  release configuration.

### Options

1. Change only the manifest.
2. Globally replace every `0.1.2` string.
3. Mechanically update the manifest/lockfile, then edit and test only active
   release surfaces while preserving history.

### Chosen approach

Choose option 3. Use npm for manifest/lockfile coherence and the distribution
test plus active search to guard every remaining surface.

### Trade-offs and risks

Selective edits require classification, but avoid falsifying prior releases and
receipts. Root verification catches an omitted active reference.

### Verification

Inspect the complete version diff, run active literal searches and distribution
tests, and verify ignored build metadata reports `0.1.3`.

## D-004: Expand marketplace PR #129 to both Git migrations

Status: Accepted

### Evidence

- Live Taskboard and Usage Tracker entries still reference unpublished npm
  packages.
- PR #129 already migrates Taskboard to its valid `^0.3.1` Git source but fails
  because Usage Tracker remains on npm.
- A Usage-only PR would inversely fail on the unchanged Taskboard entry; closed
  PR #126 demonstrated the combined shape.

### Options

1. Open a separate Usage Tracker-only PR.
2. Replace PR #129 with a new combined PR.
3. Add Usage Tracker's `^0.1.3` Git source to PR #129 and preserve its review
   branch/history.

### Chosen approach

Choose option 3. Prepare the existing fork branch locally, then after approval
and public tag validation push it and retitle/update PR #129 as a combined Git
source migration.

### Trade-offs and risks

One PR now covers two coupled entries, but that is the minimum catalog diff that
can pass repository-wide liveness. Upstream merge remains maintainer-controlled.

### Verification

Run marketplace build/repository checks before approval, manually verify the
exact remote tag after publication, and diff only the Usage Tracker entry beyond
PR #129's Taskboard change.

## D-005: Preserve BB 0.38 and SDK 0.4.6 compatibility

Status: Accepted

### Evidence

- Usage Tracker intentionally accepts both legacy and current provider wire keys
  and keeps BB `>=0.38` / plugin SDK `>=0.4.6` engine ranges.
- A current BB may ignore an older prebuilt backend and load the shipped source;
  Git installation includes that reviewed source fallback.
- Raising the SDK pin would broaden this release beyond the fixes and exclude
  supported BB versions.

### Options

1. Upgrade to BB 0.40 / SDK 0.4.21 in this release.
2. Keep the declared compatibility and validate both source/build contracts.

### Chosen approach

Choose option 2. Do not change engines or SDK pins; build and tag the complete
source so both compatible execution paths contain the fixes.

### Trade-offs and risks

BB 0.40 may compile the source fallback instead of using the 0.4.6 bundle, but
that is an explicit compatibility path rather than missing code.

### Verification

Run the pinned SDK type/build check and inspect the tag contents for every source
file used by provider normalization and sidebar presentation.

## D-006: Require a separate exact release approval

Status: Accepted

### Evidence

- Git pushes, PR integration, annotated tags, GitHub Releases, and marketplace
  updates are remote mutations.
- The submit-a-plugin workflow requires exact account, remote, commits,
  package/version, source/tag, and commands before the first release mutation.

### Options

1. Treat the original broad request as publication approval.
2. Prepare local immutable commits/checks, then request exact approval once.

### Chosen approach

Choose option 2. Stop after verified local release and marketplace commits and
present one auditable remote sequence.

### Trade-offs and risks

The release pauses once, but no partially published tag/catalog state can be
created without the user seeing every target and command.

### Verification

Prove both branches are local-only/clean and list every remote-changing command
in the approval request.

## D-007: Gate marketplace execution on immutable declarative provenance

Status: Accepted

### Evidence

- `npm ci --ignore-scripts` suppresses lifecycle hooks but later `npm run build`
  and `npm run check` execute repository code.
- PR #129 is a mutable fork branch, while its reviewed head commit and upstream
  base are immutable Git objects.
- The intended combined change is purely declarative: one entry file per commit.

### Options

1. Trust the live fork branch and inspect it after running scripts.
2. Skip marketplace scripts entirely.
3. Pin the exact PR head/base, allowlist the full declarative path set and prove
   executable files unchanged before running scripts without release credentials.

### Chosen approach

Choose option 3. Require parent `9886b504bafc07fe879098900e6c7f6f72c5231f`,
upstream base `a683caa2ffb502cdc26926c48c88a45a8579970a`, and only
`entries/taskboard.json` plus `entries/usage-tracker.json` across the two commits.

### Trade-offs and risks

The gate is specific to the existing PR head and must be reproposed if that head
changes. This is intentional: a mutable update requires another code/diff review.

### Verification

Compare exact commits and complete name-status/diff output, prove package/lock/
scripts/workflows unchanged, then rerun install/build/check with GitHub, npm,
and SSH credential variables unset.
