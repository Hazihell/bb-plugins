# Security Consultation

- Specialist: security
- Verdict: advisory

## Review boundary

This review covers the final integration tree against current `origin/main`,
including the preserved PR #10, #11, and #12 ancestry; Taskboard preset schema,
SQLite, RPC, CLI, realtime, and UI paths; Usage Tracker compact-window
selection; current Git-only manifests; and the post-review hardening changes.

## Findings

No blocking or medium findings remain. The issues found during the review were
repaired and retested:

- Preset state and reorder inputs now preflight attacker-controlled container
  cardinality before element parsing. The complete released
  `BrowsePreferences` envelope remains accepted: the measured maximum valid
  state is 900,441 UTF-8 bytes, below the 910,000-byte row bound, while a
  transactional 950,000-byte project aggregate bounds list and mutation work.
- SQLite uses parameterized, project-scoped transactions, a non-null primary
  key, canonical raw identity and normalized-name checks, bounded reads, exact
  reorder permutations, and per-row corrupt-data omission. Derived-name
  normalization failures are contained rather than aborting the list.
- The save provider check and write share the project mutation queue. CLI
  preset listing rechecks provider identity after synchronization and applies
  only facets enabled by current board settings. CLI JSON has an explicit SDK
  byte ceiling, and save RPC returns the large state only once by pairing a
  bounded saved-preset summary with the authoritative list.
- UI project revisions and scope identity reject late cross-project reads and
  mutation responses. Realtime, reconnect, and post-mutation refreshes retain
  last-known presets and drafts on transient failure. React renders preset and
  error text as text, while CLI output visibly escapes external control and
  bidirectional characters.
- Usage Tracker keeps the fresh provider snapshot separate from merged
  last-known details. Compact selection prefers the configured fresh window,
  then the fresh alternative, and only then labeled last-known data; unknown
  preferences still normalize to Weekly.
- Taskboard and Usage Tracker remain private Git-only workspaces. No dependency,
  package version, workflow, registry credential, or npm publication path was
  introduced. Host Monitor and current mainline context remain intact.

Verification observed 109 passing Taskboard tests, 17 passing Usage Tracker
tests, both focused typechecks, the full root workspace check/build, a clean
diff check, and a conflict-free merge tree against current `origin/main`.

The following low residual findings do not cross a security authorization or
project-isolation boundary.

### Finding RR-01 — Deliberately corrupted local databases fail closed

- Severity: low
- Category: local availability / corruption recovery
- Location: `plugins/taskboard/store.ts` preset reads and capacity checks
- Exposure: An actor already able to bypass SQLite constraints or alter the
  plugin database can fill a project with invalid rows. Reads and parsing stay
  bounded and valid rows remain isolated, but corrupt rows can consume the
  finite row or aggregate-byte quota until the local database is repaired.
- Recommendation: Keep fail-closed bounds and require an owner-invoked repair command.

### Finding RR-02 — Unicode lowercase equality is not full case folding

- Severity: low
- Category: display-name ambiguity
- Location: `plugins/taskboard/filter-presets.ts` `normalizePresetName`
- Exposure: NFKC plus locale-independent lowercase blocks ordinary case and
  compatibility duplicates, but Unicode multi-character case-fold equivalents
  such as `Straße` and `STRASSE` can remain distinct. Names carry no authority,
  and controls/bidirectional overrides are rejected, so this is a visual
  ambiguity rather than a project-isolation bypass.
- Recommendation: Adopt pinned Unicode case folding if full equality becomes required.

### Finding RR-03 — Authorship preservation depends on normal merge delivery

- Severity: low
- Category: provenance integrity
- Location: Git integration history and delivery strategy
- Exposure: The exact Stephen Dolan and Andrii Los commits are ancestors of the
  integration branch, and PR #11's incompatible tree is retained only as an
  unchanged `ours` merge parent. Squashing or rebasing the final integration
  would discard the ancestry that provides contributor provenance.
- Recommendation: Use a normal merge and never rewrite contributor commits.
