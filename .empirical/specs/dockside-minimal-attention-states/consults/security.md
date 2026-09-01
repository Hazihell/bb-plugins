# Security Advisory: Dockside Minimal Attention States

Specialist: security

Verdict: advisory

## Scope reviewed

- `.empirical/specs/dockside-minimal-attention-states/spec.md`
- `.empirical/specs/dockside-minimal-attention-states/design.md`
- `.empirical/specs/dockside-minimal-attention-states/deltas/dockside-thread-management.md`

## Findings

### S-001 — Informational — privacy — reduced sidebar disclosure

Location: AC-1, AC-2, AC-6

The change removes visible assistant output and PR-title prose while retaining
the existing authenticated, bounded output verification and native PR hook.
This reduces shoulder-surfing and incidental disclosure rather than adding a
new data path.

Recommendation: keep assistant output out of text, title, and hover content;
retain the PR title only in its native accessible label/tooltip as specified.

### S-002 — Informational — integrity — fixed state and tone vocabulary

Location: Design “Presentation model”

State selection and CSS classes come from closed literal unions. User or agent
content cannot choose a class, inject markup, or fabricate Done; Done still
requires the authoritative summary RPC result.

Recommendation: keep precedence and semantic tones in pure closed helpers and
continue rendering all labels through React text nodes.

### S-003 — Low — attention suppression — passive metadata priority

Location: AC-3

A live state intentionally hides PR/Done. If Needs you or Failed were treated
as passive metadata, urgent work could be obscured; the design instead keeps
existing row status highest priority and makes its treatment stronger.

Recommendation: preserve `status → PR → Done` for children and retain the root
trailing Needs you/Failed status independently of the family state slot.

## Conclusion

No blocking exploit was found. The minimal presentation narrows data exposure,
keeps authoritative backend gates unchanged, and uses fixed semantic state
values with explicit text labels.
