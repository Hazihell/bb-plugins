# Security Advisory

- Specialist: security
- Verdict: advisory

## Findings

- Severity: low
  - Category: supply-chain/build tooling
  - Location: root `bb-app` and `@get-bb/plugin-sdk` development pins
  - Finding: Dockside's unchanged frontend needs SDK 0.4.29's runtime export
    manifest during bundling. A floating or production dependency could widen
    the build trust boundary.
  - Recommendation: Keep both packages exact, development-only, lockfile-bound,
    and covered by `npm ci` plus audit; do not load either in plugin runtime.

- Severity: low
  - Category: generated-file masking
  - Location: `.github/check-dockside.mjs`
  - Finding: Restoring files after a build could hide an unexpected mutation if
    the wrapper restored an unbounded path set or swallowed a failed check.
  - Recommendation: Snapshot and restore only the two known vendored SDK
    declaration files in `finally`, propagate every command failure, and retain
    GitHub's final repository-wide `git diff --exit-code` check.

- Severity: informational
  - Category: merge integrity
  - Location: t3sidebar rename split and root catalog reconciliation
  - Finding: Broad ours/theirs conflict resolution could have replaced
    Taskboard, changed Dockside's deletion controls, or resurrected retired
    agent configuration.
  - Recommendation: Keep exact authority-tree comparisons, explicit five-plugin
    inventory assertions, retired-path assertions, and normal merge ancestry in
    the committed system check.

## Exploit Review

The reconciliation adds no new runtime input or privilege. Dockside is
byte-identical to its verified pre-merge tree, including strict custom-color
validation and server-authoritative destructive-operation revalidation. The
new attack surface is build-only: dependency substitution or a cleanup wrapper
that conceals tracked mutations. Exact npm pins/lock, isolated `npm ci`, narrow
two-file restoration, propagated failures, and GitHub's final clean-diff gate
close those paths. No blocking security finding remains.
