# Decisions: Implement And Test The Two Open Usage Tracker Fixes In

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Preserve stable IDs behind ordered wire aliases

Status: Accepted

### Evidence

- BB 0.40 reports `codex`, `claude-code`, and `acp-cursor`; the plugin currently
  indexes stable internal IDs `codex`, `claudeCode`, and `cursor` directly.
- The manifest supports BB 0.38 / SDK 0.4.6, whose response used the camel-case
  keys, and preferences/RPC/frontend state already persist the internal IDs.
- A missing integration is omitted by BB, while `not_installed` is an explicit
  provider probe result.

### Options

1. Rename all internal IDs to current wire keys.
2. Accept only current wire keys and raise the BB engine floor.
3. Preserve internal IDs and select current-first, legacy-second wire aliases,
   mapping an absent result to a provider-local unavailable error.

### Chosen approach

Choose option 3. It fixes current BB, retains declared compatibility and saved
preferences, and prevents one absent key from throwing the whole snapshot.

### Trade-offs and risks

The raw response type becomes partial and alias precedence must stay explicit.
An omitted provider is shown as unavailable rather than falsely uninstalled.

### Verification

Test current-only, legacy-only, dual-alias, and missing-provider responses while
asserting stable output IDs, status, order, and healthy-peer preservation.

## D-002: Derive canonical-first expanded rows without truncation

Status: Accepted

### Evidence

- The provider snapshot already retains all windows.
- `detailsCard()` currently creates exactly two rows from a reduced pair.
- The compact strip is intentionally constrained to one configured canonical
  reading and should not grow with provider-specific windows.

### Options

1. Render the raw provider array and remove canonical placeholders/order.
2. Add every provider window to both compact and expanded surfaces.
3. Keep the two canonical expanded rows, append every unselected window through
   a pure row helper, and leave compact selection unchanged.

### Chosen approach

Choose option 3. Exclude only the exact objects selected for canonical rows so a
second distinct window with the same or another canonical-looking label remains
visible.

### Trade-offs and risks

The card can grow beyond two rows. Additional rows span both grid columns with
top dividers, and live verification checks long/small-card behavior.

### Verification

Unit-test row labels/object identity/order and exercise a three-window card in
BB, including its compact reading and accessible action text.

## D-003: Reconcile canonical categories and extra labels separately

Status: Accepted

### Evidence

- Existing cache logic preserves one five-hour and one weekly category across
  wording aliases but drops every other window.
- Usage windows expose no stable ID; an additional window's label is the only
  available cross-refresh identity.
- Applying broad keyword classification to all rows could silently collapse two
  distinct provider windows.

### Options

1. Merge every cached row by exact label only.
2. Merge every cached row by broad five-hour/weekly categories.
3. Preserve category matching only for the selected canonical pair, then merge
   all remaining cached rows by exact label.

### Chosen approach

Choose option 3. Current selected canonical rows win by category; current extra
rows win by exact label; every missing remaining cached row is appended.

### Trade-offs and risks

Two distinct extra rows with the same label cannot be reliably reconciled across
refreshes and collapse to the current/first cached value. Current responses
still render duplicate-label objects because row selection uses object identity.

### Verification

Test empty and partial refreshes, renamed canonical labels, Fable retention,
same-label current precedence, and a second canonical-looking extra window.

## D-004: Keep release mutations outside the fix integration

Status: Accepted

### Evidence

- The user requested testing, integration, a release, and a marketplace update.
- The submit-a-plugin workflow requires a separate approval containing the exact
  account, remote, release commit, version, tag/source, and remote commands.
- A merged fix commit is needed before those exact release values can be
  prepared.

### Options

1. Mix version/tag/marketplace changes into the fix PR.
2. Integrate the reviewed fix first, then prepare a local release commit and
   marketplace update for separate approval.

### Chosen approach

Choose option 2. The fix PR closes #13 and #19 without publishing. Release
preparation begins from its merged `main` commit.

### Trade-offs and risks

The workflow has a deliberate approval pause, but the release target and every
remote mutation become exact and auditable.

### Verification

Confirm the fix PR contains no version/tag/marketplace mutation and show the
later local release commit plus commands before any release push.

## D-005: Bound and sanitize provider-defined windows before persistence

Status: Superseded

Superseded by: D-006

### Evidence

- BB validates usage labels only as non-empty strings and windows as an
  unbounded array; it does not cap or remove control characters before the SDK
  response reaches plugins.
- The first-party Claude bridge forwards a remote limits array and remote model
  display names into provider windows.
- Provider plugins are full-trust, so a malicious installed plugin gains no new
  privilege through this surface, but malformed trusted/remote data can amplify
  localStorage, reconciliation, and DOM work.

### Options

1. Accept the full-trust input assumption and render/cache every value.
2. Bound and sanitize only the expanded renderer, leaving cache growth intact.
3. Normalize at the response boundary: accept at most 32 windows, retain the
   first canonical five-hour/weekly rows, strip non-printing/bidi controls, cap
   labels at 120 code points, and reapply the window limit after cache merging.

### Chosen approach

Choose option 3 as defense in depth. Ordinary provider payloads remain far below
the bounds, and current plus legacy provider semantics stay unchanged.

### Trade-offs and risks

An anomalous provider reporting more than 32 distinct windows is truncated, and
unsafe/oversized label text is not byte-identical in the UI. Deterministic
source order plus canonical retention makes the degradation predictable.

### Verification

Feed over-limit windows with canonical rows at the tail, oversized bidi/control
labels, and rotating cached labels; assert canonical rows survive, labels are
plain bounded text, and normalized/reconciled arrays never exceed 32.

## D-006: Preserve the exact window contract and defer shared input hardening

Status: Accepted

Supersedes: D-005

### Evidence

- The approved specification and capability delta require every reported window
  under its original label.
- Independent adversarial review showed that a local 32-window/120-code-point
  projection makes display labels double as lossy cache identities, can drop a
  canonical marker after truncation, and does not repair pre-upgrade caches.
- Provider plugins are already full-trust code. BB's shared maintenance schema
  is the correct boundary for a consistent provider-result byte/count/text
  policy, including the first-party Claude bridge's remote limits response.
- The renderer uses `textContent`, not HTML, and the live 14-row stress case
  demonstrated bounded viewport layout with wrapping and vertical scrolling.

### Options

1. Expand this fix into a new keyed window model plus cache migration and amend
   the approved product contract.
2. Keep the lossy local projection despite its spec and identity conflicts.
3. Remove the local projection, preserve exact provider labels/windows as
   requested, and treat shared input limits as a separate BB contract change.

### Chosen approach

Choose option 3. Keep only the requested provider-key, complete-detail, cache,
layout, and accessibility fixes in this plugin. No local window truncation or
label rewriting ships in this release.

### Trade-offs and risks

A malformed trusted provider response can still make the details/cache larger
than ordinary provider data. Addressing that robustly requires a shared schema
and an explicit stable identity/display contract, not an implicit lossy label.

### Verification

Assert healthy current and legacy windows remain byte-for-byte labelled, current
aliases win with their exact windows, Fable survives refreshes, and long/many
ordinary rows wrap and scroll without horizontal overflow.
