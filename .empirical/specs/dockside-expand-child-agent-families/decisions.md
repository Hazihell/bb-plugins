# Decisions: Dockside Expand Child Agent Families

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Default real child-thread families open

Status: Accepted

### Evidence

- Dockside already receives real visible child threads and draws the desired
  connector tree, but its current default closes once completed children have
  no attention state.
- The reference keeps the child tree visible as the primary structure, and the
  user explicitly asked to mimic it.

### Options

- Keep attention-only auto-expansion and require a click after completion.
- Expand whenever children exist, while preserving the existing explicit user
  override and search-forced expansion.

### Chosen approach

Use `childThreads.length > 0` as the default-open condition. Retain
`expandedOverride` as the user's mounted-session choice, and keep search as the
highest-priority force-open condition.

### Trade-offs and risks

Projects with many child families consume more vertical space by default, but
each family remains individually collapsible and this matches the requested
navigation model.

### Verification

Focused expansion tests plus a live root with three completed children.

## D-002: Keep aggregate chrome visually quiet

Status: Accepted

### Evidence

- The current `3 agents` label is visually heavy in a narrow row.
- A project can currently draw working and unread glyphs together even though
  the root rows immediately below already communicate both states.
- The reference uses compact numeric disclosure at the family and a quiet
  project header.

### Options

- Keep words and stacked project glyphs.
- Replace the family label with count + chevron and reduce project state to one
  priority glyph.
- Remove visual project aggregate glyphs entirely while retaining the hidden
  accessible summary and row-level status.

### Chosen approach

Use only numeric count + chevron for child disclosure. Remove visual aggregate
status glyphs from project headers; retain `projectStatusLabel` for screen
readers and keep every row-level working/unread/input state unchanged.

### Trade-offs and risks

Project headers no longer preview aggregate attention while collapsed, but the
project root count and accessible summary remain, and expansion reveals the
authoritative row states without duplicate symbols.

### Verification

Live wide/compact screenshots and DOM assertions prove the simplified chrome;
existing status tests protect row presentation.
