# Plan: Dockside Main Reconciliation

1. Record the verified Dockside and current-main authority commits, commit the
   reconciliation contract, and start a normal no-ff merge without rewriting
   history.
2. Resolve exact conflicts by the authority map: preserve Dockside and its
   evidence; take main's retained plugins/root npm/CI; remove retired paths;
   add only Dockside collection, catalog, notice, and npm lock integration.
3. Reconcile Empirical policy with npm-native Dockside commands, refresh
   generated context, and add a deterministic reconciliation QA script.
4. Inspect the staged tree for unmerged entries, conflict markers, plugin
   inventory, exact authority-tree equality, and valid package/catalog links.
5. Run npm installation, Dockside test/typecheck/build, repository check, and
   live Dockside reload/default inspection; persist structured outcomes.
6. Commit the normal merge result and evidence, rerun the matrix on committed
   source, obtain a fresh-context committed-diff review, and replay the
   capability delta in an independent npm-installed worktree.
7. Commit integration records, push the existing branch, update PR #26, and
   confirm local/remote SHA equality and a non-DIRTY GitHub merge state.
