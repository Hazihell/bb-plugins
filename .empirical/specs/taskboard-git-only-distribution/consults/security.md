# Security Consultation

- Specialist: security
- Verdict: advisory

## Review boundary

This is a design-level supply-chain review of the current Git-only distribution
spec, design, and capability delta. The accepted D-005 user supersession is
authoritative; the original Taskboard-only request and acceptance text remain
historical context rather than the current mutation boundary.

The two-plugin Git-only design closes the identified supply-chain gaps. Both
workspaces are private and stripped of npm publication contracts, the shared
publish configuration and local credential are removed, and the deny-only
`.npm-publish.env` ignore entry remains guarded solely to prevent legacy-clone
token disclosure. Direct Git commands use distinct subdirectories and tag
prefixes; community shorthand remains conditional on PR #126. The release
evidence, private-workspace refusal checks, historical-receipt comparison, and
ordered `EOTP`-then-`E404` registry timeline provide appropriate verification.

## Findings

None.

## Residual risks

- Taskboard's peeled commit evidence and BB tag-move detection make rewrites
  detectable, and Usage Tracker receives the same namespaced-tag rule. GitHub
  administrator control remains an explicit availability and first-install
  trust assumption rather than an undeletable-tag guarantee.
- Completion evidence must resolve `usage-tracker/v0.1.2` from the public remote,
  retain its peeled reviewed commit, and build the marketplace source from
  `plugins/usage-tracker`; a local working-tree build alone does not establish
  Git-source integrity.
- The `^0.3.0` and `^0.1.2` ranges intentionally trust future authorized tags in
  their respective namespaces. Users requiring fully reproducible installs need
  an exact-version or commit policy.
- A monorepo subdirectory narrows plugin selection but root build scripts,
  lockfiles, and transitive source used by that subdirectory remain part of the
  trusted reviewed commit.
- npm's private-workspace dry run exits zero. Guards must continue matching the
  skip warning for both exact workspace names and fail if either warning
  disappears; exit status alone is not a publication denial.
- The retained credential ignore entry prevents accidental staging but does not
  revoke copies of old tokens. Existing-clone owners should still delete the
  legacy file and revoke any credential whose confidentiality is uncertain.
- Registry `E404` is point-in-time evidence. The append-only timeline must keep
  the initial `EOTP` failure and later website completion distinct, and future
  documentation must not assume the npm names can never reappear.
