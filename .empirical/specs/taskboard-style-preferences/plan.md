# Plan: Taskboard Style Preferences

## 1. Establish the working baseline

- Confirm `dev` is the active branch and record the pre-change Taskboard test,
  typecheck, and build status after `npm install` in the fresh checkout.
- Inspect the exact current `CreateIssueDialog`, filter/group rendering, right-
  panel props, context formatter, and existing pure-test conventions.
- Start the local Taskboard dev loop only when live BB verification begins.

## 2. Build the pure preference subsystem

- Add `plugins/taskboard/browse-preferences.ts` with strict versioned schemas,
  bounded defaults, project/Across scope keys, storage adapter, provider
  reconciliation, observable subscriptions, collapse overrides, and separate
  create-default helpers.
- Add focused Node tests for versioning, malformed/unavailable storage,
  project/provider isolation, clear-current-scope, cross-surface notification,
  collapse/search semantics, and create-assignee scope/validation.

## 3. Integrate shared browse state

- Replace the full and right-panel in-memory Maps with one shared preference
  binding.
- Hydrate before persistence effects, derive `committedQuery`, keep search
  session-only, and reconcile once the selected provider is known.
- Give Across projects its own scope and ensure Clear touches only that scope.
- Preserve the server-side default view as the seed when no client override
  exists.

## 4. Integrate remembered create assignee

- Port the newer repository-owned provider-native creation metadata contract
  from the local Taskboard release snapshot into this public-main baseline,
  including adapter metadata discovery, expanded validated fields, and warnings.
- Generalize create-dialog launch state without coupling it to browse filters.
- After metadata loads, restore only a still-listed native assignee ID for the
  exact project/provider/destination/issue-type scope.
- Save the ID only after successful provider creation; cover scope changes,
  removed IDs, and unassigned success.

## 5. Harden external agent context

- Centralize the trusted warning and external-data start/end delimiters in the
  Taskboard context formatter used by mentions/handoffs.
- Add tests with ordinary and instruction-like issue descriptions while
  preserving useful facts and content.

## 6. Implement List/group visual and interaction changes

- Add the semantic shaped state glyph and stable compact row grid.
- Add accessible whole-header collapse toggles with terminal defaults,
  persisted overrides, and temporary matching-group search expansion.
- Cap List and Across-project List content at 56rem while leaving Kanban full
  width and movement logic unchanged.
- Neutralize persistent group tints, preserve meaningful selection/priority
  accents, and expose hover actions on focus-within too.

## 7. Implement constrained filters and detail hierarchy

- Add the explicit constrained surface mode for the right panel.
- Render search separately, keep List/Kanban as a segmented control, and add a
  `Filters · N` trigger with named checked sections, bounded scrolling,
  active summary, and fixed Clear footer.
- Flatten the detail frame and convert comment cards to one chronological rail,
  preserving Markdown, author, time, loading, and errors.

## 8. Add direct project-board capture

- Generalize `CreateIssueDialog` into direct and composer-assisted modes.
- Add labeled `New issue` in the full header and an accessible 36px `+` in the
  right-panel header. Name destination project/provider in the dialog.
- Reuse `getCreateIssueContext`, metadata, and `createIssue`; skip the hidden
  helper in direct mode and preserve existing assisted mention insertion.

## 9. Documentation and provenance

- Update Taskboard README behavior and development notes.
- If implementation copies or closely adapts upstream code/CSS/SVG expression,
  add the full MIT attribution to root and Taskboard third-party notices and a
  concise acknowledgement. If patterns are independently reimplemented, record
  that provenance accurately without copying screenshots or trademarks.

## 10. Verification and review

- Run focused Taskboard tests/typecheck throughout, then Taskboard `check` and
  root `npm run check`.
- Build/reload through the local path and exercise wide List, Kanban, project
  switch/reload, right panel, compact filters, collapse/search, direct and
  assisted creation, detail/comments, themes, keyboard, and touch targets.
- Collect immutable test, browser, screenshot, and review receipts for every
  acceptance criterion.
- Run independent code review, repair findings, replay against an independent
  target/worktree, and integrate only after Empirical reports verified.
