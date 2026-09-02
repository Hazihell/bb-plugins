# Decisions: Usage Tracker Grok Opencode Thresholds

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Select the implementation approach

Status: Superseded

Superseded by: D-002

### Evidence

- Usage Tracker already centralizes provider wire aliases in `lib/usage.ts`,
  visible provider settings in `lib/preferences.ts`, and provider geometry in
  `lib/provider-marks.ts`.
- The current strip is a single flex row sized for at most two providers.
- Progress bars already retain both unclamped `usedPercent` and clamped
  `barPercent`, so threshold state does not need to distort geometry.
- BB and Dockside already identify the new integrations as `acp-grok` and
  `acp-opencode` and carry their MIT-licensed mark geometry.

### Options

1. Keep a flex row and group providers into explicit JavaScript row wrappers.
2. Switch the strip to a CSS grid only when provider count exceeds two, while
   emitting semantic provider-count and usage-level data attributes from the
   existing DOM renderer.

### Chosen approach

Choose option 2. Extend the existing provider tables and schemas, classify
thresholds with a pure helper from the raw percentage, and let CSS handle the
one-row/two-column layout from semantic attributes. Reuse the upstream mark
geometry already vendored by Dockside, with Usage Tracker's independent notice.

### Trade-offs and risks

- Grid rules must leave the refresh control stable and must not regress the
  existing one/two-provider compact tier; contract tests will pin selectors and
  a browser check will cover actual host layout.
- Cached preferences may predate the two provider IDs; RPC refresh remains
  authoritative, while invalid cached arrays fall back to all visible IDs.
- Yellow text can lose contrast across themes; warning/critical colors will mix
  explicit hues with the host foreground rather than use raw bright yellow.
- Unknown future providers remain outside the visible preference allowlist and
  cannot enter the DOM through untrusted cached values.

### Verification

Focused pure tests will cover wire IDs, settings order, exact thresholds, and
marks. Source/CSS contract tests plus local install/reload and browser screenshot
will prove the wrapped layout, semantic attributes, details, and colors.

## D-002: Larger provider sets use a right-side vertical stack

Status: Superseded

Superseded by: D-003

Supersedes: D-001

### Evidence

The user inspected the live 2×2 result and rejected it because the compressed
cells looked detached from BB's footer controls. At four trackers, a vertical
list restores useful rail and percentage width.

### Options

Keep the 2×2 grid; force four items into one row; hide secondary providers
behind overflow; or stack one full tracker per row at the right edge.

### Chosen approach

Preserve the existing flex row for one or two providers. For three or four,
render one tracker per 2rem row in a narrower right-side grid, with one fixed
refresh column spanning and centering beside the stack.

### Trade-offs and risks

The footer becomes taller when all providers are enabled, reducing thread-list
height slightly. In exchange, tracker marks, rails, and percentages remain
legible and the layout has one consistent vertical scan path. The provider
allowlist currently caps the stack at four.

### Verification

Inspect the installed plugin with four providers, confirm four 32px computed
rows and two computed columns, verify refresh placement and provider focus, and
capture threshold colors with the controlled browser response.

## D-003: Many providers collapse into a highest-usage summary

Status: Accepted

Supersedes: D-002

### Evidence

The user rejected both the 2×2 grid and four-row stack after live inspection.
Both expose provider count directly in the footer and either compress content or
make the footer too tall. The actionable footer datum is the highest quota usage.

### Options

Keep the vertical stack; show only two pinned providers; cycle providers; or
show one highest-usage summary with an overview popover for the complete list.

### Chosen approach

For more than two enabled providers, render the highest available percentage and
`+N` in one compact summary beside refresh. Clicking opens a complete provider
overview; selecting a row drills into the existing details, and close/Escape
returns through the same hierarchy with restored focus.

### Trade-offs and risks

Individual provider percentages require one click when more than two are enabled.
In exchange, the footer stays one row and scales without layout churn. Showing
the highest percentage makes the collapsed state useful rather than arbitrary.
Color remains supplementary to exact numeric and accessible provider text.

### Verification

Use controlled browser responses at 79.9, 80, 95, and 96 percent; assert the
summary shows `96% +3`, critical severity, one-row height, and one refresh;
assert the overview lists all providers and details/overview/summary focus paths.
