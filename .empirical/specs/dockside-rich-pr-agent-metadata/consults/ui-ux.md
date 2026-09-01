# UI/UX advisory: rich PR and agent metadata

Specialist: ui-ux

Verdict: advisory

## Findings

### UX-001: Metadata pills must stay subordinate to thread titles

- Severity: high
- Category: hierarchy
- Location: root and child metadata lines
- Finding: PR/status pills can easily turn the narrow tree into a badge list.
- Recommendation: use 2xs uppercase pills, one icon, compact horizontal
  padding, and semantic low-opacity backgrounds. Keep the linked title plain,
  muted, and truncated; never place the pill in the title line.

### UX-002: Use one row-level metadata precedence

- Severity: high
- Category: state clarity
- Location: PR and Done presentation
- Finding: Showing both PR and Done for one row is contradictory; idle alone is
  not completion.
- Recommendation: PR metadata wins when present. Otherwise show Done only for a
  real non-empty final output. Keep the existing trailing Working/Unread/Failed
  status independent because it describes current attention, not outcome.

### UX-003: Waiting is family orchestration, not another badge

- Severity: medium
- Category: activity feedback
- Location: root metadata and connector
- Finding: Adding another trailing icon would recreate the clutter just removed.
- Recommendation: one text line with one activity glyph plus a subtle connector
  tint. Do not alter thickness, project headers, or every child background.

### UX-004: Summaries must be quiet, bounded, and ephemeral

- Severity: high
- Category: privacy / density
- Location: final-output preview
- Finding: Assistant output may be verbose or sensitive and can dominate a
  sidebar or leak more context than expected.
- Recommendation: one local-only line, 120 characters maximum, control-free,
  no Markdown rendering, no persistence, no hover expansion to full output, and
  no fetch for collapsed children.

### UX-005: Child rows may grow only when metadata exists

- Severity: medium
- Category: density
- Location: expanded child list
- Finding: Reserving an empty third line for every child wastes vertical space.
- Recommendation: retain two-line density when PR/Done is absent; add the third
  line conditionally and leave connector/provider/branch geometry unchanged.
