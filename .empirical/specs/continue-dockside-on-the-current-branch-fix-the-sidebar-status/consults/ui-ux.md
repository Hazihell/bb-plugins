# UI/UX Advisory

- **Specialist:** ui-ux
- **Verdict:** advisory

## Findings

### High · hierarchy · root row status needs a single visual sentence

- **Location:** Root card rows
- **Finding:** Six simultaneous color dots or stacked metadata would recreate the
  ambiguity in the reference screenshot.
- **Recommendation:** Use one distinct leading icon and one short row-two text
  badge from the same family projection; put lower-priority context in the
  accessible tooltip rather than adding chrome.

### High · responsive layout · semantic cluster must never wrap

- **Location:** Root card row two
- **Finding:** Long branches and child/PR metadata compete at narrow widths.
- **Recommendation:** Give branch `min-width: 0` and truncation, keep metadata in
  a no-wrap shrink-resistant cluster, use fixed row heights, and test at the
  narrowest live sidebar width.

### Medium · accessibility · sorting needs discoverable non-pointer operation

- **Location:** Reorder handle/root focus target
- **Finding:** Drag alone is not operable or reliably understandable from a
  keyboard.
- **Recommendation:** Label the handle, expose Alt+Arrow shortcuts and focus
  tooltip, retain a polite live region, and announce blocked/boundary outcomes.

### Medium · visual tone · inactive and stale should differ by luminance

- **Location:** Palette and quiet root copy
- **Finding:** A bright idle color makes unused work compete with actionable
  rows; one grey cannot explain long inactivity.
- **Recommendation:** Use light muted grey for Inactive and darker/dimmer grey
  for Stale, muting title and branch for both while retaining readable badge
  text and separate icon shapes/labels.

### Low · settings fidelity · preview should show components, not dots alone

- **Location:** Dockside Settings preview
- **Finding:** Plain swatches do not demonstrate effective contrast, animation,
  labels, or the inactive/stale distinction.
- **Recommendation:** Preview the actual icon plus badge label for each of the six
  states using resolved palette values, followed by PR swatches.
