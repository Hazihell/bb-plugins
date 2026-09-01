# Plan: rich PR and agent outcome metadata

1. Add pure PR-state presentation, summary normalization/LRU cache, and family
   waiting derivation modules with exhaustive tests.
2. Extend the typed Dockside RPC and server adapter for bounded, timestamp-
   validated final-output batches and deletion cache cleanup.
3. Add the family-scoped lazy summary hook with stale-request cancellation.
4. Add reusable PR/Done/Waiting metadata UI, then wire root and expanded child
   rows with stable precedence and connector tint.
5. Run focused tests/typecheck/lint and watcher reload; fix live density,
   accessibility, PR-null, output-null, and compact-layout issues.
6. Exercise completed demo children, one controlled active child, and available
   PR branches in real BB; capture screenshots and record QA evidence.
7. Run root gates, local commit, fresh-context code review, clean full CI, and
   capability integration without pushing.
