# Taskboard Git-only distribution verification

## Source and build

- Signed receipt `executed-f19eb7b3790a9c40e46b8d5e` records the final
  `npm run check` passing against Taskboard `0.3.1` and Usage Tracker `0.1.2`.
- Taskboard: SDK contracts, TypeScript, 88/88 tests, production build, and build
  metadata verification pass.
- Usage Tracker: TypeScript, 13/13 tests, and production build pass after the
  user's superseding Git-only instruction.
- Taskboard manifest is `private: true` and has no `publishConfig`, `files`, or
  `prepack`; package name/version, BB source entries, dependencies, and build
  scripts remain valid.
- `npm publish --dry-run --ignore-scripts` reports
  `Skipping workspace bb-plugin-taskboard, marked as private` and does not
  publish.
- Usage Tracker is likewise `private: true` with no `publishConfig`, `files`, or
  `prepack`; its plugin identity/runtime/build scripts remain valid. Its dry run
  reports `Skipping workspace bb-plugin-usage-tracker, marked as private`.
- Root npm publish config and local publish credential are removed. The inert
  `.npm-publish.env` deny-only ignore entry remains to protect legacy clones.
  npm remains only the dependency/workspace/build tool.

## Active documentation

- Root and Taskboard READMEs contain no Taskboard npm badge, package URL, or
  `npm:bb-plugin-taskboard` command.
- Both lead with the exact direct Git range command using repository,
  `plugins/taskboard`, `^0.3.0`, and `taskboard/` tag prefix.
- BB Community shorthand is explicitly pending marketplace PR #126 rather than
  presented as already live.
- Usage Tracker npm badge/link/install copy is absent and its exact direct Git
  command uses range `^0.1.2`, subdirectory `plugins/usage-tracker`, and tag
  prefix `usage-tracker/`.

## Git and marketplace provenance

- Public annotated tag `taskboard/v0.3.0` peels to reviewed commit
  `3cbd919bcce696131b1cc16480c54f3049401ea9`.
- GitHub Release `taskboard/v0.3.0` is public and points users to that tag.
- Managed Git installs record their resolved tag/commit and detect later tag
  movement; hosting-administrator control remains an explicit trust assumption.
- Marketplace entry source is Git repository
  `https://github.com/MateoCerquetella/bb-plugins.git`, subdirectory
  `plugins/taskboard`, range `^0.3.0`, tag prefix `taskboard/`.
- Marketplace build produces 82 entries. PR #126 validation concluded SUCCESS
  against commit `3e7fb10535b39a5a72fd8ef45e37237d03ad02db`.
- Usage Tracker's marketplace source is prepared locally with the same
  repository, subdirectory `plugins/usage-tracker`, range `^0.1.2`, and tag
  prefix `usage-tracker/`; final liveness awaits that public tag.

## Immutable evidence

- Every historical Empirical specification/receipt path from pre-change HEAD is
  byte-unchanged.
- A receipt-artifact digest audit remains required again after capability
  integration; no historical baseline is regenerated.

## npm registry timeline

- The approved CLI unpublish attempt for Taskboard was rejected with `EOTP`.
- The user then completed npm deletion externally. Fresh registry responses now
  report Taskboard unpublished at `2026-08-26T23:00:34.123Z` and Usage Tracker
  unpublished at `2026-08-26T23:00:13.963Z`.
- No repository operation stores or retries an unpublish command, OTP, or npm
  credential. Active npm distribution surfaces for both plugins are removed.

## Acceptance coverage

- AC-1: private manifest, absent publish fields/hooks, preserved build identity.
- AC-2: Taskboard npm copy absent; exact Git/community-pending copy guarded.
- AC-3: superseded by the user's later explicit both-package removal; Usage
  Tracker runtime/build identity remains while npm distribution is removed.
- AC-4: Git-only capability delta, tag evidence, immutable receipt boundary.
- AC-5: signed root check, public v0.3.0 provenance, and prepared v0.3.1 plus
  Usage Tracker Git-release/marketplace sources pending exact remote approval.
- AC-6: initial EOTP and later registry-confirmed external deletion recorded as
  separate facts.
