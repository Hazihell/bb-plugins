# Design: Dockside Icon-Only Agent States

## Model

- Root secondary state: activity icon → PR icon + number → verified check.
- Child secondary state: PR icon + number only when no live status.
- Child live status remains the existing `ThreadStateGlyph`; child Done and
  child summary requests are removed.
- Root `ThreadStateGlyph` remains the sole live-status signal; the trailing
  slot always shows relative age.

## Components

- `pull-request-presentation.ts` returns a stable IconName with label/tone.
- `PullRequestMetadata` renders the colored icon box and `#number`; its
  `aria-label`/tooltip contains state and title.
- `DoneMetadata` renders a success Check icon with Done label/tooltip.
- family activity renders a primary Loading icon with Agents working label.
- `ChildThreadRow` has no summary prop and never renders Done or status text.
- `useThreadSummaries` receives only the root, so children are not queried for
  completion metadata.

## Accessibility

Every icon-only control/state has `aria-label` and `title`. Icons use distinct
shapes plus semantic color; color is supplementary. PR number remains visible
and linked. The existing left status glyph already carries BB's indicator
label.

## Verification

Extend pure tests for every PR icon and ensure child precedence has no Done.
Run focused checks and capture wide/compact screenshots showing three quiet
children without Done badges and root states without visible status words.
