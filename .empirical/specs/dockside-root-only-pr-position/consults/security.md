# Security Advisory

- Specialist: security
- Verdict: advisory

## Findings

No blocking or actionable security finding was identified.

- Severity: informational
  - Category: untrusted presentation data
  - Location: root PR title, number, URL, branch, and provider labels described by the specification and design
  - Assessment: the change relocates existing SDK-provided values and removes child PR lookups; it introduces no HTML injection, command execution, credential, persistence, permission, or server boundary. React text rendering keeps titles and labels escaped, and the existing SDK `UrlLink` remains the only PR navigation boundary.
  - Recommendation: retain text-node rendering, bounded tooltip geometry, and `UrlLink`; do not replace them with raw HTML or an unvalidated navigation primitive.

## Exploit Review

The plausible attacker-controlled inputs are long or markup-shaped PR titles,
branch names, provider names, and PR URLs. Titles and names remain inert text,
while the compact rows truncate or wrap them. The smallest continuing control
is therefore the current one: keep React escaping and the SDK link component.
Removing the per-child PR hook also reduces duplicate remote lookups rather
than adding a new attack surface.
