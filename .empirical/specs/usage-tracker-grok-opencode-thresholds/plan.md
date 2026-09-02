# Implementation plan

1. Extend provider and preference contracts.
   - Add Grok/OpenCode wire and stable IDs, definitions, recovery commands,
     deterministic normalization, visible preference IDs, settings, and schemas.
   - Add exact severity classification beside existing percentage clamping.
2. Extend provider artwork and rendering semantics.
   - Generalize provider marks to multiple paths and add BB's Grok/OpenCode
     geometry with OpenCode opacity.
   - Render all visible provider names safely, and add `data-level` to compact
     providers, rails, and detail rows.
3. Implement responsive presentation.
   - Preserve flex rules for one/two providers.
   - Add two-row and three-row grid rules for larger provider counts with a
     fixed spanning refresh column.
   - Add theme-aware warning/critical reading and fill colors.
4. Add regression coverage.
   - Expand normalization and settings permutations for both providers.
   - Test exact severity boundaries and provider mark paths.
   - Add a source/CSS contract test for semantic attributes and grid/threshold
     selectors while retaining existing lifecycle/accessibility/reset tests.
5. Update public metadata and documentation.
   - Package descriptions/keywords, README provider features/settings/login
     commands/wrapping/thresholds, and third-party mark notices.
6. Verify and integrate.
   - Run focused Usage Tracker typecheck/tests/build and configured Empirical QA.
   - Install/reload the local plugin, inspect normal/narrow layouts and details,
     and capture screenshot evidence.
   - Record unrelated workspace failures without changing acceptance, obtain a
     fresh-context review, and integrate capability deltas against an independent
     clean target.
