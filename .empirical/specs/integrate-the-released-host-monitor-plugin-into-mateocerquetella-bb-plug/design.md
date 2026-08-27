# Design: Main-line Host Monitor Integration

## Overview

Create a focused branch from the public repository's current `main` and copy
the reviewed Host Monitor plugin directory from release commit
`9db09cc35553493113f31e5352a44911ae92bc73`. Do not merge the unrelated
release-branch history. Preserve product source and tests, exclude generated
output, and adapt only repository-level development/distribution metadata.

## Source boundary

- Copy `plugins/machine-monitor/**` from the reviewed release workspace.
- Exclude `dist/`, `node_modules/`, and other generated output.
- Preserve package version `0.1.0`, plugin id `machine-monitor`, source entry
  points, UI/assets/screenshots, tests, license, and leaf notices.
- Do not change the public `machine-monitor/v0.1.0` tag or marketplace PR #128.

## Main-line manifest adaptation

Host Monitor becomes a Git-only tracked workspace package, matching the active
repository distribution policy:

- Set `private: true` and remove npm publication configuration.
- Point the homepage to the main-line plugin directory for ongoing source
  tracking; released README installation remains Git/tag based.
- Replace the branch's Bun-specific dev script with this repository's npm/BB
  conventions.
- Add `types:check`, `types:refresh`, and `check` scripts.
- Preload the dev-only `tsx` loader into Node's test runner so TSX modules and
  source `.js` specifiers resolve without product-source rewrites; register a
  test-only CSS loader through `node:module` for the app registration test.
- Add a compatible `bb-app` 0.40 development dependency while retaining the
  exact `@get-bb/plugin-sdk` 0.4.21 pin required by Host Monitor.
- Clear `BB_CLI` for build/type-generation commands so the workspace toolchain
  is authoritative.

## Repository integration

- Add `{ "name": "machine-monitor", "source":
  "./plugins/machine-monitor" }` to `.bb/plugins.json`.
- Add Host Monitor to the root README catalog, a Git-release quick start,
  source-build/local-install examples, and collection install examples.
- Keep those paths visually distinct: the immutable Git release is the primary
  user quick start; collection installation is a separate repository feature;
  local-path installation belongs only in the contributor/source section.
- Extend root third-party notices with Host Monitor's Hugeicons and Zod
  attribution, while retaining the detailed leaf notice.
- Run `npm install` to update `package-lock.json` with the workspace and its
  dependency graph.

## Verification

1. Confirm the copied source excludes generated files and retains all released
   package files.
2. Run `npm run check --workspace bb-plugin-machine-monitor`.
3. Run root `npm run check`.
4. Run `git diff --check` and inspect the focused branch diff.
5. Install the copied local path in BB and record a concrete UI evidence
   checklist without exposing hostnames, IPs, usernames, or process details:
   - Dashboard cards visible and styled at the normal BB panel size.
   - Cards/Rows toggle changes the fleet layout without clipping.
   - Selecting a host opens populated details with masked IP.
   - Processes opens a populated, searchable/sortable ledger.
   - Sidebar control opens and dismisses its summary.
   - Float monitor opens, moves, and closes with its metric layout intact.
   Record the interaction, visible result, active build/reload state, and
   screenshot or browser artifact for each exercised surface.
6. Confirm styles, icons, spacing, scrolling, and overlays have no missing
   assets, clipping, or packaging regressions.
7. Verify `machine-monitor/v0.1.0` still peels to `9db09cc` and marketplace PR
   #128 still references the same Git range.

## Delivery

Commit only the plugin transplant, repository integration, lockfile, and
Empirical records. Push a new main-based branch and open a pull request to the
user-owned repository. Do not merge it.

## Risks and mitigations

- **Toolchain coexistence:** Existing plugins use BB 0.38 while Host Monitor
  requires BB 0.40. Let npm retain per-workspace dependency requirements and
  prove all workspaces through the root check.
- **Generated-file leakage:** Copy with explicit exclusions and verify Git
  status before commit.
- **Distribution drift:** Keep install documentation Git-only and preserve the
  immutable release tag/marketplace source.
- **Behavioral regression:** Avoid product-source edits; repository adaptations
  stay confined to manifest scripts/distribution fields and root integration.
