# Taskboard Git Only Distribution

## Request

> Remove Taskboard's npm distribution path now and make Taskboard Git-only without touching Usage Tracker: mark the Taskboard workspace private/non-publishable while retaining its package name, dependencies, and npm-as-build-tool scripts required by BB Git installs; remove Taskboard publishConfig, prepack/files packaging contract where safe, tracked npm publish config, local publish credential/ignore entry, npm badges/links/install/update instructions, and root claims that every plugin ships through npm; document BB Community and direct Git semver install commands using plugins/taskboard and taskboard/ tags; update the living Taskboard distribution capability to Git-only; preserve immutable historical Empirical receipts. Verify builds/tests and marketplace Git source. The external npm unpublish of bb-plugin-taskboard versions 0.1.0 through 0.2.0 was explicitly authorized but npm rejected it with EOTP, so record the registry deletion as externally blocked rather than pretending it succeeded. Do not modify or unpublish Usage Tracker.

## Goal

Make Taskboard explicitly Git-only and impossible to publish accidentally to
npm, while retaining npm as the repository's package manager/build tool and
leaving Usage Tracker's separate npm distribution untouched.

## Acceptance Criteria

- [ ] [AC-1] `plugins/taskboard/package.json` is private and has no
  `publishConfig`, `files`, or `prepack` npm-distribution contract, while its
  package name, version, dependencies, BB manifest, build/dev/typecheck/test/
  check scripts, and plugin identity remain valid for workspace and Git builds.
- [ ] [AC-2] Root and Taskboard documentation remove Taskboard npm badges,
  package links, npm install/update wording, and claims that Taskboard releases
  through npm; they document BB Community installation and an exact direct Git
  semver command using `plugins/taskboard` plus tag prefix `taskboard/`.
- [ ] [AC-3] Usage Tracker's npm badge, install instructions, publish metadata,
  root npm workspace/package-manager commands, lockfile registry dependencies,
  and shared npm credential-ignore/config support remain unchanged.
- [ ] [AC-4] The living Taskboard distribution contract and active docs define
  immutable Git tags/GitHub Releases plus the BB Community Git range as the sole
  Taskboard distribution path; immutable historical Empirical receipts remain
  byte-valid.
- [ ] [AC-5] Root checks, Taskboard build metadata, direct Git release-source
  validation, and the existing marketplace Git entry checks pass.
- [ ] [AC-6] The public `bb-plugin-taskboard` registry package is reported
  accurately: full unpublish was explicitly attempted and rejected by npm with
  `EOTP`; no code or evidence claims that registry deletion succeeded.

## Scope

- Taskboard manifest distribution flags and Taskboard/root documentation.
- Living `taskboard-distribution` capability and focused distribution guards.
- Verification of the public tag and existing Git-source marketplace PR.

## Non-goals

- Removing npm/node/package.json/package-lock dependencies used to build Git
  installs.
- Changing or unpublishing Usage Tracker.
- Rewriting immutable historical specifications, receipts, release artifacts,
  or the already-published GitHub Release/tag.
- Claiming success for npm unpublish without registry confirmation.

## Verification

- Focused manifest/documentation assertions and `npm run check`.
- `bb plugin build`/metadata validation through the existing Taskboard check.
- Public `taskboard/v0.3.0` tag resolution and marketplace `npm run build` /
  `npm run check` against the Git source.
- Receipt-artifact digest audit and npm registry presence check.

## Capability Deltas

- `deltas/taskboard-distribution.md`
