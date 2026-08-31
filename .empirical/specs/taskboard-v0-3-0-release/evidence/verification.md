# Taskboard 0.3.0 release verification

Collected: 2026-08-26T17:01:59-03:00  
Source branch: `dev`  
Source base: `f3ecae77e9add2ffd649442ee880841e30fc25eb`  
Marketplace branch: `taskboard-v0.3.0-marketplace`  
Marketplace commit: `9ae222172804d7c12efd7882cd63ac0a046d7acf`

## Release identity and compatibility

- Taskboard manifest and matching root lock metadata advance from `0.2.0` to
  `0.3.0`.
- Package name, plugin identity, MIT license, BB/SDK engines, source entry
  points, branding, and full `bb` manifest object match the `0.2.0` base.
- Lock metadata is byte-equivalent after omitting its version field.
- Usage Tracker remains `0.1.2` and is not part of this release.
- Authenticated accounts are GitHub `MateoCerquetella` and npm
  `mateocerquetella`; the source remote is
  `https://github.com/MateoCerquetella/bb-plugins.git`.

## Automated source checks

- Signed Empirical command receipt
  `executed-dcce5e65b3d1ba219fa695d5` records root `npm run check` passing.
- Taskboard: SDK contract check, TypeScript, 71/71 tests, production build, and
  build-metadata verification pass as `bb-plugin-taskboard@0.3.0`.
- Usage Tracker: SDK contract check, TypeScript, 13/13 tests, and production
  build pass unchanged as `bb-plugin-usage-tracker@0.1.2`.
- Both packed app/server metadata files identify plugin `taskboard`, version
  `0.3.0`, SDK `0.4.6`, and BB `0.38.0`.
- `git diff --check` passes.

## Immutable npm archive

- Exact archive:
  `/home/dyaus/.bb/thread-storage/thr_7my6pz67bn/taskboard-v0.3.0-release/bb-plugin-taskboard-0.3.0.tgz`
- SHA-256:
  `9cec43475954d32974fc10ddbd2ec74fe5b3cd4dd18ed8626b1c8f2c974e6f38`
- npm identity: `bb-plugin-taskboard@0.3.0`; 421,683 packed bytes,
  2,416,079 unpacked bytes, 53 entries.
- The real archive was created with lifecycle scripts disabled. Its manifest,
  license, README, notices, source entries, `browse-preferences.ts`, and all
  four required JS/metadata build artifacts are present.
- Archive inspection finds no dotenv, npm credential/config, `node_modules`,
  or test path. The release command must recheck the recorded SHA-256 and
  publish this exact `.tgz` with `--ignore-scripts`; it must not repack the
  mutable workspace.

## Marketplace candidate

- Local commit `9ae222172804d7c12efd7882cd63ac0a046d7acf` is based on current
  `get-bb/marketplace:main` and has a clean working tree.
- Its only changed path is `entries/taskboard.json`, and its only content
  change is npm range `^0.1.2` to `^0.3.0`.
- The listing identity, description, author, tags, absent optional engines
  block, npm package, and `taskboard-0b77950c.svg` reference are unchanged.
- Marketplace and plugin icons have the same SHA-256
  `0b77950cec05ed35134dcc8d0c8ff96460c806106cb8e28cedeb15903ccd08ef`.
- `npm ci --ignore-scripts`, `npm run build`, and `npm run check` pass against
  82 entries. The full check will run again after npm publication and before
  the branch is pushed.

## Availability, credentials, and approval gate

- `bb-plugin-taskboard@0.3.0` is absent from npm and
  `taskboard/v0.3.0` is absent from the origin tag namespace.
- `.npm-publish.env` is ignored and untracked. It was never read into output or
  copied into evidence/archive contents. The temporary npm config contains an
  environment reference only and is outside Git.
- The publish token will be loaded only inside the one publication subshell,
  exposed to no lifecycle hook, and discarded with that process.
- No branch, commit, tag, package, GitHub release, marketplace branch, or PR has
  been pushed or created remotely for `0.3.0`.
- The source release commit and branch are deliberately finalized only after
  Empirical review/integration. Exact hashes and every remote-changing command
  must be shown to the user and approved before the first remote mutation.

## Acceptance coverage

- AC-1: manifest/lock/base invariants and unchanged Usage Tracker comparison.
- AC-2: signed build/check receipt plus real archive identity, contents,
  metadata, exclusions, and SHA-256.
- AC-3: clean one-file marketplace commit, icon hash, build, and liveness check.
- AC-4: signed root checks, npm/tag absence, and final clean-tree/release-commit
  gate after integration.
- AC-5: recorded no-remote-mutation boundary and exact-command approval gate.
- AC-6: ignored/untracked credential proof, safe archive paths, and hardened
  one-process scripts-disabled publication design.
