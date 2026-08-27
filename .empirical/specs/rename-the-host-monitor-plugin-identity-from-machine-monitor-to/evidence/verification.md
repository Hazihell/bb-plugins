# Verification evidence

Collected: 2026-08-27T00:11:27-03:00  
Branch: `feat/rename-host-monitor`  
Base commit: `fc4a1b9d66f8b9707874663b08b754edcf1a1c64`

## Canonical identity and repository checks

- The marketplace helper derives `host-monitor` from
  `plugins/host-monitor/package.json` (`bb-plugin-host-monitor`).
- The plugin directory, collection entry, homepage/repository directory,
  keyword set, root/leaf docs, notices, install/update/remove commands,
  fallback route, fake host ids, RPC paths, JSX/CSS selectors/keyframes, and
  npm workspace/lock records all use the new identity.
- The active product/repository scan outside `.empirical` reports zero literal
  retired compound-id matches. The plugin's new regression test constructs the
  retired string at runtime and scans every active text file so a future match
  fails the suite without embedding the literal itself.
- `npm install` completed with zero vulnerabilities. `package-lock.json` differs
  only in the workspace package/path and its nested path keys.
- Focused `npm run check --workspace bb-plugin-host-monitor` — PASS: SDK check,
  TypeScript, 145/145 tests, and server/app/host build.
- Root `npm run check` — PASS across Host Monitor, Taskboard, and Usage Tracker.
- Generated server/app/host metadata all report plugin id `host-monitor`, BB
  `0.40.0`, and plugin SDK `0.4.21`.
- `npm pack --dry-run --json --workspace bb-plugin-host-monitor` — PASS: package
  `bb-plugin-host-monitor@0.1.0`, 37 expected files, including three sanitized
  screenshots and every built artifact.
- `git diff --check` — PASS; generated `dist/` and `node_modules/` remain
  ignored and untracked.

## Live Bun development mirror

The non-Git live source was renamed separately without overwriting its
deliberate Bun/publication manifest shape. `bun install` regenerated
`bun.lock`; the source, docs, icon map, package, selectors, routes, and tests
contain no retired compound id.

- Focused Host Monitor typecheck, 144/144 Bun tests, and build — PASS.
- Root `bun run test` — PASS, including 106 workspace-script tests and every
  plugin suite.
- Root `bun run lint` — exit 0 with the same eight unrelated warnings.
- Root `bun run build` — PASS for every plugin.
- The root parallel typecheck fan-out was attempted three times under unrelated
  host memory pressure and the OS killed varying TypeScript workers with 137.
  Every worker killed in those attempts (`agent-proxy`, `gh-stack`, `dotfiles`,
  `pr-walkthrough`, and `agentation`) then passed its identical focused
  typecheck sequentially; every other workspace, including Host Monitor,
  passed in the root attempts.

## Settings-safe local BB cutover

Before mutation, the retired local id had no secrets, schedules, database, or
KV state and these non-secret settings:

- threshold colors: `true`
- attention threshold: `70`
- critical threshold: `85`

With no process confirmation/action open, the old id was disabled and verified
as `disabled` with zero services. The new local path was installed as
`host-monitor`, then configured in safe order (colors, attention, critical).
All four enrolled hosts were connected during cutover, and BB's disable
lifecycle disposed the old frontend/server generation before the new install.
The host entry owns no timer, watch, or retained lease.

The new plugin then completed more than two ten-second sampling cycles, showed
4/4 connected, accumulated 106 successful handler calls with zero errors, and
kept exactly one running `machine-sampler`. Only after browser verification was
the disabled retired registration removed. Final inventory contains one enabled
running `host-monitor` and no installed retired id; the three settings still
match exactly.

## Live browser walkthrough

The real BB browser opened `/plugins/host-monitor/machines` with four populated
hosts. Network/resource inspection found only `/api/v1/plugins/host-monitor/*`
icon, settings, dashboard, preferences, and process requests; no retired route,
asset, RPC request, or CSS class existed.

- Cards rendered with masked IPs, RAM used/total, green/attention/critical
  percentage tones at the migrated 70/85 cutoffs, red download, and blue upload.
- Rows toggled on and back to cards with native pressed state and no horizontal
  overflow in the exercised compact panel.
- A populated host inspector retained masked-address default and full telemetry.
- Processes loaded only for the selected host; search filtered to `node`, RAM
  sort became selected, and protected/available controls remained clear. No
  process action or confirmation was invoked.
- The circular sidebar control opened its populated summary; clicking the page
  outside changed `aria-expanded` to false and removed the popover.
- The floating monitor opened with CPU/RAM/download/upload metrics, its titlebar
  took keyboard focus, `ArrowLeft` moved it exactly 10px, and its close control
  dismissed it.
- Visiting `/plugins/machine-monitor/machines` produced BB's normal unavailable
  panel with no old plugin asset request or redirect.

The exact live screenshot was masked to `Host 1` through `Host 4` before
capture. Manual image inspection plus local OCR found only those fixture names,
masked IPs, ordinary OS labels, percentages, and rates—no real hostname,
username, process/PID, path, project/thread, credential, or address. Artifact:
`live-host-monitor-identity.png`,
`sha256:aecf84e650a9d838cd79e6a60f63551c979c0aadb0775aef9b56a1beb0b78ad7`.

## Release and marketplace preparation

- Legacy tag absence/mutation check: annotated object `0d77d210…` still peels
  to `9db09cc35553493113f31e5352a44911ae92bc73`.
- No `host-monitor/v0.1.0` tag exists yet; creation remains blocked on separate
  release approval and will be bound to the final reviewed commit.
- A clean local checkout of marketplace PR #128's branch renames the entry and
  unchanged-hash icon to `host-monitor`, sets subdirectory/prefix to
  `plugins/host-monitor` / `host-monitor/`, and keeps range `^0.1.0`.
- Marketplace `npm ci --ignore-scripts` and `npm run build` pass with zero
  vulnerabilities and 83 entries.
- Pre-release `npm run check` fails exactly as expected: the new tag is not
  public yet, while unrelated Taskboard and Usage Tracker entries still point
  at packages unpublished on 2026-08-26. No remote branch, tag, or PR mutation
  has occurred.

## Security advisory closure

- Cutover race: all four hosts were connected; old frontend/service lifecycle
  was fully disabled with zero services before install; no pending process
  operation existed; new requests/classes were inspected; old registration was
  kept disabled through two refresh cycles before removal.
- Screenshot disclosure: exact bytes were masked, viewed manually, OCR-audited,
  and hashed as described above.
- Tag integrity: the new tag is proven absent, approval will bind its exact
  peeled commit, the push will not use force, and both peeled refs will be
  verified immediately. Repository tag-rule creation is a separate owner
  policy decision and not silently broadened into this rename.

## Acceptance coverage

- AC-1/AC-2: derived id, directory/package/collection/route/selectors/tests,
  generated metadata, lockfile, and zero-match active scan.
- AC-3: root/leaf documentation, living context, notices, source/dev/install
  commands, and new prefix; historical records remain truthful.
- AC-4: exact settings snapshot, disabled-first cutover, two-cycle validation,
  one sampler, and retired registration removal.
- AC-5: focused/root canonical checks, Bun mirror checks, pack dry-run, and
  ignored-output/diff hygiene.
- AC-UI-1: real browser route, UI interaction sweep, network/class inspection,
  retired-route check, and sanitized screenshot.
- AC-6: old peeled ref preserved and new exact release namespace prepared but
  not published before approval.
- AC-7: repository and marketplace mutations are locally prepared and remain
  conditional on separate approval; neither PR will be merged by this workflow.
