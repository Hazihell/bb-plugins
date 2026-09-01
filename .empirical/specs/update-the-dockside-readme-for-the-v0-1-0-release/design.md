# Design

## Approach

Keep the existing README structure and replace only obsolete release/install
copy while adding a release showcase near the introduction. The showcase uses
the final verified 634-pixel Retina PNGs copied into the plugin-owned
`docs/media/` directory:

- `dockside-v0.1.0-light.png`
- `dockside-v0.1.0-dark.png`
- `dockside-v0.1.0-subagents.png`

Use a Markdown table for side-by-side light/dark captures and a full-width
expanded-subagent image below it. Each image gets concrete alt text naming the
theme or child-agent content. Existing detailed usage, safety, migration,
troubleshooting, credits, and development sections remain in place.

## Release accuracy

Document `dockside/v0.1.0` and the direct semver-range install using
`--subdirectory plugins/dockside --tag-prefix dockside/`. State that the BB
Community marketplace submission is validated and awaiting maintainer merge;
do not claim that `dockside` is discoverable from the marketplace until PR #162
is merged.

## Risks and controls

- Large screenshots: keep three optimized existing PNGs; do not regenerate or
  commit duplicates outside the plugin.
- Theme ambiguity: label light and dark captures explicitly and retain their
  native colors.
- Release misinformation: link the tag and marketplace PR, and distinguish Git
  availability from marketplace availability.
- README regression: edit in place and preserve all existing operational
  sections.

## Verification

Validate PNG signatures/dimensions, referenced paths, release tag resolution,
install flags, marketplace PR state, Markdown links, and `git diff --check`.
