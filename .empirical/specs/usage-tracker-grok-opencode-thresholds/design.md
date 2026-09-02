# Design: Grok, OpenCode, wrapped usage, and thresholds

## Architecture

Keep the existing Usage Tracker pipeline intact:

1. `load-usage.ts` calls BB's provider-keyed `system.usageLimits` API.
2. `usage.ts` normalizes every known provider into a stable ordered snapshot.
3. `server.ts` validates the expanded snapshot and returns user preferences.
4. `sidebar-strip.ts` filters the snapshot by the strict visible-provider
   allowlist, reconciles last-known windows, and emits semantic DOM attributes.
5. `app.css` owns responsive placement and severity presentation.

No provider is allowed to affect another provider's normalization or rendering.

## Provider model

- Extend `ProviderId` with `grok` and `openCode` and `RawProviderId` with
  `acp-grok` and `acp-opencode`.
- Append Grok and OpenCode to the normalized provider table after Cursor so
  existing order remains stable. Recovery commands are `grok login` and
  `opencode auth login`, as documented by their official CLI references.
- Keep Cursor normalized for compatibility but outside `SIDEBAR_PROVIDER_IDS`.
- Expand `SIDEBAR_PROVIDER_IDS` to `claudeCode`, `codex`, `grok`, `openCode`.
  Settings default all four visible providers to enabled and filter them in
  this order regardless of untrusted RPC/cache array order.
- Expand the RPC Zod enums by deriving them from the updated constant arrays.
- Copy Grok and OpenCode mark geometry from BB's existing MIT geometry already
  vendored by Dockside. Generalize Usage Tracker marks from one path to an array
  of paths so OpenCode's translucent inner layer is preserved.

## Severity model

Add a pure `usageLevel(usedPercent)` helper returning `normal`, `warning`, or
`critical`. Null/missing is normal; normalized windows are already finite.

- `usedPercent < 80`: `normal`
- `80 <= usedPercent < 95`: `warning`
- `usedPercent >= 95`: `critical`

Classification uses raw `usedPercent`; the independent `barPercent` remains
clamped to 0–100. `progressRail` writes `data-level`, compact provider buttons
write the primary window's `data-level`, and detail rows write their window's
`data-level`. CSS colors both the numeric reading and fill, not the brand mark
or entire control.

Theme-safe colors mix yellow/red hues with `--usage-sidebar-text`, retaining
contrast in light and dark themes. Empty rails and unavailable readings stay
neutral.

## Layout and interaction

One/two-provider strips keep the current 2rem flex row and width tiers. For
provider counts 3–6, the strip becomes a grid with two `minmax(0, 1fr)` provider
columns plus a fixed 1.75rem refresh column:

- counts 3–4: two 2rem provider rows;
- counts 5–6: three 2rem provider rows;
- refresh occupies the fixed last column and spans the provider rows;
- providers remain in DOM/tab order and grid auto-placement fills left-to-right,
  top-to-bottom;
- the root remains 11.25rem wide and grows vertically instead of competing with
  BB's footer icons horizontally.

The details card remains absolutely positioned above the footer and has its own
refresh action at narrow widths. Provider IDs continue to key dialog IDs, focus
restoration, selection, cached snapshots, and preference synchronization.

## Documentation and attribution

Update package descriptions/keywords, README provider/login/setup language,
feature list, wrapping and threshold behavior, and third-party notices for the
additional BB mark geometry.

## Verification design

- Pure tests: provider order/wire IDs, missing-provider isolation, setting
  combinations, exact threshold boundaries, clamped geometry, mark path data.
- Source/CSS contract tests: semantic `data-level`, provider-count grid rules,
  two/three-row selectors, fixed refresh column, warning/critical selectors.
- Existing Usage Tracker tests protect last-known merging, focus/accessibility
  copy, reset gating, host resolution, and lifecycle behavior.
- Focused typecheck/tests/build, local install/reload, browser inspection at
  normal and narrow widths, provider details, and screenshot evidence.

## Risks and mitigations

- Older BB builds may omit the new keys: provider-local errors are expected and
  do not erase healthy providers.
- Cached snapshots/preferences may predate the IDs: strict validation and live
  RPC refresh converge safely.
- Extra rows can collide with details positioning: the card remains positioned
  from the footer and opens above the complete root; live inspection covers it.
- Workspace-wide SDK drift may fail unrelated checks: focused plugin evidence
  remains required and the unrelated failure is reported separately.
