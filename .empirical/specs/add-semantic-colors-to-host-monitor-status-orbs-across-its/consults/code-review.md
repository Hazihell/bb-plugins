# D-008 working-tree code review

- Specialist: `code-review`
- Verdict: `integration-ready`
- Review target: current uncommitted working tree

## Findings

No remaining actionable findings.

## Verification basis

- Host cards, compact rows, desktop rows, popover rows, and floating rows are
  rail-free and use only neutral container hover/focus treatments. Semantic
  color remains confined to status orbs and the approved Critical/Needs
  attention text; the global Host Monitor icon remains neutral and dot-free.
- One closed presentation mapper owns connection/freshness/health precedence,
  fixed fallback reasons, and reconstructed resource explanations. Raw alert
  and refresh-error strings do not reach explanations or the inspector, and
  the DTO schemas bound their string fields.
- Disconnected/offline precedence also governs fleet counts and filters, so
  retained stale or critical state cannot reclassify an offline host.
- Page explanations use collision-aware Radix tooltips with plugin portal
  scope and popover-theme foregrounds. Plain-DOM sidebar rows use visually
  hidden `aria-describedby` text plus one body-level overlay that flips and
  clamps to the viewport.
- Popover Tab order includes host rows, refresh rerenders restore row focus by
  stable host id, and independent hover/focus activation keeps the shared
  overlay visible until neither activation remains.
- Table rows retain native `<tr>` structure through `asChild`; decorative dots
  remain `aria-hidden`, and visible status/connectivity copy remains the
  authoritative non-color signal.
- Host Monitor remains prepared as `0.1.2`; the Processes tab uses
  registry-backed `ChartColumn`, and manifest copy discloses guarded controls
  that can stop eligible processes.
- Focused state/privacy/CSS/source regressions, contract bounds, full Host
  Monitor checks, root verification, live BB screenshots, and diff hygiene
  support this disposition.

## Formal committed-diff limitation

The semantic-orb/D-008 patch is uncommitted and coexists with other prepared
working-tree changes. Empirical's formal review packet is base-to-`HEAD`, so it
cannot certify these uncommitted bytes. This is a review-evidence limitation,
not a code defect: inspect the exact staged diff after scope approval and
before any commit, tag, push, publication, or release action.
