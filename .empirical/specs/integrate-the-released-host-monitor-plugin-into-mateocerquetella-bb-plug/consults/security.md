# Security Specialist Consult

Specialist: security

## Verdict

advisory

## Exploit path

The integration trusts a copied plugin directory while the verification plan
only checks that released files are present and generated files are absent. An
attacker who can alter the release workspace, copy source, or review branch can
add or replace a file that is not obvious in the final repository diff. Once a
user installs Host Monitor, that code runs with the plugin's machine-monitoring
and host-worker authority, so the compromise can reach enrolled machines rather
than remaining a documentation-only supply-chain defect.

## Findings

### Finding 1

- **Severity:** high
- **Category:** supply-chain provenance
- **Location:** `spec.md` AC-1 and Verification; `design.md` Source boundary and Verification step 1
- **Recommendation:** Prove the transplant against the immutable release commit before delivery. Materialize `plugins/machine-monitor` directly from commit `9db09cc35553493113f31e5352a44911ae92bc73` (for example with `git archive`) or byte-compare the copied tree to that commit, excluding only `dist/` and `node_modules/`; then review an explicit allowlist of repository-only adaptations such as `package.json` test/workspace metadata. Record the comparison command and passing result as verification evidence.

## Smallest closing fix

Add one provenance check to the verification contract and run it before the
branch is committed: compare every tracked Host Monitor file with the immutable
release commit, then separately permit only the named manifest/test-harness
adaptations. This closes the substitution path without changing product code,
the release tag, or marketplace PR #128.
