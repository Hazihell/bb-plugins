# Usage Tracker Grok Opencode Thresholds

## Request

> Extend the Usage Tracker sidebar widget to normalize and display Grok (`acp-grok`) and OpenCode (`acp-opencode`) usage alongside the existing enabled providers, with independent settings toggles. When the enabled provider count exceeds the compact single-row capacity, wrap the strip into a compact layout supporting up to three provider rows while keeping refresh and details usable. Apply warning presentation at usage percentages greater than or equal to 80% (yellow) and critical presentation at greater than or equal to 95% (red) to compact and detail percentages/bars. Preserve provider-local fault isolation, cached snapshots, keyboard focus, accessibility, and current Codex reset behavior. Add focused normalization, preference, threshold, markup/CSS contract tests and update Usage Tracker documentation, then build and verify the plugin UI.

## Goal

Users can see Grok and OpenCode quota alongside Codex and Claude Code without
the sidebar footer becoming a cramped single row, and can identify approaching
or exhausted limits at a glance from consistent warning colors.

## Acceptance Criteria

- [ ] [AC-1] BB usage keys `acp-grok` and `acp-opencode` normalize to stable
  `grok` and `openCode` provider records in deterministic order, while an
  absent or unhealthy provider remains a provider-local error and does not
  erase healthy providers.
- [ ] [AC-2] Grok and OpenCode are enabled by default for new settings and have
  independent settings toggles; preference RPC validation, cached provider
  filtering, and provider-specific recovery copy accept all four visible
  providers without changing Codex reset behavior.
- [ ] [AC-UI-1] [UI] One or two enabled providers retain the current compact
  single-row presentation. Three through six enabled providers use a two-column
  grid spanning at most three provider rows, with a single refresh control that
  remains reachable and with each provider opening the correct details card.
- [ ] [AC-UI-2] [UI] Compact and expanded usage readings and progress fills use
  the normal neutral presentation below 80%, yellow warning presentation from
  80% through 94.999…%, and red critical presentation at 95% and above. Missing
  windows remain neutral.
- [ ] [AC-3] Threshold classification is derived from the unclamped finite
  `usedPercent` value at the exact 80 and 95 boundaries while progress geometry
  remains clamped to 0–100; the DOM exposes semantic level attributes usable by
  CSS and automated accessibility/layout checks.
- [ ] [AC-4] Last-known snapshots, focus restoration, keyboard dismissal,
  accessible provider names, expanded provider windows, automatic/manual
  refresh, and Codex reset confirmation continue to work for the expanded
  provider set.
- [ ] [AC-5] Focused normalization, preferences, thresholds, provider-mark and
  markup/CSS contract tests pass; Usage Tracker typecheck/tests/build pass; the
  README documents all providers, wrapping, thresholds, and login prerequisites;
  local install/reload and browser inspection verify the visible result.

## Scope

- Usage Tracker provider normalization, preferences/RPC schema, provider marks,
  sidebar strip DOM, styling, tests, package metadata, notices, and README.
- Current BB wire IDs `acp-grok` and `acp-opencode` only; stable internal IDs
  are `grok` and `openCode`.
- A responsive two-column grid for more than two providers, sized for up to
  three rows without hiding providers.
- Warning and critical presentation on compact and detail bars/readings.

## Non-goals

- Adding Cursor to the visible sidebar provider settings in this change.
- Implementing usage collection in BB or provider CLIs; the plugin consumes
  `system.usageLimits` only.
- Changing limit selection semantics, refresh cadence, reset-credit accounting,
  or provider authentication.
- Treating a missing provider key as proof that its CLI is not installed.

## Verification

- Run focused Usage Tracker tests, typecheck, and production plugin build.
- Exercise exact threshold boundaries (79.9, 80, 94.9, 95, and over 100) and
  all enabled-provider combinations relevant to one-row and wrapped layouts.
- Install and reload `./plugins/usage-tracker`, inspect the sidebar at normal and
  narrow widths, open Grok/OpenCode details, and capture a browser screenshot.
- Record unrelated workspace-wide SDK drift separately rather than weakening
  focused acceptance.

## Capability Deltas

- `deltas/usage-tracker-provider-usage.md`
- `deltas/usage-tracker-compact-display.md`
