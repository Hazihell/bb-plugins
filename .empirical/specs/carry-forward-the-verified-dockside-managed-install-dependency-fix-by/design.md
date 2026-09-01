# Design

## Architecture

The change has three bounded parts:

1. `lib/project-colors.ts` owns deterministic automatic color selection,
   canonical six-digit hex parsing, override precedence, and black/white
   foreground selection by WCAG relative luminance and contrast ratio.
2. Dockside's existing backend adds one append-only database migration and
   typed `listProjectColors`, `setProjectColor`, and `resetProjectColor` RPC
   methods. The server validates project membership through
   `bb.sdk.projects.get`, stores at most one canonical color per bounded project
   ID, caps total rows and output, and publishes `project-colors` after writes.
3. A shared frontend hook loads authoritative overrides, subscribes to the
   realtime channel, and reconciles after reconnect. Project headers consume
   the resolved presentation. The settings section reads the live project
   roster, renders one compact editor row per project, and calls set/reset RPC.

## Color behavior

Use a curated twelve-color palette chosen for distinguishable saturated badge
backgrounds. A stable FNV-1a hash of project ID selects the fallback palette
index. Display-name changes therefore affect only the existing letter, not the
color. Explicit canonical `#RRGGBB` overrides win.

For every background, calculate linearized sRGB luminance and select whichever
of `#000000` or `#FFFFFF` has the higher contrast ratio. This pair guarantees
at least WCAG AA 4.5:1 at the crossover when the stronger candidate wins. Keep the existing
rounded 20px badge, border/chrome context, project header accessible name, and
all row-level semantic status colors.

## Persistence and trust boundary

Append a `project_badge_colors(project_id TEXT PRIMARY KEY, color TEXT NOT
NULL, updated_at INTEGER NOT NULL)` migration. The RPC boundary accepts project
IDs with a small length/control-character policy and canonicalizes valid hex.
Before a write, call `bb.sdk.projects.get({ projectId })`; an unknown or deleted
project is rejected. Reads validate database rows again and return at most 500
entries. Set uses an upsert; reset deletes exactly one row. No stored string is
used as CSS unless it passes the pure hex parser.

The UI displays at most the bounded host project roster in host order. Each row
uses a 20px badge preview, visible project name, selectable status copy
(`Automatic · #RRGGBB` or `Custom · #RRGGBB`), a native `input type="color"`
labelled with the project name, and Save/Reset buttons whose accessible names
also include the project. Save is disabled until the draft differs from the
persisted effective value; Reset is disabled without an override. Changing the
picker updates only that row's preview and draft hex until Save.

Busy and error state is per project so one failure does not disable other rows.
The busy row disables its own controls and shows progress. An inline error is
associated through `aria-describedby` and preserves the draft. Successful
Save/Reset synchronizes the row from the authoritative response, restores
focus, and emits a polite live-region announcement. For large rosters the
section adds a project-name filter and a clear empty result without changing
host project order.

## Realtime and recovery

The shared hook loads once on mount, reloads on the `project-colors` realtime
signal, and reloads after a reconnect transition. RPC responses are the
authority; optimistic server state is unnecessary because local RPC is fast
and a successful write publishes immediately. Both sidebar and settings mount
their own hook instance and converge on the same server state.

Settings drafts are row-local. A realtime change updates authoritative state
and clean drafts. It never overwrites a dirty draft: that row shows `Color
changed elsewhere` with Reload (discard draft) and Save (apply draft) choices.
The originating row's successful Save/Reset uses its direct RPC response to
become clean before the realtime echo arrives.

## Managed-install metadata

Move both Hugeicons packages and Zod from Dockside `devDependencies` to
`dependencies`, preserving ranges, and refresh the root lockfile. Add a
distribution contract test that asserts each required package independently in
manifest/lock workspace runtime metadata and absent from development-only
metadata.

## Verification

- Pure unit tests cover hashing, rename stability, parsing, the worst
  black/white contrast crossover, every palette entry, representative overrides, and
  override/reset presentation.
- Backend harness tests cover migration, bounded list, project validation,
  upsert/reset isolation, and realtime publication.
- UI contract tests cover project roster, color input labels, save/reset,
  project-ID keying, and header styling.
- Typecheck, focused/full tests, production-only isolated resolution/build,
  local BB install/reload, and real-browser light/dark screenshots verify the
  user workflow.
