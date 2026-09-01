# Plan: Action Topbar Main Integration

1. Confirm the clean worktree contains only the Action Topbar package, root
   documentation/notices, lockfile changes, and Empirical feature records.
2. Install npm workspace dependencies and stage the regenerated lockfile.
3. Run Action Topbar tests and typechecking, then attempt the plugin build and
   record any expected SDK-version compatibility block.
4. Inspect the complete staged diff and finish the existing cherry-pick.
5. Synchronize the local Empirical tracker after the durable commit.
6. Push the commit to `origin/main` and verify the remote ref.
7. Report the install commands and the marketplace/SDK warning to the user.
