# Independent Taskboard 0.3.0 Release Review

- Reviewer: `code-review`
- Verdict: `advisory`
- Source base: `f3ecae77e9add2ffd649442ee880841e30fc25eb`
- Marketplace commit: `9ae222172804d7c12efd7882cd63ac0a046d7acf`

## Criterion dispositions

### AC-1 — Pass

Taskboard's manifest and root workspace lock entry advance from `0.2.0` to
`0.3.0`. After excluding `version`, the Taskboard lock entry is unchanged; after
excluding `version` and the required new `browse-preferences.ts` package-file
entry, the package manifest is unchanged. Package name, plugin ID, branding,
license, engines, source entry points, repository metadata, and dependencies are
preserved. Usage Tracker remains `0.1.2` with no source or manifest diff.

### AC-2 — Pass

The signed root check passes Taskboard SDK validation, typecheck, 71/71 tests,
production build, and build-metadata verification, plus the unchanged Usage
Tracker checks. The reviewed archive is `bb-plugin-taskboard@0.3.0`, has SHA-256
`9cec43475954d32974fc10ddbd2ec74fe5b3cd4dd18ed8626b1c8f2c974e6f38`,
contains 53 regular files, and includes the manifest, license, notices, README,
declared source closure, `browse-preferences.ts`, and required app/server build
artifacts. Both metadata files identify Taskboard `0.3.0`, SDK `0.4.6`, and BB
`0.38.0`. Every packed member is byte-identical to its current release-candidate
counterpart. No dotenv, npm config, test tree, `node_modules`, or credential is
present in the archive.

### AC-3 — Pass for local preparation

Marketplace commit `9ae222172804d7c12efd7882cd63ac0a046d7acf` is a clean child of current
`upstream/main` `a683caa2ffb502cdc26926c48c88a45a8579970a`. Its only changed path is
`entries/taskboard.json`, and its only content change is `^0.1.2` to `^0.3.0`.
All listing fields and the npm package are preserved. The marketplace and plugin
icons share SHA-256
`0b77950cec05ed35134dcc8d0c8ff96460c806106cb8e28cedeb15903ccd08ef`.
The recorded 82-entry build and liveness check pass. Because marketplace
liveness checks the package rather than exact semver resolution, the executable
plan's separate exact `bb-plugin-taskboard@0.3.0` registry confirmation remains
mandatory before the post-publication check and marketplace push.

### AC-4 — Pass for verified evidence; final commit gate pending

The signed root workspace check and `git diff --check` pass. Public registry
lookup returns 404 for `bb-plugin-taskboard@0.3.0`; the origin has no
`taskboard/v0.3.0` tag or `agent/taskboard-v0.3.0` branch, and no matching source
PR or GitHub release exists. The source tree is intentionally still uncommitted
because Empirical integration follows this review. Before any remote approval,
the complete candidate must be integrated, committed locally, placed on the
declared release branch, shown clean, and rechecked against the approved archive
digest and contents.

### AC-5 — Approval gate preserved

No release or marketplace remote mutation was observed. The authenticated
identities recorded in evidence are GitHub `MateoCerquetella` and npm
`mateocerquetella`; the source repository, package/version, tag, npm source,
marketplace branch, and range are consistently specified. Exact source and
marketplace commit hashes plus every remote-changing command must still be
presented after source finalization, and explicit user approval remains required
before the first push, PR, merge, tag, publication, or GitHub release.

### AC-6 — Pass

`.npm-publish.env` is ignored, untracked, and owner-readable only. It was not
read into review output. The npm configuration contains only an environment
reference, and neither credential material nor npm release configuration occurs
in the archive or marketplace data. The approved publication design rechecks
the archive digest, publishes that exact archive with lifecycle scripts disabled,
and scopes the token to one process.

## Decision consistency

D-001 is supported by the material pre-1.0 feature scope and confirmed version
absence. D-002 is preserved by the unchanged npm package and the marketplace
range-only update. D-003 is upheld: local preparation is separated from remote
release, and no accepted decision is contradicted by the implementation,
archive, evidence, or marketplace commit. The stronger executable controls in
the design—real archive, recorded/rechecked digest, exact-archive publication,
and process-scoped scripts-disabled credentials—must remain authoritative at
execution time, as required by the security consult.

## Findings

None. No blocking, high, medium, or low correctness, regression,
supply-chain, provenance, manifest-scope, credential-safety, marketplace, or
decision-consistency finding remains in the reviewed local candidate. The
source commit/clean-tree proof, exact approval presentation, publication
confirmation, and post-publication marketplace check are explicit completion
gates rather than defects in this pre-integration review.
