# Independent Code Review

- Reviewer: code-review
- Verdict: advisory
- Source base: `3cbd919bcce696131b1cc16480c54f3049401ea9`
- Scope: complete Git-only distribution working-tree diff, accepted
  supersessions D-004 through D-006, signed verification, security consult,
  immutable Empirical history, and the locally prepared marketplace sources

## Criterion dispositions

### AC-1 — Pass

Taskboard is `bb-plugin-taskboard@0.3.1`, is marked `private: true`, and has no
`publishConfig`, `files`, or `prepack` field. Its package name, BB name and
branding, source app/server entries, engines, dependencies, and build, dev,
typecheck, test, and check scripts remain intact. The signed root check proves
SDK validation, TypeScript, 88/88 tests, production build, and Taskboard build
metadata against the changed manifest.

### AC-2 — Pass

The root and Taskboard READMEs no longer advertise the npm package, npm badge,
npm URL, or `npm:bb-plugin-taskboard` installation. Both contain the exact
direct Git command with range `^0.3.0`, subdirectory `plugins/taskboard`, and
tag prefix `taskboard/`; community shorthand is explicitly conditional on
marketplace PR #126 becoming live. Managed Git update/remove commands remain
correctly documented.

### AC-3 — Superseded; current two-plugin requirement passes

D-005 records the user's later explicit instruction and supersedes D-002,
AC-3, and the original Usage Tracker non-goal without rewriting the historical
approved specification. Usage Tracker remains
`bb-plugin-usage-tracker@0.1.2` with its BB identity, runtime dependencies, and
build scripts intact, but is now private and has no npm publication fields or
hook. Its root/plugin documentation has the parallel `^0.1.2`,
`plugins/usage-tracker`, and `usage-tracker/` Git install contract and no active
npm distribution copy. npm workspaces and registry-resolved third-party
dependencies remain only as required build tooling.

### AC-4 — Pass for the reviewed delta; integration remains a workflow gate

The capability delta removes Taskboard's immutable npm-release requirement and
adds the general immutable Git tag, reviewed commit, GitHub Release, and
marketplace-range requirements. Its v0.3.0 scenarios retain the already-public
baseline; D-006 governs adding v0.3.1 without moving that baseline, and the
`^0.3.0` range tracks the highest compatible tag. All 135 Empirical
specification files tracked at the source base hash byte-identically to HEAD.
The historical npm publication wrapper and receipts remain only as immutable
audit artifacts; no active manifest, CI workflow, root script, or documentation
invokes them. Applying the accepted delta in Empirical integration is still
required before source commit.

### AC-5 — Pass for local verification; public release gates remain

Signed receipt `executed-f19eb7b3790a9c40e46b8d5e` records the final root
check at Taskboard 0.3.1 and Usage Tracker 0.1.2. Independent review also
confirmed `git diff --check`, all focused distribution assertions, and exact
private-workspace dry-run warnings for both plugin names. Public annotated tag
`taskboard/v0.3.0` still peels to
`3cbd919bcce696131b1cc16480c54f3049401ea9`; it has not moved.

The marketplace Taskboard entry is Git-backed with repository, subdirectory,
`^0.3.0`, and `taskboard/` prefix preserved. The local Usage Tracker entry
replaces its now-dead npm source with the same repository,
`plugins/usage-tracker`, `^0.1.2`, and `usage-tracker/`. Full remote liveness is
intentionally pending the reviewed source commit and public
`taskboard/v0.3.1` and `usage-tracker/v0.1.2` tags; this is a post-approval
release gate, not evidence already claimed by the candidate.

### AC-6 — Superseded external conclusion; current timeline passes

D-004 preserves the initial Taskboard CLI `EOTP` failure and separately records
the user's later website deletion. Independent cache-bypassed registry queries
return `E404 Unpublished` for Taskboard at
`2026-08-26T23:00:34.123Z` and Usage Tracker at
`2026-08-26T23:00:13.963Z`. No active repository operation stores or retries an
unpublish command, OTP, token, or npm credential.

## Publication and credential boundary

The shared tracked `.npmrc.publish` is deleted and the local
`.npm-publish.env` is absent. Retaining the deny-only `.npm-publish.env` ignore
line is appropriate credential hygiene for legacy clones and does not preserve
a publication path. The CI workflow performs dependency installation and
checks only; there is no registry publish job or npm release script. Both
private dry runs emit `Skipping workspace ... marked as private`, which is the
authoritative refusal despite npm returning exit zero.

## Required post-review gates

- Integrate the accepted capability delta, then commit the exact reviewed
  source tree and re-run immutable receipt-artifact validation.
- Obtain exact remote-mutation approval before pushing or merging the source
  PR, creating tags/releases, or updating marketplace PR #126.
- Create new annotated `taskboard/v0.3.1` and
  `usage-tracker/v0.1.2` tags at the same reviewed commit; never move
  `taskboard/v0.3.0`. Publish the required Taskboard v0.3.1 GitHub Release.
- After both tags are public, require their peeled commits to match the reviewed
  source, run full marketplace build/liveness checks for both Git subdirectories,
  update PR #126's scope, and require its hosted validation to pass.

## Findings

None. No blocking, high, medium, or low correctness, manifest-identity,
buildability, documentation, credential, CI/CD, immutable-history, or
distribution-path finding remains in the reviewed local candidate. The public
tags, release, marketplace liveness, and remote approval above are explicit
completion gates rather than pre-integration code defects.
