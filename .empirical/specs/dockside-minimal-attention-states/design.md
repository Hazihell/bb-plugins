# Design: Dockside Minimal Attention States

## Design intent

Dockside is navigation, not a status report. Preserve the rich backend truth
introduced by the prior feature while collapsing its presentation to one
short, color-coded state in each row's existing second line. The user should
find urgent/live work first and open the destination for detail.

## Presentation model

### One secondary state slot

- Root selection: `Agents working` → PR → Done → nothing.
- Child selection: existing thread status → PR → Done → nothing.
- A root's primary trailing `Needs you`, `Failed`, `Working`, or `Unread`
  remains authoritative and does not create another metadata line.
- Passive state is not discarded; it reappears when the higher-priority live
  state clears.

Keep selection pure in `lib/attention-state.ts` so precedence can be tested
without rendering BB UI.

### Semantic tones

Use a small shared tone helper rather than duplicating class strings:

- destructive: Needs you, Failed, Changes, Blocked;
- primary: Working, Unread, live workflow verbs, Checks, In review,
  Agents working;
- success: Ready, Done;
- merged: BB's `--pr-merged` foreground;
- muted: Open, Draft, Closed.

Each state keeps visible text. Low-opacity token backgrounds strengthen scan
order without turning the row into a wall of badges.

## Component changes

### `row-metadata.tsx`

- PR renders state pill plus `#number`; title stays in `aria-label` and `title`.
- Done renders the pill only and accepts no summary prop.
- Family work renders `Agents working` as text only, without an extra icon.
- Components fit inline in a fixed-height branch line and never allocate a
  third row.

### `thread-card.tsx`

- Root chooses one state inside its existing location/activity line.
- Child chooses one state after its location; an existing thread status wins.
- Remove the later PR/Done/Waiting blocks that grew card height.
- Preserve PR hook mount boundaries, output-summary requests, row anchors,
  controls, and connector tint.

### `status-slot.tsx`

- Retain labels and indicators.
- Assign destructive treatment to Needs you/Failed, primary treatment to live
  and unread states, and muted treatment to Draft.
- Status renderers add the same compact rounded/padded word treatment.

## Data and privacy

No server or RPC contract changes. The output summary still proves that Done is
real, but the client uses only map membership and never renders the text. PR
title remains transient BB hook data used only for accessible/hover context.
No additional lookup, persistence, or user content surface is introduced.

## Failure behavior

- PR still loading: render no passive state rather than flashing Done before PR.
- Missing PR: Done may appear only after verified output arrives.
- Summary RPC failure: no Done state; navigation stays intact.
- Long branch: location truncates first while the short state stays visible.
- Compact drawer: the same two-line row fits without alternate content.

## Verification

- Pure tests cover root/child precedence and all semantic tone classes.
- Existing PR mapping, summary cache, filter, lifecycle, and deletion suites
  remain passing.
- Typecheck validates component/RPC contracts.
- Live wide and compact screenshots show 52px two-line rows, visible colored
  state words, no assistant prose, and the three-child connector family.
- Root typecheck, test, lint, and build pass before handoff.
