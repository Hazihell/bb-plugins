# Assignee Row Avatar Design

## Overview

Keep the existing 20px initials marker and make it read as a deliberate avatar,
not a faint metadata badge. No provider or storage contract changes are needed.

## Identity derivation

Add a pure helper beside Taskboard's other browse/display derivations. It:

- normalizes the display name with Unicode NFKC, trims it, and collapses
  whitespace;
- derives at most two initials from the first two meaningful tokens, preserving
  non-Latin letters and falling back to `?` for punctuation-only input;
- hashes the normalized name after locale-independent `toLowerCase()` with a
  fixed unsigned integer algorithm; and
- selects one of six named provider-neutral avatar tones.

The fixed algorithm and ordered palette make identity stable across renders and
reloads without storing another preference. Tone is supplementary; the full
name remains the accessible identity.

## Visual treatment

`AssigneeMark` keeps a 20×20px circular footprint and existing row/card
placement. It adds `data-assignee-tone`, `role="img"`, and
`aria-label="Assigned to <full name>"`.

CSS gives every marker:

- a stronger accent-mixed border plus subtle outer/inset ring;
- a softly tinted, theme-token-derived surface;
- higher-contrast 9px bold initials with controlled letter spacing; and
- one of six restrained tones: violet, blue, teal, amber, rose, or slate.

Colors use `color-mix` with BB theme tokens so light/dark contrast stays
coherent. The palette is identity decoration, not state/priority semantics.
Inline/block/min/max size stay locked to 20px with border-box sizing and no
hover scale or motion.

## Boundaries

- No network lookup, provider avatar URL, cache/schema, or RPC changes.
- No presence dot, hover card, assignee mutation, or multi-avatar stack.
- Unassigned items still render no marker.
- The existing tooltip continues to disclose the full name.
- The compact-width rule that hides row avatars below 36rem remains unchanged.

## Verification

- Pure tests prove normalization, initials fallback, deterministic tone, and
  palette bounds.
- Source/CSS guards prove accessible labeling, six tone rules, 20px geometry,
  and theme-token mixing.
- Taskboard and root checks prove no provider/filter/navigation regression.
- Live light/dark List and Kanban screenshots verify density and contrast.
