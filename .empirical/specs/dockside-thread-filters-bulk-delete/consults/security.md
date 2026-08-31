# Security advisory: Dockside bulk deletion

Specialist: security

Verdict: advisory

## Findings

### SEC-001: Treat preview tokens as one-use deletion capabilities

- Severity: high
- Category: authorization / replay
- Location: `previewBulkDelete` and `confirmBulkDelete`
- Finding: A confirm token authorizes irreversible deletion of its bound root
  set. Replay or an unbounded lifetime would let a stale browser action repeat
  after the user reviewed different state.
- Recommendation: generate cryptographically random opaque tokens, store them
  only in the active server generation, bind root ids and the protected current
  id plus each root's exact sorted descendant identity set, expire after 60
  seconds, prune on access, and consume before the first mutation. Never accept
  raw ids on confirm, and skip/re-preview on any topology drift.
- Disposition: addressed by the approved design.

### SEC-002: Revalidate the complete hidden descendant tree fail-closed

- Severity: high
- Category: destructive scope / TOCTOU
- Location: authoritative family read and confirm loop
- Finding: Frontend rows omit hidden agents and can go stale. Trusting them can
  delete a newly active or unread descendant, or present a smaller child count
  than the SDK cascade will remove.
- Recommendation: recursively enumerate visible, hidden, archived, and active
  descendants server-side; compare against the SDK child summary; protect
  unknown/reconnecting runtime states; reject child rows as roots; cap roots,
  pages, and total descendants; and repeat the read immediately before each
  delete. Skip changed families and continue the batch.
- Disposition: addressed by the approved design, with the SDK mutation as the
  final authority for the unavoidable final instruction-level race.

### SEC-002A: Keep retained failures inside the user's inspection surface

- Severity: high
- Category: destructive-action recoverability
- Location: selection-mode filtering and per-id outcomes
- Finding: A selected quiet family can become active or unread and stop matching
  the active preset before confirm; retaining only its id while hiding its row
  makes a skipped result difficult to inspect or intentionally retry.
- Recommendation: union retained selected families back into the filtered and
  searched selection view, remove only confirmed deleted ids, and render
  per-id skipped/failed messages rather than aggregate counts alone.
- Disposition: addressed by the revised design and requested-change repair.

### SEC-003: Do not expose backend exception text through bulk results

- Severity: medium
- Category: information disclosure
- Location: per-root failed result
- Finding: Returning a bounded but otherwise raw exception can reveal local
  paths, host identifiers, transport details, or internal implementation text
  to any same-origin plugin caller.
- Recommendation: log the detailed exception server-side with the thread id,
  but return one generic display-safe failure message. Keep stable skip reasons
  separate from unexpected failures.
- Disposition: requires the smallest implementation refinement before final
  verification.

### SEC-004: Keep confirmation identity-rich and cancellation mutation-free

- Severity: medium
- Category: user intent
- Location: native bulk confirmation dialog
- Finding: Counts alone can authorize the wrong similarly sized set; accidental
  Enter/backdrop handling can turn inspection into confirmation.
- Recommendation: show root titles and root/child/total counts, initial-focus
  Cancel, require a distinct `Delete permanently` button, and never invoke
  confirm from close, Escape, filter changes, or generic container events.
- Disposition: addressed by the approved design.

### SEC-005: Preserve BB's trust and project-routing boundaries

- Severity: low
- Category: boundary integrity
- Location: RPC route and project `+`
- Finding: A custom unauthenticated HTTP route or plugin-owned filesystem picker
  would widen access and could target the wrong machine.
- Recommendation: use the SDK RPC's local authenticated route, use BB's native
  `openNewThread({ projectId })`, and leave workspace/folder resolution to BB.
- Disposition: addressed by the approved design.
