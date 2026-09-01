# Plan: Filter Icons Refactor

## 1. Centralize filter presentation

- Define an exhaustive typed map for Source and every board filter field.
- Derive ordered Manage filter options from the canonical entries.

## 2. Reuse icons and labels

- Update wide chips to read icon/label from the map.
- Add a decorative icon-bearing label helper to every constrained section.
- Add the same decorative icon beside each Manage filter-card title.

## 3. Guard compatibility

- Preserve explicit option/update branches, preference values, counts, search,
  Clear, scrolling, checkbox semantics, and responsive composition.
- Add source tests for exhaustiveness, reuse, decorative accessibility, and
  absence of old hardcoded chip literals.

## 4. Verify and review

- Run Taskboard and root checks plus diff validation.
- Exercise wide, constrained, active-filter, Clear, and Manage surfaces in BB;
  capture screenshots and complete independent review before integration.
