# Dockside Project Colors And Managed Installability

## Request

> Carry forward the verified Dockside managed-install dependency fix and give
> every project letter badge a stable color that can be changed individually
> from Dockside settings.

## Goal

Dockside installs cleanly from managed Git sources, renders recognizable
project letter badges with stable accessible colors, and lets users persist or
reset an explicit color for each project from the settings page.

## Acceptance Criteria

- [ ] [AC-1] Dockside declares `@hugeicons/react`,
  `@hugeicons/core-free-icons`, and runtime-imported `zod` as production
  dependencies, with matching workspace-lock metadata and regression coverage.
- [ ] [AC-UI-1] [UI] Every project header renders its existing letter badge
  with a deterministic background derived from stable project ID and readable
  foreground text; the same project keeps its automatic color across reloads
  and renames.
- [ ] [AC-UI-2] [UI] Dockside's settings section lists the current projects,
  previews each letter badge, and provides an accessible native color picker
  plus Reset action for each project.
- [ ] [AC-3] Saving a valid six-digit hex override persists it by project ID in
  Dockside's database, publishes a realtime update, and changes both settings
  preview and sidebar without reload.
- [ ] [AC-4] Invalid, oversized, unknown-project, malformed, and excess
  persisted/input values fail closed; resetting removes only that project's
  override and restores its deterministic automatic color.
- [ ] [AC-UI-3] [UI] Badge colors remain legible in light and dark BB themes,
  expose the project name to assistive technology through the existing header,
  and do not replace thread-state semantics.
- [ ] [AC-5] Dockside typecheck, focused tests, production-only dependency
  resolution/build, full workspace checks, local install/reload, and browser
  screenshots pass.

## Scope

- Dockside dependency metadata and root workspace lockfile.
- Deterministic project-color selection and contrast logic.
- A bounded project-color database table, typed list/set/reset RPC, and
  realtime invalidation.
- Settings-section project editor and project-header badge styling.
- Unit, backend contract, UI contract, live browser, and install verification.

## Non-goals

- Coloring provider, thread-state, PR, control, or navigation icons.
- Changing project names, initials, order, or BB's project records.
- Arbitrary CSS colors, gradients, alpha channels, or per-thread colors.
- Publishing or updating a marketplace release.

## Risks

- Untrusted project IDs or colors could grow storage or inject CSS; validate
  IDs, cap rows and payloads, and accept only canonical six-digit hex colors.
- Random colors could jump or collide; use a deterministic hash over project
  ID and a curated palette, with explicit overrides taking precedence.
- Background colors can reduce contrast; derive foreground from luminance and
  keep the badge's existing accessible project-header context.
- Realtime signals are ephemeral; load authoritative RPC state on mount and
  reconcile again after reconnect.

## Verification

- Test deterministic hashing, rename stability, palette bounds, contrast,
  canonical hex parsing, override precedence, and reset behavior.
- Test RPC schemas, database bounds, unknown-project rejection, persistence,
  and realtime publication.
- Test settings/sidebar source contracts and run frontend typecheck/build.
- Exercise production-only install resolution and both generated bundles.
- Install/reload Dockside locally and capture settings/sidebar screenshots in
  light and dark themes.

## Capability Deltas

- `deltas/dockside-project-appearance.md`
- `deltas/dockside-source-installability.md`
