# Plugin Git Distribution Delta

## MODIFIED Requirements

### Requirement: Dockside release documentation is source-verifiable

Dockside's README SHALL present the product without prominent version branding.
Exact semver range, tag prefix, and immutable tag MAY appear only where required
to make installation source-verifiable. Community announcement copy SHALL stay
outside repository documentation.

#### Scenario: User evaluates Dockside before installing

- **WHEN** a user opens the Dockside README
- **THEN** the hero, introduction, showcase heading, and image alternatives are
  product-led and contain no release-version branding
- **AND** the Install section still resolves the immutable Git release safely
