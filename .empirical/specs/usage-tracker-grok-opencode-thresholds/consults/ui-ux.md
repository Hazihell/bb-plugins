# UI/UX advisory: Usage Tracker provider expansion

Specialist: ui-ux

Verdict: advisory

## Findings

### Finding 1

- Severity: medium
- Category: layout
- Location: compact sidebar strip
- Recommendation: Retain the existing single row for one or two providers, but
  use two equal provider columns plus a fixed refresh column for larger counts.
  Four providers should occupy two rows; reserve a third row only when provider
  count grows beyond four. Do not shrink icons or percentage type to force four
  providers into one line.

### Finding 2

- Severity: medium
- Category: visual-consistency
- Location: warning and critical usage states
- Recommendation: Apply severity color only to the percentage and progress fill.
  Keep provider marks and control backgrounds in their existing brand/host
  colors so yellow and red communicate quota state rather than provider identity.
  Mix hues with the host foreground to preserve theme contrast.

### Finding 3

- Severity: low
- Category: interaction
- Location: multi-row refresh and details
- Recommendation: Keep one refresh action at the right edge spanning the row
  group and retain the refresh inside expanded details. Preserve DOM/tab order,
  provider-specific dialog IDs, Escape/outside-click dismissal, and focus return.

### Finding 4

- Severity: low
- Category: state-coverage
- Location: unavailable and cached provider states
- Recommendation: Missing/unavailable providers should keep neutral severity,
  remain independently expandable for recovery instructions, and never remove
  healthy provider readings or last-known windows.

## Concrete interface

At the default four-provider configuration the strip is a 2×2 provider grid
with a narrow refresh column. Each cell retains the current 2rem hit target,
brand mark, optional compact rail, and percentage. The details card remains the
only place for provider name, all usage windows, reset timing, status recovery,
and Codex reset controls. No new legend is needed: threshold color is reinforced
by the exact percentage and expanded context rather than color alone.

## User follow-up

After live inspection, the user rejected the 2×2 grid as visually detached and
requested four rows on the right. D-002 supersedes the original layout advice:
one tracker per row preserves rail width and produces a clearer scan path while
keeping one refresh action beside the stack.

The user also rejected that vertical stack because four rows overwhelmed the
footer. D-003 supersedes it with progressive disclosure: highest usage stays
visible, `+N` communicates hidden providers, and one overview click reveals the
complete comparable list before optional drill-down.
