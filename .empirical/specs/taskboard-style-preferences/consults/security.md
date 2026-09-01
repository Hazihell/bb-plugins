# Security Specialist Advisory

- **Specialist:** security
- **Verdict:** advisory

The milestone is safe to verify after the following abuse cases are treated as
explicit invariants. The final implementation and regression suite incorporate
each recommendation.

## Findings

### 1. Confine every external tracker line

- **Severity:** high
- **Category:** prompt injection
- **Location:** `design.md` — External task context; `deltas/external-task-context.md`
- **Recommendation:** Put trusted handling instructions before one clearly
  delimited external-data block, prefix every logical line after normalizing
  Unicode and C0 line separators, escape remaining unsafe controls, and route
  mentions plus direct handoff through the same formatter.

### 2. Bind native create fields to reviewed connector state

- **Severity:** high
- **Category:** confused deputy / stale authorization
- **Location:** `design.md` — Preference architecture and Direct board capture;
  `deltas/board-capture.md`
- **Recommendation:** Key assignee memory by exact project/provider/destination/
  type, restore only from fresh options, and require a connector revision from
  metadata load through the queued create operation. Clear stale native fields
  synchronously and disable submission until the scope and revision match.

### 3. Treat provider write failures as possibly committed

- **Severity:** high
- **Category:** duplicate external mutation
- **Location:** `design.md` — Direct board capture and Failure handling;
  `deltas/board-capture.md`
- **Recommendation:** Advance the provider mutation generation before the
  write, reconcile authoritatively after success or ambiguity, return a
  committed summary without fallible post-write enrichment, and disable repeat
  submission when confirmation is uncertain until the user closes and checks
  the refreshed board.

### 4. Keep browser preferences non-secret and best-effort

- **Severity:** medium
- **Category:** local data exposure / availability
- **Location:** `design.md` — Preference architecture;
  `deltas/project-view-preferences.md`
- **Recommendation:** Store only UI selections and provider-native IDs in
  versioned, validated device-local records. Never place credentials or issue
  bodies in browser storage; catch read/write failures and fall back safely.

### 5. Revalidate project and provider scope server-side

- **Severity:** medium
- **Category:** cross-project write
- **Location:** `spec.md` — AC-4 and AC-6; `deltas/board-capture.md`
- **Recommendation:** Treat frontend project/provider/destination values as
  claims. Re-read the selected connector, require the expected provider and
  connector revision, enforce repository/team/JQL destination scope in the
  adapter, and reject mismatches before provider mutation.
