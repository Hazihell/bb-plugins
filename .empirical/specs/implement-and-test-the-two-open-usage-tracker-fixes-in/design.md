# Design: Usage Tracker Provider and Window Compatibility

## Overview

Fix the two failures without changing Usage Tracker's persisted provider IDs or
compact-density contract. Normalize current and legacy BB response keys through
an ordered alias table, isolate an absent response to its provider, derive the
expanded card's rows through a pure helper, and extend last-known reconciliation
to additional windows. Keep the change on one review branch because both issues
share the same usage snapshot and sidebar presentation boundary.

## Provider response normalization

`ProviderId` remains the stable plugin-facing union `codex | claudeCode |
cursor`. Introduce a raw response-key union and model `RawUsageResponse` as a
partial record because BB only returns registered usage integrations. Each
provider definition receives an ordered `wireIds` tuple:

- Codex: `codex`
- Claude Code: `claude-code`, then legacy `claudeCode`
- Cursor: `acp-cursor`, then legacy `cursor`

Normalization selects the first defined alias, so current BB data wins when a
transitional response contains both shapes. `normalizeProvider` accepts a
missing raw value and returns a provider-local `error` with null metadata, no
windows, and a message that BB did not report that provider. It does not claim
`not_installed`, a status reserved for an explicit BB probe result. The provider
map still runs in its stable output order, so one omission cannot reject the
whole RPC.

## Expanded detail rows

Add a pure exported `sidebarUsageDetailRows(provider)` helper beside the existing
compact selection logic. It returns:

1. the canonical `5-hour limit` row, including its existing null placeholder;
2. the canonical `Weekly limit` row, including its existing null placeholder;
3. every provider window not selected for those two rows, in source order and
   using its original label.

The helper excludes only the exact window object selected by each `.find` call.
It therefore preserves a second distinct window even when a provider gives it a
duplicate or broadly matching label. `detailsCard` maps the helper into the
existing `detailWindowRow` renderer. Compact selection and summary functions
continue to consume only `sidebarUsageWindows()`.

The details grid keeps the canonical pair as two columns. Every third and later
row spans both columns and receives a top divider; only the second canonical row
receives the pair's vertical divider. Change compact accessible action copy from
“Open five-hour and weekly details” to “Open usage details” so it remains true
when additional rows exist.

## Last-known reconciliation

Retain the existing category-aware behavior for the one selected canonical
five-hour and weekly window:

- if a current category exists, it is authoritative and its selected previous
  counterpart is considered handled even when the provider renamed the label;
- if a current category is absent, restore the selected previous counterpart in
  the existing five-hour-first/weekly-last positions.

Then inspect every previous window not selected as one of those canonical
counterparts. Append it only when its exact label is absent from the accumulated
current/restored rows. This hybrid identity avoids losing arbitrary extra
windows that happen to match a broad canonical keyword while preventing stale
canonical aliases from accumulating forever. Current objects and source order
remain untouched; reconciliation returns new arrays only.

## Regression coverage

Extend `plugins/usage-tracker/test/usage.test.ts` with:

- current BB 0.40 wire keys and stable normalized output IDs;
- legacy camel-case aliases and current-key precedence;
- one absent provider producing only a localized unavailable result;
- three-window detail rows with `Fable` after the canonical pair;
- a second distinct canonical-looking window retained as an extra row;
- empty/partial refreshes retaining Fable and missing canonical values;
- current canonical aliases and exact extra labels winning without duplicates;
- unchanged compact selection/summary behavior when Fable exists.

Focused tests/typecheck/build run during implementation. Root `npm run check`
is the final repository gate. Live BB verification seeds a non-secret local
cached snapshot containing Current session, Weekly limit, and Fable, then checks
the expanded card, compact reading, layout, accessible labels, refresh fallback,
and captures UI evidence. Restore any pre-test local cache/install state after
the exercise.

## Integration and release boundary

Commit the reviewed implementation and Empirical evidence on one owner branch,
open a PR that closes issues #13 and #19, wait for CI, and merge normally into
`main`. Do not bump the package version, create a tag/GitHub Release, or modify
the marketplace in this feature. Those release mutations are prepared after
integration and require the submit-a-plugin workflow's separate exact approval.

## Failure handling

- If alias tests fail, preserve stable output IDs and declared BB 0.38
  compatibility rather than switching exclusively to current keys.
- If extra rows overflow or misalign live, adjust only the details-grid styling;
  do not truncate provider windows or widen the compact strip.
- If cache reconciliation creates a duplicate, distinguish selected canonical
  object identity from exact-label identity for remaining windows; do not apply
  the broad keyword classifier to every extra.
- If any root check or UI evidence fails, stop before opening or merging the PR.
