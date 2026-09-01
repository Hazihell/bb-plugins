# Capability Delta: Dockside Thread Management

## MODIFIED Requirements

### Requirement: Rows show semantic pull-request context

Dockside MUST show one PR indicator per family on the root only. The root's
trailing column MUST show elapsed time first and `#number` plus semantic icon
directly beneath it. Child rows MUST NOT look up or render PR metadata.

#### Scenario: Root and three children share a branch PR

- **Given** an expanded root has three children on the same PR branch
- **When** Dockside renders the family
- **Then** the root shows one PR number/icon below elapsed time
- **And** no child repeats that PR metadata
