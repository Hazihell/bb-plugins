# UI/UX specialist consultation

- Specialist: `ui-ux`
- Verdict: `advisory`

## Assessment

Yes, this is the clearest interface direction for the stated criteria, with one
qualification: the design identifies the correct controls and behaviors but
should make their visible states more explicit. No redesign is needed. The
Taskboard glyph should identify the product while its label explains the
right-panel action; Host Monitor should be intentionally badge-free rather
than merely hiding a badge in one state; and Usage Tracker should make compact
truncation, complete expansion, and provider-local failure visually
unambiguous.

## Findings

### 1. Make the Taskboard control product-specific without weakening its action cue

- Severity: `low`
- Category: `iconography and affordance`
- Location: `AC-UI-1`; Design / Port the verified local fixes / Taskboard
- Recommendation: Render the existing `Ticket` glyph as the only icon in the
  thread-header action, using the same size, stroke, color, hit area, hover,
  focus, and disabled treatment as adjacent header actions. Preserve the
  accessible label and tooltip text “Pin Taskboard on the right”; that text,
  rather than a second panel glyph, should communicate placement. Activation
  should immediately open the right panel, whose visible appearance is the
  confirmation of success. Do not change Taskboard's unrelated internal
  sidebar-collapse `PanelRight` icon.

### 2. Treat the Host Monitor trigger as deliberately badge-free in every state

- Severity: `medium`
- Category: `status communication and accessibility`
- Location: `AC-UI-2`; Design / Port the verified local fixes / Host Monitor
- Recommendation: The movable sidebar trigger should remain a visually neutral
  monitor control with no corner dot, pseudo-element, reserved badge gap, or
  replacement color badge in idle, loading, healthy, warning, or error states.
  Keep its current hit target, drag affordance, focus treatment, and click-to-
  open behavior. Convey status through the existing dynamic accessible name
  and title/tooltip (in the form “Host Monitor — <status>”) and through the
  opened popover and floating monitor. This removes notification-like noise
  without making status unavailable to keyboard, assistive-technology, or
  pointer users.

### 3. Give Usage Tracker a clear compact-to-complete information hierarchy

- Severity: `medium`
- Category: `information architecture and state clarity`
- Location: `AC-UI-3`; Design / Port the verified local fixes / Usage Tracker
- Recommendation: Label the setting as “Compact window limit” and explain that
  it controls how many usage windows appear before expansion. In compact mode,
  render no more than that configured count, with each visible item retaining
  its provider/window identity, usage value or progress, and reset context;
  when more windows exist, provide an explicit overflow cue such as “+N more”
  on the control that opens the expanded view. In the expanded view, show every
  window without truncation, grouped once under its canonical provider so
  current and legacy keys never appear as duplicate provider sections.

### 4. Scope missing-provider feedback to the affected provider

- Severity: `high`
- Category: `error isolation and resilience`
- Location: `AC-UI-3`; Design / Risks and mitigations / Regressing PR #20
- Recommendation: Represent an omitted or unavailable provider as a compact
  inline unavailable/error row inside only that provider's section. Continue
  showing healthy providers and all of their windows; do not replace the whole
  compact or expanded surface with a global error or empty state. Refresh may
  mark the affected data as busy, but it should not blank already healthy
  provider data. The expanded surface should close on Escape and return focus
  to its trigger so the error state remains fully keyboard-navigable.

### 5. Capture evidence at the states where regressions would be visible

- Severity: `low`
- Category: `usability verification`
- Location: `AC-5`; Specification / Verification; Design / Build, install, and live verification
- Recommendation: Capture the Taskboard header action with its ticket glyph and
  open right panel; the Host Monitor trigger in at least normal and non-normal
  status states with no overlay plus its open popover; and Usage Tracker in
  compact, expanded, and one-provider-missing states. Include keyboard focus
  and Escape/focus-return checks in the walkthrough. These views are sufficient
  to demonstrate the intended hierarchy without introducing new UI behavior.
