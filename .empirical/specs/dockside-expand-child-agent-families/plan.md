# Plan: open child-agent trees with quiet chrome

1. Add and test a pure family-expansion resolver covering no children,
   default-open, search force-open, and explicit true/false overrides.
2. Wire `ThreadCard` to the resolver and replace `N agents` with chevron plus
   numeric count while keeping the existing accessible label.
3. Remove the visible project attention glyph cluster while preserving the
   screen-reader summary and row-level status rendering.
4. Run focused Dockside tests/typecheck/lint, watcher reload, and root gates.
5. Render this root with its three completed visible BB children at wide and
   compact widths, capture screenshots, and record fresh-context/review evidence.
