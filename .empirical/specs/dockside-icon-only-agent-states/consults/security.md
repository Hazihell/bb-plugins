# Security Advisory: Dockside Icon-Only Agent States

Specialist: security

Verdict: advisory

## Findings

### S-001 — Informational — privacy — child output removal

Location: AC-1, AC-2, AC-6

Child output is no longer requested or displayed, reducing incidental data
exposure. Root Done remains gated by the existing bounded local RPC and exposes
no output content.

Recommendation: keep child rows out of summary requests and preserve root
authoritative verification.

### S-002 — Low — accessibility — icon-only meaning

Location: AC-3 through AC-5

Icons without accessible names could hide state from assistive technology.
The design includes screen-reader labels/tooltips and a visible PR number.

Recommendation: keep icons decorative inside labelled wrappers/links and test
that no state relies on color alone.

### S-003 — Informational — integrity — closed icon vocabulary

Location: Design “Components”

PR icon selection uses a fixed union derived from BB state, preventing content
or class injection. Navigation remains on BB's UrlLink.

Recommendation: preserve the closed mapping and plain React text rendering.

No blocking exploit was found.
