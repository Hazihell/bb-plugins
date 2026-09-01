# Design

## Persistent settings

- Define BB-owned Dockside settings in `server.ts` with palette preset,
  twelve custom semantic colors, density, child expansion, provider visibility,
  PR visibility, and relative-time visibility.
- Use select/boolean/string descriptors so BB renders and persists the canonical
  settings form. `Default` is the one-step active reset; custom fields are
  ignored unless `Custom` is selected.
- Read values through `useSettings()` and resolve them in a pure module. Until
  settings load, and for every unknown/invalid value, preserve safe defaults.

## Preference model

- `DocksidePreferences` carries one resolved palette plus behavior toggles.
- Presets contain CSS-safe theme tokens or fixed reviewed colors. Custom values
  pass a strict six-digit hex validator before entering the palette.
- ThreadInbox projects the effective palette into owner-scoped CSS variables on
  its root. Descendant glyphs consume those variables without receiving color
  props, keeping status truth separate from presentation.
- A settings-section component resolves the same values and renders labeled
  swatches plus concise preset/reset/custom guidance.

## Semantic application

- Working indicators and family activity/connectors use `working`.
- Waiting-for-input/stalled uses `waiting`.
- Unread-success/waiting-to-read uses `unread`; unread-error remains `error`.
- Quiet no-status dots use `idle`.
- PR presentation adds an explicit color role for review, checks, ready,
  merged, draft, blocked, and closed; state precedence/icon/tooltip stays pure.
- Color is additive only: aria labels, titles, icon shape, disabled state,
  animation, and connector geometry remain.

## Behavioral preferences

- Comfortable density preserves current sizes; Compact reduces root/child row
  padding while retaining two lines and checkbox focusability.
- Default child expansion flows into `resolveFamilyExpanded`; force-reveal search
  and mounted user override retain precedence.
- Provider, PR, and time settings conditionally hide only their optional nodes.
- Preferences resolve once in ThreadInbox and pass through ProjectGroup to
  ThreadCard/child rows.

## Row selection fix

- In selection mode a semantic, full-row button consumes row clicks and reports
  state with `aria-pressed`. Eligible rows call the existing selection intent
  callback with `selected: !selected` and the row MouseEvent Shift modifier;
  protected buttons are disabled and cannot navigate.
- Checkbox clicks stop propagation and continue using native checked state.
- Status and trailing metadata stay visible but become pointer-inert in
  selection mode so every non-checkbox coordinate reaches the row button.
- Outside selection mode the button is replaced by the required navigation
  anchor, preserving shortcut/split behavior and interactive metadata.

## Verification

- Unit-test settings descriptors/resolver, presets, custom fallback, CSS
  projection, behavior fallbacks, expansion precedence, PR roles, and status
  role mapping.
- Source/system assertions cover settings registration/section, row activation,
  owner-scoped variables, toggles, and live plugin.
- Exercise settings and row selection in real BB; capture settings and sidebar
  screenshots; run Dockside and repository checks.
