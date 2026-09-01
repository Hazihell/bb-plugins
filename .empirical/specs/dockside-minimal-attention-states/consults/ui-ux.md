# UI/UX Advisory: Dockside Minimal Attention States

Specialist: ui-ux

Verdict: advisory

## Findings

### U-001 — High — information hierarchy — row metadata

Location: AC-1 through AC-5

The clearest sidebar uses one short state per row. Showing branch, PR title,
assistant summary, thread status, and time simultaneously makes every row a
mini report and weakens attention triage.

Recommendation: keep the title line and location line, place one compact state
at the end of the location line, and use the stated live → PR → Done precedence.

### U-002 — Medium — color semantics — state words

Location: AC-4

Color should communicate urgency, not provider identity. A destructive token
for Needs you/Failed, primary for active/in-progress, success for Ready/Done,
and muted for passive states creates a predictable scan path.

Recommendation: use low-opacity semantic backgrounds plus explicit labels;
never remove the words or rely on red/green alone.

### U-003 — Medium — density — family activity

Location: AC-5

The connector already carries activity geometry. An additional spinner beside
`Agents working` repeats the same fact and recreates the icon cluster the user
rejected.

Recommendation: keep connector tint, use `Agents working` as plain compact
text, and retain only the chevron plus numeric child count in disclosure.

### U-004 — Low — discoverability — removed detail

Location: AC-1, AC-2, AC-6

Removing visible PR/output prose makes the list calmer but moves detail one
click away.

Recommendation: preserve the PR title in native tooltip/accessibility text and
make state+number clickable. Do not add a summary tooltip; open the thread for
the authoritative outcome.

## Concrete target

- Two lines per root or child row.
- One state word/pill maximum in the secondary line.
- Destructive states visually strongest, then live primary, then success,
  then muted passive states.
- No new project header icon, metadata row, prose preview, or hover card.

The proposal is clear and should materially improve scanning at both desktop
and compact widths.
