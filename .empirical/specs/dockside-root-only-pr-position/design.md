# Design

- Keep the single root PR hook.
- Remove child PR hook, state selection, and metadata rendering.
- Remove PR metadata from root branch line.
- Render PullRequestMetadata in the fixed trailing column immediately below the
  elapsed-time line and above child disclosure.
- Preserve right-aligned tooltip, PR link, provider marks, and all actions.
