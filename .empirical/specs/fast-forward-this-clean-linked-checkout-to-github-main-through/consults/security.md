# Security specialist advisory

- Specialist: `security`
- Verdict: `advisory`

## Finding SEC-1

- Severity: Medium
- Category: Security-monitoring degradation / defense evasion
- Location: `spec.md` AC-UI-2; `design.md` “Host Monitor”; `deltas/host-monitor-sidebar.md` “Dot-free movable trigger”
- Exploitation: An attacker who disrupts, disconnects, or otherwise drives a monitored host into a critical state benefits from the removal of the trigger’s only passive visual warning. For a sighted operator who does not hover the trigger or use a screen reader, the remaining dynamic `aria-label` and title are not continuously visible, so the hostile or degraded state can remain unnoticed longer and delay investigation. This does not create an initial compromise path, but it weakens detection after compromise or service interference.
- Recommendation: Keep the prohibition on an overlaid pseudo-element dot, but require the existing status state to produce a non-overlay visible critical cue on the trigger itself, such as a status-dependent icon color or outline. Extend the focused regression to require that visible critical-state mapping alongside the dynamic accessible label/title. This is the smallest fix because it reuses the status already computed by Host Monitor and does not restore the removed dot, change interaction behavior, or expand plugin privileges.

