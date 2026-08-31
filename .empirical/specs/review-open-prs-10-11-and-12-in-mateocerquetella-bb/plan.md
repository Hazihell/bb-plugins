# Plan: Integrate Community PRs 10, 11, and 12

## 1. Establish the integration history

- Fetch current main and exact PR heads; create one owner integration branch.
- Merge PR #10 normally.
- Merge PR #11 with the whole-tree `ours` strategy and verify no obsolete
  persistence files/symbols enter the tree.
- Merge PR #12 after #11 so only its seven preset commits are new, preserving
  conflict markers for deliberate semantic resolution.

## 2. Resolve Usage Tracker and Taskboard behavior

- Retain PR #10 compact-limit preference, normalization, live selection,
  fallback, docs, and tests against current Usage Tracker.
- Port preset schemas/storage/RPC/CLI/tests to strict `BrowsePreferences`.
- Integrate preset save/apply/manage controls into the current Taskboard UI and
  observable store without restoring obsolete filter markup or writers.
- Preserve private Git-only manifests, versions, provider safety, query,
  collapse, assignee, filter icons, and responsive behavior.

## 3. Credit and verify

- Add Stephen Dolan and Andrii Los to root/plugin contributor documentation.
- Add focused guards for obsolete PR #11 mechanics and author ancestry.
- Run focused suites, root `npm run check`, build metadata, CLI/RPC exercises,
  and live Taskboard/Usage Tracker reload walkthroughs.
- Complete security and independent code review, then replay capability deltas
  against detached current main.

## 4. Deliver

- Commit only the reviewed conflict resolution and Empirical integration state
  atop the original contributor merge parents.
- Push the owner integration branch, open one source PR, require hosted CI, and
  merge normally into main.
- Verify exact PR #10/#11/#12 head SHAs and contributor commits are ancestors of
  main; confirm the original PRs show merged or close only with the integration
  PR reference when GitHub cannot auto-detect.
