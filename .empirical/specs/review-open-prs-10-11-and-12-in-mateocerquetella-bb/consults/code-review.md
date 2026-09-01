# Independent Code Review

- Reviewer: code-review
- Verdict: advisory
- Source base: `fc4a1b9d66f8b9707874663b08b754edcf1a1c64`
- Reviewed candidate: `fb74be3f9f81f2d9f00de073ef79bc395485b7ce`
  on `integrate-community-prs`
- Scope: AC-1 through AC-9, decisions D-001 through D-005, original PR heads,
  merge resolution, current-main/Host Monitor reconciliation, product code,
  tests, manifests, documentation, context, and contributor attribution

## Criterion dispositions

### AC-1 — Pass

Usage Tracker defines Weekly and Five-hour as the only Compact limit choices,
normalizes missing and unknown values to Weekly at RPC and browser-cache
boundaries, and observes settings without reloading the plugin. Compact text
and rail geometry use the configured current window, then the current
alternative, then last-known data. The merged last-known snapshot remains
separate so expanded details continue to show both windows. Accessible labels
distinguish configured, actual, alternative, and last-known states. The final
17-test Usage Tracker suite covers normalization, both selections, both
fallback directions, fresh-versus-stale ordering, expanded-window retention,
and refresh/error behavior.

### AC-2 — Pass

The released `BrowsePreferences` architecture remains the only automatic
current-view owner. It is still versioned, strict, device-local, scoped by BB
project/provider plus Across projects, and shared by full and constrained
surfaces through one observable store. Query, view, every facet, provider, and
collapse overrides remain intact. Merge `bbdb3b8` uses the whole-tree `ours`
strategy and its tree equals its first parent exactly; no
`project_filter_state`, `BoardFilterState`, `filter-state.ts`, filter-state RPC,
or second server writer survives. Existing stale-request revision guards and
provider reconciliation remain in place.

### AC-3 — Pass

Project boards expose one bounded Presets menu in full and constrained layouts.
Save captures the complete current `BrowsePreferences`; Apply validates project
and provider identity and replaces the active project snapshot through
`browsePreferenceStore.set`, immediately notifying both surfaces. The applied
name is announced. Manage supports explicit rename, reorder, and delete with
serialized mutations, authoritative response lists, stale-request/project
guards, draft preservation, and logical focus restoration. Across projects has
no preset surface, and no default, dirty, active, or automatic preset behavior
was introduced.

### AC-4 — Pass

Preset persistence is project-scoped and parameterized. The strict state schema
prevalidates only known bounded fields without allocating attacker-sized
worklists, rejects accessors/inherited containers and controls, preserves the
complete version-1 browse shape, and enforces provider/source consistency.
Writes enforce per-state and aggregate UTF-8 byte ceilings transactionally;
RPC/CLI output is kept under the SDK ceiling without duplicating the saved
state. The table has an explicit non-null primary key, bounded columns and
positions, and project/name uniqueness.

Reads are capped, invalid rows are omitted individually, and raw IDs, project
IDs, names, and normalized names must round-trip canonically. Names use
locale-independent NFKC plus lowercasing. Creation enforces the 50-row limit;
ordering is deterministic; reorder accepts only an exact permutation of the
visible parseable IDs and is atomic; deletion of an absent ID is a no-op.
Provider validation and saving share the project mutation queue, while rename
is state-preserving only. Adversarial container, UTF-8 maximum, aggregate,
overflow, corrupt-row, duplicate, isolation, and permutation cases pass.

### AC-5 — Pass

The CLI lists, saves, renames, and deletes project presets and accepts
`list --preset`. Names resolve case-insensitively. Explicit `--source` and
`--query` values take precedence, including an explicit empty query; remaining
facets use `filterWorkItemsByAttributes` and honor the project's enabled board
facets like the UI. Results remain bounded to 200 items. Non-cached listing
revalidates the preset provider after synchronization, preventing an
old-provider preset from filtering items after a concurrent connector switch.
JSON preset output enforces BB's one-megabyte CLI limit.

### AC-6 — Pass

