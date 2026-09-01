# Security Advisory

- Specialist: security
- Verdict: advisory

## Findings

- Severity: low
  - Category: CSS/value injection
  - Location: custom semantic and PR color settings
  - Finding: Settings are user-controlled strings and would become a style
    injection boundary if arbitrary CSS syntax reached inline properties.
  - Recommendation: Accept only normalized six-digit hex values in one pure
    resolver; keep preset CSS values code-owned; test hostile strings such as
    `var(...)`, declarations, named colors, malformed lengths, and whitespace.

- Severity: low
  - Category: destructive-action confusion
  - Location: root overlay during selection mode
  - Finding: Turning the whole row into a selection target could accidentally
    navigate or include a protected family if mode/protection checks diverge
    from the checkbox path.
  - Recommendation: Reuse the same intent callback, consume the row click only
    in selection mode, no-op protected rows, and retain authoritative preview,
    token consumption, descendant binding, and confirmation-time revalidation.

- Severity: informational
  - Category: confidentiality
  - Location: Dockside settings descriptors
  - Finding: Palette and layout preferences contain no secrets and can safely be
    exposed through `useSettings`; no credential setting is introduced.
  - Recommendation: Keep all descriptors non-secret and do not add telemetry or
    external transmission for presentation preferences.

## Exploit Review

The practical inputs are setting strings and row click events. Strict hex
validation closes the only new injection-shaped boundary. Row clicks mutate
local review selection only; permanent deletion remains behind the existing
server-authoritative, one-use, revalidated confirmation flow. No blocking
security finding remains when those controls and their tests are retained.
