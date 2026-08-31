# Decisions: Adapt Github Pr 1964 Into A New Independently Installable Bb

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Select the implementation approach

Status: Accepted

### Evidence

PR #1964 changes BB core's internal new-thread hook and is not directly loadable as a plugin. Existing plugins can expose settings sections and app code, but cannot replace that hook.

### Options

1. Copy BB core files (not independently installable and relies on internal imports).
2. Implement the persistence contract as a plugin-owned library and settings UI.

### Chosen approach

Implement option 2, preserving storage semantics and documenting the upstream PR as the path to native composer behavior.

### Trade-offs and risks

The installed plugin cannot change BB's built-in picker until a host extension point exists; README and marketplace description state this limitation.

### Verification

Unit tests cover scope isolation, fallback, malformed values, and clearing.
