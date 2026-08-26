# Decisions: Filter Icons Refactor

## D-001: Centralize presentation, not filter behavior

Status: Accepted

### Evidence

Labels, icons, and descriptions are repeated across the Manage model and wide
chip call sites, while each filter's option/update logic remains intentionally
different.

### Options

- Keep hardcoded presentation literals.
- Convert the entire filter bar to one generic renderer.
- Centralize only presentation metadata and retain explicit behavior branches.

### Chosen approach

Use one exhaustive typed presentation record and derive Manage options from it;
keep explicit source/state/facet render and update logic.

### Trade-offs and risks

Some rendering repetition remains, but behavior stays reviewable and there is
no risky abstraction over distinct selection semantics.

### Verification

Typecheck the exhaustive record and source-guard its consumers.

## D-002: Iconize section headings, not every option

Status: Accepted

### Evidence

The constrained menu currently has clear text sections but no visual anchors.
Adding a generic icon to every checkbox would repeat noise and compete with
state glyphs and provider-native values.

### Options

- Add icons to every checkbox row.
- Add icons only to named section headings.
- Keep the menu text-only.

### Chosen approach

Use one small decorative icon beside each constrained section heading. Preserve
option rows, except for their existing meaningful state/provider visuals.

### Trade-offs and risks

Headings become more scannable without increasing menu height or making icons a
second source of truth.

### Verification

Inspect the compact menu at short right-panel height and verify text, checks,
search, and Clear remain reachable.

## D-003: Reuse existing icon names and layout

Status: Accepted

### Evidence

The wide filter chips already use host-compatible icons that communicate each
facet and have passed live BB verification.

### Options

- Introduce new SVG assets.
- Choose a new icon family.
- Reuse the current chip vocabulary everywhere.

### Chosen approach

Reuse `GitBranch`, `Circle`, `Workflow`, `UserRound`, `AlertCircle`, `Folder`,
and `Layers` through the shared map with no asset/dependency change.

### Trade-offs and risks

This prioritizes consistency over novel artwork and avoids SDK or packaging
risk.

### Verification

Build with the pinned SDK and compare wide, constrained, and Manage surfaces.
