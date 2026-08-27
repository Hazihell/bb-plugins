# Plan: Active Git-only Distribution Audit

## 1. Tighten current documentation

- Remove unnecessary npm-distribution explanatory prose from the root README
  and active context while keeping real development commands.
- Reword the Usage Tracker changelog's SDK dependency note so it cannot be read
  as plugin publication.
- Preserve the exact Git semver and BB Community install paths.

## 2. Expand preventive guards

- Extend the distribution test across root/plugin docs, changelog, active
  context, root/plugin manifests, CI, and publish-config absence.
- Assert both workspaces/root are private, publish hooks/config/tokens are
  absent, and Git install sources remain complete.

## 3. Verify active and historical boundaries

- Run focused tests and the signed root check.
- Repeat the classified repository-wide search and both private publish dry
  runs.
- Audit historical tracked files and collected-receipt artifact digests.
- Validate the locally prepared marketplace schema; retain full liveness as a
  post-tag release gate.

## 4. Review and integrate

- Obtain an independent code/supply-chain review of the final diff.
- Integrate the new shared plugin Git-distribution capability against the
  approved detached worktree.
- Amend the existing local release commit only after checks pass; perform no
  remote mutation without exact approval.
