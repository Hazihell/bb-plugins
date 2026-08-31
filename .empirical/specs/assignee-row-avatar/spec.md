# Assignee Row Avatar

## Request

> Enhance the assigned-person marker on Taskboard List and Kanban rows into a clearer compact initials avatar with deterministic per-person color, stronger theme-safe contrast and ring treatment, and an accessible assigned-person label, while preserving row density, provider-neutral data, and existing behavior.

## Goal

Make assignees easier to recognize while scanning dense List and Kanban rows,
without adding provider-specific avatar APIs or increasing row height.

## Acceptance Criteria

- [ ] [AC-UI-1] [UI] Assigned List rows and Kanban cards show a crisp compact
  initials avatar with a stronger ring, surface, and foreground treatment in
  both light and dark themes while preserving the current dense geometry.
- [ ] [AC-UI-2] [UI] The same normalized assignee name always receives the same
  restrained avatar tone during a session and across reloads; different names
  can use a small provider-neutral palette without implying workflow state.
- [ ] [AC-1] The marker exposes the full `Assigned to <name>` label to assistive
  technology and retains the existing tooltip; initials and color are never the
  only accessible identity.
- [ ] [AC-2] Assignee filtering, provider data contracts, item navigation,
  status movement, List/Kanban density, and unassigned-item behavior remain
  unchanged.
- [ ] [AC-3] Focused source/CSS tests, Taskboard checks, and real BB List/Kanban
  screenshots verify the result and guard its size, tone, and accessibility.

## Scope

- `plugins/taskboard/app.tsx` assignee initials/tone derivation and marker
  semantics.
- `plugins/taskboard/app.css` compact avatar geometry and theme-token palette.
- Focused Taskboard UI/CSS tests and live BB evidence.

## Non-goals

- Fetching profile photos, avatar URLs, or new provider metadata.
- Adding presence, hover cards, assignment mutation, or multi-assignee stacks.
- Increasing List row or Kanban card height.
- Changing how assignee values are filtered, cached, or sent during creation.

## Risks

- Weak contrast could make initials less readable in one theme.
- Semantic workflow colors could make avatars imply status or priority.
- Unstable hashing could make a person change color across reloads.
- Long, punctuation-only, or non-Latin names still need safe initials/fallback.

## Verification

- Unit/source assertions for deterministic normalized tones, accessible label,
  and unchanged 20px geometry.
- Taskboard typecheck, test suite, build verification, and root workspace check.
- Real BB screenshots of populated List and Kanban rows in light and dark
  schemes, with no tracker mutation.

## Capability Deltas

- `deltas/taskboard-browser.md`