Compared directly with current `origin/main`, root/plugin manifests,
`package-lock.json`, `.bb/plugins.json`, CI, Taskboard `0.3.1`, Usage Tracker
`0.1.2`, Git-only/private distribution fields, and the complete Host Monitor
tree are unchanged. The 109-test Taskboard regression suite covers browsing,
query, filters, List/Kanban, collapse state, remembered assignee, creation,
provider safety, credentials, status movement, distribution, and the new preset
paths. Usage Tracker retains provider visibility, refresh, cache, and error
behavior while adding the compact selection. `git diff --check` passes.

### AC-7 — Pass

The root README describes both capabilities and contains a Contributors section
with exact links for Stephen Dolan (`https://github.com/stephendolan`) and
Andrii Los (`https://github.com/RIP21`). The Usage Tracker README/changelog
credit Compact limit; the Taskboard README credits the project-view work and
named presets and documents UI, Manage, CLI CRUD, `list --preset`, explicit
precedence, project scope, and no automatic application. Refreshed Empirical
context describes the same ownership and commands while retaining Host Monitor.

### AC-8 — Pass for history; remote PR state is a delivery gate

Exact heads `201c44a5f825c724fcfdfa6876437ceb2730814b` (#10),
`445e5ac4f3943a8eb4821f27a808715f46e57450` (#11), and
`91037db6add4edd08c313025cb8a1e51896458ad` (#12) are ancestors of the candidate.
Stephen Dolan remains author of #10; Andrii Los remains author of all six #11
and seven unique #12 commits. #11 is intentionally represented by the exact
whole-tree `ours` merge; #12 remains a merge parent and its useful seven-commit
delta is adapted in the owner resolution commits. Current main, including Host
Monitor, is also an ancestor. Remote #10 is merged; #11 and #12 remain open
until the reviewed integration is merged, after which their exact heads must be
confirmed as main ancestors or closed with the specified supersession link.

### AC-9 — Pass for code review; final workflow gates remain

Final independent reruns pass Taskboard TypeScript and 109/109 tests, Usage
Tracker 17/17 tests, ancestry checks, unchanged manifest/lock/Host Monitor
comparison, and `git diff --check`. Signed receipt
`executed-13777e8d218261389af72cdf` records the exact final product tree's root
`npm run check`: all three workspace checks, Taskboard build metadata, and
plugin builds pass. Live reload exercises, Empirical detached integration,
hosted CI, normal remote merge, and final PR ancestry/state checks remain
required before claiming delivered. Those are workflow/delivery gates, not
product-code defects.

## Decision consistency

- D-001 is preserved by normal merge parents for all exact contributor heads.
- D-002 is preserved by retaining PR #10 behavior and authorship without a
  package or release change.
- D-003 is preserved by the exact tree-neutral #11 `ours` merge and guards
  against every obsolete persistence artifact.
- D-004 is preserved by porting only the useful #12 preset work onto strict
  `BrowsePreferences`, current UI/provider safety, bounded storage, RPC, and
  CLI contracts.
- D-005 is preserved by linked root/plugin credit plus original reachable
  authorship.

No accepted decision requires supersession.

## Finding CR-001: retained-refresh retry focus is not deterministic

- Severity: low
- Category: keyboard accessibility
- Location: `plugins/taskboard/app.tsx` retained-refresh retry controls in
  `FilterPresetMenu` and `FilterPresetsForm`
- Detail: the menu's retained-error retry is a plain nested button rather than
  a registered `DropdownMenuItem`, so Radix arrow-key navigation does not
  reliably include it. In the menu and Manage, starting retry clears the error
  and removes the pressed control without explicitly choosing the next focus
  target.
- Impact: authoritative rows and drafts remain intact, pointer retry works, and
  automatic realtime/reconnect refresh remains available. This does not block
  merge but can make keyboard retry/disorientation worse after a transient
  background failure.
- Recommendation: use a `DropdownMenuItem` for menu retry and retain a disabled
  `Refreshing...` control or move focus to the preset trigger/heading before
  removing the Manage retry.

No blocking, high, or medium correctness, security, persistence, concurrency,
scope, packaging, ancestry, contributor-credit, or regression finding remains.
