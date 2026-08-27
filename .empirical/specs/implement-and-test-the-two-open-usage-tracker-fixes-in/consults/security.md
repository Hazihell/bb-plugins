# Security Consult

- Specialist: `security`
- Verdict: `advisory`

## Findings

### Unbounded additional-window retention permits resource amplification

- Severity: `medium`
- Category: `availability / resource exhaustion`
- Location: `design.md` — “Expanded detail rows” and “Last-known reconciliation”; `deltas/usage-tracker-compact-display.md` — “Partial refresh omits a known additional window”
- Exploit: A malformed or adversarial usage producer can return a large number of windows, very long labels, or a different label on every refresh. The expanded card renders every current window, while reconciliation retains omitted prior windows and deduplicates extras only by exact label. Rotating labels therefore grows the cached/displayed window set across refreshes, increasing persistent storage, reconciliation work, DOM size, and sidebar rendering cost until the surface becomes slow or unusable. This does not require markup injection; distinct plain-text labels are sufficient.
- Recommendation: Bound data at the provider-response boundary before it reaches reconciliation or persistence. The smallest closing fix is a fixed per-provider maximum for accepted windows and label length, applied deterministically while preserving the canonical five-hour and weekly rows; impose the same maximum on retained additional windows. Add a regression test that feeds over-limit windows and rotating/oversized labels and proves the normalized and reconciled arrays remain bounded. If preserving every window is an intentional compatibility requirement, document the trusted-input assumption explicitly and treat this as accepted availability risk.

### Provider labels can visually spoof canonical usage rows

- Severity: `low`
- Category: `UI integrity / deceptive text`
- Location: `design.md` — “Expanded detail rows”; `deltas/usage-tracker-compact-display.md` — original-label rendering requirement
- Exploit: An unusual provider label containing bidirectional or other non-printing control characters can be rendered under its original text and made to resemble or reorder a canonical limit label. A compromised or malformed producer could make an additional row appear authoritative and mislead a user about which quota is being reported.
- Recommendation: Keep the original semantic label for matching, but derive display text by removing bidi and non-printing control characters and enforcing the label-length bound. Render it only through the framework’s escaped text path; do not introduce raw HTML. Cover control-character input with a focused row-rendering test.
