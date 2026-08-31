# Design: open child-agent trees with quiet aggregate chrome

## Overview

Dockside already has the reference structure: root card, branch/status details,
provider-marked child rows, and a vertical/horizontal connector. The mismatch is
state and chrome, not architecture. Make families with real child threads open
by default, preserve the current explicit override/search behavior, and remove
duplicated words/glyphs from the family and project headers.

## Expansion state

Add a pure `resolveFamilyExpanded` helper in `lib/thread-management.ts`:

```text
childCount == 0 -> false
forceExpanded   -> true
override set    -> override
otherwise       -> true
```

`ThreadCard` continues to own `expandedOverride: boolean | null`. New children
therefore open the family when no override exists; a user click pins open or
closed for that mounted card; search remains force-open. Completion/read state
does not collapse the family.

## Child disclosure chrome

Keep the existing button hit target, accessible name, `aria-expanded`, and
`aria-controls`. Replace `3 agents` with:

- the existing chevron first, matching the reference's disclosure rhythm;
- numeric count (`3`) second, tabular and compact;
- primary tint only when a child needs attention.

No additional person/agent icon is needed because every expanded child row
already carries its provider glyph and the connector communicates hierarchy.

## Project header chrome

Remove the visual `needsYou`, `working`, and `unread` cluster from
`ProjectGroup`. Keep:

- project initial tile;
- project name;
- root-family count;
- per-project `+` button;
- collapse chevron;
- the existing screen-reader-only `projectStatusLabel(threads)` summary.

The actual root/child rows remain the only visible status authority. This
prevents the project header from showing a spinner and unread ring together.

## Data boundary

No new data source is added. Dockside renders only `PluginSidebarThread` rows
BB supplies. Real visible children created with `parentThreadId` render in the
tree. Provider-internal collaboration workers that never create BB thread rows
cannot be discovered or represented safely and remain outside scope.

## Verification

- Pure tests cover no-child, default-open, forced-open, explicit-open, and
  explicit-closed cases.
- Existing Dockside tests prove status and hierarchy functions remain stable.
- Live BB uses the three visible children under `Improve sidebar design` and
  confirms they remain shown after completion without clicking.
- DOM/screenshot review confirms count + chevron only and no project status
  glyph cluster at wide and compact widths.
