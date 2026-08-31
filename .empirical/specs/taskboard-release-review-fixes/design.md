# Taskboard Release Review Fixes Design

## Durable project search

Add a bounded `query` field with `default('')` to the existing version-1 browse
schema. The default lets strict legacy records without the field migrate in
memory without losing saved facets. `defaultBrowsePreferences`, cloning, clear,
and provider reconciliation all carry/reset the field. `TrackerList` reads the
query from the shared `useSyncExternalStore` snapshot, writes input changes
through the same scoped store, seeds its debounced committed query from the
snapshot, and caps input length to the schema bound. Full/right unmounts during
detail therefore cannot erase search, and every scope remains independent.
Scope/query changes invalidate in-flight list requests; clear/provider reset
blank the shared input immediately and the existing filtered empty state retains
its Clear action.

Browse records use one validated `project:<project-id>` scope encoded as one URI
component; create defaults encode a validated versioned JSON tuple of project,
provider, destination, and issue type. These injective encodings prevent
delimiter-bearing or Unicode identifiers from colliding.

## Confirmed assignee persistence

Extend the provider create-result, server result, and strict RPC output with a
three-state union:

`assigneeConfirmation: { confirmed: true; id: string | null } | { confirmed: false }`.

Each adapter derives it from explicit returned native issue state: GitHub's
required assignee array, Linear's required nullable assignee, and Jira's required
nullable assignee plus optional account ID. Missing/unreadable native identity is
never converted into confirmed null. The persistence helper captures the scope
and submitted ID before awaiting and mutates that scope only when confirmation
is true and its native ID exactly equals the submitted ID, including explicit
null/null unassignment.

All other successful results preserve the prior scoped default. This avoids
parsing human warning strings or comparing native IDs with display names.

## Ambiguous provider writes

GitHub's existing outcome-uncertain marker remains the frontend contract. The
mutation-attempt boundary is set synchronously immediately before invoking the
provider transport. Linear wraps that invocation and response parse; Jira
separately wraps its create POST/parse and post-create detail fetch. Every throw,
abort, timeout, malformed/lost response, or detail failure after invocation uses
the marker and reconciliation guidance, so the dialog disables Create. Only a
documented authoritative `success: false` response with no issue is an ordinary
rejection. Jira may include the confirmed issue key in the message, but never
enables a duplicate retry after a valid create response.

## External-content controls

Expand visible escaping to `U+007F–U+009F` and Unicode bidi embedding/override,
isolate, and mark controls (`U+061C`, `U+200E–U+200F`, `U+202A–U+202E`,
`U+2066–U+2069`). Existing line-separator splitting and delimiter quoting remain
unchanged. Table-driven tests enumerate every C0 code point for inline output,
every `U+007F–U+009F` code point, and every listed bidi mark/override/isolate;
they assert exact literal `\\uXXXX`, no original controls, and fixed delimiter
order around delimiter-like attacker text.

## Accessible constrained filtering and errors

The constrained menu owns an input ref. `DropdownMenuContent.onOpenAutoFocus`
prevents Radix's first-item default and focuses that input; Escape and arrow keys
remain available to the menu while printable/editing keys avoid Radix typeahead.
Down transfers into the filtered options, Escape restores the trigger, and an
empty value search shows a non-selectable `No matching values` row.
The scrolling values container clips horizontal overflow and wraps arbitrarily
long option labels without changing menu width.

The backend converts metadata failures into one normalized provider-specific
safe message before RPC serialization; raw errors, stacks, response bodies,
headers, URLs, and credentials never reach the app. Metadata errors render only
that text in a stable `role="alert"` block with a concise heading and explicit
Retry button with loading/duplicate-click protection. Create stays disabled
until a successful metadata load, as before, and references the error block
through `aria-describedby`.

## Canonical facets and provider fidelity

Add pure case-folded selection helpers that map persisted IDs to current option
values, deduplicate them, and remove all case variants when toggled off. After
fresh list options load, one effect writes canonical facet arrays back only when
they differ; checked state and selected labels use the same identity function.
State-category/source enums stay exact.

Linear issue field fragments request 100 labels, matching the accepted create
selection maximum. README text explicitly lists direct creation as a UI surface
and describes the CLI as browse/detail/status/configuration rather than full
feature parity.

## Release archive replacement

Product changes invalidate the earlier candidate archive. After tests and
review, build the final `0.3.0` source, create a new real tarball with scripts
disabled in a new release-artifact directory, inspect exact paths/metadata,
record SHA-256, and compare every packed source/build member with the candidate.
Only that canonical regular non-symlink file may be approved. A fail-closed
verify/publish wrapper pins `https://registry.npmjs.org/`, re-resolves the
absolute path, verifies name/version and SHA-256 immediately before invoking
`npm publish <absolute-path> --ignore-scripts`, and exposes the token only to
that npm process. Before marketplace push, assert
`npm view bb-plugin-taskboard@0.3.0 version` equals `0.3.0`, then rerun its build
and package-level liveness check.

## Verification strategy

- Unit tests: legacy query migration, scope sharing/clear/reconcile, canonical
  facets, confirmed/unconfirmed assignee storage, result contracts, C1/bidi
  escaping, adapter applied IDs, ambiguous Linear/Jira writes, and label limit.
- UI source guards plus live BB browser evidence: search detail round trip and
  cross-surface restore; keyboard-focused constrained search with long values;
  announced metadata error and Retry.
- Focused Taskboard typecheck/tests during implementation; signed root check,
  independent security/UI/code review, capability integration, then replacement
  archive verification before the source release commit.
