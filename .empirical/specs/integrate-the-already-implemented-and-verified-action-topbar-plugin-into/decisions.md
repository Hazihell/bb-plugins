# Decisions: Integrate Action Topbar Into Main

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Select the implementation approach

Status: Accepted

### Evidence

- The plugin relies on `experimental_beginThreadActionSplitDrag`, introduced by
  the matching BB core change and declared experimental in Plugin SDK 0.4.33.
- The user explicitly requested integration into `main` and no marketplace
  submission until the SDK can change.
- The original plugin worktree contains unrelated uncommitted changes.

### Options

1. Publish the plugin source on `main` with an explicit compatibility warning.
2. Wait for upstream SDK stabilization before integrating any plugin source.

### Chosen approach

Use option 1 in a clean worktree, preserving the experimental API name and
requiring `bbPluginSdk >=0.4.33` in the manifest.

### Trade-offs and risks

The plugin cannot work on stock BB releases that lack the experimental split
drag API. The manifest and README make that incompatibility explicit, and the
plugin will not be submitted to the marketplace in this change.

### Verification

Run package tests and typechecking, inspect the final commit scope, and verify
the commit at the remote `main` ref.
