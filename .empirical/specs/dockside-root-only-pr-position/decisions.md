# Decisions: Dockside Root Only Pr Position

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: One family PR indicator on the root

Status: Accepted

### Evidence

The screenshot shows identical PR metadata repeated on root and every child.

### Options

Keep repetition; deduplicate in children conditionally; or make root the sole
family PR owner.

### Chosen approach

Root owns PR lookup/display in its right column below elapsed time. Children do
not query PR state.

### Trade-offs and risks

Child-specific PR differences would be hidden, but family children share the
same branch in this presentation and root ownership prevents repetition.

### Verification

One-hook/no-child-hook source assertions and live family screenshot.
