# Independent Code Review

- Reviewer: code-review
- Verdict: advisory
- Source base: `ecc13bee4a275772ac7ac19207056d719da9057a`
- Scope: complete active Git-only cleanup diff, accepted decisions D-001 through
  D-003, signed verification, security consult, immutable Empirical history,
  and the separately prepared marketplace worktree

## Criterion dispositions

### AC-1 — Pass for the reviewed source candidate

The root, Taskboard, and Usage Tracker READMEs contain no npm package badge,
package URL, `npm:` plugin source, registry install/update command, or registry
release wording for either plugin. All three document direct Git installation
with the correct repository, plugin subdirectory, compatible semver floor, and
plugin-specific tag prefix; BB Community shorthand is explicitly conditional
on marketplace PR #126 becoming live. Remaining `npm install` and `npm run`
examples occur only in development/build sections. Taskboard's `^0.3.0` floor
intentionally admits the prepared 0.3.1 patch release and preserves the already
public 0.3.0 fallback until the new tag is approved and created.

### AC-2 — Pass

The active Usage Tracker changelog, third-party notices, and generated context
describe private workspaces, generic third-party dependencies, and Git releases
without claiming registry distribution. A repository-wide classified search
found only legitimate npm build/dependency facts in contributor commands, CI
dependency installation, lockfile records, and focused negative tests. The
exact `@get-bb/plugin-sdk` development pins remain intact.

### AC-3 — Pass

The root and both plugin manifests are private. Both plugin manifests omit
`publishConfig`, `files`, and every publication/packing lifecycle hook while
retaining their source entries and build contracts. No active script invokes
`npm publish` or `npm unpublish`; `.npmrc.publish` is absent; the local
credential file is absent; and the sole CI workflow has read-only contents
permission with no registry URL, publish command, or npm credential variable.
The deny-only `.npm-publish.env` ignore entry remains appropriate protection
for legacy clones and is not an active credential or release path.

### AC-4 — Pass for local preparation; remote delivery remains pending

Independent inspection of the marketplace worktree confirms Taskboard uses
`plugins/taskboard`, range `^0.3.0`, and prefix `taskboard/`, while Usage
Tracker uses `plugins/usage-tracker`, range `^0.1.2`, and prefix
`usage-tracker/`; both point at the public monorepo and neither local entry has
an npm source object. The Usage Tracker entry is still an uncommitted local
change, remote PR #126 has not yet been expanded to include it, and the live
catalog remains stale. The verification report states that distinction
honestly. D-003 and the approved non-goals make source tags, Releases,
marketplace push, hosted validation, and live catalog correction post-review
remote gates requiring exact approval; none is claimed as already delivered.

### AC-5 — Pass

Both stable package names, package manifests, root workspaces, lockfile
workspace/dependency records, source `bb.server`/`bb.app` entries, runtime and
development dependencies, and npm-backed contributor/CI commands remain
present. Taskboard stays at 0.3.1 and Usage Tracker at 0.1.2. The cleanup
therefore removes registry distribution without breaking the package identity
or dependency installation BB's Git source flow requires.

### AC-6 — Pass

No pre-existing `.empirical/specs/**` path differs from source base
`ecc13bee4a275772ac7ac19207056d719da9057a`. Independent digest validation of
every artifact referenced by prior features' final attached collected receipts
checked 50 artifacts with zero mismatches. Earlier npm publication, failure,
and deletion records remain accurate immutable history rather than active
instructions.

### AC-7 — Pass

Signed receipt `executed-780cb49e0b3da2700c7f3e9a`, bound to final product
tree digest `98f0021522923a8a14a9fb38c650d4123db07b17b0676ffe5babf18c98d0a5b6`,
records the final root `npm run check`: Taskboard passes SDK checks,
TypeScript, 89/89 tests, build, and build-metadata validation; Usage Tracker
passes SDK checks, TypeScript, 13/13 tests, and build. Independent review reran
the four focused distribution tests and `git diff --check`; both pass. The
document guard now includes both third-party notices as well as READMEs,
changelog, and active context. The guards assert semantic manifest,
documentation, credential/config, and CI invariants while deliberately
preserving stable build commands and package identity, rather than banning the
word npm indiscriminately.

## Decision consistency

D-001 is preserved by classifying npm dependency/build tooling separately from
registry distribution. D-002 is preserved by leaving all prior Empirical
feature records untouched. D-003 is preserved by reporting the local
marketplace candidate separately from the stale remote PR and live catalog. No
implementation choice contradicts an accepted decision or requires a
superseding entry.

## Finding CR-001: Git release immutability is not enforced

- Severity: medium
- Category: supply-chain integrity
- Location: `README.md` Git release statement; `.empirical/context/overview.md`;
  `design.md` Marketplace boundary; `deltas/plugin-git-distribution.md` Active
  Git-only install surfaces
- Recommendation: Before describing the released tags as immutable, add GitHub
  tag rulesets that block update and deletion for `taskboard/v*` and
  `usage-tracker/v*`, minimize bypass principals, and make the release procedure
  fail if an existing remote tag peels to any commit other than the reviewed
  commit. Until that remote control exists, treat the tags as versioned and
  annotated but operationally mutable.

This is the same advisory supply-chain risk recorded by the security consult.
It does not reintroduce an npm distribution path or block integrating the local
cleanup, but it remains a mandatory release-hardening decision before claiming
host-enforced immutability.

## Required post-review gates

- Integrate the accepted capability delta and commit the exact reviewed tree.
  Do not tag source base `ecc13bee4a275772ac7ac19207056d719da9057a`, because
  the current README, changelog, context, and regression-guard cleanup is still
  uncommitted on top of it.
- Obtain exact remote-mutation approval before pushing/merging the source PR,
  creating `taskboard/v0.3.1` or `usage-tracker/v0.1.2`, creating Releases, or
  updating marketplace PR #126.
- After both tags exist, require each peeled tag commit to equal the final
  reviewed source commit, run full marketplace Git-source liveness, push both
  Git entries, update the PR title/body and evidence, require hosted validation,
  and verify the live catalog no longer references either deleted registry
  package.

No additional blocking, high, medium, or low correctness, documentation,
manifest identity, buildability, credential, CI/CD, immutable-history, test, or
npm-distribution finding remains in the reviewed local candidate.
