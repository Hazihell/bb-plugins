# Decisions: Dockside Thread Filters Bulk Delete

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Use a two-step guarded RPC for true bulk deletion

Status: Accepted

### Evidence

- The frontend sidebar action surface deliberately exposes only
  `requestDelete(threadId)`, which opens BB's one-thread confirmation and has no
  completion callback that can safely drive a multi-selection queue.
- The backend SDK exposes `threads.get`, `threads.childSummary`, and
  `threads.delete({ childThreadsConfirmed })`, which can authoritatively count
  descendants and revalidate state immediately before each mutation.
- The user explicitly requested one multi-thread selector and delete action.

### Options

- Open one BB confirmation per selected row; safe, but not a usable bulk flow
  and impossible to sequence reliably from the callback-free frontend action.
- Delete directly from the frontend through backend RPC; functional, but too
  easy to invoke without a review step.
- Use preview-token-confirm: server preview, explicit plugin confirmation,
  short-lived token, then server revalidation and bounded sequential deletion.

### Chosen approach

Use preview-token-confirm. The preview is authoritative and includes child
counts; confirmation is explicit and permanent; confirm consumes the token,
revalidates every root, skips newly protected work, and reports each outcome.

### Trade-offs and risks

This plugin owns the bulk confirmation rather than BB's one-row dialog. Keep the
existing context-menu delete on BB's host flow, cap the batch, expire and consume
preview tokens, use BB SDK mutations only on the server, and test stale/partial
failure behavior.

### Verification

Backend harness tests cover preview requirements, token expiry/consumption,
child confirmation, live-state changes, partial failure, and result ordering;
the live UI proves cancellation and permanent-action copy.

## D-002: Select stable filter and eligibility semantics

Status: Accepted

### Evidence

- Dockside already centralizes working detection and preserves root/child
  families in `lib/inbox.ts`.
- The user values working/unread presentation and initially wanted old inactive
  cleanup, so filters must expose both attention and age without hiding status.

### Options

- Arbitrary combinable facets, which add more state and denser controls.
- A single compact preset menu covering the common attention and cleanup views.
- A separate management page, which breaks the requested Orca-style sidebar.

### Chosen approach

Use one preset at a time: All, Working, Needs you, Unread, Quiet, Quiet 1d+,
and Quiet 7d+. Search runs after the preset while hierarchy stays intact.
Selection applies only to quiet root families and never to protected state.

### Trade-offs and risks

Preset filters are less expressive than arbitrary combinations, but remain
understandable in a narrow sidebar and make Select all predictable.

### Verification

Pure logic tests cover every preset, age boundary, hierarchy preservation, and
family-level protection.

## D-003: Create threads through BB's project-aware composer

Status: Accepted

### Evidence

- `experimental_useSidebarThreadActions().openNewThread({ projectId,
  focusPrompt })` is the host-supported path and selects the project in BB's
  native composer.
- BB, not Dockside, owns project source and default workspace/folder resolution.

### Options

- Add a plugin-owned folder picker and spawn RPC.
- Open the native composer with the project id.

### Chosen approach

Put a `+` button in each project header and call `openNewThread` with that exact
project id plus prompt focus, then invoke the list's `onNavigate` callback.

### Trade-offs and risks

The button uses the project's configured default rather than overriding it;
this is the intended behavior and stays consistent across machines/clients.

### Verification

Frontend behavior checks assert the project id and focus request, and the live
browser confirms the composer opens with the correct project/folder context.

## D-004: Bind reviewed cascade scope and retain recoverable outcomes

Status: Accepted

### Evidence

- Fresh-context review found that binding only root ids lets a newly attached
  quiet descendant enlarge the irreversible cascade after preview.
- The same review found that a selected quiet family can disappear from a Quiet
  preset when it becomes unread or active, hiding the retained skipped id.

### Options

- Bind only descendant counts; catches most drift but not an equal-count
  replacement.
- Bind the exact sorted descendant id set and skip on any difference.
- Leave retained results aggregate-only or merge selected families back into
  the selection view with per-id outcome copy.

### Chosen approach

Bind each token to the exact descendant identity set shown by preview and skip
the root when that set changes. During selection mode, union retained selected
families back into the filtered/search result and render per-id skipped/failed
messages inline.

### Trade-offs and risks

Any child topology change requires a fresh preview even when it reduces scope.
That extra confirmation is intentional for irreversible deletion. Selected
families can temporarily appear outside the named preset, but only while their
checkbox is retained for inspection.

### Verification

Regression tests add and remove quiet children between preview and confirm and
prove no deletion occurs; selection tests prove a newly unread selected family
remains visible outside Quiet, and live UI checks the inline outcome treatment.
