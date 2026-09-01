# Design

Change the two affected icon SVG roots only by removing their global `path`
style. Their explicit violet `stroke` attributes and `fill="none"` root then
render the intended outlines. Update the eight root README `<img>` previews
from 64×64 to 128×128 with no other catalog edits. Validate with `git diff
--check`, text assertions, SVG rasterization, and the repository check command.

This is intentionally asset-local and reversible; no plugin runtime code or
shared icon system is involved.
