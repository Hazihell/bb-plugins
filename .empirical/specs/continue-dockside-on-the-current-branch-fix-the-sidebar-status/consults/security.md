# Security Advisory

- Specialist: security
- Verdict: advisory

## Findings

- Severity: medium
  - Category: untrusted browser persistence
  - Location: `plugins/dockside/lib/family-order.ts`
  - Finding: Project and root IDs round-trip through user-modifiable localStorage;
    oversized, duplicate, controlled, or cross-project values could corrupt list
    order or consume rendering work.
  - Recommendation: Keep a strict version, byte cap, project/root count caps,
    identifier bounds, duplicate rejection, and canonical fallback. Require an
    exact current same-project permutation before every write.

- Severity: medium
  - Category: drag payload trust boundary
  - Location: ProjectGroup drop handling and ThreadInbox reorder validation
  - Finding: `DataTransfer` content can be synthesized by arbitrary page code and
    must not authorize cross-project or partial-order mutation.
  - Recommendation: Parse a bounded minimal payload, then ignore its authority;
    resolve the target project's canonical full order and validate source/target
    project, root membership, uniqueness, and pinned partition in pure logic.

- Severity: low
  - Category: style injection
  - Location: Dockside semantic color settings
  - Finding: Custom color strings become inline CSS variables and PR background
    color mixes.
  - Recommendation: Continue accepting only normalized six-digit hex values and
    project preset constants; never interpolate raw settings into CSS.

- Severity: low
  - Category: accessibility denial
  - Location: reorder keyboard and tooltip surfaces
  - Finding: Disabled or boundary operations can silently fail, leaving keyboard
    users unable to distinguish policy rejection from a broken control.
  - Recommendation: Keep labelled focusable controls, explicit disabled reasons,
    and a polite atomic live region for every success or rejection.

## Smallest sufficient closure

The implemented pure validators, bounded storage codec, exact permutation and
pinned-boundary checks, fixed custom-hex parser, minimal drag payload parser, and
live announcements close the identified paths. No blocking finding remains.
