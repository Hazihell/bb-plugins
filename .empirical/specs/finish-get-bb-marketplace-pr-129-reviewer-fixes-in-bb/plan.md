# Plan: Taskboard 0.3.3 Marketplace Review Fixes

1. Add focused regressions for the intended boundary.
   - Cover prompt-derived title/description behavior and assert the active
     source/contract no longer exposes issue-draft worker RPC or agent spawn.
   - Cover ownership/title/visibility-gated cleanup of legacy helper records.
   - Cover all allowed `gh` environment categories, fixed controls, empty
     values, and exclusion of unrelated secret-like variables.
   - Extend distribution assertions for production SDK placement and exact
     Taskboard/other-plugin versions.

2. Remove the unsafe drafting runtime while preserving manual capture.
   - Reduce the pure draft module to prompt normalization.
   - Remove draft-worker schemas/RPC methods and server spawn, polling,
     reconciliation, event, cancellation, and model-output code.
   - Add idempotent legacy-key cleanup that stops only a verified old hidden
     Taskboard helper thread.
   - Simplify the composer dialog/session to immediately show editable prompt
     content and accurate non-model copy.

3. Constrain GitHub CLI child processes.
   - Add the documented pure allowlist builder.
   - Pass its output to every `execFile` invocation, including discovery.
   - Run the focused environment tests and a normal GitHub status path.

4. Prepare Taskboard `0.3.3` distribution surfaces.
   - Move exact `@get-bb/plugin-sdk` from dev to production dependencies.
   - Bump only Taskboard, refresh the root lock, and update root/leaf install
     docs, tests, capability deltas, and build metadata expectations.
   - Confirm Host Monitor `0.1.2` and Usage Tracker `0.1.4` are untouched.

5. Verify the source candidate.
   - Run focused Taskboard typecheck, tests, build, and metadata verification.
   - Export a Taskboard-only tracked subtree to an isolated temporary
     directory, production-install dependencies, and build it.
   - Run root checks/full CI, package/source-closure audit, and diff checks.
   - Exercise the live watcher-reloaded composer form and installed inventory;
     inspect plugin logs if reload is unclear.

6. Prepare Marketplace PR #129 locally.
   - Merge current upstream main into the existing PR branch without force.
   - Retain Taskboard and Usage Tracker entries as additions, restore the
     hashed Taskboard icon, update ranges/copy, and prove the exact three-file
     diff.
   - Run Marketplace dependency install/build/check and direct exact-tag
     liveness; isolate any unrelated repository-wide failure.

7. Review, integrate, and stop at release authorization.
   - Record immutable QA/browser evidence and run fresh-context review.
   - Integrate capability deltas against an independent current target.
   - Commit the validated local candidates as needed, then present the exact
     authenticated source push/tag/Release and Marketplace push/PR/comment
     commands. Execute none until the user approves that release boundary.
