# Independent Code Review

- Verdict: `pass`
- Scope: every acceptance criterion, accepted decisions D-001 through D-004
  and D-006, the complete source/test/CSS diff, and live browser artifacts
- Review passes: provider/cache correctness, adversarial edge cases, and
  UI/accessibility/visual behavior

## Criterion review

- AC-1/AC-2: current `claude-code` / `acp-cursor` keys and legacy
  `claudeCode` / `cursor` aliases retain healthy windows under stable internal
  IDs; current keys win exact-window conflicts.
- AC-3: an absent provider becomes one provider-local unavailable error while
  healthy peers remain intact.
- AC-4: pure detail rows keep canonical placeholders first and append every
  unselected provider object under its original label/source order.
- AC-5: cache reconciliation preserves the selected canonical categories and
  all remaining exact-label windows without replacing current values.
- AC-UI-1/AC-UI-2: recaptured BB evidence shows Fable in the complete expanded
  card, a single compact percentage, wrapped/scrollable overflow, reachable
  header, and no host-chrome or horizontal overlap.
- AC-6: the root workspace check passes SDK checks, typechecks, every plugin
  suite, production builds, and Taskboard build-metadata validation. The PR's
  clean `npm ci` CI run remains a required pre-merge integration gate.

## Findings resolved during review

1. A proposed local provider window/label bound contradicted the approved exact
   product contract and created lossy cache identities. D-006 explicitly
   supersedes D-005; the projection was removed and shared provider-result
   hardening was deferred to BB's full-trust maintenance contract.
2. Healthy current/legacy windows and current-key exact-window precedence were
   under-tested. Dedicated regressions now cover all three provider outputs.
3. Subtree replacement lost focus and omitted popup relationships. Logical
   focus is now preserved across open, close, Escape, preferences and refresh;
   the trigger/dialog/scroll-region ARIA contract is explicit and Open/Close
   copy reflects state.
4. The tall card could collide with BB's fixed sidebar control. Viewport height,
   scrolling, and stacking were corrected; the recaptured stress screenshot and
   hit test show the card paints cleanly.
5. Disabled refresh focus could temporarily fall to the body and later steal
   focus. The control now remains focusable with `aria-disabled` throughout the
   request.
6. Global Escape interception could suppress a newer host overlay. Escape is
   consumed only when event/active focus belongs to Usage Tracker; live proof
   shows host-focused Escape leaves the background card open.

## Final result

Three independent final re-review passes reported no remaining
medium-or-higher findings. Focused Usage Tracker verification passes 23/23
tests plus typecheck, SDK pin check, and production build. `git diff --check`
is clean.
