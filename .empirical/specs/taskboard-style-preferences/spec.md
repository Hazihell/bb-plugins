# Taskboard Style Preferences

## Request

> Improve Taskboard using the completed bb-plugin-linear research. Preserve GitHub/Linear/Jira project scoping, Kanban, provider-native creation, credentials, and existing CLI behavior. Implement a first coherent milestone: durable versioned per-project browse preferences shared by the full and right panels; separate remembered create assignee keyed by project/provider/destination and validated against live metadata; safe treatment of external issue content before agent context; flatter Linear-inspired list styling with neutral sticky group headers, compact row typography, restrained semantic state glyphs, capped List width but uncapped Kanban, a comments rail instead of cards, a consolidated compact filter control in constrained/right-panel layouts, collapsible terminal groups, and direct board quick-create. Add focused persistence/schema/UI tests and complete root verification plus live BB UI evidence. Do not add inbox, webhooks, PR automations, or Linear-only assumptions in this milestone.

## Goal

Make Taskboard remember how each BB project is browsed, keep issue creation
defaults predictable, and adopt the strongest restrained list/detail patterns
from the approved Linear reference without weakening Taskboard's multi-provider
or Kanban behavior.

## Acceptance Criteria

- [ ] [AC-1] A project restores its selected state/status/assignee/priority/
  external-project/label filters, view, and collapsed groups after route
  changes and a BB window reload, without inheriting another project's values.
- [ ] [AC-2] The full Taskboard and the pinned right panel read and update the
  same project preference record; clearing filters affects only the active
  project, and Across projects uses an independent scope.
- [ ] [AC-3] Preference data is versioned and validated. Missing, malformed, or
  unavailable browser storage falls back safely, and changing a project's
  selected provider cannot apply stale provider-specific selections.
- [ ] [AC-4] After a successful issue creation, the provider-native assignee ID
  is remembered only for the same project, provider, destination, and issue
  type. It is restored only when fresh metadata still offers that ID.
- [ ] [AC-5] Issue descriptions and metadata inserted into agent context are
  explicitly delimited as untrusted external tracker data and cannot masquerade
  as Taskboard or repository instructions.
- [ ] [AC-UI-1] [UI] List rows are flat and compact, with shaped semantic state
  glyphs, restrained priority/state color, neutral sticky group headings, and
  a readable maximum List width near 56rem. Kanban remains uncapped.
- [ ] [AC-UI-2] [UI] Finished/cancelled groups start collapsed, can be toggled,
  persist per project, and temporarily open while search is active so matches
  are never hidden.
- [ ] [AC-UI-3] [UI] Wide layouts retain efficient filter access, while the
  pinned/right or otherwise constrained layout exposes one compact filter
  control with an active indicator and restored selections visibly checked.
- [ ] [AC-UI-4] [UI] Task detail uses a quiet full-bleed hierarchy and one
  conversation rail/divider treatment rather than nested comment cards.
- [ ] [AC-UI-5] [UI] A user can start provider-aware issue creation directly
  from a configured project board without first writing a BB composer prompt;
  the existing richer composer-assisted creation flow remains available.
- [ ] [AC-6] Existing provider scoping, credentials, mentions, CLI behavior,
  optimistic status movement, accessible Kanban keyboard movement, and create
  confirmation behavior remain covered by regression checks.
- [ ] [AC-7] Focused preference/security/UI tests, root workspace checks, and a
  real BB browser walkthrough with screenshots provide immutable evidence.

## Scope

- `plugins/taskboard` preference models, pure persistence helpers, and UI state
  hydration/reconciliation.
- Separate browse preferences and create defaults; no coupling between a browse
  assignee filter and the assignee used to create an issue.
- Taskboard List/group/filter/detail styling and accessible interaction changes.
- Reuse of the existing create dialog for a direct board capture entry point.
- Focused unit/regression tests, documentation updates, and required MIT
  attribution for any copied or closely adapted upstream expression.

## Non-goals

- Inbox/notification feeds, webhooks, PR write-back, automatic status
  transitions, saved remote views, or adaptive provider polling.
- Turning Taskboard into a Linear-only plugin or removing Kanban/project
  navigation/provider-native metadata.
- New inline mutations for title, description, labels, priority, comments, or
  assignee beyond the already supported status change and issue creation.
- Cross-device synchronization of browser UI preferences. Device-local storage
  is intentional; server/project configuration remains separately durable.
- Publishing, tagging, pushing, or loading unverified output into the user's
  live BB instance.

## Verification

- Unit tests for versioned preference parsing, project/provider isolation,
  storage failure fallback, clear-current-scope behavior, provider reset, group
  collapse/search behavior, and remembered create-assignee validation.
- Security tests for the external tracker context delimiter and instruction
  warning.
- UI/source regression tests for shaped state glyphs, constrained filter
  presentation, List/Kanban width behavior, comments rail, and board quick
  create.
- Existing Taskboard test suite, typecheck, build, packed-output verification,
  then root `npm run check`.
- Live local-path Taskboard in BB: wide List, Kanban, pinned right panel,
  project switching, reload restoration, compact filter flow, direct create,
  detail/comments, light/dark themes, and keyboard/touch-sized controls.
- Screenshot evidence for the wide List, constrained right panel, and task
  detail; independent diff/code review before integration.

## Capability Deltas

- `deltas/project-view-preferences.md`
- `deltas/external-task-context.md`
- `deltas/taskboard-browser.md`
- `deltas/board-capture.md`
