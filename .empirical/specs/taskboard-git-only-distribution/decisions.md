# Decisions: Taskboard Git Only Distribution

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Keep npm as tooling, remove it as Taskboard distribution

Status: Accepted

### Evidence

BB derives the plugin ID/version from `package.json`, Git installs run dependency
installation and builds, and the monorepo uses npm workspaces. The user wants
Taskboard removed from npm distribution, not a broken Git checkout.

### Options

- Delete Taskboard's package manifest and npm dependencies.
- Keep the build manifest but mark it private and remove publish-only fields.

### Chosen approach

Keep the manifest/tooling and make Taskboard private with no publication,
packaging allowlist, or prepack hook.

### Trade-offs and risks

The file remains npm-compatible because npm is still the build tool. `private`
and focused guards prevent accidental registry publication.

### Verification

Manifest assertions, full workspace checks, and a direct Git install contract.

## D-002: Preserve Usage Tracker npm distribution

Status: Superseded

Superseded by: D-005

### Evidence

The user selected destructive removal of `bb-plugin-taskboard`; no instruction
authorized changing `bb-plugin-usage-tracker`.

### Options

- Remove shared npm infrastructure and affect both plugins.
- Remove only Taskboard-specific publication surfaces.

### Chosen approach

Leave Usage Tracker's manifest, badges, install instructions, and shared root
npm support unchanged.

### Trade-offs and risks

Root npm configuration remains because it still serves Usage Tracker. Active
copy must clearly avoid implying Taskboard also publishes there.

### Verification

Byte-/field-level assertions for Usage Tracker plus root documentation review.

## D-003: Report npm unpublish as blocked

Status: Superseded

Superseded by: D-004

### Evidence

The registry accepted authentication but rejected full-package unpublish with
`EOTP`; public versions `0.1.0` through `0.2.0` remain queryable.

### Options

- Claim deletion based on intent.
- Record the external blocker and complete Git-only code removal honestly.

### Chosen approach

Record npm deletion as externally blocked until the registry itself confirms
absence.

### Trade-offs and risks

Historical npm installs remain available temporarily. New Taskboard releases and
the marketplace use Git only.

### Verification

Registry query remains explicit and no code/docs advertise npm installation.

## D-004: Supersede the blocked registry status after external deletion

Status: Accepted

Supersedes: D-003

### Evidence

After the CLI `EOTP` rejection, the user completed npm deletion externally.
Fresh registry responses now return `E404 Unpublished` for Taskboard at
`2026-08-26T23:00:34.123Z` and Usage Tracker at
`2026-08-26T23:00:13.963Z`.

### Options

- Preserve the earlier blocked status after it becomes stale.
- Record the attempt and later external completion as separate timeline facts.

### Chosen approach

Record both facts. The later accepted scope decision removes stale distribution
surfaces for both externally deleted packages in this feature.

### Trade-offs and risks

Historical npm versions cannot be restored under the same version numbers.
Git tags and the marketplace are now the live distribution source.

### Verification

Use read-only registry queries and never store/retry an unpublish command.

## D-005: Supersede the Taskboard-only code boundary

Status: Accepted

Supersedes: D-002

### Evidence

The user's latest explicit instruction is to remove both npm packages and their
active code paths immediately. The registry confirms both packages unpublished,
and marketplace liveness now fails on Usage Tracker's stale npm source.

### Options

- Preserve stale Usage Tracker npm instructions despite external deletion.
- Convert both plugins to private Git-only workspaces and marketplace sources.

### Chosen approach

Convert both. Preserve npm only as the monorepo dependency/build tool.
This accepted user supersession also replaces AC-3 and the Usage Tracker
non-goal in the original approved specification without rewriting that
historical contract.

### Trade-offs and risks

Usage Tracker needs a plugin-specific Git tag and marketplace source update.
Historical npm receipts remain immutable timeline evidence.

### Verification

Private-publish skips for both manifests, no active npm install URLs, public
plugin-specific tags, and marketplace Git liveness for both entries.

## D-006: Cut a Taskboard patch tag for the Git-only manifest

Status: Accepted

### Evidence

`taskboard/v0.3.0` is immutable and predates the private manifest. The
marketplace/direct range `^0.3.0` can select a compatible patch release.

### Options

- Move v0.3.0 to the new commit.
- Leave installs on the old manifest indefinitely.
- Bump to 0.3.1 and create a new tag.

### Chosen approach

Release `taskboard/v0.3.1` and `usage-tracker/v0.1.2` from the reviewed Git-only
commit.

### Trade-offs and risks

Two plugin-specific tags point to one monorepo commit, with independent semver
ranges and subdirectories. Existing immutable tags remain untouched.

### Verification

Check both manifest versions, annotated tag names, peeled commit equality, and
marketplace liveness before push/PR completion.
