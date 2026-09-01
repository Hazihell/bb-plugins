# Decisions: Dockside Icon Only Agent States

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Use existing glyphs and remove child completion chrome

Status: Accepted

### Evidence

- The user rejected repeated Done badges on sub-agents and requested icons
  instead of permanent state text.
- Every row already has a BB-derived left status glyph with accessible text.
- Root output verification and PR state remain useful truth sources.

### Options

- Replace text with icons but keep child Done icons.
- Remove all completion/PR state.
- Keep root truth and PR context, remove child Done, and reuse existing glyphs.

### Chosen approach

Use one accessible root activity/PR/completion icon, PR icon+number on quiet
children, and the existing left glyph as the only child live-status signal.
Do not request or render child completion metadata.

### Trade-offs and risks

Quiet children no longer explicitly say Done, and icon meaning may require
hover for unfamiliar users. Time, neutral state, semantic shape/color, labels,
and destination detail preserve the necessary context without repetition.

### Verification

Icon-mapping/precedence tests and real wide/compact screenshots with three
quiet children and no child Done marker.
