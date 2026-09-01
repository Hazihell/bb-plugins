# Decisions: Dockside Semantic Status And Family Ordering

## D-001: Use one family state with six explicit outcomes

Status: Accepted

### Evidence

BB exposes runtime indicator, unread, pending interaction, activity counts, and
timestamps but no generic completed state.

### Options

Preserve independent dots; infer Done; or derive one semantic family projection.

### Chosen approach

Project Failed, Needs you, Working, Unread, Stale, then Inactive in that
precedence, using a seven-day stale boundary and never inferring Done.

### Trade-offs and risks

Lower-priority simultaneous signals move into tooltip context, but the row is
immediately legible and does not invent completion.

### Verification

Projection matrix tests and a live screenshot containing all six states.

## D-002: Persist bounded project-local order in browser storage

Status: Accepted

### Evidence

Dockside already owns browser-local warm-start data; BB exposes no plugin sort
mutation, and reload persistence does not require cross-device synchronization.

### Options

Backend SQLite; mutate BB threads; or versioned localStorage.

### Chosen approach

Store bounded project-to-root arrays in versioned localStorage, apply ranks
before filtering/search, validate mutations as exact permutations, and preserve
the canonical pinned-leading partition.

### Trade-offs and risks

Order is browser-local by design; safe parsing and canonical fallback contain
corruption and newly-created roots.

### Verification

Round-trip, corruption, cap, stale-root, pinned-boundary, and reload tests.

## D-003: Isolate reorder drag from BB split drag

Status: Superseded

Superseded by: D-007

### Evidence

The root anchor already owns BB shortcut and split-drag props, so making the
whole row draggable would create competing gestures.

### Options

Make the row draggable; context-menu moves only; or use an explicit handle with
keyboard shortcuts.

### Chosen approach

Use a compact focusable handle in row two for native drag and expose
Alt+ArrowUp/Down on the root focus target with polite live announcements.

### Trade-offs and risks

One compact icon enters the trailing cluster, while BB split dragging and
ordinary navigation remain isolated.

### Verification

Interaction contract tests and live pointer/keyboard checks.

## D-004: Disable reorder over incomplete visible order

Status: Accepted

### Evidence

Search, filters, and selection can omit or reinsert families, making a visible
index ambiguous relative to hidden roots.

### Options

Guess placement among hidden roots; allow and reconcile; or disable.

### Chosen approach

Disable during selection, non-All filter, or nonblank search; reject stale,
cross-project, incomplete, and pinned-boundary operations in pure logic.

### Trade-offs and risks

Users clear narrowing state before sorting, preventing silent hidden-order
changes.

### Verification

Conflict enablement and invalid-request tests plus live disabled help.

## D-005: Use a fixed two-row grid with shrink-resistant metadata

Status: Accepted

### Evidence

The supplied screenshot shows tiny undifferentiated dots, while the existing
flex column separates elapsed time from row-two metadata.

### Options

Add a third status line; overlay badges; or use a fixed two-row CSS grid.

### Chosen approach

Use two fixed-height grid rows, truncate title and branch first, and keep PR,
disclosure, provider, and one fixed-width final status badge in a non-wrapping
cluster.

### Trade-offs and risks

Extremely narrow cards show less branch text but never clip or wrap semantic
controls.

### Verification

Long-text, zero/multiple-child, and no-PR tests plus normal/narrow screenshots.

## D-006: Preserve live activity subtype and semantic PR backgrounds

Status: Accepted

### Evidence

User review found that one green spinner still hides whether Dockside is running
a workflow, agent, command, plan, or goal, and that the ready PR tick's generic
primary background does not read as successful.

### Options

Keep one Working spinner; show multiple text labels; or retain one Working badge
while varying the leading icon shape and color by BB's actual activity kind.

### Chosen approach

Keep the six family outcomes and Working badge, but project runtime, workflow,
agent, command, plan, and goal to separate animated shapes and customizable
colors. Mix each PR icon background from its effective semantic PR color so the
ready tick has a green background.

### Trade-offs and risks

Settings gains five activity color fields and a compact activity preview, but
the card adds no row or text and color remains backed by shape and tooltip.

### Verification

Table-test every activity indicator/color role, assert settings declarations and
preview, assert semantic PR background CSS, and inspect live Working/ready PR
examples.

## D-007: Reuse the semantic status icon as the reorder target

Status: Accepted

Supersedes: D-003

### Evidence

Live review showed that the dedicated stacked-chevron reorder glyph creates a
third visual column and makes otherwise compact rows noisy.

### Options

Keep the extra handle; make the whole card draggable and conflict with split
drag; or reuse the already focusable semantic status icon.

### Chosen approach

Remove the dedicated reorder glyph. Make the semantic status icon the native
drag and Alt+Arrow focus target, extending its tooltip with reorder help while
leaving the card anchor's BB split-drag props unchanged. Give all family badges
one compact 4rem fixed width with no horizontal padding and put the badge last
in the row-two cluster so every status aligns at the same right edge.

### Trade-offs and risks

The status icon has two discoverable actions, mitigated by its hover/focus help,
keyboard shortcut metadata, and unchanged status label/description.

### Verification

Source contracts assert no dedicated reorder glyph, status-icon drag/keyboard
wiring, fixed badge width, and badge-last cluster ordering; live normal/narrow
screenshots verify alignment.
