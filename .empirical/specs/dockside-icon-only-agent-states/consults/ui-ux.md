# UI/UX Advisory: Dockside Icon-Only Agent States

Specialist: ui-ux

Verdict: advisory

## Findings

### U-001 — High — repetition — child completion

Location: AC-2

Repeating Done on every child overwhelms the family and adds no navigation
value once the child is quiet.

Recommendation: remove child completion entirely; retain title, branch, time,
provider, and neutral connector.

### U-002 — Medium — icon clarity — root and PR state

Location: AC-1, AC-3, AC-4

Icon-only state is appropriate at this density if shapes are stable and every
state exposes a label on hover and to assistive technology.

Recommendation: use Check for completion/ready, CircleX for blocked/closed,
GitBranch for open/draft, Target for review, and Loading for checks/activity;
keep PR number visible.

### U-003 — Medium — duplicate live state — child rows

Location: AC-4, AC-5

Adding another working icon beside the branch duplicates the existing left
status glyph just as visibly as the rejected word.

Recommendation: rely on the existing left glyph for child live state and use
only connector tint plus one root activity icon for family orchestration.

The resulting family is visually quieter and preserves discoverability through
consistent tooltips and accessible names.
