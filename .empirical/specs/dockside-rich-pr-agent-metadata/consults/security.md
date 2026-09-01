# Security Advisory: Dockside Rich PR and Agent Metadata

Specialist: security

Verdict: advisory

## Scope reviewed

- `.empirical/specs/dockside-rich-pr-agent-metadata/spec.md`
- `.empirical/specs/dockside-rich-pr-agent-metadata/design.md`
- `.empirical/specs/dockside-rich-pr-agent-metadata/deltas/dockside-thread-management.md`

## Findings

### S-001 — Low — privacy — final-output preview surface

Location: AC-4/AC-5 and Design “Backend contract and cache”

The new line can reveal up to 120 characters of an assistant's final output in
the always-visible authenticated sidebar. The design prevents persistence and
excludes raw history/tool output, but sensitive text can still be visible to a
person looking at the screen.

Recommendation: keep the current mounted-row-only lookup, control-character
normalization, hard length bound, and memory-only cache. Do not add hover
expansion, persistence, or unbounded output to this surface.

### S-002 — Low — availability — repeated mounted-row lookups

Location: AC-5 and Design “Frontend data flow”

A workspace with many visible quiet roots can cause many small local RPC calls
on a cold cache. Each request is bounded and server-revalidated, so this is not
an authorization bypass, but it can amplify local `threads.get`/`threads.output`
work until the 200-entry cache warms.

Recommendation: retain the 50-row request cap, exact timestamp cache key,
quiet-row gate, and failure-to-null behavior. If runtime telemetry later shows
meaningful load, aggregate requests at the inbox level or add a small server
concurrency limiter rather than persisting output.

### S-003 — Informational — authorization — client claims are revalidated

Location: Design “Server behavior”

The client supplies thread ids and timestamps, but the server re-reads the
thread, rejects deleted/active/stale rows, and returns only normalized final
output. The method is local authenticated RPC, does not accept project paths or
credentials, and the cache is cleared on deletion.

Recommendation: preserve exact id/timestamp/status revalidation and keep PR
navigation on BB's `UrlLink` rather than opening arbitrary URLs directly.

## Conclusion

No blocking exploit was found. The smallest durable safety boundary is the one
already designed: local-only RPC, strict bounded inputs, authoritative thread
revalidation, normalized short output, no persistence, and deletion cleanup.
