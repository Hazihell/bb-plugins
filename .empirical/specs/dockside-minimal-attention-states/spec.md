# Dockside Minimal Attention States

## Request

> Make Dockside's new metadata more minimal and attention-first: remove visible assistant summary prose and PR title text, keep compact color-coded PR state plus number and output-verified DONE, place one Agents working state in the existing branch line, color Needs you/Failed more strongly than Working/Unread, use one state slot per row so live attention temporarily outranks PR/Done, preserve all existing filters, bulk deletion, hierarchy, project creation, navigation, and compact layout.

## Goal

Make Dockside scannable at a glance: each row uses one short, color-coded state
slot, urgent/live work outranks passive metadata, and no sidebar row repeats
assistant prose or long PR titles already available in the destination view.

## Acceptance Criteria

- [ ] [AC-1] [UI] A quiet root or mounted child with a PR shows only its
  semantic PR-state pill and `#number` in the existing branch line. The PR title
  remains in the accessible label and tooltip, the link still uses BB's
  `UrlLink`, and no visible PR-title prose is rendered.
- [ ] [AC-2] [UI] A quiet no-PR row with a verified non-empty final output shows
  only a `DONE` pill in the existing branch line. The output-backed RPC/cache
  remains the truth gate, but no assistant output text is visible in the
  sidebar.
- [ ] [AC-3] Every row exposes at most one secondary state in that line. Root
  precedence is `Agents working`, then PR, then Done. Child precedence is an
  existing live/attention status, then PR, then Done. A higher-priority state
  temporarily hides lower-priority metadata without changing its source data.
- [ ] [AC-4] [UI] Needs you and Failed use a destructive semantic treatment;
  Working, Unread, Drafting, Workflow, Agent, Command, Planning, and Goal use a
  primary treatment; Ready and Done use the success treatment; Merged uses the
  host PR color; Open, Draft, and Closed remain muted. Text labels accompany
  every color so meaning never depends on color alone.
- [ ] [AC-5] [UI] `Agents working` appears without another metadata glyph in
  the root branch line while the existing active connector stays tinted. Rows
  remain two-line navigation rows at wide and compact widths with no new
  overflow or project-level status chrome.
- [ ] [AC-6] PR title and final-output detail remain accessible by opening the
  PR/thread; Dockside does not add hover previews, persistence, another RPC,
  or a second state line.
- [ ] [AC-7] Filters, host search, default-open child families, explicit
  collapse, selection/bulk-delete protection and confirmation, context menus,
  split navigation, project `+`, lifecycle shelves, and compact routing remain
  unchanged.
- [ ] [AC-8] Focused tests cover attention-first precedence and semantic tone
  selection; live wide and compact BB screenshots show the two-line minimal
  rows, colored state words, three completed children, and no visible summary
  prose.

## Scope

- Compress `PullRequestMetadata`, `DoneMetadata`, and family activity metadata.
- Move the single metadata choice into existing root/child branch lines.
- Strengthen semantic status-word presentation using host theme tokens.
- Keep the output-verification backend and lazy PR integration unchanged.

## Non-goals

- Removing the summary RPC/cache used to prove Done.
- Removing PR title data from accessibility or changing PR state mapping.
- Adding project-level activity icons, progress meters, hover cards, or new
  workflow concepts.
- Changing sorting, filters, deletion semantics, navigation, or project scope.

## Risks

- Hiding PR/Done while a live status is present can delay passive context; this
  is intentional and reverses automatically when the attention state clears.
- Stronger colors can become noisy; small low-opacity token backgrounds and
  explicit text labels keep the hierarchy readable and theme-safe.
- Removing prose reduces at-a-glance detail; the thread and PR remain the
  canonical places to read it.

## Verification

- Pure precedence/tone tests plus the existing PR and summary suites.
- Dockside focused tests/typecheck and root typecheck/test/lint/build.
- Running plugin check and real wide/compact browser screenshots.
- Fresh-context outcome QA, isolated committed-diff review, and capability
  integration.

## Capability Deltas

- `deltas/dockside-thread-management.md`
