# Security Advisory

- **Specialist:** documentation supply-chain review
- **Verdict:** advisory

## Findings

### Low — Preserve install trust coordinates

- **Category:** supply-chain clarity
- **Location:** README Install section
- **Recommendation:** keep the semver range, tag prefix, and immutable tag link
  even while removing promotional version branding.
- **Resolution:** retained only in Install.

No blocking issue was found. The correction changes prose and media filenames
only; runtime and release sources remain unchanged.
