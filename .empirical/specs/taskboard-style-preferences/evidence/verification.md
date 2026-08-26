# Verification evidence

Collected: 2026-08-26T14:27:39-03:00  
Branch: `dev`  
Base commit: `f3ecae77e9add2ffd649442ee880841e30fc25eb`

## Automated checks

- `npm run check --workspace bb-plugin-taskboard` — PASS
  - SDK contract check against `@get-bb/plugin-sdk` 0.4.6
  - TypeScript check
  - 67/67 Node tests
  - production server/app build
  - build metadata verification
- `npm run check` — PASS
  - Taskboard checks above
  - Usage Tracker typecheck, 13/13 tests, and production build
- `git diff --check` — PASS

The focused suite covers strict/versioned preference parsing, storage failure,
project/Across-project isolation, asynchronous default seeding, observable
cross-surface updates, provider reconciliation, collapse persistence/search,
canonical create scopes, fresh-option assignee restoration, rejected/successful
creation persistence, external-data delimiters and handoff routing, provider
metadata pagination/native IDs/defaults, connector-revision binding, ambiguous
write handling, control-character confinement, and GitHub refresh races.

## Live BB walkthrough

The local-path Taskboard plugin was built and reloaded by the running dev loop.
The walkthrough used a real configured Linear project containing 247 cached
work items and did not create, update, move, or comment on any provider item.

- List rendered compact flat rows, shaped category glyphs, neutral sticky group
  headers, and the measured content column in light and emulated dark schemes.
- Kanban remained a full-width horizontal board.
- Switching List → Kanban survived a BB window reload; the view was restored to
  List afterward.
- Collapsing `In Review` survived reload. Searching for `FRE-2461` temporarily
  reopened the matching group, disabled the misleading collapse action, kept
  the stored collapse override unchanged, and restored the collapse when the
  search cleared. The group was returned to expanded afterward.
- The pinned thread panel showed standalone search, List/Kanban controls, and
  the compact Filters surface. Selecting one state showed `Filters · 1`, a
  checked value, and a reachable fixed Clear action in the short viewport; it
  was cleared afterward. A narrow full Taskboard used the same composition.
- The configured Linear direct-create dialog opened with a blank title and
  description plus native status, assignee, priority, labels, and due date.
  No provider submission was made.
- A real issue detail with one comment rendered full-bleed content and a single
  chronological comment rail; the scrolled detail remained reachable.

## Screenshot artifacts

- `wide-list-1440.png` — `sha256:e453228b2bd7473eb6039d79e97d343bc28d0133b9c5e03935a068eba5514bcd`
- `wide-list-dark-1440.png` — `sha256:f006796c678a071dd9a7c5430180452f7266844abe9776077b894e809003893e`
- `wide-list.png` — `sha256:44b776547ea24d57b8fdab0ec670b3ccf8f6d9bcf7225bafd13b826848941ed6`
- `wide-list-dark.png` — `sha256:c16bdec8f0371ea86d9d69b595d97d6c82881abbd01e2b6154648e0b34bf96f1`
- `kanban-uncapped.png` — `sha256:6f0d18f2d883fdf43987f8c2acbc114336403174baed10e253c0c5a7379a4141`
- `narrow-full-constrained.png` — `sha256:04b3b6c87c60578c2579c87da018c6441881761db53c02fc1c0029b52c514f5e`
- `right-panel-constrained.png` — `sha256:593b2dd3d08257d2f38ed8c794c769fc4fbfc792250c5f0e0446f622a967579b`
- `right-panel-filter-active.png` — `sha256:017a90e2ba55f0fa161f5551c39e2fef97214cb2ec79d7c042b88d26c319fcf2`
- `direct-create-linear.png` — `sha256:1c119ce67093728cc5eaf6d258ddb303a1e6095dd52fdf6590ce1964f1a1f0f0`
- `detail-comment-rail.png` — `sha256:f7a7eb46918b8b778999d0bca635571540472eb7d7b9cde5601dba0348b90375`
- `detail-comment-rail-scrolled.png` — `sha256:8bf98d5e4ca94ee77b8658cdafe8dcd52282894617d8414a8abce10779d8c3de`

## Acceptance coverage

- AC-1–AC-3: pure preference tests plus live route/reload/cross-surface checks.
- AC-4: scoped/fresh assignee tests, metadata-scope submit gate, provider
  pagination/native-identity tests, and configured direct-create walkthrough.
- AC-5: adversarial formatter and detail-handoff tests.
- AC-UI-1–AC-UI-4: CSS/source tests and List/Kanban/right-panel/detail captures.
- AC-UI-5: direct/composer source guards, creation contract tests, and live
  provider-aware direct form without submission.
- AC-6: existing regression suite plus provider create/reconciliation tests.
- AC-7: package/workspace checks, screenshots, and independent review.
