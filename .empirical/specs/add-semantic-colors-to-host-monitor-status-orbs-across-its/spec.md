# Add Semantic Colors To Host Monitor Status Orbs

## Request

> Add semantic colors to Host Monitor status orbs across its compact popover and relevant host rows: connected healthy green, attention yellow, critical red, and offline/disconnected muted gray, with loading/unknown remaining neutral. Preserve visible text and accessible state labels so color is never the only signal. Add focused regression coverage, bump Host Monitor from 0.1.1 to 0.1.2 across active manifest/lock/documentation/distribution contracts, run focused and root checks, keep the local watcher/install live, and verify the real BB UI with a screenshot. Do not commit, push, tag, publish, release, or update the marketplace.

## Goal

Make every per-host status orb in Host Monitor communicate the same semantic
state at a glance without replacing the visible status copy or assistive
meaning. Healthy connected hosts use BB's success color, attention states use
warning, critical states use destructive, and disconnected/offline or
unavailable/loading states remain neutral gray. Prepare the local Host Monitor
patch as `0.1.2` and exercise that exact installed version in BB.

## Acceptance Criteria

- [ ] [AC-1] Compact and floating Host Monitor rows expose the computed host
  tone and render healthy as success green, attention/stale/error as warning
  yellow, critical as destructive red, and offline/disconnected as muted gray;
  sampling and unavailable/unknown states remain neutral rather than green.
- [ ] [AC-2] Dashboard list, table, card, and health-badge status orbs apply the
  same semantic mapping, with disconnected state taking precedence over any
  stale health value and card halos remaining visually restrained.
- [ ] [AC-A11Y-1] Color is additive only: per-host Connected/Disconnected and
  health/freshness labels remain visible, decorative dots remain hidden from
  assistive technology, and no status meaning is available only through color.
- [ ] [AC-3] The previously removed notification/status dot on the movable
  Host Monitor sidebar trigger remains absent, while its dynamic accessible
  label, title, click behavior, and drag behavior remain unchanged.
- [ ] [AC-4] Host Monitor reports `0.1.2` in its manifest, workspace lock
  record, direct Git install documentation, distribution guards, generated
  metadata, and live BB plugin inventory; Taskboard and Usage Tracker release
  versions remain unchanged.
- [ ] [AC-5] Focused regression tests cover tone propagation, semantic token
  selectors, disconnected precedence, neutral fallbacks, accessible text, and
  the continued absence of the trigger notification dot.
- [ ] [AC-6] Focused Host Monitor checks and root typecheck, test, lint, and
  required build checks pass without changing unrelated user work.
- [ ] [AC-UI-1] [UI] The locally installed Host Monitor `0.1.2` renders the
  semantic orbs in the real BB UI and the result is captured in a screenshot.

## Scope

- Host Monitor compact popover and floating monitor host-row dots.
- Host Monitor dashboard table/list identity dots, host-card dots, and the dot
  inside health badges.
- Focused source/CSS regression coverage and existing pure presentation tests.
- Host Monitor-only `0.1.1` to `0.1.2` release-preparation surfaces.
- Local path installation, watcher reload, live UI exercise, and screenshot.

## Non-goals

- Reintroducing or recoloring the movable sidebar trigger notification dot.
- Recoloring numeric CPU/RAM/disk readings or changing the user's threshold
  color preference; semantic host-status orbs are not gated by that setting.
- Coloring Connected/Disconnected or health-label text; only decorative orbs
  change color.
- Changing health thresholds, sampling, connection detection, fleet sorting,
  filtering, host actions, or the hidden sidebar accessory.
- Committing, pushing, tagging, publishing, creating a release, or updating
  marketplace metadata.

## Risks

- A disconnected machine may retain a stale critical health value; compound
  selectors and tone precedence must force it to neutral gray.
- `unavailable` is a valid health value and must not fall through to healthy.
- The threshold-color preference controls numeric readings only; gating status
  orbs behind it would make connectivity/severity presentation inconsistent.
- Color alone is insufficient, so visible text and existing accessible labels
  must remain intact and decorative dots must stay `aria-hidden`.

## Verification

- Run Host Monitor's focused typecheck and test suites while iterating.
- Assert source tone propagation and semantic CSS token mappings, including
  neutral/disconnected precedence and the dot-free trigger regression.
- Run root typecheck, test, lint, and build because the manifest and frontend
  bundle change.
- Confirm generated Host Monitor metadata and BB's live plugin inventory both
  report `0.1.2` from the consolidated local path.
- Open the affected Host Monitor surfaces in real BB, inspect the rendered
  states, and capture a screenshot.
- Run an independent final-tree review and `git diff --check` before handoff.

## Capability Deltas

- `deltas/host-monitor-sidebar.md`
- `deltas/host-monitor-fleet-presentation.md`
- `deltas/plugin-git-distribution.md`
