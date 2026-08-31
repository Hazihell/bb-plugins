# Verification evidence

Collected: 2026-08-26T15:11:24-03:00  
Branch: `dev`  
Base commit: `f3ecae77e9add2ffd649442ee880841e30fc25eb`

## Automated checks

- Focused Taskboard typecheck — PASS.
- Focused Taskboard suite — 70/70 PASS, including deterministic normalized
  identity, Unicode/punctuation fallback, accessible marker source guards, six
  theme-tone rules, and locked 20px geometry.
- Repository Policy v2 `workspace-check` runs the authoritative root
  `npm run check`, including production builds and metadata verification.
- `git diff --check` — PASS.

## Live BB walkthrough

The local-path Taskboard plugin rendered a populated 247-item Linear project.
No issue, status, comment, assignment, or other provider mutation was made.

- List showed stable colored initials for repeat assignees: the same person
  retained initials and tone across all visible rows.
- Kanban reused the identical marker on cards without changing card geometry.
- Every rendered marker remained exactly 20×20px and exposed an
  `Assigned to <full name>` label plus its existing tooltip.
- All six colors are derived from host theme tokens; populated List and Kanban
  were inspected in both light and dark color schemes.
- The pre-existing compact rule still hides row avatars when the content area
  is narrower than 36rem, avoiding crowding.

## Screenshot artifacts

- `list-assignee-avatars-light.png` — `sha256:5844b9c3e56b444a2d105d7c799937dbadcec305656a28786796a68ed9d8ab89`
- `list-assignee-avatars-dark.png` — `sha256:204c46f5e4353b0236c24ce5e0de119b55a9447a13c5b3ca4d938fbeaed527bb`
- `kanban-assignee-avatars-light.png` — `sha256:fb798fe748f1a82d58d2070650fd1a603b8369ea1d79d452c6795546a59df1b5`
- `kanban-assignee-avatars-dark.png` — `sha256:f4a815c006fbaeea6fb3bad29f2a55d1c957f95485b6548a56c4c0622dc456d5`

## Acceptance coverage

- AC-UI-1: CSS/source tests plus light/dark List and Kanban captures.
- AC-UI-2: pure deterministic normalization/hash tests and repeat-person live
  observation.
- AC-1: named-image source guard and live DOM label inspection.
- AC-2: unchanged provider contracts and full Taskboard regression suite.
- AC-3: signed workspace check, browser walkthrough, screenshots, and review.
