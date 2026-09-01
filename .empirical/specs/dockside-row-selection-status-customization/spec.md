# Dockside Row Selection Status Customization

## Request

> Fix Dockside Shift selection so ordinary click and Shift+click work anywhere on an eligible root thread row while selection mode is active, not only on the checkbox; protected rows must never select or navigate accidentally. Make thread-state icon colors customizable from a Dockside settings page with clear defaults for working, stalled/waiting, unread/waiting-to-read, error, and idle/stale, plus PR review/checks/ready/merged/draft/blocked/closed colors. Add Default, High contrast, and colorblind-friendly presets, reset controls, persistent validated preferences, and additional settings for row density, default child expansion, provider icon visibility, PR metadata visibility, and relative-time visibility. Changes must apply live across the Dockside sidebar, preserve accessible non-color labels/shape/animation, and keep current behavior as defaults.

## Goal

Make range selection match row-level user expectations and let users tune
Dockside's semantic status presentation and compactness without losing safety
or accessible meaning.

## Acceptance Criteria

- [ ] [AC-1] [UI] While selection mode is active, ordinary click anywhere on
  an eligible root row toggles that family and establishes the range anchor;
  Shift+click anywhere on another eligible row applies its intended selected
  state to the inclusive visible eligible range.
- [ ] [AC-2] [UI] Clicking or Shift+clicking a protected root row in selection
  mode neither selects nor navigates it, while its disabled checkbox and
  protection reason remain accessible.
- [ ] [AC-3] [UI] Dockside declares persistent settings rendered on the plugin
  settings page for Default, High contrast, Colorblind-friendly, and Custom
  palettes; choosing Default resets the active palette behavior.
- [ ] [AC-4] Custom working, stalled/waiting, unread/waiting-to-read, error,
  idle/stale, and PR review/checks/ready/merged/draft/blocked/closed values accept
  only valid `#RRGGBB` colors and otherwise fall back safely.
- [ ] [AC-5] [UI] Settings changes apply live across root/child status icons,
  family activity icons/connectors, idle dots, and PR state icons while labels,
  shapes, animation, and state precedence remain independent of color.
- [ ] [AC-6] [UI] Additional persistent settings control Comfortable/Compact
  row density, default child expansion, provider icon visibility, parent PR
  metadata visibility, and relative-time visibility; existing behavior is the
  default for every setting.
- [ ] [AC-7] [UI] A Dockside settings section previews the effective semantic
  palette and explains preset/reset/custom behavior without duplicating the
  host-owned settings form.
- [ ] [AC-8] Filters, search, project ordering, selected-family visibility,
  bulk eligibility, Clear/All, preview/confirmation/revalidation/outcomes,
  navigation outside selection mode, and keyboard/accessibility behavior remain.

## Scope

- Extend root selection-mode row activation while retaining checkbox activation.
- Define Dockside server settings through `bb.settings.define` and consume them
  live through `useSettings`.
- Add a pure validated preference resolver, palette presets, CSS variable
  projection, and a settings preview section.
- Apply behavior preferences to root and child rendering.

## Non-goals

- User-supplied SVG/icon shapes, arbitrary CSS, secrets, or executable values.
- Per-project or per-thread preference overrides.
- Changing the underlying BB status/PR truth or deletion protection rules.
- Automatically committing, pushing, or publishing settings.

## Risks

- Invalid or hostile color strings must never enter inline CSS.
- Color alone cannot communicate state; icons, labels, animation, tooltips, and
  disabled semantics must remain.
- Row-wide selection must not leak through to thread navigation or split-open.
- Loading settings must not flash destructive or misleading states; defaults
  remain effective until validated values arrive.
- Hiding metadata can reduce context, so controls must be explicit and defaults
  preserve the current surface.

## Verification

- Unit-test every preset, custom/fallback color, boolean/select fallback, CSS
  projection, row activation intent, and existing status/PR state precedence.
- Assert server descriptors, settings-section registration, and source wiring.
- Run Dockside tests/typecheck and repository full CI.
- Exercise row-wide ordinary/Shift selection and protected-row suppression in
  live BB; exercise presets, custom colors, reset, density, expansion, provider,
  PR, and time settings; capture sidebar and settings screenshots.

## Capability Deltas

- `deltas/dockside-thread-management.md`
