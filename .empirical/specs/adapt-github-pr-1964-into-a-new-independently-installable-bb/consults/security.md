# Security Advisory

- Specialist: security
- Verdict: advisory

## Findings

- Severity: medium
  - Category: untrusted persisted data / availability
  - Location: `plugins/save-my-model/lib/preferences.ts` list/read boundary
  - Finding: localStorage keys and values are user-controlled. An invalid
    percent-encoded key can make `decodeURIComponent` throw while the settings
    page lists entries, and unbounded strings or entry counts can cause
    excessive parsing and rendering.
  - Recommendation: decode each key component defensively, reject malformed or
    oversized identities and values, and cap listed plugin entries.

- Severity: low
  - Category: scope confusion
  - Location: host and legacy-key resolution
  - Finding: empty or malformed hosts and legacy unscoped values can resolve
    inconsistently, leaking one provider choice into another scope or silently
    discarding an existing preference.
  - Recommendation: normalize invalid hosts to one browser scope, preserve
    provider-specific then unscoped legacy fallback order, and test provider
    changes against cross-provider leakage.

- Severity: informational
  - Category: confidentiality
  - Location: browser localStorage
  - Finding: host, provider, model, and reasoning choices are preferences,
    not credentials, but remain visible to code running in the same origin.
  - Recommendation: store no secrets or prompts, keep values JSON-minimal, and
    clear only plugin-owned versioned and documented legacy keys.

## Exploit Review

The practical attacker controls same-origin localStorage rather than a remote
server input. React escapes rendered strings, so script injection is not
available, but malformed keys can crash the settings section and oversized
records can degrade it. Defensive decoding, length and count bounds, strict
reasoning validation, deterministic host normalization, and hostile-storage
tests close those paths without changing the plugin's scope.
