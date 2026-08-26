---
specialist: security
verdict: advisory
---

# Security consultation

## Findings

None. The revised design removes the exploitable ambiguities identified in the
prior review: assignee evidence is three-state and scope-captured; the mutation
attempt boundary is conservative; control-character coverage is exhaustive;
metadata errors cross RPC only as normalized safe text; local preference keys
are injective; and publication binds a canonical archive and pinned registry to
the approved identity and process-scoped credential. Menu focus and label
overflow behavior introduce no additional security boundary.

## Residual risk

### RR-01 — Provider responses remain an external source of truth

- severity: low
- category: state-integrity / provider trust
- location: `design.md` — Confirmed assignee persistence and Ambiguous provider writes
- exposure: A provider can return stale or dishonest native issue state, and a transport failure after invocation cannot prove whether the write committed. The revised union prevents missing evidence from becoming confirmation, while outcome-uncertain handling deliberately trades availability for duplicate-write safety.
- recommendation: Keep exact native-ID comparison, never derive confirmation from warnings or display names, and require user reconciliation rather than automatic retry after an uncertain outcome.

### RR-02 — Device-local preferences are not a confidentiality boundary

- severity: low
- category: local confidentiality and integrity
- location: `design.md` — Durable project search and Canonical facets
- exposure: Code compromised within the same browser origin can read or alter persisted queries and facets even though tuple encoding prevents cross-scope key collisions. Search text can itself contain sensitive project terms and remains until clear/provider reset.
- recommendation: Continue treating every stored record as untrusted, enforce the bounded strict schema before use, never store credentials or authorization decisions in browse preferences, and preserve the documented scope-local clear/reset behavior.

### RR-03 — Visible escaping cannot remove semantic deception

- severity: low
- category: untrusted-content / social engineering
- location: `design.md` — External-content controls
- exposure: Complete C0/C1 and bidi escaping prevents terminal-state changes and direction-control spoofing, but ordinary text can still use homoglyphs, zero-width characters, misleading delimiter-like prose, or prompt-injection language.
- recommendation: Retain the fixed untrusted-data heading and delimiters, render external fields only as data, and do not interpret text inside the boundary as commands or trusted metadata.

### RR-04 — Safe error text can still disclose intentionally included context

- severity: low
- category: information disclosure / user-visible diagnostics
- location: `design.md` — Accessible constrained filtering and errors
- exposure: A normalized provider-specific message may legitimately name a provider, project, or permission failure, and the announced alert can be captured by assistive technology or screenshots. Raw secrets and transport internals are excluded by design.
- recommendation: Keep normalization server-side, limit messages to the minimum actionable context, render only plain text, and maintain regression cases proving raw errors, URLs, headers, bodies, stacks, and credentials never reach RPC output.

### RR-05 — Publication controls depend on the integrity of the publishing host

- severity: low
- category: software supply chain / local host trust
- location: `design.md` — Release archive replacement
- exposure: Canonical-path, regular-file, identity, hash, registry, and process-scope checks prevent accidental substitution and credential persistence, but they cannot protect a token or archive from an attacker already controlling the publishing account, npm client, or operating system.
- recommendation: Run the fail-closed wrapper on a controlled host with a short-lived least-privilege package token, preserve the approved SHA-256 and command evidence, and revoke or expire the token after the exact-version registry assertion.
