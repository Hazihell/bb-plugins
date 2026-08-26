# Release wrapper verification addendum

This addendum preserves the immutable primary verification receipt while
recording the two publication-wrapper findings discovered during final review.

- Approved archive:
  `/home/dyaus/.bb/thread-storage/thr_7my6pz67bn/taskboard-v0.3.0-release-final-candidate-v2/bb-plugin-taskboard-0.3.0.tgz`
- Approved SHA-256:
  `9004d7495775ad696ad35517532eaacbd0e4558d429eda5eca55af9d9dca4f08`
- Wrapper:
  `.empirical/specs/taskboard-release-review-fixes/artifacts/verify-publish-taskboard.sh`

The wrapper passes `bash -n` and verify-only execution against the exact
archive. Publish mode remains unexecuted.

Immediately before the adjacent `npm publish` invocation, after registry,
dotenv, npmrc, and token setup, the wrapper repeats these fail-closed checks:

- the archive is still a regular non-symlink file;
- its path is still canonical and contains no symlink component;
- its SHA-256 still equals the approved digest; and
- its packed name/version still equal `bb-plugin-taskboard@0.3.0`.

The dotenv is sourced without `set -a`, and `export -n NPM_TOKEN` removes the
export attribute even if the dotenv used `export`. Hash, archive, and metadata
validation subprocesses therefore do not inherit the credential. Only the
immediately adjacent command-local environment supplies `NPM_TOKEN` and the
temporary npm config to `npm publish <canonical-archive> --ignore-scripts`
against pinned `https://registry.npmjs.org/`; the shell value is then unset.

Independent code review records both TOCTOU and credential-containment findings
as resolved, with no current findings. npm `0.3.0`, the release tag/branch, and
every remote release/marketplace action remain absent pending exact approval.
