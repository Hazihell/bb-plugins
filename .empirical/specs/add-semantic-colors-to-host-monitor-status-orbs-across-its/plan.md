# Plan: Semantic Host Monitor Status Orbs

## 1. Add focused regression expectations

- Extend `plugins/host-monitor/test/sidebar-summary.test.ts` to require explicit
  offline/unavailable fallback handling, tone stamping in both row builders,
  the complete semantic CSS mapping, visible state text, decorative dots, and
  continued absence of the trigger pseudo-element.
- Extend `plugins/host-monitor/test/app-registration.test.ts` to require tone
  propagation into cards, a dedicated health-badge indicator hook, semantic
  selectors for all dashboard orb contexts, faint card halos, and disconnected
  neutral precedence.
- Extend `plugins/host-monitor/test/fleet-presentation.test.ts` with explicit
  critical, unavailable/sampling, and disconnected/offline cases where current
  coverage is incomplete.
- Run the focused Host Monitor suite and confirm the new source/CSS guards fail
  before implementation for the intended reasons.

Coverage: AC-1, AC-2, AC-A11Y-1, AC-3, AC-5.

## 2. Propagate semantic tones into rendered orbs

- Harden `machineTone()` in
  `plugins/host-monitor/lib/sidebar-host-monitor.ts` so explicit offline and
  unavailable states cannot fall through to healthy.
- Stamp the derived tone on compact and floating host rows without changing
  their text or `aria-hidden` dots.
- In `plugins/host-monitor/app.tsx`, add the existing presentation tone to card
  identity dots and give the health-badge dot a dedicated class while keeping
  the sampling spinner and neutral label.

Coverage: AC-1, AC-2, AC-A11Y-1, AC-3.

## 3. Apply consistent semantic CSS

- In `plugins/host-monitor/app.css`, map healthy, attention, and critical orbs
  to the existing success/warning/destructive tokens.
- Keep offline, disconnected, loading, unavailable, and unknown states neutral.
- Require connected state on dashboard/card semantic selectors and place the
  disconnected rule last so it wins.
- Use a faint same-tone halo only on connected host-card orbs; leave label text
  neutral and keep all orb rules outside threshold-preference gates.

Coverage: AC-1, AC-2, AC-A11Y-1, AC-3, AC-UI-1.

## 4. Prepare Host Monitor 0.1.2 locally

- Bump the Host Monitor manifest and its single workspace lock record.
- Update root and Host Monitor README Git ranges, Empirical active commands,
  shared distribution guards, and the current Git-distribution capability.
- Preserve historical Empirical specs and all Taskboard/Usage Tracker versions.
- Let the watcher rebuild/reload and reinstall the same local path only if
  needed to refresh BB's inventory version.

Coverage: AC-4.

## 5. Verify focused and repository-wide behavior

- Run focused Host Monitor typecheck and test suites.
- Run root typecheck, test, lint, and build.
- Inspect watcher output/logs, generated app/server/host metadata, installed
  source path/version/status, and `git diff --check`.
- Refresh Empirical context through the workflow-provided mechanism rather
  than editing its manifest manually.

Coverage: AC-4, AC-5, AC-6.

## 6. Exercise the real BB UI and capture evidence

- Open Host Monitor's compact/floating and dashboard surfaces in the shared BB
  browser.
- Verify semantic connected and neutral disconnected/unresolved states where
  runtime data permits, visible labels, restrained card halo, and the dot-free
  movable trigger.
- Capture screenshots and record the exact runtime limits if the live fleet
  cannot naturally show every severity at once.

Coverage: AC-A11Y-1, AC-3, AC-UI-1.

## 7. Independent review and Empirical closeout

- Run the required verification/review specialists against the final tree.
- Resolve blocking findings, record evidence/receipts, integrate capability
  deltas, and ensure no remote/release/marketplace mutation occurred.

Coverage: all acceptance criteria.
