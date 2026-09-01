# Implementation plan

1. Remove the global `path` fill/stroke CSS rule from the Dockside and Host
   Monitor icon SVG roots.
2. Replace each root README plugin icon preview dimension pair with 128×128.
3. Run `git diff --check`, assert the README dimensions and absence of the
   problematic rules, rasterize both SVGs for visual evidence, and run
   `npm run check`.
