# Independent code review

- Verdict: `integration-ready`
- Baseline: `HEAD == origin/main == 203f910676d6ba9d1f1da1d58affc8f9d307645e`
- Scope: the complete tracked working-tree diff, the active Empirical contract,
  decisions, capability deltas and evidence receipts, plus relevant product,
  test, manifest, lockfile, documentation, changelog and generated metadata
  surfaces

No blocking correctness, accessibility, preservation, versioning, or
distribution finding remains. The reviewed product tree is ready for
Empirical's clean-target integration replay.

## Ordered findings

### 1. Low — the two new UI regressions are source guards, not behavioral component tests

- Locations:
  - `plugins/taskboard/test/app-ui.test.ts:7-15`
  - `plugins/host-monitor/test/sidebar-summary.test.ts:405-421`
- Impact: the Taskboard test proves that the scoped function contains the
  expected accessible-label and `Ticket` source, but it does not itself render
  the registered header action, activate it, or inspect pin persistence and
  `openThreadPanel`. The Host Monitor test rejects the current trigger
  `::after` selector and finds label/title assignments in source, but it does
  not itself mount the content script and inspect every trigger state.
- Recommendation: when these plugins adopt a compatible frontend/content-
  script harness, query the Taskboard button by role and accessible name,
  assert the rendered `data-icon="Ticket"`, activate it, and inspect navigation
  plus stored pin state; mount Host Monitor and assert computed pseudo-element
  output plus its dynamic accessible name across representative states.
- Disposition: non-blocking. The production hunks are minimal, the surrounding
  interaction code is unchanged, focused suites pass, and the collected live
  browser evidence independently covers render, activation, computed style,
  popover behavior, Escape, and focus return.

## Review observations (not defects at this milestone)

- The three development watchers have regenerated ignored `dist/` app/host
  metadata against the running BB SDK `0.4.23`, while pinned production server
  metadata remains on the manifest toolchains (`0.4.6` for Taskboard/Usage
  Tracker and `0.4.21` for Host Monitor). Every metadata file still has the
  correct plugin id and release version. These ignored watcher artifacts are
  not part of the Git-only product tree; the immutable root-check receipt
  records the pinned production build. A future separately authorized artifact
  package should rebuild with `BB_CLI` cleared immediately before inspection or
  packing.
- The `^0.3.2`, `^0.1.1`, and `^0.1.4` Git ranges intentionally have no remote
  tags yet. D-001 explicitly accepts these local preparatory references, and
  AC-3 forbids creating the tags in this task. They are a later release gate:
  do not make the updated install documentation public without the authorized
  immutable tags (or an explicit preparatory caveat).
- Review and clean-target replay were necessarily absent while revision 8 was
  waiting in the review phase. This consult supplies the independent review;
  the integration replay and durable integration receipt remain the next
  workflow step rather than a missing implementation artifact.

## Criterion coverage

### AC-1 — Pass

- `HEAD`, the local remote-tracking ref, and GitHub main resolve to `203f910`.
- Merge commits for PR #18 (`3893ed8`), PR #20 (`daffcd4`), and PR #21
  (`203f910`) are present in the baseline.
- PR #20's behavior files (`app.css`, `lib/sidebar-strip.ts`,
  `lib/sidebar-usage.ts`, `lib/usage.ts`, and `test/usage.test.ts`) are
  byte-identical to the merged implementation. The working patch changes only
  Usage Tracker release metadata and documentation.

### AC-2 — Pass

- Taskboard `0.3.2`, Host Monitor `0.1.1`, and Usage Tracker `0.1.4` agree in
  the three manifests, exactly three workspace records in `package-lock.json`,
  root/leaf release-facing documentation, active context commands,
  distribution guards, the Usage Tracker changelog, live BB inventory, and
  every generated metadata file's `pluginVersion`.
- The lockfile has no dependency, resolution, integrity, engine, or graph
  change. `npm ls --all --depth=0` succeeds.
- `npm pack --dry-run` finds complete source closures for all three plugins;
  the packages remain private and the release path remains Git-only.

### AC-3 — Pass

- All three manifests remain `private: true`; no npm publication hook,
  registry credential path, marketplace edit, or permissive CI publication
  authority was added.
- No candidate commit, push, future patch tag, GitHub Release, marketplace
  mutation, or remote feature branch exists. Existing tracked Empirical
  history and capability records are unchanged.

### AC-UI-1 — Pass

- `TaskboardThreadHeaderAction` changes only the typed glyph from `PanelRight`
  to the existing `Ticket` mapping. The semantic button, 28px control/16px
  glyph sizing, accessible label, tooltip, pin storage, panel-open call, and
  failure toast are unchanged. The unrelated internal sidebar-collapse
  `PanelRight` remains intact.
- Browser evidence confirms `data-icon="Ticket"` and the hide, activate,
  open, and pin transition.

### AC-UI-2 — Pass

- The movable Host Monitor trigger's base, error, empty, loading, and reduced-
  motion `::after` rules are removed without changing its click/drag/content-
  script implementation.
- Dynamic `aria-label`, title, dialog relationships, popover and floating
  monitor behavior remain in source. Live evidence checks a non-normal state,
  computed `::after` content of `none`, and a working populated popover.

### AC-UI-3 — Pass

- The complete PR #20 implementation is preserved: current and legacy provider
  keys, current-key precedence, provider-local omission errors, configured
  Weekly/Five-hour compact selection, all additional windows, last-known
  reconciliation, responsive details, Escape and focus return.
- The focused 23-test Usage Tracker suite and collected live browser/RPC
  evidence cover these behaviors. D-002 correctly retains the accepted
  Weekly/Five-hour semantics rather than adding the out-of-scope window-count
  redesign.

### AC-4 — Pass

- A fresh read-only `bb plugin list/source` check reports all three plugins
  running from this exact consolidated checkout, with versions `0.3.2`,
  `0.1.1`, and `0.1.4`, null status details, Taskboard's sync service running,
  and Host Monitor's machine-sampler service running.
- The three requested development watcher processes remain active.

### AC-5 — Pass for review; integration replay is next

- The immutable root `npm run check` receipt passed SDK checks, typechecks, all
  111 Taskboard tests, 146 Host Monitor tests, 23 Usage Tracker tests,
  production builds, and Taskboard metadata verification on the final product
  tree. Receipt artifact hashes match the files on disk.
- Independent review reran the changed Taskboard UI/distribution tests (20/20),
  Host Monitor sidebar suite (31/31), Usage Tracker suite (23/23), and all
  three plugin typechecks; `git diff --check`, `npm ls`, and all three pack
  dry-runs pass.
- The screenshots and verification record match their collected receipt
  digests. This consult finds no accepted-decision contradiction: D-001's
  preparatory release posture, D-002's compact-limit semantics, and D-003's
  deliberately neutral Host Monitor trigger are all implemented as accepted.

## Final assessment

The exact diff preserves merged main and PR #20 behavior, introduces only the
two intended presentation changes plus coherent local patch-release metadata,
keeps the plugins private/Git-only, and has adequate automated and live
evidence. The low test-fidelity advisory does not justify another
implementation cycle. Verdict: `integration-ready`.
