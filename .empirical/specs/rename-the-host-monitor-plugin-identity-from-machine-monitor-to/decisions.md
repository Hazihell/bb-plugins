# Decisions: Rename The Host Monitor Plugin Identity From Machine Monitor To

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Replace the active plugin identity completely

Status: Accepted

### Evidence

- BB derives the plugin id from package `bb-plugin-machine-monitor`, so the
  requested rename is a new runtime namespace rather than display copy.
- The id scopes routes, settings, logs, host artifacts, workers, and managed
  installation identity.
- Active source contains the old name in its directory, package/collection,
  route fallback, test hosts/RPC paths, 433 JSX/CSS selectors, lockfile, and
  documentation.

### Options

1. Change only the display name, which is already Host Monitor.
2. Rename package/directory but retain old internal classes and routes.
3. Replace every active identity-bound surface with `host-monitor`, retaining
   the old name only in immutable history and explicit migration evidence.

### Chosen approach

Choose option 3. Perform a mechanical but reviewed active-source rename across
package, directory, collection, route/RPC, selectors/keyframes, tests, docs,
lockfile, living capability/context, release metadata, and marketplace entry.

### Trade-offs and risks

This intentionally breaks update continuity for the retired id. Historical
Empirical receipts and Git objects must remain byte-honest, so an allowlisted
scan will still find the old name there and in this migration record.

### Verification

Derive the new id with the marketplace helper, inspect built artifact metadata,
run focused/root checks, scan all active files, and exercise live requests and
assets under `/plugins/host-monitor`.

## D-002: Start the new release namespace at v0.1.0

Status: Accepted

### Evidence

- The legacy `machine-monitor/v0.1.0` annotated tag peels to release commit
  `9db09cc35553493113f31e5352a44911ae92bc73` and BB refuses moved tags.
- No `host-monitor/*` tag exists.
- The plugin id is new and marketplace PR #128 has never merged, so no public
  `host-monitor` version line exists.

### Options

1. Move or reuse the legacy tag.
2. Start `host-monitor` at `v0.2.0` as if it were an in-place package update.
3. Preserve the legacy tag and create `host-monitor/v0.1.0` at the reviewed
   rename commit, keeping package version and marketplace range at `0.1.0` and
   `^0.1.0`.

### Chosen approach

Choose option 3. Treat `host-monitor` as the first release of the new plugin
namespace and the old tag as immutable retired history.

### Trade-offs and risks

Existing direct `machine-monitor` installs cannot update across ids. Current
documentation and local migration must make the remove/install boundary clear.
No remote tag is created until the separately approved release step.

### Verification

Before and after approved delivery, use peeled `git ls-remote` refs to prove the
legacy tag is unchanged and the new annotated tag points to the exact reviewed
commit.

## D-003: Cut over the local BB installation without two samplers

Status: Accepted

### Evidence

- The installed old id has three non-secret settings: threshold colors `true`,
  attention `70`, and critical `85`; it has no secrets, schedules, KV, or
  plugin database.
- Browser preference keys already use the stable `host-monitor` name.
- Reloading a path whose manifest derives another id is not a supported rename;
  BB treats the new id as a separate plugin.

### Options

1. Install the new id while the old sampler remains running.
2. Remove the old id first, losing the rollback and its settings.
3. Snapshot settings, disable old, install/configure/verify new, then remove old.

### Chosen approach

Choose option 3. Disable `machine-monitor` only when no process action is open,
install `host-monitor`, apply attention before critical, verify two refresh
cycles and one sampler, then remove the disabled retired id.

### Trade-offs and risks

The dashboard resamples cold and old route/panel session state disappears. The
disabled old id remains a rollback until verification, and no old data-dir or
artifact path is manually deleted.

### Verification

Inspect config before/after, plugin/service inventory, logs, connected fleet,
RPC/UI behavior, and final absence of an installed `machine-monitor` row.

## D-004: Preserve marketplace PR #128's head branch

Status: Accepted

### Evidence

- PR #128 is open from fork branch `submit-machine-monitor` and contains the
  pending entry plus its vendored icon.
- GitHub closes an open pull request when its head branch is renamed.
- Entry filename/id, icon filename, PR title/body, and source fields can all be
  updated without changing the head branch or losing the review thread.

### Options

1. Rename the head branch and let PR #128 close.
2. Close PR #128 and open a replacement PR.
3. Keep the historical internal head branch while renaming every published and
   review-visible marketplace artifact in the existing PR.

### Chosen approach

Choose option 3. After approval, update PR #128 in place and retain only its
head-branch name as an explicit infrastructure exception.

### Trade-offs and risks

One old-name string remains in GitHub's internal branch reference, but users,
catalog consumers, and reviewers retain the same PR and see only the new entry
identity. The exception is documented in the active-identity allowlist.

### Verification

Verify PR #128 remains open and its title, body, entry, icon, source subdir,
tag prefix, and screenshot URLs use `host-monitor`; separately confirm the
head ref remains the preserved exception.
