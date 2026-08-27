# UI/UX Consult: Host Monitor Identity Migration

- Specialist: `ui-ux`
- Verdict: `advisory`

## Assessment

Yes. For the stated criteria, the clearest interface is an intentionally
uneventful visual migration: users should recognize the same Host Monitor,
with the same information architecture, privacy defaults, thresholds, and
controls, while navigation and runtime identity become unambiguously
`host-monitor`. The design has the right boundary—rename identity-bound
surfaces without renaming ordinary “machine” domain language or redesigning
the product—but it should make the following user-facing contract explicit.

## Concrete target interface

| Surface | Expected result |
| --- | --- |
| Plugin navigation | Exactly one enabled entry labeled **Host Monitor** |
| Canonical page | `/plugins/host-monitor/machines` |
| Dashboard | Existing card and row layouts, data hierarchy, colors, and refresh behavior |
| Inspector | Existing machine terminology and masked-address default |
| Processes | Existing search, sort, and guarded termination interaction |
| Sidebar summary | Existing compact summary and outside-click dismissal |
| Floating monitor | Existing visual treatment and keyboard movement |
| Technical identity | Routes, RPC calls, assets, DOM hooks, and persisted keys use `host-monitor` only |
| Retired route | No alias or redirect; migration documentation carries the one-time removal instruction |

## Findings

### Finding 1

- Severity: medium
- Category: naming hierarchy
- Location: Active repository rename boundary, items 2–4
- Recommendation: State the visible naming contract explicitly: use “Host
  Monitor” for the plugin label, page title, and monitor surfaces;
  `host-monitor` only for technical paths and management commands; and retain
  “machine”/“machines” for monitored resources. This prevents a mechanical
  replacement from leaking slug-style text into product copy or incorrectly
  renaming valid domain labels such as `MachineRow`.

### Finding 2

- Severity: high
- Category: migration state clarity
- Location: Local BB cutover, steps 2–6
- Recommendation: Require exactly one enabled, visible Host Monitor navigation
  entry throughout every user-observable cutover state. The disabled retired
  plugin must not contribute a page, sidebar item, floating monitor, or content
  script while the new plugin is verified. On rollback, disable the new entry
  before restoring the retired one. This makes the identity transition
  intelligible and avoids two visually identical products appearing at once.

### Finding 3

- Severity: medium
- Category: state continuity
- Location: Local BB cutover, steps 1 and 4–5
- Recommendation: Treat the three migrated settings as a perceptual continuity
  check, not only a config comparison. At 70% and 85%, the dashboard, sidebar,
  inspector, and floating monitor should show the same green/attention/critical
  states before and after migration, with threshold colors enabled. Confirm
  that address masking remains the initial inspector state.

### Finding 4

- Severity: medium
- Category: interaction regression coverage
- Location: Verification design, browser exercise
- Recommendation: Use one concrete interaction pass at the canonical route:
  switch cards to rows and back; open and dismiss the masked inspector; search
  and sort processes without invoking termination; open and outside-click the
  sidebar summary; move the floating monitor with the keyboard; then repeat a
  refresh cycle. Check the browser network log during that same pass so a
  visually successful screen cannot conceal requests to the retired path.

### Finding 5

- Severity: low
- Category: retired-route behavior
- Location: History and compatibility boundary; Verification design
- Recommendation: Keep the no-alias decision. A visit to the retired route
  should resolve through BB’s normal unavailable/not-found experience rather
  than silently loading the new plugin. Ensure all active navigation, docs,
  screenshots, and install links point directly to the canonical route so
  users do not encounter that state in normal use.

### Finding 6

- Severity: low
- Category: release presentation
- Location: Release and PR design, marketplace entry target
- Recommendation: Reuse sanitized screenshots that show the unchanged Host
  Monitor interface, but ensure captions, filenames, alt text, and referenced
  URLs use the new identity. The marketplace title should remain the readable
  product name “Host Monitor”; the slug and source metadata should be
  `host-monitor`.

## Conclusion

No visual redesign is warranted. The clearest result is the existing Host
Monitor experience with a single canonical identity, no duplicate transitional
surface, and explicit verification that settings, privacy, interactions, and
network paths survive the cutover unchanged.
