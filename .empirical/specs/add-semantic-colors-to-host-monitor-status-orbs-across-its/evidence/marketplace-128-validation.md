# Marketplace PR #128 local validation

- Authenticated account: `MateoCerquetella`.
- PR: `get-bb/marketplace#128`, head
  `MateoCerquetella:submit-machine-monitor` at `f33423048fbd51246c3eb47e531326f7edde2511`.
- Current marketplace main used for validation:
  `e937f462a47180aef8725c5e71af6898da5ccfdd`.
- The existing PR branch is 12 commits behind current main. Its historical CI
  failure references Taskboard and Usage Tracker entries already removed from
  current main.
- The prepared entry description explicitly discloses guarded controls to stop
  eligible processes. Its vendored icon, id, source subdirectory, compatible
  `^0.1.0` range, and `host-monitor/` tag prefix remain unchanged.
- A detached current-main validation worktree combined the PR's entry/icon with
  the corrected description.
- `npm ci` passed with zero vulnerabilities.
- `npm run build` passed and composed 88 entries.
- `npm run check` passed, including source liveness.
- `git diff --check` passed in both the existing PR checkout and validation
  worktree.
- Plugin source fixes are prepared locally at Host Monitor `0.1.2`: the
  Processes fixed tab uses registry-backed `ChartColumn`, registration tests
  reject `Activity`, and manifest descriptions disclose guarded process-stop
  controls.
- No commit, merge, push, tag, GitHub Release, PR body edit/comment, re-review
  request, or marketplace remote mutation was performed.
