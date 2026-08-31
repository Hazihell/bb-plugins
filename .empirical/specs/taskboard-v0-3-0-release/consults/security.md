# Taskboard 0.3.0 Security Consult

- Specialist: `security`
- Verdict: `advisory`

## Findings

None. The approved spec and capability delta retain their dry-run minimum, while the executable design requires a real verified archive, a recorded and rechecked SHA-256, publication of that exact `.tgz` with lifecycle scripts disabled, and one-process npm credential scope. For this release, following that design closes the mutable-repack and lifecycle-hook credential paths identified in the earlier passes.

## Residual risk

The approved spec and capability delta do not themselves enumerate the hardened publication controls, so safety depends on release execution continuing to follow the design; validation against those requirement layers alone would not catch a future regression to dry-run-only publication. Residual exposure also includes compromise of the maintainer host, npm/GitHub accounts, npm client, or registry after digest approval. Retain least-privilege credentials and independently reconfirm the account, package owner, archive digest, version absence, and registry response at the approval boundary.
