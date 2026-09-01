# Security advisory

## Specialist

security

## Verdict

advisory

## Findings

No blocking findings.

### Finding S-001

- Severity: low
- Category: compatibility integrity
- Location: `plugins/action-topbar/package.json`, `plugins/action-topbar/README.md`
- Finding: Installing the plugin on a BB core without the experimental split-drag
  surface could produce incomplete behavior or runtime failures.
- Recommendation: Retain the `bbPluginSdk >=0.4.33` engine gate and the prominent
  matching-core warning, and do not publish to the marketplace until the API is
  accepted and available in a compatible BB release.

### Finding S-002

- Severity: informational
- Category: supply chain
- Location: documented Git installation command
- Finding: Installing from a mutable `main` ref does not provide immutable release
  provenance.
- Recommendation: Keep this path explicitly experimental. Once the SDK dependency
  is stabilized, create a reviewed immutable release tag before marketplace
  submission.
