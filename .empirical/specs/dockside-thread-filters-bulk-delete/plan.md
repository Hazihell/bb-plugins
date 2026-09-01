# Plan: Dockside thread filters, bulk delete, and project create

1. Add pure thread-family management logic and tests.
   - Define filter presets, family attention/quiet/age predicates, stable group
     filtering, and bulk eligibility/protection reasons.
   - Cover exact age cutoffs, mixed descendants, order/immutability, and every
     protected state.

2. Add the guarded bulk-delete coordinator and tests.
   - Model preview tokens, bounded root batches, authoritative family reads,
     child totals, expiry/consumption, and stable result records.
   - Cover stale state, overlap/duplicates, current-thread protection, missing
     roots, partial failure, and retry-through-new-preview behavior.

3. Wire BB SDK reads/deletes through Dockside RPC.
   - Extend the contract with strict preview/confirm schemas.
   - Recursively page visible and hidden descendants with count/depth guards.
   - Map authoritative ThreadResponse state into coordinator protection and
     call `threads.delete` only after child confirmation.

4. Build the compact management UI.
   - Add icon vocabulary and focused filter-menu / native-dialog components.
   - Add Projects-header filter and selection controls, filtered/search group
     derivation, selection pruning/select-all, result messaging, and RPC flow.
   - Add optional root-family checkbox behavior without changing ordinary row
     navigation/status/parking/context menus.

5. Add the per-project native create action.
   - Refactor project headers into sibling collapse and `+` buttons.
   - Call `openNewThread({ projectId, focusPrompt: true })`, then `onNavigate`.
   - Verify accessible names, focus, and compact-client behavior.

6. Run focused and live verification.
   - Keep the root dev watcher running and inspect Dockside reload logs/status.
   - Run Dockside typecheck/tests while iterating.
   - Exercise filters, selection, protected rows, cancel/confirm, partial
     results, and project `+` in a real BB browser using disposable threads
     only; capture required screenshots.

7. Run repository gates and independent review.
   - Run root typecheck, tests, lint, and build.
   - Record the Empirical QA matrix, fresh-context outcome, security/UI
     evidence, and exact committed-diff review before capability integration.
