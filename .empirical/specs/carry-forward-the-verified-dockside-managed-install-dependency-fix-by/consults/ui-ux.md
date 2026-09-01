# UI/UX Advisory

Specialist: ui-ux

Verdict: advisory

The original specialist pass returned a blocking contrast finding. The design
now uses black/white maximum contrast, explicitly models automatic/custom and
dirty/external-change state, and includes row-local pending, error, focus, and
live-region feedback. With those corrections incorporated, the remaining
findings are advisory implementation requirements.

## Findings

### F-1

- Severity: Blocker (resolved in design)
- Category: Accessibility / contrast
- Location: `design.md` — Color behavior
- Recommendation: Select between `#000000` and `#FFFFFF` by measured contrast,
  and test the worst crossover, palette entries, and representative overrides.

### F-2

- Severity: Major
- Category: Settings information architecture
- Location: Settings project rows
- Recommendation: Show badge, project name, explicit Automatic/Custom hex
  status, labelled native picker, Save, and Reset. Disable actions when they
  have no effect.

### F-3

- Severity: Major
- Category: Draft and realtime behavior
- Location: Realtime recovery
- Recommendation: Preserve dirty drafts across external updates and show
  `Color changed elsewhere` with Reload or Save choices.

### F-4

- Severity: Major
- Category: Error and pending feedback
- Location: Settings project rows
- Recommendation: Keep busy/error state row-local, associate inline errors,
  preserve failed drafts, restore focus, and announce success politely.

### F-5

- Severity: Moderate
- Category: Control accessibility
- Location: Settings project rows
- Recommendation: Include project names in picker and button accessible labels,
  retain focus indicators, and expose the hex in visible text.

### F-6

- Severity: Moderate
- Category: Badge semantics
- Location: Sidebar project badge
- Recommendation: Preserve letter, size, shape, placement, border, and header
  name; color remains supplemental and never carries thread status.

### F-7

- Severity: Moderate
- Category: Large project rosters
- Location: Settings project list
- Recommendation: Preserve host order and add project-name filtering with an
  empty result for long lists.

### F-8

- Severity: Advisory
- Category: Interaction specification
- Location: Overall editor
- Recommendation: Picker edits preview only; Save persists; Reset removes one
  override; writes update both surfaces; rename preserves ID-derived color.
