# Decisions: Integrate The Released Host Monitor Plugin Into Mateocerquetella Bb Plug

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Select the implementation approach

Status: Accepted

### Evidence

- Public `main` and the release branch have unrelated histories.
- `machine-monitor/v0.1.0` already points immutably at reviewed release commit
  `9db09cc35553493113f31e5352a44911ae92bc73`.
- The main-line workspace tracks plugins through `plugins/*`,
  `.bb/plugins.json`, root catalog documentation, and `package-lock.json`.

### Options

1. Merge the unrelated histories and resolve broad repository conflicts.
2. Transplant the reviewed plugin directory onto a branch from `main` and
   adapt only workspace/distribution metadata.
3. Leave Host Monitor exclusively on the release tag and agent branch.

### Chosen approach

Choose option 2: copy the reviewed release source onto a focused branch from
`main`, then update the collection, catalog, notices, and dependency lock.

### Trade-offs and risks

The main-line copy will be a new commit rather than preserving the release
branch's internal commit ancestry. The immutable release tag preserves the
audited v0.1.0 history. Repository-specific script and development dependency
adaptations may make the tracked manifest differ from v0.1.0; those changes are
limited to future main-line development and must pass the full workspace
contract.

### Verification

Compare plugin source coverage, verify collection/catalog/notices/lockfile
updates, run focused and root checks, exercise the local plugin in BB, and
inspect a focused PR diff based on `main`.

## D-002: Keep Host Monitor's required BB toolchain isolated

Status: Accepted

### Evidence

- Existing main-line plugins pin BB 0.38 / plugin SDK 0.4.6.
- Released Host Monitor requires BB 0.40 / plugin SDK 0.4.21 and uses a host
  worker plus APIs unavailable in the older surface.
- npm workspaces can retain package-specific development dependency versions.

### Options

1. Downgrade Host Monitor to the BB 0.38 API.
2. Upgrade Taskboard and Usage Tracker as part of this integration.
3. Preserve Host Monitor's 0.40/0.4.21 requirements in its workspace and prove
   coexistence with the root check.

### Chosen approach

Choose option 3. Add the compatible BB 0.40 build tool to Host Monitor only,
retain its exact SDK pin, and leave existing plugins unchanged.

### Trade-offs and risks

npm may hoist one compatible toolchain copy or retain nested copies. The
workspace scripts clear `BB_CLI`, so resolution must come from the installed
workspace graph. Any incompatibility is a blocking root-check failure rather
than a reason to weaken Host Monitor's manifest.

### Verification

Inspect the lockfile's workspace-specific dependency records, run Host
Monitor's complete check, then run every workspace through root `npm run
check`.

## D-003: Preserve TypeScript/TSX test resolution

Status: Accepted

### Evidence

- The release suite runs under Bun and includes dynamic TSX imports plus
  production `.js` specifiers that resolve to TypeScript source during tests.
- Node 22's built-in type stripping does not load `.tsx` or remap those `.js`
  specifiers, leaving six tests unresolved while 112 others pass.

### Options

1. Rewrite production/test import specifiers for Node's limited stripper.
2. Require Bun in the npm-workspace repository.
3. Add the dev-only `tsx` loader and retain Node's test runner/coverage.

### Chosen approach

Choose option 3. Preload `tsx` into Node's test runner and register a tiny
test-only ESM loader that replaces CSS-module imports with an empty module.
This preserves production `.js` specifiers, TSX imports, and the complete
144-test suite without requiring Bun or emitting an experimental-loader
warning.

### Trade-offs and risks

This adds one development dependency and its lockfile graph. It ships in no
plugin artifact. The exact integration is proved by focused and root checks.

### Verification

Run Host Monitor's complete check and confirm all 144 tests pass before the
build step.
