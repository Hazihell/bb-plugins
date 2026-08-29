# Decisions: Fast Forward This Clean Linked Checkout To Github Main Through

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Select the implementation approach

Status: Accepted

### Evidence

- GitHub main `203f910` includes PR #18 and the complete PR #20/#21 Usage
  Tracker implementation.
- The old Taskboard checkout is based on `00ee7c6` and intentionally dirty;
  the current `bb-plugins` directory has no Git metadata.
- A clean linked worktree was already explicitly approved and can preserve Git
  identity while leaving both older source directories untouched.
- Main’s Usage Tracker already contains the requested missing-provider safety
  behavior; copying the older local implementation would remove merged UI and
  all-window behavior.
- Active version-bearing files are limited to the three manifests, their three
  workspace lock records, direct-Git commands, Usage Tracker’s existing
  changelog, and shared distribution guards; dependency-version lookalikes and
  completed Empirical history are not release metadata.

### Options

1. Fast-forward the approved clean linked worktree and port only reviewed local
   hunks.
2. Copy the older live plugin directories wholesale over main.
3. Commit or stash the old dirty checkout, update it, and resolve conflicts.

### Chosen approach

Choose option 1. It preserves the merged repository state, avoids unrelated
overwrites, and produces one source path for build, live testing, and later
release review without requiring a commit or stash.

### Trade-offs and risks

The consolidated checkout lives at a longer worktree path and its branch name
originated with the completed Taskboard integration, but neither affects plugin
identity or distribution. Updating direct-Git ranges before public tags means
those new commands are preparatory until the separately authorized release.
Focused source guards, root checks, metadata inspection, and live source-path
verification contain the material risks.

The shared distribution test will gain Host Monitor coverage so all three
prepared versions, private-package flags, publication-hook exclusions, and
direct Git commands fail together on drift.

### Verification

- Exact source/test diffs for the Taskboard and Host Monitor fixes.
- Existing full Usage Tracker PR #20 suite plus version/distribution guards.
- Root `npm run check`, `git diff --check`, and built metadata inspection.
- `bb plugin source` confirms all three absolute paths and bumped versions.
- Real browser/RPC verification and sanitized screenshots.
- Independent code, security, and UI/UX review followed by clean-target replay.

## D-002: Resolve the UI/UX compact-limit advisory

Status: Accepted

### Evidence

- The merged Usage Tracker capability defines `Compact limit` as a choice of
  the Weekly or Five-hour canonical window, not a count of visible windows.
- Expanded details already show canonical rows followed by every additional
  provider window, with provider-local error isolation and Escape/focus return.

### Options

1. Retain the merged Weekly/Five-hour selector and complete expanded details.
2. Replace it with the advisory’s window-count selector and `+N more` cue.

### Chosen approach

Accept the advisory’s Taskboard icon, badge-free Host Monitor, provider-local
failure, and evidence recommendations. Retain the released Weekly/Five-hour
`Compact limit` semantics and do not add a window-count setting or `+N more`
control, because that would be a new feature outside the approved request and
would contradict the living compact-display capability.

### Trade-offs and risks

Option 1 preserves shipped behavior and contributor intent but does not add a
new compact overflow count. Option 2 might expose count information sooner but
would change settings semantics, migration behavior, copy, tests, and scope.
The complete expanded view already makes every window reachable, so preserving
the released selector is the lower-risk choice.

### Verification

Verify the existing setting switches the compact canonical reading while all
reported windows remain visible after expansion; verify a provider-local error
does not replace healthy provider data.

## D-003: Resolve the Host Monitor passive-cue security advisory

Status: Accepted

### Evidence

- The user explicitly requested removal of the notification-like trigger dot.
- Host Monitor is a resource-health utility, not an intrusion-detection or
  security-alerting boundary.
- Fleet state remains in the trigger’s dynamic accessible label/title and in
  the immediately available popover, floating monitor, sidebar accessory, and
  full dashboard.
- The UI/UX review recommends a deliberately neutral, badge-free trigger in
  every state rather than a replacement status badge.

### Options

1. Keep the trigger neutral and dot-free, retaining text and detailed status
   surfaces.
2. Replace the dot with status-dependent icon color or outline.

### Chosen approach

Choose option 1. The security review’s replacement cue is advisory and would
reintroduce unsolicited notification-like emphasis through a different visual
mechanism. No security authority or data flow changes, and resource state
remains accessible on demand and to assistive technology.

### Trade-offs and risks

A sighted user who never hovers or opens Host Monitor loses passive fleet-state
color on the compact trigger. That is the intended quiet presentation trade-off
the user requested. A future visible-cue redesign should be separately scoped
and user-reviewed rather than silently substituted for the removed dot.

### Verification

Require no trigger `::after`, preserve dynamic `aria-label`/title, and exercise
the popover and full status surfaces under a non-normal fleet state.
