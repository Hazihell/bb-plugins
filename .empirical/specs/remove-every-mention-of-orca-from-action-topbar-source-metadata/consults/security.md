# Security advisory

## Specialist

security

## Verdict

advisory

## Findings

No blocking findings.

### Finding S-001

- Severity: low
- Category: information exposure
- Location: `docs/media/action-topbar-light.png`, `docs/media/action-topbar-dark.png`
- Finding: Real application screenshots can expose private thread text, paths,
  project names, or credentials when framed too broadly.
- Recommendation: Inspect both committed assets, use a non-sensitive thread,
  and frame the capture around the topbar and launcher. Never capture secrets or
  credential entry surfaces.

### Finding S-002

- Severity: informational
- Category: compatibility integrity
- Location: `plugins/action-topbar/README.md`
- Finding: Copy edits and screenshots must not imply support on stock BB builds.
- Recommendation: Retain the existing matching-core and Plugin SDK 0.4.33
  warning next to the product description and installation instructions.
