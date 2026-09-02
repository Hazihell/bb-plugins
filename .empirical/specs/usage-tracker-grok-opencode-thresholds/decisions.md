# Decisions: Usage Tracker Grok Opencode Thresholds

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Select the implementation approach

Status: Accepted

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
