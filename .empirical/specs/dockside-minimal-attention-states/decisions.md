# Decisions: Dockside Minimal Attention States

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Keep rich truth while compressing presentation

Status: Accepted

### Evidence

- Live rich-state screenshots showed assistant result sentences dominating the
  navigation and forcing extra row height.
- The user explicitly requested less text and stronger color differentiation
  for PR, working/in-progress, and attention states.
- BB already provides the canonical detail in the destination thread or PR.

### Options

- Remove the rich metadata and its backend verification entirely.
- Keep all text and adjust colors only.
- Keep the verified state sources but render one attention-first short state.

### Chosen approach

Keep lazy PR and output verification unchanged. Select one state per row:
family/child live attention first, otherwise PR, otherwise Done. Display only
short state text and PR number in the existing branch line; retain hidden
detail only for accessibility/tooltip context.

### Trade-offs and risks

PR/Done can be temporarily hidden while work needs attention, and detailed
outcomes require opening the destination. That loss is deliberate and
reversible. Text labels accompany semantic tokens, so the hierarchy does not
depend on color vision.

### Verification

Pure precedence/tone tests, existing rich-state tests, wide/compact screenshots,
and the complete repository checks.
