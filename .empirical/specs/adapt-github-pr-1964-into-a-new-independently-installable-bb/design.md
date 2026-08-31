# Design

The plugin exposes pure storage helpers for provider, model, and reasoning
selections. Keys are versioned and encode `[hostId]` or `[hostId, providerId]`;
when host is absent, provider-scoped legacy keys are read before unscoped keys.
Invalid values are discarded. A settings section renders saved entries and a
clear-all action. The app does not claim to replace BB's internal composer.

## Data flow

`readPreference(scope)` -> validate -> fallback; `writePreference(scope, value)`
-> versioned localStorage key. `clearPreferences()` removes only plugin keys.

## Verification

Node tests exercise storage with a fake localStorage. Typecheck and `bb plugin
build` validate the installable package.
