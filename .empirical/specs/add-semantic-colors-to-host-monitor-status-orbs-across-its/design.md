# Design: Semantic Host Monitor Status Orbs

## Overview

Use Host Monitor's existing health/freshness presentation logic as the single
source of truth, carry the derived tone onto each orb's DOM context, and map
that tone to the semantic CSS variables already used for threshold readings.
The implementation changes presentation only; it does not alter how health,
connectivity, or samples are calculated.

## State and precedence

The compact/floating sidebar uses `machineTone(machine)`. Its precedence is:

1. A disconnected host or explicit offline health is `offline`.
2. An actively sampling host is neutral (`loading`).
3. A stale or failed sample is `attention`, even when its current health value
   is unavailable.
4. Fresh critical and attention health retain those severities.
5. A fresh unavailable host is neutral (`loading`).
6. Only a known fresh healthy state is `healthy`.

The React dashboard continues to use `machineBadgePresentation(machine)`,
which already maps sampling to unavailable, stale/error to attention, and
fresh readings to their health. Every colored dashboard selector also requires
`data-connected="true"`; the later disconnected selector forces gray if a host
retains a stale attention/critical tone.

## Rendering changes

### Compact and floating monitor

Both `compactHostRow()` and `floatingHostRow()` assign
`row.dataset.tone = hostMonitorSidebarMachineTone(machine)`. Existing status dots stay
`aria-hidden="true"`, while row copy continues to render the host name,
Connected/Disconnected where present, and health/freshness label. The compact
summary becomes one inline semantic definition list rather than three boxes.
Compact rows make health the primary trailing word, connection state the
secondary word, and add a thin attention/critical rail without adding chrome.

### Fleet dashboard

- `MachineIdentity` already exposes `data-connected` and `data-tone`; CSS begins
  honoring both.
- `CardMachineIdentity` receives the same derived tone and exposes it beside
  `data-connected`. Its compact halo uses a very low-opacity mix of the same
  semantic token so the orb remains the primary signal.
- `HealthStatus` is a borderless inline dot-plus-label treatment. It keeps the
  state word visible, uses semantic text/orb color for recognized connected
  health, and remains muted for disconnected or unresolved states. Sampling
  uses its existing spinner and does not render a status dot.
- Card, compact-list, and desktop-row containers expose the normalized tone for
  their internal dot and word only. No container receives a semantic edge,
  background, border, or shadow.
- Fleet filters become underline tabs inside a labelled fieldset, retaining
  `aria-pressed` and adding `aria-controls` for the results region.
- Every host presentation has a neutral hover/focus treatment and a concise
  explanation of the current state. Fresh resource alerts use a closed mapper
  over validated metric, severity, and bounded percentage values; connection,
  sampling, stale, failed-refresh, healthy, and unknown states use fixed copy.
  Neither `machine.alert.message` nor `machine.error` is exposed. Explanation
  copy is inserted only as React text children or through `textContent`, never
  through an HTML-capable sink.

The hidden sidebar accessory is untouched. The movable trigger keeps its
existing structure and behavior, and no trigger pseudo-element is restored.

### Host Monitor page's inner sidebar status

The user rejected the pill/chip treatment. The Host Monitor page now presents
status as a quiet inline orb and word with no border, rounded container,
background, fixed pill height, or horizontal padding. Host cards and rows stay
neutral in every state, including Critical and Needs attention; only their
small orb and action-state word carry semantic color. Hover or keyboard focus
reveals why the host has that state. BB's permanent global Host Monitor icon
remains neutral and notification-dot free; the popover/floating window keeps
its own status rows rather than borrowing page chrome.

## Visual tokens

| Rendered state | Semantic token | Observable color |
| --- | --- | --- |
| Connected + healthy | `--host-monitor-normal` / BB `--success` | Green |
| Connected + attention, stale, or failed | `--host-monitor-attention` / BB `--warning` | Yellow |
| Connected + critical | `--host-monitor-critical` / BB `--destructive` | Red |
| Offline or disconnected | `--muted-foreground` or existing muted mix | Gray |
| Sampling, unavailable, or unknown | Existing neutral base style | Gray/neutral |

Host-card halos use only a faint mix of the mapped semantic token and collapse
to the existing muted outline for disconnected hosts.

Status-orb rules are unconditional. The
`data-host-monitor-threshold-colors` preference continues to gate only numeric
CPU/RAM/disk percentage colors.

## Accessibility

Orb and action-state text color supplement, but never replace, existing state
copy. Decorative dots remain hidden from assistive technology.
Connected/Disconnected, Healthy/Needs attention/Critical/Offline/Unavailable,
Sampling, Stale reading, and Last known labels stay visible where they currently
render. The same safe explanation shown on hover is exposed through the host
row's accessible description, and keyboard focus reveals the visual tooltip.
Existing metric and trigger accessible labels remain unchanged.

## Regression coverage

- Sidebar source assertions prove both row constructors stamp the computed
  tone, explicit offline/unavailable fallbacks exist, and visible labels and
  `aria-hidden` dots remain.
- Sidebar CSS assertions prove each tone uses the expected semantic token and
  remains independent of threshold-color preferences.
- App registration/source assertions prove the card tone and inline status-dot
  hook exist, pill chrome is absent, filters retain keyboard/pressed semantics,
  all semantic card/row rail selectors are absent, and disconnected rules
  remain neutral.
- Explanation tests cover safe resource-alert reuse, fixed connectivity and
  freshness copy, raw-error exclusion, neutral container hover/focus, and the
  visible `Needs attention` label.
- Pure fleet-presentation tests cover healthy, attention/stale/error, critical,
  sampling/unavailable, and offline/disconnected mappings.
- The prior test forbidding a trigger `::after` badge remains in force.

## Version and live lifecycle

Bump only Host Monitor from `0.1.1` to `0.1.2` in the active manifest, lock
record, root/leaf Git-install documentation, distribution guard, and current
distribution capability. Let the running watcher rebuild/reload the local path
plugin, then reinstall that same path only if BB's inventory needs the manifest
version refreshed. Generated `dist` metadata must report `0.1.2`; it remains
ignored. Marketplace PR #128's entry description is prepared locally to
disclose guarded process-stop controls, and the invalid Processes fixed-tab
icon becomes the registry-backed `ChartColumn`. No commit, push, tag, release,
publication, PR comment, or other remote mutation occurs without separate
approval.

## Verification sequence

1. Run focused Host Monitor typecheck/tests after implementation.
2. Confirm watcher rebuild/reload output and inspect Host Monitor logs if the
   runtime state is unclear.
3. Run root typecheck, test, lint, and build because source CSS, frontend
   bundle, manifest, and documentation/distribution contracts changed.
4. Reconfirm ignored generated metadata and live BB inventory at `0.1.2`.
5. Exercise compact/floating and dashboard status orbs in real BB and capture
   a screenshot.
6. Run independent review, Empirical verification, and `git diff --check`.

## Rollback

The patch is isolated to tone attributes, CSS selectors, tests, and version
references. Reverting those hunks restores the previous neutral orbs without
changing stored settings, telemetry, or host state.
