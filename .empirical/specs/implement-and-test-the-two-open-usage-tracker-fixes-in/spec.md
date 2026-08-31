# Implement And Test The Two Open Usage Tracker Fixes In

## Request

> Implement and test the two open Usage Tracker fixes in GitHub issues #13 and #19, create a reviewed pull request, and integrate it into main so Usage Tracker can be released; keep release publication and marketplace updates outside Empirical for separate release approval.

## Goal

Usage Tracker consumes the provider keys emitted by current BB releases without
changing its stable internal provider IDs, isolates an absent provider instead
of failing the whole snapshot, and shows every reported usage window in the
expanded sidebar card while retaining the deliberately compact single-window
sidebar reading.

## Acceptance Criteria

- [ ] [AC-1] A response keyed by `codex`, `claude-code`, and `acp-cursor`
  normalizes to the stable provider IDs `codex`, `claudeCode`, and `cursor`
  with each provider's status and windows intact.
- [ ] [AC-2] Legacy responses keyed by `claudeCode` and `cursor` continue to
  normalize, and a current wire key takes precedence when both current and
  legacy aliases are present.
- [ ] [AC-3] If one provider key is absent, only that provider becomes an
  `error` with an unavailable message; healthy providers still produce a
  complete usage snapshot.
- [ ] [AC-4] Expanded details describe the canonical five-hour and weekly
  windows first, followed by every other current provider window in source
  order with its original label.
- [ ] [AC-5] Last-known reconciliation retains canonical and additional cached
  windows that a partial refresh omits, without replacing current values or
  duplicating a current canonical category or exact additional-window label.
- [ ] [AC-UI-1] [UI] Given a healthy provider with `Current session`, `Weekly
  limit`, and `Fable` windows, the expanded card visibly renders all three with
  the Fable percentage and reset state.
- [ ] [AC-UI-2] [UI] The compact sidebar reading remains one configured
  canonical percentage and does not add an extra Fable reading.
- [ ] [AC-6] Focused Usage Tracker tests and the repository-root `npm run check`
  complete successfully from a clean dependency installation.

## Scope

- Provider response typing, alias selection, and fault isolation in
  `plugins/usage-tracker/lib/usage.ts`.
- Expanded-card row selection, accessible copy, layout, and last-known window
  reconciliation in the Usage Tracker sidebar modules.
- Regression coverage for current and legacy provider keys, missing keys,
  additional detail rows, and cached additional windows.
- Live BB verification of the expanded and compact sidebar surfaces.

## Non-goals

- Renaming persisted provider IDs, preference values, RPC output IDs, icons, or
  sidebar provider configuration.
- Increasing compact sidebar density or making additional windows selectable as
  the compact primary limit.
- Upgrading the plugin's minimum BB/plugin-SDK versions or changing BB's usage
  response contract.
- Publishing a Git tag or GitHub Release, changing marketplace metadata, or
  otherwise performing the separately approved release workflow.

## Risks

- Supporting two generations of response keys can select stale data if alias
  precedence is not explicit.
- Broad canonical label classifiers could suppress a genuinely distinct extra
  window, so only the selected five-hour/weekly rows may use category identity;
  all other windows use exact labels.
- An unbounded number or long label of additional windows can stress the small
  sidebar card, so the existing scroll/layout behavior must be exercised live.

## Verification

- Add Node regression tests for current wire keys, legacy aliases, precedence,
  and an absent provider.
- Add pure row-selection and merge tests covering a third `Fable` window,
  current-value precedence, canonical alias suppression, distinct duplicate
  labels, and deterministic order.
- Run the Usage Tracker test/typecheck/build contract during iteration and the
  root `npm run check` before review.
- Install/reload the local plugin in BB, exercise a three-window expanded card
  and the compact reading, and capture the configured UI evidence.

## Capability Deltas

- `deltas/usage-tracker-provider-usage.md` adds compatible, fault-isolated
  provider response normalization.
- `deltas/usage-tracker-compact-display.md` extends the existing compact display
  contract so expanded details and last-known state retain additional windows.
