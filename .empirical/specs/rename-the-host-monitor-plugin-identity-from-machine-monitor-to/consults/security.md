# Security Consult

- Specialist: security
- Verdict: advisory

## Executive answer

The string rename is not itself the useful attack surface. The exploitable
moment is the identity cutover: an already-loaded `machine-monitor` renderer or
an old host worker can outlive the point at which the plugin is reported as
disabled. Because the design says the retired implementation already uses
`host-monitor` DOM events and local-storage keys, stale and new code can share
one client-side namespace. An attacker able to run same-origin plugin code, or
a host that reconnects late, can use that overlap to race state/events, make
stale data appear current, or cause duplicate handling during the migration.

The smallest fix is one explicit quiescence barrier between local-cutover steps
2 and 3: invalidate any pending process action, disable the retired id, reload
all renderer contexts that loaded it, and obtain a per-enrolled-host
acknowledgement that the retired service count is zero before enabling the new
worker for that host. Keep the disabled retired installation until every host
has checked in and passed that assertion. Then verify one service per host for
two refresh cycles before removal.

## Findings

### SEC-1: Disable status is not a complete namespace-quiescence proof

- Severity: medium
- Category: identity lifecycle / race condition
- Location: `design.md`, **Local BB cutover**, steps 2–6; `deltas/plugin-git-distribution.md`, **Migrate a local Host Monitor identity safely**
- Exploit: A renderer that loaded the old content script can retain its event
  listeners after the backend is disabled, while a disconnected enrolled host
  can retain the retired worker until it reconnects. Installing the new id at
  that point creates two implementations around shared `host-monitor` browser
  keys/events or two sampler generations. Same-origin malicious code can emit
  or overwrite shared state during that window; ordinary delayed events can
  produce the same integrity failure. The visible result can be spoofed
  freshness, duplicate UI handling, or ambiguous process-action routing.
- Recommendation: Add the quiescence barrier described above as a required
  migration assertion. A global aggregate of “zero services” is insufficient;
  capture the enrolled-host set, require an acknowledgement for each host, and
  treat an unreachable host as migration-pending. On reconnect, reconcile the
  disabled retired worker before deploying the new worker. Force a full BB
  renderer reload after disabling the old id, and prove that no old route,
  request, asset, listener, or service is active before proceeding.

### SEC-2: “Sanitized screenshot” lacks a concrete disclosure boundary

- Severity: medium
- Category: information disclosure
- Location: `spec.md`, AC-7 and **Verification**; `design.md`, **Verification design** and **Release and PR design**
- Exploit: Marketplace screenshots are public and persistent. Masking IP
  addresses alone does not remove hostnames, usernames, process names and
  command lines, local paths, repository names, or tokens rendered in a
  process ledger. A passive observer can inventory the developer environment
  from one accidentally unsanitized capture.
- Recommendation: Define the release screenshot gate explicitly: use fixture
  data or redact hostnames, addresses, usernames, process arguments, paths, and
  identifiers; then perform an OCR-assisted and manual review of the exact
  image bytes referenced by the marketplace PR. Publish only that reviewed
  artifact, and record its hash with the release evidence.

### SEC-3: Tag immutability is stated as policy but not enforced as a control

- Severity: medium
- Category: software supply-chain integrity
- Location: `spec.md`, AC-6 and AC-7; `design.md`, **Release and PR design**; `deltas/plugin-git-distribution.md`, **Preserve distribution history**
- Exploit: The marketplace range ultimately trusts Git refs. If a repository
  credential with tag-write authority is compromised, an annotated
  `host-monitor/v0.1.0` tag can be replaced after review unless the remote
  rejects updates and deletions. Future installs can then resolve attacker
  code while retaining the approved-looking version and tag name.
- Recommendation: Before creation, prove the new remote tag is absent. Bind
  the approval record to the exact peeled commit SHA, push without force, and
  immediately verify the public peeled ref equals that SHA. Protect both
  `host-monitor/*` and legacy `machine-monitor/*` tags with a repository
  ruleset that rejects updates and deletions, and make marketplace validation
  assert the same peeled SHA before the PR mutation is accepted.

## Residual assessment

With the per-host/renderer quiescence barrier, explicit screenshot review, and
enforced tag immutability, the rename does not add a new privilege boundary.
The existing masked-address default, guarded process confirmation, no-alias
rule, and approval gate should remain unchanged.
