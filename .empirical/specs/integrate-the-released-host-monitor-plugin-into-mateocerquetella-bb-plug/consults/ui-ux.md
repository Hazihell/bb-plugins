# UI/UX Specialist Consult

- Specialist: `ui-ux`
- Verdict: `advisory`

## Findings

### UIUX-1

- Severity: medium
- Category: Public plugin catalog and quick start
- Location: `spec.md` AC-3; `design.md` Repository integration
- Recommendation: Define the README information hierarchy explicitly. The catalog entry should give Host Monitor a short user-facing purpose statement and link to its plugin README. Present the immutable Git-tag install as the primary user quick start, then clearly separate source-build/local-path instructions as a contributor workflow. Keep the collection-install example distinct so readers can tell whether they are installing one released plugin, the whole collection, or a development checkout.

### UIUX-2

- Severity: medium
- Category: Live UI verification evidence
- Location: `spec.md` AC-UI-1 and Verification; `design.md` Verification step 5
- Recommendation: Turn the surface list into a concrete evidence checklist with expected results and named artifacts. At minimum, record: the dashboard with the card fleet visible; selecting a host and opening its inspector; the process ledger populated and readable; the sidebar summary/control in its available state; and the floating monitor. For each item, state the interaction performed, the visible success condition, and the screenshot or browser-evidence path. Record the BB build/reload state used for the exercise and redact hostnames, IP addresses, usernames, and process details where necessary.

### UIUX-3

- Severity: low
- Category: Integration UX fidelity
- Location: `design.md` Verification step 5 and Risks and mitigations / Behavioral regression
- Recommendation: Include one explicit visual-fidelity check after the local-path reload: confirm styles, icons, spacing, scrolling, and overlays render without missing assets or clipping at the normal BB panel size. Exercise the sidebar control and floating monitor rather than merely confirming that they are present. This stays within the non-goal of changing product UI while making the integration check sensitive to packaging or bundle regressions.

### UIUX-4

- Severity: informational
- Category: Coverage assessment
- Location: `spec.md` AC-3 and AC-UI-1; `design.md` Repository integration and Verification
- Recommendation: Retain the current catalog, Git-release quick-start, source-install, and named-dashboard-surface requirements. Together they establish the right public discovery-to-install path and cover the principal released UI; the refinements above make their implementation and review objectively verifiable.
