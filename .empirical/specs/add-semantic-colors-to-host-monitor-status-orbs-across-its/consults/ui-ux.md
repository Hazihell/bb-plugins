---
specialist: ui-ux
verdict: advisory
---

# UI/UX consultation: rail-free host-state explanations

## Assessment

The final D-008 interaction matches the user's requested hierarchy across the
Host Monitor page, compact popover, and floating monitor. Host cards and rows
remain neutral in every health state, with no severity-colored edge,
background, border, shadow, chip, or global-icon treatment. The small semantic
orb remains additive, `Critical` and `Needs attention` are the only colored
state words, and Healthy, Offline, sampling, and unavailable copy stay neutral.
The supplied real-BB screenshots show concise help without making the host
container itself look like an alert.

Compact and floating rows now separate accessible description from visual
overlay correctly. Each focusable native `li` owns visually hidden,
privacy-safe reason text through `aria-describedby`; no role override or native
`title` duplication remains. A single `aria-hidden` tooltip attached at the
document body provides the visual copy. It measures the active row, constrains
itself to the current visual viewport, chooses below or above placement from
available space, and therefore avoids popover and floating-window scrollport
clipping for first, last, only, or intermediate hosts.

Pointer delegation and `focusin` expose the same explanation. Hover and focus
activation are tracked independently: hover takes temporary visual priority,
pointer exit falls back to a still-focused row, and focus exit preserves a
still-hovered row. The real-browser mixed-input sequences passed in both
directions. Scrolling repositions the active overlay, while rerendering,
closing, and disposal reset or remove it. The popover tab loop includes host
rows in DOM order. Rerenders remember the focused host by its stable host id
and restore focus—and therefore the explanation—after refresh, falling back
safely if that host disappears. The page's Radix tooltip remains portal-based
and collision-aware, including the whole focusable desktop row.

Visible health/freshness and connectivity copy remains authoritative; status
dots are decorative; raw alert and machine-error strings are excluded from
explanations; and the permanent Host Monitor icon remains neutral and
notification-dot free.

## Findings

No blocking or advisory UI/UX findings remain in the reviewed D-008 scope.

## Recommendation

Preserve the current regression boundaries: forbid tone-based container and
global-trigger decoration; retain native list/table semantics, focus order,
stable host-focus restoration, independent hover/focus activation, and
body-overlay cleanup; and keep explanation content routed through the closed
privacy-safe presentation mapper. Future visual checks should continue
covering page and compact/floating surfaces in active BB themes.
