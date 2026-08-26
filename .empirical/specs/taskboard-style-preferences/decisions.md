# Decisions: Taskboard Style Preferences

## D-001: Persist browse state on the client

Status: Accepted

### Evidence

Current filter/view selections live only in per-component Maps, while Taskboard
already keeps other client chrome in localStorage. The approved reference also
separates device-local filters/collapse from server-wide preferences.

### Options

- Extend project SQLite settings.
- Store one record in BB KV.
- Use a versioned browser-local observable store.

### Chosen approach

Use a versioned browser-local observable store keyed by project and provider;
keep explicitly saved Manage configuration server-side and separate.

### Trade-offs and risks

Preferences do not roam across devices, but a phone and desktop cannot overwrite
each other's transient working view. Browser storage can be unavailable or
malformed, so every read/write must fail safely to defaults.

### Verification

Test parsing, versions, storage failures, project/provider isolation, reload,
and live full/right-panel convergence.

## D-002: Separate browse and create assignees

Status: Accepted

### Evidence

Browse data currently carries display-name strings. Provider creation metadata
supplies provider-native IDs that vary by destination and issue type.

### Options

- Reuse the active browse assignee filter.
- Store one creation assignee per project.
- Store a scoped create default and validate it against metadata.

### Chosen approach

Store create assignee separately by project, provider, destination, and issue
type, then restore only when fresh metadata still offers that ID.

### Trade-offs and risks

This creates more keys and tests, but avoids accidental assignment caused by a
browsing choice or stale provider identity.

### Verification

Test same-scope restore, cross-scope isolation, removed IDs, and save-only-after-
successful-create behavior.

## D-003: Adapt restraint without replacing Taskboard

Status: Accepted

### Evidence

Taskboard already supports multi-provider Kanban, project navigation, broad
filters, and rich provider-native creation that the reference does not.

### Options

- Transplant the reference UI wholesale.
- Copy only its dark palette.
- Reimplement its hierarchy and density inside existing Taskboard surfaces.

### Chosen approach

Reimplement flat rows, shaped state glyphs, neutral sticky headings, constrained
filters, reading measure, and comment rail in Taskboard's `.tb-*` system. Keep
Kanban, project navigation, and provider semantics.

### Trade-offs and risks

Adaptation takes longer than a transplant, but avoids upstream responsive bugs,
SDK drift, and Linear-only assumptions. Visual regression remains a live-host
boundary.

### Verification

Capture wide List, constrained right panel, and detail screenshots; regression-
check Kanban, status movement, provider labels, themes, and accessibility.

## D-004: Reuse one create backend for two launch modes

Status: Accepted

### Evidence

The existing dialog and RPC already own provider metadata, validation,
confirmation, cache update, and mention output.

### Options

- Add a separate quick-create RPC and form.
- Keep the composer mandatory.
- Generalize the existing dialog with direct and assisted launches.

### Chosen approach

Generalize the dialog with direct and composer-assisted modes; both call the
existing validated `createIssue` RPC.

### Trade-offs and risks

The dialog gains explicit mode branching, but provider behavior remains
single-source. Direct mode must not accidentally start the hidden draft helper.

### Verification

Test direct blank launch, composer regression, unavailable projects, provider
metadata, and no provider write before confirmation.

## D-005: Centralize the external-content trust boundary

Status: Accepted

### Evidence

Mention context currently places remote issue descriptions beside Taskboard
metadata without stating that remote text is untrusted reference material.

### Options

- Remove descriptions from agent context.
- Add warnings independently at every caller.
- Centralize warning and delimiters in the context formatter.

### Chosen approach

Centralize a trusted warning plus start/end delimiters in
`formatWorkItemContext`, preserving useful issue content as data.

### Trade-offs and risks

The context becomes slightly longer, but every caller receives the same prompt-
injection boundary and the useful description remains available.

### Verification

Test ordinary issues and descriptions containing instruction-like content,
ensuring the trusted warning stays outside attacker-controlled text.

## D-006: Port the repository-owned creation metadata baseline

Status: Accepted

### Evidence

Public `main` exposes only destination, issue type, title, and description, so
there is no stable assignee ID to remember. The newer local Taskboard release
snapshot already contains repository-owned provider metadata and expanded create
contracts for GitHub, Linear, and Jira.

### Options

- Persist browse display names as create defaults.
- Design a second metadata API from scratch.
- Port and reconcile the newer Taskboard implementation before adding memory.

### Chosen approach

Port the local release snapshot's creation metadata schemas, adapter methods,
server handlers, UI fields, warnings, and focused tests into this branch, then
layer scoped assignee memory and direct launch on that stable-ID foundation.

### Trade-offs and risks

The milestone touches more provider code than public `main` suggested, but it
avoids unsafe display-name assignment and reuses already-developed first-party
work. The port must be selective so unrelated snapshot state and generated
artifacts are not imported.

### Verification

Run provider creation tests for metadata mapping, field validation, warnings,
scope enforcement, and legacy composer behavior before preference integration.
