# Design: Taskboard 0.3.3 Marketplace Review Fixes

## Overview

Prepare one Taskboard-only patch release that closes the Marketplace review at
the source boundary. The patch makes the SDK available during managed Git
installs, replaces the unenforceable hidden model worker with deterministic
prompt-derived manual review, constrains `gh` child environments, and updates
only Taskboard's version. Marketplace PR #129 is refreshed separately from
current upstream and remains local until release approval.

## Production-only Git build

`plugins/taskboard/contract.ts` executes `defineRpcContract` at app build time,
so `@get-bb/plugin-sdk@0.4.6` moves from Taskboard's `devDependencies` to
`dependencies`. The exact pin and engines stay unchanged. Root lock records
must mark the Taskboard SDK edge as production while retaining the existing
single installed SDK package.

Verification exports the complete tracked Taskboard subtree into a new
temporary directory outside the npm workspace, installs with
`--ignore-scripts --omit=dev --omit=optional`, and invokes the pinned BB CLI
to build there. This prevents the root workspace's existing node_modules or
dev dependencies from masking an incomplete release.

## Composer-assisted issue review without an agent

The public SDK version has no enforced read-only thread spawn mode. Replacing
`auto` with `accept-edits` or `full` would still permit repository mutation, so
Taskboard removes new issue-draft worker creation entirely.

- The composer action still requires a non-empty prompt and opens the same
  provider-aware review dialog.
- A small pure prompt normalizer derives the initial title from the first
  non-empty line and retains the complete trimmed prompt as the description.
- The form remains fully editable and the existing create RPC remains the only
  tracker mutation; no model request, thread spawn, polling, retry, or
  cancellation RPC remains.
- Loading/status copy no longer claims repository inspection, read-only
  execution, AI generation, or model usage.
- Legacy draft RPC schemas and parsing/prompt machinery are removed from the
  active source closure.

Activation retains one bounded compatibility cleanup. It derives candidate ids
only from valid running legacy request records and old thread-index keys; an
unrecorded exact-title thread is never targeted. It intersects those ids with
Taskboard-owned thread listings and archives/stops a candidate only when the
live thread is hidden, owned by Taskboard, and carries the old helper title. A
recorded live mismatch aborts without deleting retry state. Corrupt records
with no valid helper id are cleared without targeting a thread. Old
request/thread/cancellation keys are deleted only after every verified helper
stop succeeds.

## Deliberate GitHub CLI environment

Before forwarding any authenticated environment, Taskboard resolves `gh` to an
absolute executable. An explicit absolute `GH_PATH`, fixed OS install
locations, and absolute PATH directories are candidates; empty/relative PATH
entries and the current workspace or its descendants are rejected. Each
candidate is access-checked and canonicalized with `realpath`; non-operator
candidates are then checked again against the canonical workspace so an
external symlink/junction cannot point back into repository-controlled code.
Accepted candidates are probed using a separate token-free environment.
Taskboard never passes bare `gh` to `execFile`.

The authenticated environment builder starts with fixed `LANG`/`LC_ALL`,
`GH_PROMPT_DISABLED`, and `GH_NO_UPDATE_NOTIFIER`, then copies values only from
these categories:

- executable/system lookup: `PATH`, `PATHEXT`, `SystemRoot`, `WINDIR`,
  `COMSPEC`;
- user/config roots: `HOME`, `USERPROFILE`, `APPDATA`, `LOCALAPPDATA`,
  `XDG_CONFIG_HOME`, `GH_CONFIG_DIR`;
- GitHub authentication/routing: `GH_TOKEN`, `GITHUB_TOKEN`,
  `GH_ENTERPRISE_TOKEN`, `GITHUB_ENTERPRISE_TOKEN`, `GH_HOST`;
- network trust/routing: uppercase and lowercase HTTP/HTTPS/NO proxy
  variables, `SSL_CERT_FILE`, `SSL_CERT_DIR`;
- Linux secure credential storage: `DBUS_SESSION_BUS_ADDRESS` and
  `XDG_RUNTIME_DIR`;
- temporary storage: `TMPDIR`, `TMP`, `TEMP`.

Normal API calls receive that object only after absolute resolution. Version
probes receive fixed controls plus the minimum Windows system/temp keys and no
token, home, config, proxy, or PATH variables. Tests seed every supported
category plus unrelated secret-like keys, assert allowed values and fixed
controls, prove unrelated keys are absent, and cover POSIX/Windows cwd-shadow
attempts.

## Version and documentation coherence

Only Taskboard advances from `0.3.2` to `0.3.3`. Update its manifest, root lock
workspace record, root and leaf Git-install commands, release/distribution
assertions, and living capability deltas. Host Monitor remains `0.1.2`; Usage
Tracker remains `0.1.4`. Production build metadata must report Taskboard
`0.3.3` with BB `0.38.0` and SDK `0.4.6`.

The leaf README describes the prompt-derived review flow and explicit create
confirmation without model/read-only claims. It also states that GitHub CLI
receives only its deliberate environment categories.

## Marketplace PR #129 preparation

Use the dedicated clean Marketplace checkout. Merge `upstream/main` normally
into `bump-taskboard-v0.3.1`, preserve the two entry files as additions, and
restore the byte-identical 414-byte Taskboard SVG as
`taskboard-0b77950c.svg`. Update ranges to Taskboard `^0.3.3` and Usage Tracker
`^0.1.4`; the Taskboard description covers task browsing/creation but makes no
removed AI claim.

The final base-relative Marketplace diff must be exactly three added files.
Run dependency install and build/schema checks. Run repository-wide liveness
and separately verify both exact public tag refs so an unrelated catalog
failure cannot obscure these sources.

## Verification sequence

1. Focused Taskboard tests/typecheck/build and new source/security regressions.
2. Repository-independent production-only subtree install and build.
3. Root checks and the exact `bun run ci` promotion entrypoint.
4. Metadata, source closure/package dry-run, version, and diff audits.
5. Live watcher reload, installed inventory, and manual composer issue-form
   exercise confirming immediate editable prompt content and no spawned helper.
6. Marketplace merge resolution, exact diff, schema/build/liveness checks.
7. Fresh-context review and capability integration.
8. Present exact authenticated remote release and PR-update commands; stop for
   approval.

## Rollback

The patch is additive to dependency availability and subtractive to the unsafe
worker. Reverting the source commit restores the former flow; no stored issue
or tracker data migrates. The cleanup only removes Taskboard's obsolete draft
keys and stops a thread after ownership/title/visibility verification.
