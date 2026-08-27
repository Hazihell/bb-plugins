# Security Consultation

- Specialist: security
- Verdict: advisory

## SEC-1: Marketplace pre-execution provenance boundary

- Severity: Informational (resolved)
- Category: Supply-chain / arbitrary code execution
- Location: `design.md` — **Marketplace preparation** and **Failure handling**; `spec.md` — **Verification**
- Finding: The earlier attack path was execution of `npm run build` or `npm run check` from a mutable PR branch before its contents were trusted. A hostile branch update could have introduced an executable script and used the release operator's credentials or local release artifacts.
- Resolution: The design now resolves the exact GitHub PR head object, requires the local parent to equal it, compares against the recorded upstream base, permits exactly the two reviewed declarative entry paths, rejects every manifest/lockfile/script/workflow/executable-code change, reads the complete diff before execution, removes GitHub/npm/SSH credential variables, and stops before install on any mismatch. Together these controls close the identified path; `npm ci --ignore-scripts` is correctly treated only as an additional measure.
- Recommendation: Preserve the object IDs, allowlist result, executable-file check, and credential-free command invocation as release evidence. When the spec is next edited, reorder its abbreviated marketplace verification list so the pre-execution diff/schema gate appears before `npm ci` and explicit npm scripts, matching the controlling design and preventing an operator from following the summary in the unsafe order.
