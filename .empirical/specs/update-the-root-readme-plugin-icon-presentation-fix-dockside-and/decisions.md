# Decisions

## D-001: Remove the fill override

Status: Accepted

### Evidence

The affected SVGs use stroke-only paths, but a global CSS rule forces every path
to fill violet, producing the reported solid square.

### Options

Remove the override; redraw the glyphs; replace the assets with raster images.

### Chosen approach

Remove only the global fill override. Explicit violet strokes and root
`fill="none"` preserve the existing geometry.

### Trade-offs and risks

This changes only rendering of these two icons and leaves all other icon assets
untouched.

### Verification

Rasterize both SVGs and inspect their outline rendering.

## D-002: Double root README previews

Status: Accepted

### Evidence

All root catalog/header previews were 64×64, while the request asks for double
the size.

### Options

Use 96×96; use 128×128; change only the table icons.

### Chosen approach

Set every root README plugin icon preview, including the header, to 128×128.

### Trade-offs and risks

The catalog rows become taller, as requested; plugin-specific README logos stay
unchanged because they are outside the root catalog presentation.

### Verification

Assert all root README icon width/height attributes are 128.
