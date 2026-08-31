# Adapt Github Pr 1964 Into A New Independently Installable Bb

## Request
> Adapt GitHub PR #1964 into a new independently installable BB plugin, preserving its behavior, aligning manifests/docs/tests, and prepare repository changes plus validation for marketplace submission and upstream BB linkage.

## Goal
Ship a community-installable plugin that stores provider, model, and reasoning independently for each directly selected host and provider, with browser-wide fallback. Document the current extension boundary and link upstream PR #1964 for native host composer integration.

## Acceptance Criteria
- [ ] [AC-1] Host/provider/model/reasoning values round-trip through localStorage.
- [ ] [AC-2] Empty or malformed host identifiers use browser-wide scope.
- [ ] [AC-3] Existing unscoped values remain readable as fallback.
- [ ] [AC-4] Changing provider does not leak prior provider model/reasoning.
- [ ] [AC-UI-1] [UI] Settings lets users inspect and clear saved selections.
- [ ] [AC-5] Package metadata, collection manifest, README, tests, and build align.
- [ ] [AC-6] Documentation links https://github.com/get-bb/bb/pull/1964.

## Scope
Plugin-owned persisted-selection library, settings UI, tests, package metadata, collection registration, and marketplace-ready documentation.

## Non-goals
Modifying BB core, intercepting the built-in new-thread picker, persisting reused-environment selections, or publishing/pushing remote state without explicit release approval.

## Verification
Focused unit tests, TypeScript check, BB plugin type check/build, and root workspace checks.

## Capability Deltas
See `deltas/machine-model-preferences.md`.
