# Implementation Plan

1. Add `lib/project-colors.ts` with curated automatic palette, stable project-ID
   hashing, canonical hex validation, override resolution, relative luminance,
   and black/white maximum-contrast presentation. Add exhaustive pure tests.
2. Extend the append-only Dockside database migrations with
   `project_badge_colors`, define bounded typed list/set/reset RPC schemas, and
   implement membership validation, canonical upsert, isolated reset, bounded
   defensive reads, and `project-colors` realtime publication. Add backend
   harness/contract tests using the existing server test style.
3. Add `use-project-colors.ts` to load authoritative overrides, subscribe to
   realtime changes, and reconcile reconnects. ThreadInbox passes resolved
   colors into ProjectGroup, which styles only the existing letter badge.
4. Expand DocksideSettingsSection to read the project roster and render a
   filterable project editor. Implement row-local draft, busy, error,
   automatic/custom, external-change, Save/Reset/Reload, focus, and live-region
   behavior from the UI consult.
5. Move Hugeicons and Zod to Dockside runtime dependencies, refresh the root
   npm lockfile, and add per-required-entry distribution metadata coverage.
6. Run Dockside typecheck/tests/build while editing, then exercise an isolated
   production-only install/build and the full configured workspace checks.
7. Install/reload this local Dockside path, test save/reset/rename/reload in a
   real browser, and capture light/dark settings/sidebar screenshots.
8. Collect current-matrix receipts, complete isolated fresh-context review,
   reconcile findings, and integrate both capability deltas against a clean
   independent target without publishing.
