# Plan: Assignee Row Avatar

## 1. Add deterministic identity derivation

- Add a pure normalized-name, Unicode-safe initials, fixed hash, and six-tone
  derivation beside Taskboard browse helpers.
- Cover repeated names, whitespace/casing normalization, Unicode, punctuation
  fallback, and palette bounds with unit tests.

## 2. Upgrade the shared marker

- Feed derived initials/tone into `AssigneeMark` used by List and Kanban.
- Replace `aria-hidden` with a non-interactive named image while retaining the
  full-name tooltip and surrounding row/card labels.

## 3. Refine theme-safe CSS

- Keep exact 20px geometry and compact hiding behavior.
- Add restrained accent-mixed surface, border, ink-heavy text, and one-pixel
  ring rules for all six tones without workflow semantics or motion.

## 4. Verify and review

- Extend source/CSS guards, run Taskboard and root checks, and inspect populated
  List/Kanban in light and dark BB themes.
- Capture immutable screenshots and complete independent UI/security review
  before the Empirical integration replay.
