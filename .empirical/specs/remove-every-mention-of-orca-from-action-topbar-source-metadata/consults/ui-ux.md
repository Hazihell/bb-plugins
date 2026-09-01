# UI/UX advisory

## Specialist

ui-ux

## Verdict

advisory

## Findings

### Finding U-001

- Severity: medium
- Category: screenshot clarity
- Location: `plugins/action-topbar/README.md`
- Finding: A full-window screenshot would make the topbar too small and expose
  unrelated thread content.
- Recommendation: Use a consistent desktop crop centered on the thread header,
  open tab strip, `+` launcher, and enough workspace to show placement.

### Finding U-002

- Severity: low
- Category: theme comparison
- Location: `docs/media/action-topbar-light.png`, `docs/media/action-topbar-dark.png`
- Finding: Different interaction states would make theme comparison ambiguous.
- Recommendation: Keep the launcher open and use matching framing and content
  in both captures.

### Finding U-003

- Severity: low
- Category: accessibility
- Location: `plugins/action-topbar/README.md`
- Finding: Generic screenshot alt text would not explain the documented UI.
- Recommendation: Name the theme, main-thread topbar, searchable Action
  launcher, and draggable workspace context in each image description.
