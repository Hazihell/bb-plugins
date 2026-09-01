# Decisions: Active Git-only Distribution Audit

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Separate build tooling from plugin distribution

Status: Accepted

### Evidence

Both plugin manifests are required for BB identity and Git builds. Git installs
run dependency installation/builds, and the repository's verified development
commands use npm workspaces. The removed registry packages are not required for
any of those operations.

### Options

- Delete every npm string, manifest, workspace record, and package command.
- Remove only registry distribution surfaces while retaining build/identity
  tooling.

### Chosen approach

Classify by behavior. Remove badges, URLs, `npm:` plugin sources, publishing
hooks/config/credentials, registry marketplace sources, and distribution copy;
retain manifests, package names, lockfile records, dependencies, and contributor
commands.

### Trade-offs and risks

Active files still contain `npm install` and `npm run` because those commands
are real. Focused guards and clear Git-first install sections prevent that
tooling from being mistaken for a supported registry source.

### Verification

Repository-wide classified search, manifest/CI assertions, direct Git install
assertions, private-workspace publish refusals, and root checks.

## D-002: Keep immutable history intact

Status: Accepted

### Evidence

Earlier Empirical specifications, receipts, and release artifacts accurately
record npm publication, a later EOTP failure, and the user's final website
deletions. Existing collected receipts bind those files by digest.

### Options

- Rewrite history so no npm reference exists anywhere.
- Preserve historical records and remove references only from active surfaces.

### Chosen approach

Preserve all prior feature records byte-for-byte. The new shared living
capability documents the current Git-only boundary without falsifying history.

### Trade-offs and risks

A raw unscoped search still finds historical npm text. Audits must explicitly
separate immutable history from supported current behavior.

### Verification

Compare tracked historical specification files with the base commit and
recalculate every historical collected-receipt artifact digest.

## D-003: Treat marketplace deployment as a separate approval gate

Status: Accepted

### Evidence

The local marketplace entries are Git-only, but the remote PR still covers only
Taskboard and the live catalog still points both entries at deleted registry
packages. Usage Tracker's Git source cannot pass liveness before its namespaced
tag exists.

### Options

- Claim the marketplace is fixed from the local edit.
- Keep local preparation verified, then perform source/tags/Releases and the PR
  update only after exact remote approval.

### Chosen approach

Keep the remote gate explicit. This feature verifies local source and catalog
metadata; the approved release sequence must create immutable public tags,
rerun marketplace liveness, push the catalog change, and update PR #126.

### Trade-offs and risks

Until the PR merges, the public marketplace remains stale even though direct Git
installation is prepared. Reporting must distinguish local readiness, open PR,
and live catalog state.

### Verification

Before remote work, record exact account, repository, release commit, versions,
tags, and commands. After approval, verify peeled tags, Releases, marketplace
build/check, PR CI, and final live catalog sources.
