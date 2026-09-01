# UI/UX advisory: open Dockside child-agent trees

Specialist: ui-ux

Verdict: advisory

## Findings

### UX-001: Match the reference's compact disclosure order

- Severity: medium
- Category: visual hierarchy
- Location: root-family child toggle
- Finding: Removing `agents` is the correct simplification; adding another
  person icon would recreate the visual clutter the user rejected.
- Recommendation: render chevron first and the tabular numeric count second,
  matching the reference's trailing disclosure rhythm. Keep the full action and
  count only in the accessible label.

### UX-002: Row state should remain the single visible authority

- Severity: high
- Category: state clarity
- Location: project header
- Finding: Simultaneous working and unread project glyphs compete with the root
  rows and make the header harder to scan.
- Recommendation: remove the whole visible aggregate cluster rather than
  choosing one priority icon. Preserve the screen-reader summary and every
  row-level Working, Unread, Failed, and Needs you treatment.

### UX-003: Default-open must respect deliberate collapse

- Severity: medium
- Category: interaction predictability
- Location: family expansion state
- Finding: Reopening a family immediately after a user collapses it would make
  the control feel broken.
- Recommendation: default open only while the override is null; explicit false
  remains false across child completion/addition for the mounted keyed family;
  search may still force open temporarily.

### UX-004: Keep connector density unchanged

- Severity: low
- Category: layout continuity
- Location: expanded child list
- Finding: The existing thin vertical/horizontal connector and compact child
  rows already provide the requested structure.
- Recommendation: change no padding, border, provider glyph, branch/status, or
  child row typography in this refinement; only open the existing structure.
