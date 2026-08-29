# Verification evidence

## Implemented behavior

- Rejected status chips were replaced by quiet inline status: a visible state
  word plus a small semantic orb, with no border, fill, radius, fixed pill
  height, or horizontal padding.
- Critical and Needs attention words use contrast-safe foreground mixes while
  Healthy text remains neutral and the small orbs retain BB's raw success,
  warning, and destructive colors.
- All, Attention, and Offline are underline filters in a labelled fieldset with
  pressed state, focus treatment, and explicit result-region ownership.
- Every page card/row and compact/floating host remains on a neutral BB surface.
  No health state receives a colored edge, background, border, or shadow.
- The compact summary is a labelled `dl`, and compact host rows show health or
  freshness before Connected/Disconnected.
- Page host buttons expose a neutral Radix tooltip on hover/focus. Compact and
  floating hosts remain native focusable described list items with a neutral in-surface
  explanation. Fresh resource alerts use only a closed metric/severity mapper
  plus validated bounded percentages; other states use fixed text, and raw
  alert/error strings are never rendered in explanations or the inspector.
- The permanent Host Monitor icon remains neutral with no notification dot.
- The Processes fixed tab now uses valid `ChartColumn`; both manifest
  descriptions disclose guarded controls to stop eligible user processes.

## Automated verification

- Host Monitor typecheck passed.
- The complete Host Monitor suite passed, including rail-negative CSS/source
  contracts, safe explanation precedence, malformed alert fallbacks, and a raw
  error containing markup, a filesystem path, and secret-like sentinels.
- Root `npm run check` passed through an immutable Empirical QA receipt. It ran
  every workspace SDK check, typecheck, complete test suite, and production
  build without changing the source tree.
- The repository has no configured lint script. The sibling workspace's pinned
  `oxlint` binary ran directly over all changed Host Monitor TypeScript/TSX
  files and returned zero findings.
- `npm install` refreshed the workspace installation metadata with zero
  vulnerabilities; `npm ls --workspace bb-plugin-host-monitor --depth=0`
  resolves Host Monitor as `0.1.2` with SDK `0.4.21` and BB `0.40.0` tooling.
- `npm pack --dry-run --workspace bb-plugin-host-monitor --json` succeeded for
  `bb-plugin-host-monitor@0.1.2` with the expected 37-file source/build closure
  and created no tarball.
- `git diff --check` passed.

## Version, build, and runtime coherence

- Manifest, lockfile, root and leaf Git-install docs, distribution guards, and
  active capability contracts report Host Monitor `0.1.2`.
- Production `dist/app.meta.json`, `dist/server.meta.json`, and
  `dist/host.meta.json` all report plugin id `host-monitor`, plugin version
  `0.1.2`, BB `0.40.0`, and SDK `0.4.21` after the final production build.
- BB runs `host-monitor@0.1.2` from the consolidated local path with null status
  detail and the `machine-sampler` service running. The live development bundle
  is compatible with the host's SDK `0.4.23`; release metadata remains pinned to
  the manifest's SDK `0.4.21`.

## Real BB browser walkthrough

- Page status words computed borderless with transparent backgrounds.
- Raw indicator colors computed as critical `rgb(210, 15, 57)`, attention
  `rgb(223, 142, 29)`, and healthy `rgb(64, 160, 43)`, while Healthy text
  computed to the neutral foreground.
- Light-theme semantic text measured Healthy 4.62:1, Attention 4.99:1, and
  Critical 6.9:1 against the active BB surface. An isolated dark-reference
  fixture measured a minimum of 8.83:1 without changing the user's theme.
- Filters were borderless, transparent, visibly underlined when selected, and
  all controlled `host-monitor-fleet-results`.
- Critical, Needs attention, and Healthy cards/rows all computed with
  `::before` content `none`; page cards shared the same neutral background and
  border, and idle compact rows stayed transparent.
- The compact summary rendered as `DL` with accessible name `Fleet summary`.
  Host rows rendered `Critical Connected`, `Needs attention Connected`, and
  `Healthy Connected` in health-first order as the live fleet changed.
- Hovering a page host opened a portaled neutral tooltip with closed concrete
  copy such as `Disk usage is high at 94%, above the critical threshold.`
  Focusing a compact host revealed
  the same reason; every row retained native list-item semantics while remaining
  focusable and linked by `aria-describedby`.
- The compact popover's Tab loop reached host rows, refresh replaced the DOM
  while restoring the exact focused host id, and mixed pointer/focus sequences
  kept the shared tooltip visible until neither activation remained. The visual
  tooltip is body-level and viewport-positioned, so scrolled middle rows are not
  clipped by the popover scrollport.
- The global icon computed to BB's muted foreground and its `::after` content
  remained `none`.

Final screenshots:

- `host-monitor-0.1.2-rail-free-card-explanation.png`
- `host-monitor-0.1.2-rail-free-sidebar-explanation.png`

The live fleet had no offline host. No machine was deliberately disconnected;
executable tests cover disconnected/offline/loading/unavailable/malformed
fallbacks, safe explanation copy, raw-error exclusion, and universal rail
absence.

## Marketplace preparation

- A local PR #128 entry description now discloses guarded stop controls while
  retaining the compatible `^0.1.0` range.
- A detached checkout based on current Marketplace main passed `npm ci`,
  `npm run build`, `npm run check`, and `git diff --check` with 88 entries.
- No commit, push, tag, publication, GitHub Release, PR edit, comment, re-review
  request, or other remote mutation was performed.

## Criterion mapping

- AC-1, AC-2: state and explanation derivation, source/CSS tests, full suite,
  computed styles, and real-BB page/popover screenshots.
- AC-A11Y-1: visible state text, decorative `aria-hidden` indicators, labelled
  filters/summary, described focusable compact hosts, Radix focus triggers,
  text-only explanation sinks, keyboard semantics, and computed contrast.
- AC-3: trigger regressions plus live neutral icon and absent pseudo-element.
- AC-4: manifest/lock/docs/guard/capability checks, production metadata, and
  live installed inventory.
- AC-5: focused disconnected, unavailable, sampling, and malformed-state
  regressions.
- AC-6: focused and root checks, direct lint, install audit, package dry-run,
  metadata inspection, and diff check.
- AC-UI-1: real BB rail-negative computed styles, exercised page/sidebar
  explanations, and two final screenshot artifacts.
