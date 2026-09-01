# Decisions: Dockside Pr Only Check Icons

Record concise, externally reviewable evidence and choices here. Do not store
private chain-of-thought, prompts, credentials, secrets, or scratchpad text.

## D-001: Reserve checks for PR state

Status: Accepted

### Evidence

The user identified ordinary completion checks as visually indistinguishable
from PR approval and requested the icon after the number at the far right.

### Options

Keep root completion checks; restyle them; or remove completion and reserve
checks for Ready/Merged PR semantics.

### Chosen approach

Remove ordinary completion entirely. PR metadata renders number then state icon.

### Trade-offs and risks

Passive completion is no longer visible; quiet status/time and thread detail
remain. Check meaning becomes unambiguous.

### Verification

Absence tests, PR order/icon tests, and real wide/compact screenshots.
