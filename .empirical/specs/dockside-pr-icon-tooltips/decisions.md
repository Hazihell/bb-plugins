# Decisions: Dockside Pr Icon Tooltips

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Compact icon with explicit hover detail

Status: Accepted

### Evidence

The user wants the reference's clear PR status without permanent row prose.

### Options

Permanent status pill; native title only; or icon plus themed hover/focus card.

### Chosen approach

Use number then semantic icon and a themed two-line hover/focus tooltip.

### Trade-offs and risks

Tooltip can clip; right-align above the metadata, bound width, disable pointer
events, and retain native title/accessibility fallback.

### Verification

Icon matrix tests, source order/tooltip assertions, live plugin and root checks.
