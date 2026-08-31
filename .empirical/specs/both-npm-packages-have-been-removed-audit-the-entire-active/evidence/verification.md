# Active Git-only distribution audit verification

## Active documentation

- Root, Taskboard, and Usage Tracker READMEs lead with immutable Git semver
  installs and conditional BB Community shorthand.
- A classified active-file search found no `npm:` source for either plugin, npm
  package badge/URL, publish/unpublish command, registry auth URL, publishing
  token name, `publishConfig`, or tracked publish config in current README,
  changelog, context, manifest, CI, or collection files.
- Root README and generated context no longer carry unnecessary prose describing
  the workspace or plugins as npm-distributed. Usage Tracker's changelog now
  calls `@get-bb/plugin-sdk` a pinned development dependency.
- Contributor `npm install` and `npm run` commands remain intentionally because
  they install dependencies, test, and build Git source.

## Manifests, automation, and credentials

- Root, Taskboard, and Usage Tracker manifests are `private: true`.
- Structural guards reject `publishConfig`, package `files`, and
  `prepublish`, `prepublishOnly`, `publish`, `postpublish`, `prepack`, or
  `postpack` hooks across all three manifests, plus publish/unpublish command
  text in every script.
- `.npmrc.publish` and the local credential file are absent. The deny-only
  `.npm-publish.env` ignore line remains protective hygiene for legacy clones.
- The sole GitHub workflow has read-only contents permission and no registry,
  auth-token, publish, or unpublish path. Read-only GitHub checks report no
  Actions secrets, no Actions variables, zero deployment environments, and one
  active CI workflow.
- Final private dry runs emit the exact skip warning for both
  `bb-plugin-taskboard` and `bb-plugin-usage-tracker`.

## Tests and builds

- Signed receipt `executed-780cb49e0b3da2700c7f3e9a` records root
  `npm run check` passing at the final tree.
- Taskboard 0.3.1 passes SDK checking, TypeScript, 89/89 tests, production
  build, and build-metadata verification.
- Usage Tracker 0.1.2 passes SDK checking, TypeScript, 13/13 tests, and
  production build.
- `git diff --check` passes.

## Marketplace and public state

- The local Taskboard marketplace entry is Git-backed at
  `plugins/taskboard`, range `^0.3.0`, tag prefix `taskboard/`.
- The local Usage Tracker entry is Git-backed at `plugins/usage-tracker`, range
  `^0.1.2`, tag prefix `usage-tracker/`; it contains no npm source object.
- Marketplace schema build passes and produces 82 entries.
- Remote PR #126 and the live catalog are still stale until the separately
  approved source release creates `taskboard/v0.3.1` and
  `usage-tracker/v0.1.2`, after which full source liveness, the marketplace
  commit/PR update, and hosted validation remain mandatory.

## Historical integrity and registry state

- All prior tracked Empirical feature files remain unchanged from release
  commit `ecc13bee4a275772ac7ac19207056d719da9057a`.
- Every collected artifact referenced by a prior feature's final attached
  evidence receipts validates: 50 artifacts checked, zero mismatches.
- Registry tombstones retain the final deletion times for all earlier versions:
  Usage Tracker `2026-08-26T23:00:13.963Z` and Taskboard
  `2026-08-26T23:00:34.123Z`; exact deleted versions return 404.

## Security review

- The structural manifest/CI finding is resolved by the expanded distribution
  guard.
- The security consult remains advisory about adding GitHub tag rulesets to
  prevent tag update/deletion. No ruleset is claimed or changed locally; it is
  a separate remote release control requiring explicit approval.

## Acceptance coverage

- AC-1/AC-2: current READMEs, changelog, and context are Git-first and free of
  retired registry distribution copy.
- AC-3: private manifests, structural hook denial, clean CI/config/credential
  surfaces.
- AC-4: both local marketplace entries use correct Git sources; public
  deployment remains explicitly gated.
- AC-5: package identity, workspaces, dependencies, lockfile, entry points, and
  build commands remain intact.
- AC-6: historical files unchanged and attached artifacts digest-valid.
- AC-7: final root check, classified audit, private refusals, marketplace build,
  and diff checks pass.
