# Security Consult

- Specialist: security
- Verdict: advisory

## Finding SEC-001: Git release immutability is asserted but not enforced

- Severity: medium
- Category: supply-chain integrity
- Location: `design.md` Marketplace boundary; `deltas/plugin-git-distribution.md` Active Git-only install surfaces
- Recommendation: Before treating either Git source as immutable, add a GitHub tag ruleset that blocks updates and deletion for `taskboard/v*` and `usage-tracker/v*`, restrict bypass to the minimum release principal, and make the release procedure fail when an existing remote tag resolves to a different commit. This is the smallest control that prevents a compromised or mistaken maintainer from silently retargeting a version already selected by BB or the marketplace.
