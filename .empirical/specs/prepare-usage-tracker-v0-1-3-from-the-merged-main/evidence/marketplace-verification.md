# Marketplace 0.1.3 local preparation

- Repository/fork: `MateoCerquetella/marketplace`
- Upstream: `get-bb/marketplace`
- Existing PR/head: #129 / `bump-taskboard-v0.3.1` /
  `9886b504bafc07fe879098900e6c7f6f72c5231f`
- Local proposed marketplace commit:
  `1361c0383c09480c4729afe63e9ad412ec41000c`
- Upstream base at preparation: `a683caa2ffb502cdc26926c48c88a45a8579970a`

## Prepared source entries

- Taskboard retains Git range `^0.3.1`, subdirectory `plugins/taskboard`, tag
  prefix `taskboard/`.
- Usage Tracker replaces unpublished npm `^0.1.1` with Git range `^0.1.3`,
  subdirectory `plugins/usage-tracker`, tag prefix `usage-tracker/`.
- Both use `https://github.com/MateoCerquetella/bb-plugins.git`.
- No listing identity, author, description, tags, or icon changed.

## Checks

- GitHub PR head, local parent, and recorded head all equal
  `9886b504bafc07fe879098900e6c7f6f72c5231f`; upstream base is
  `a683caa2ffb502cdc26926c48c88a45a8579970a`.
- Existing PR changed path: only `entries/taskboard.json`.
- Local commit changed path: only `entries/usage-tracker.json`.
- Combined path set: exactly those two declarative entry files; package
  manifests, lockfile, scripts, workflows, and executable code are unchanged.
- Marketplace README, complete schema, icon rules, both target entries, other
  Git examples, package scripts, build script, and validation workflow were
  inspected before the credential-free rerun.
- `npm ci --ignore-scripts`: passed, zero vulnerabilities.
- `npm run build`: passed; composed 82 entries.
- `npm run check`: passed; composed 82 entries.
- The final install/build/check rerun removed `GH_TOKEN`, `GITHUB_TOKEN`,
  `NPM_TOKEN`, `NODE_AUTH_TOKEN`, `SSH_AUTH_SOCK`, `SSH_AGENT_PID`, and
  `GIT_ASKPASS` from every process environment.
- `git diff --check`: passed.
- Exact `usage-tracker/v0.1.3` remote tag proof remains intentionally pending
  until approved publication; the repository liveness script accepts any
  existing prefixed semver tag and is not sufficient for range satisfaction.

The marketplace commit remains local; no remote branch or PR was changed during
preparation.
