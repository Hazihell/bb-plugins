# Verification evidence

Collected: 2026-08-26T15:38:20-03:00  
Branch: `dev`  
Base commit: `f3ecae77e9add2ffd649442ee880841e30fc25eb`

## Automated checks

- Focused Taskboard typecheck — PASS.
- Focused Taskboard suite — 71/71 PASS, including exhaustive presentation-map
  reuse and decorative accessibility guards.
- Policy v2 `workspace-check` runs the authoritative root `npm run check`,
  production builds, and Taskboard metadata verification.
- `git diff --check` — PASS.

## Live BB walkthrough

The local-path Taskboard plugin was inspected against a populated Linear
project without any provider mutation.

- Wide chips display the canonical Source/State/Status/Assignee/Priority/
  Project/Labels icon vocabulary.
- The compact menu displays the matching decorative icon beside all enabled
  section headings while retaining visible text, checks, search, and scrolling.
- Selecting one state produced `Filters · 1` and a checked option; Clear returned
  the project preference record to its original empty filters.
- Manage visible-filter cards show the same icon beside each title while native
  checkboxes, descriptions, card height, and click targets remain unchanged.
- DOM inspection confirmed all section SVGs use `aria-hidden="true"`.

## Screenshot artifacts

- `wide-filter-icons.png` — `sha256:cf3eb27892656ad45d1c3364fe2074720152ec9097d571b21a27dcea8a32f5a0`
- `compact-filter-icons-active.png` — `sha256:94cf7629677530db3a0d217a885e06097cb046195352dbf7f96297f98177b5f1`
- `manage-filter-icons.png` — `sha256:2c4b2b8378417477271282039ea8e5d9e6c534ac381b8ef1aef1722c4334d98a`

## Acceptance coverage

- AC-UI-1: all three iconized surfaces plus screenshots and DOM inspection.
- AC-1: exhaustive typed map and derived ordered Manage model source guards.
- AC-2: existing preference/filter regressions plus live checked/count/Clear.
- AC-3: signed root check, browser walkthrough, screenshots, and review.
