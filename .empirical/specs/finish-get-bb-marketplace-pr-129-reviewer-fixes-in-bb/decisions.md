# Decisions: Finish Get Bb Marketplace Pr 129 Reviewer Fixes In Bb

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Select the implementation approach

Status: Accepted

### Evidence

- Marketplace review reproduced a production-only Git-subdirectory build
  failure because `contract.ts` executes `defineRpcContract` from the SDK root
  while the SDK exists only in `devDependencies`.
- SDK `0.4.6` exposes `auto`, `accept-edits`, and `full` thread permission
  modes; none enforces repository read-only execution. The current helper uses
  `auto` and `visibility: hidden`.
- The composer flow already has deterministic prompt-to-title/body fallback
  behavior and a visible confirmation form.
- `sources/github.ts` currently invokes every `gh` process with the entire
  server environment.

### Options

1. Keep the hidden agent, change its label or switch to another writable
   permission mode, and disclose the residual risk.
2. Remove automatic agent execution, preserve prompt-derived manual review,
   and clean up legacy helper records.
3. Add an unreviewed direct model integration and separate credentials.

### Chosen approach

Choose option 2. Move the exact SDK package to production dependencies, remove
new issue-draft agent spawning/model parsing, preserve the visible editable
prompt-derived form, and retain only bounded idempotent cleanup for older
running helper records. Build `gh` subprocess environments from a documented
allowlist plus fixed non-interactive/locale values.

### Trade-offs and risks

Taskboard loses automatic repository-aware rewriting, but no longer claims or
attempts a security property the public SDK cannot enforce. The visible review
and explicit tracker confirmation remain. The environment allowlist may need
future additions for supported enterprise setups, so it includes standard
GitHub auth/config, proxy, CA, executable lookup, Windows home/system, and temp
variables and is regression-tested.

### Verification

Prove no issue-capture path calls `threads.spawn` or uses auto approval; test
prompt-derived form behavior and legacy cleanup; test allowed and secret-like
environment keys; run a repository-independent production-only install/build;
and complete focused, root, live, Marketplace, and fresh-context checks.

## D-002: Refine GitHub CLI proxy and credential-store variables

Status: Accepted

### Evidence

GitHub CLI uses Go's HTTP transport, which honors HTTP, HTTPS, and NO proxy
variables but not `ALL_PROXY`. Secure credential storage on Linux can require
the session D-Bus address and XDG runtime directory even when HOME is present.

### Options

1. Forward every proxy and desktop-session variable.
2. Forward only the Go-supported proxy pairs plus the two Linux credential
   store roots.

### Chosen approach

Choose option 2. Omit `ALL_PROXY`/`all_proxy`; include uppercase/lowercase
HTTP, HTTPS, and NO proxy variables plus `DBUS_SESSION_BUS_ADDRESS` and
`XDG_RUNTIME_DIR`.

### Trade-offs and risks

SOCKS-only setups expressed exclusively through `ALL_PROXY` are not supported
by GitHub CLI's Go transport and gain nothing from forwarding it. The two
session variables reveal only routing paths to the child already trusted with
GitHub credentials; unrelated desktop and agent variables remain excluded.

### Verification

Strict POSIX and Windows synthetic-environment tests assert the exact allowed
keys, fixed controls, casing behavior, empty-value handling, and exclusion of
secret-like sentinels.

## D-003: Resolve GitHub CLI before exposing credentials

Status: Accepted

### Evidence

The first design used bare `gh --version` with the authenticated child
environment. On Windows, current-directory executable lookup and, on every
platform, relative/current-workspace PATH entries can select attacker-provided
code before a trusted GitHub CLI. That code would inherit GitHub tokens.

### Options

1. Keep bare lookup and remove tokens from only the probe.
2. Resolve and canonicalize an absolute executable using trusted candidates,
   reject cwd/relative PATH entries, probe without credentials, then use the
   resolved path for authenticated calls.

### Chosen approach

Choose option 2. Support an operator-supplied absolute `GH_PATH`, fixed common
OS locations, and absolute PATH directories outside the current workspace.
Access-check and `realpath` each candidate; version-probe it with fixed controls
and minimum Windows system/temp variables only. Never execute a bare name.

### Trade-offs and risks

A GitHub CLI intentionally installed inside the server's current workspace is
ignored unless the operator explicitly names its absolute `GH_PATH`. This is a
deliberate security boundary. Absolute user PATH locations remain trusted in
the same way as the user's normal shell installation.

### Verification

Source assertions require candidate resolution, `realpath`, and the token-free
probe. POSIX and Windows tests reject relative/current-workspace shadow paths,
verify every candidate is absolute, and preserve fixed/system discovery keys
without auth/config/PATH values.
