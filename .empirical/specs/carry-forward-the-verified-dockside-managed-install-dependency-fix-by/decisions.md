# Decisions: Dockside Project Colors And Managed Installability

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Persist project overrides in Dockside's server database

Status: Accepted

### Evidence

- `useSettings()` exposes effective values but no dynamic setting mutation API.
- BB plugin setting descriptors are static, while projects are a dynamic roster.
- Dockside already owns a migrated plugin database, typed RPC, and realtime
  invalidation for durable sidebar state.

### Options

1. Store JSON in browser localStorage.
2. Add hundreds of static project setting keys.
3. Store bounded rows in Dockside's database behind typed RPC.

### Chosen approach

Choose option 3. It supports a real per-project editor, shares choices across
clients, validates at the server trust boundary, and fits existing architecture.

### Trade-offs and risks

This adds backend code and a migration. Keep it append-only, bounded, and
separate from BB's project records; validate project existence before writes.

### Verification

Harness tests exercise migration, membership rejection, upsert/reset, row caps,
and realtime publication; live settings/sidebar behavior proves convergence.

## D-002: Use stable automatic colors with explicit overrides

Status: Accepted

### Evidence

- The user wants initially varied colors and an individual project control.
- Random-at-render behavior would jump across reloads and project reordering.
- Project ID is stable across renames while project name is not.

### Options

1. Generate a random color on every render.
2. Hash project name into a palette.
3. Hash stable project ID into a curated palette and allow one override.

### Chosen approach

Choose option 3, with override precedence and Reset restoring the hash result.

### Trade-offs and risks

Different IDs can share a palette color. A bounded curated palette favors
readability and theme stability over an unbounded generated color space.

### Verification

Pure tests prove determinism, rename stability, palette bounds, override
precedence, and reset behavior.

## D-003: Derive badge foreground by measured contrast

Status: Accepted

### Evidence

- Users can select any valid opaque RGB color, including very light or dark.
- A fixed foreground cannot remain readable over that full range.

### Options

1. Always use white.
2. Use a simple brightness threshold.
3. Compare WCAG contrast for near-black and white foreground candidates.

### Chosen approach

Choose option 3 and select the higher-contrast candidate for every automatic or
custom background.

### Trade-offs and risks

The result is binary rather than brand-tinted typography, which is appropriate
for a 20px identity badge and makes the contrast policy auditable.

### Verification

Tests cover black, white, palette colors, and boundary colors and assert the
selected pair has the maximum available contrast.

## D-004: Keep unshimmed imports in production dependencies

Status: Accepted

### Evidence

- Dockside imports Hugeicons and Zod as runtime values.
- BB managed Git installs omit development dependencies before building.
- BB shims neither Hugeicons nor Zod.

### Options

1. Leave them development-only and rely on workspace hoisting.
2. Vendor/replace the libraries.
3. Move their existing ranges to runtime dependencies.

### Chosen approach

Choose option 3 and lock/test the manifest boundary.

### Trade-offs and risks

Managed installs download the required packages, which is the intended cost of
building unshimmed imports reliably.

### Verification

Metadata assertions plus an isolated production-only install/build prove the
managed-source path.
