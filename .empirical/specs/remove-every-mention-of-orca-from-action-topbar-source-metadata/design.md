# Design: Action Topbar Identity And Screenshots

## Wording

Replace comparison-based phrases with direct descriptions of the actual
feature: a compact main-thread topbar, searchable Action launcher, draggable
workspace panes, and persistent per-thread tabs. Remove explanatory Dockside
comments that carry the same comparison rather than introducing replacement
comments, preserving the repository's no-comments rule.

## Screenshot composition

Capture the installed plugin in the real BB application at a desktop viewport.
Open the topbar `+` launcher so the searchable Action list is visible. Use the
same thread, framing, and interaction state in both themes, with enough main
workspace context to establish that the control is in BB while avoiding
unrelated personal or transient content.

Store the final PNGs as:

- `docs/media/action-topbar-light.png`
- `docs/media/action-topbar-dark.png`

Present them in the plugin README under a concise Preview section with explicit
light-mode and dark-mode labels and descriptive alt text.

## Verification

Use a case-insensitive source audit, browser screenshots and visual inspection,
focused Action Topbar checks, package build, and the root repository check.
Keep the experimental SDK warning unchanged in meaning.
