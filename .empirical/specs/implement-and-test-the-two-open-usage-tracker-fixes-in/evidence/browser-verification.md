# Live BB browser verification

- Date: 2026-08-27
- Surface: BB 0.40 sidebar footer with the local Usage Tracker review path
- Fixture: non-secret cached Codex windows for Current session, Weekly limit,
  Fable, and a 14-row overflow/long-label stress case

## Three-window behavior

- Expanded details rendered canonical `5-hour limit` and `Weekly limit` first,
  then `Fable` at 21% with `Reset unavailable`.
- The compact control remained one live Weekly percentage; Fable did not add a
  compact reading.

## Dialog and focus behavior

- Activating the compact button moved focus to the close button.
- The dialog exposed role/name `dialog` / `Codex usage limits` and stable id
  `usage-tracker-sidebar-details-codex`.
- The current trigger exposed `aria-haspopup="dialog"`, matching
  `aria-controls`, `aria-expanded="true"`, and state-accurate `Close Codex usage
  details` copy.
- Escape was cancelable and reported `defaultPrevented=true`; it closed the
  dialog, restored focus to the Codex trigger, changed `aria-expanded` to
  `false`, and restored `Open Codex usage details` copy.
- The explicit close button also closed the dialog and restored trigger focus.
- A refresh subtree replacement preserved the details scroll position and kept
  focus on the refresh button both while `aria-disabled="true"` and after it
  returned to `false`; focus never dropped to the document body.
- With focus moved to BB's external composer, Escape was handled by the host and
  the background usage dialog stayed open. With focus inside Usage Tracker,
  Escape was consumed by the plugin, closed details, and restored trigger focus.

## Overflow and paint behavior

- The 14-row card measured 301px client width and 301px scroll width: no
  horizontal overflow.
- Its header remained visible at y=51px; the card occupied y=50–467px.
- The windows region measured 369px client height / 836px scroll height with
  computed `overflow-y: auto`.
- The long provider label wrapped to 36px (three 12px lines).
- The scroll container exposed role/name `region` / `Codex usage windows` and
  `tabIndex=0`; it accepted focus and vertical scrolling without adding a tab
  stop to each row.
- Hit-testing the card's top-left header area resolved inside the card, and the
  recaptured screenshot shows no overlap from BB's fixed sidebar toggle.

The pre-test localStorage values and original installed plugin path were
restored after capture.
