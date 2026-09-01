# Decisions: Dockside Row Selection Status Customization

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Use BB declarative settings as the persistence authority

Status: Accepted

### Evidence

BB already renders plugin settings, persists them, exposes live values through
`useSettings`, and validates select/boolean shapes.

### Options

Browser localStorage; plugin KV plus custom RPC form; or `bb.settings.define`
with a custom preview section.

### Chosen approach

Use declarative settings for canonical editing/persistence and a settingsSection
only for effective-palette preview and guidance.

### Trade-offs and risks

The host form is intentionally conventional rather than a bespoke color picker;
hex fields remain auditable and portable across app surfaces.

### Verification

Assert descriptors/defaults, settings registration, live resolver behavior,
and the real Tools/settings surface.

## D-002: Resolve presets and custom colors through one pure boundary

Status: Accepted

### Evidence

Raw string settings cannot safely become CSS without validation, and sidebar
and settings preview must show identical effective values.

### Options

Use raw settings in components; validate independently per component; or resolve
one immutable preference object and CSS projection.

### Chosen approach

Use one strict resolver with Default, High contrast, Colorblind-friendly, and
Custom palettes; only `#RRGGBB` custom values pass.

### Trade-offs and risks

Custom supports hex rather than every CSS color syntax, deliberately reducing
injection and cross-browser ambiguity.

### Verification

Table-test all presets, each role, invalid inputs, unknown selects/booleans, and
CSS variable output.

## D-003: Preserve non-color semantics and owner-scope palette variables

Status: Accepted

### Evidence

Working, waiting, unread, error, idle, and PR states already use distinct shapes,
labels, and animation; color should improve scanning without becoming truth.

### Options

Pass colors through every component; write global CSS variables; or set
Dockside-prefixed variables on the ThreadInbox root.

### Chosen approach

Project resolved colors into Dockside-prefixed root variables and keep existing
labels, shapes, animation, state precedence, tooltips, and disabled semantics.

### Trade-offs and risks

Settings preview duplicates swatch rendering only, while state logic stays in
existing pure helpers.

### Verification

Test status/PR role mapping and inspect live root/child/PR states under presets.

## D-004: Row selection consumes the overlay only during selection mode

Status: Accepted

### Evidence

Users naturally Shift+click row text, while the existing overlay currently
navigates and only the small checkbox selects.

### Options

Increase checkbox size; add a second row button; or switch the existing overlay
from navigation to selection while selection mode is active.

### Chosen approach

Use the overlay as the row selection target in selection mode, no-op for
protected rows, and preserve navigation outside selection mode.

### Trade-offs and risks

Selection mode intentionally changes row click meaning; the visible checkbox
and toolbar make that mode explicit.

### Verification

Live-click row title/background with and without Shift; click protected rows;
then exit mode and confirm navigation behavior is restored.
