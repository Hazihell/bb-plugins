# UI/UX Advisory

- Specialist: ui-ux
- Verdict: advisory

## Findings

- Severity: medium
  - Category: settings information architecture
  - Location: Dockside plugin settings
  - Finding: Twelve semantic color fields plus behavior toggles can become a
    long undifferentiated form.
  - Recommendation: Put palette preset first, prefix custom fields consistently,
    order roles by thread states then PR states, and use the custom settings
    section for a compact labeled swatch preview. Explain that Default is the
    active reset and Custom alone reads custom fields.

- Severity: medium
  - Category: accessible state communication
  - Location: root/child status and PR glyphs
  - Finding: Custom colors can be low contrast or indistinguishable.
  - Recommendation: Never remove icon shape, animation, accessible label,
    tooltip, or disabled state; provide High contrast and Colorblind-friendly
    presets and retain safe fallback colors for invalid input.

- Severity: low
  - Category: selection affordance
  - Location: root rows in selection mode
  - Finding: Checkbox-only range selection conflicts with the row-sized target
    users expect in list selection.
  - Recommendation: Make the whole eligible row toggle/range-select only while
    selection mode is visibly active. Protected rows should no-op rather than
    navigate, while outside selection mode row navigation remains unchanged.

## Concrete treatment

Keep the current sidebar structure. Use green for working, amber for waiting,
blue for unread, red for errors/blocked, and gray for idle as the default
semantic vocabulary. Show effective settings as small named swatches, not a
second editable form. Compact density may reduce padding but must keep two-line
root layout, visible focus, and native checkbox access.
