# Root README icon presentation

## Outcome

The root README displays all plugin icons at twice their current preview size,
while Dockside and Host Monitor retain violet outlined glyphs rather than
rendering as filled squares.

## Scope

- Update the root `README.md` icon dimensions from 64×64 to 128×128.
- Remove the fill override that fills the stroke-only Dockside and Host Monitor
  icon paths; preserve their violet stroke geometry.

## Non-goals

- Do not change plugin behavior, logos, screenshots, badges, or icon geometry.
- Do not alter icon dimensions outside the root README catalog/header.

## Acceptance criteria

- [ ] [AC-1] Every plugin icon preview in the root README, including the header icon, has
   width and height of 128 pixels.
- [ ] [AC-2] Dockside and Host Monitor `assets/icon.svg` files contain no CSS rule that
   forces all paths to violet fill, and their visible paths remain violet
   strokes with no solid background square.
- [ ] [AC-3] Existing README links and all other plugin icon assets remain unchanged.

## Verification

- Run the repository check command configured by Empirical.
- Inspect the changed SVG and README text to confirm dimensions and fill/stroke
  attributes.
