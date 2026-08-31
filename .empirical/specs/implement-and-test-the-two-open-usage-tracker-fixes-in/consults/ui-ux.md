# UI/UX Consult

- Specialist: `ui-ux`
- Verdict: `advisory`

## Assessment

Yes. Keeping the compact sidebar at one configured canonical percentage while
making the expanded card the complete view is the clearest hierarchy for the
stated criteria. The canonical five-hour and weekly windows remain the familiar
two-column summary, and supplemental windows become easy-to-scan full-width
rows below them. The design is implementation-ready, but the following details
should be made explicit during implementation and live verification.

## Findings

### Finding 1

- Severity: medium
- Category: content hierarchy
- Location: Design, “Expanded detail rows”; AC-UI-1
- Recommendation: Render the expanded card concretely as a two-column first
  row for `5-hour limit` and `Weekly limit`, followed by one full-width row per
  additional window. Each additional row should show the original label first,
  the percentage with the same meaning and formatting as the canonical rows,
  and a visible reset-state line. For the acceptance fixture, the third row
  should therefore read as `Fable`, its percentage, and either its formatted
  reset time or an explicit unavailable reset state. Do not collapse the extra
  row into a tooltip or place it beside the compact percentage.

### Finding 2

- Severity: medium
- Category: responsive layout
- Location: Design, “Expanded detail rows”; Spec, “Risks”
- Recommendation: Keep additional rows full-width with a top divider, allow
  labels to wrap without overlapping the percentage or reset copy, and preserve
  a single vertical reading order. If the provider reports enough rows to exceed
  the available card height, scroll the details region vertically without
  introducing horizontal scrolling or truncating windows. Exercise at least one
  long label and a narrow sidebar during live verification.

### Finding 3

- Severity: medium
- Category: state clarity
- Location: AC-UI-1; Design, `detailWindowRow` reuse
- Recommendation: Reuse the canonical row’s established visual grammar for
  every supplemental window, including units, percentage semantics, and reset
  formatting. Never leave the reset area visually blank: show the supplied
  reset state when present and the existing explicit placeholder when absent.
  This makes “Fable percentage and reset state” directly observable rather than
  inferable from layout.

### Finding 4

- Severity: low
- Category: accessibility
- Location: Design, compact accessible action copy
- Recommendation: “Open usage details” is accurate, but include the provider
  name in the accessible name when multiple provider controls can appear in the
  same sidebar, for example “Open Codex usage details.” Keep the visible compact
  presentation unchanged, ensure supplemental rows participate in DOM/source
  order after the canonical pair, and verify keyboard focus does not move to or
  through non-interactive detail rows.

### Finding 5

- Severity: low
- Category: verification evidence
- Location: Spec, “Verification”; Design, live BB verification
- Recommendation: Capture one expanded-state view that simultaneously shows
  Current session, Weekly limit, and Fable, plus one compact-state view showing
  exactly one percentage. Record the narrow-width/overflow result and the
  computed accessible name as part of the UI evidence so the visual and
  non-visual contracts are both unambiguous.
