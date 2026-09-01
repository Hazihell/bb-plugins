# Design

- Remove `useThreadSummaries` from ThreadCard and remove root `done` selection.
- Delete DoneMetadata, summary hook, summary RPC/cache, and summary-only tests.
- Keep PR mapping; render `#number` first and its colored icon second/rightmost.
- Keep activity icon, provider-after-count, provider-first children, left status
  glyphs, age, and all management behavior unchanged.
- Tests assert PR state icon/order and source/system checks assert no completion
  plumbing or ordinary check icons.
