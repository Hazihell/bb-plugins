# Verdict: CHANGES_REQUESTED

- PASS AC-1: Host/provider/model/reasoning round-trip and isolation are covered.
- PASS AC-2: Invalid hosts normalize to browser-wide scope.
- PASS AC-3: Legacy provider-scoped and matching unscoped fallbacks remain readable.
- FAIL AC-4: An explicitly invalid provider is treated like omission and falls back to the selected provider.
- FAIL AC-UI-1: A provider-only saved record is absent from the Settings inventory and leaves Clear disabled.
- PASS AC-5: Package, docs, tests, and build contracts align.
- PASS AC-6: README and Settings link the exact upstream PR.

## Security / correctness

Reject explicitly invalid provider input instead of applying selected-provider fallback.

## Design / maintainability

Settings inventory must cover both provider and execution record types.
