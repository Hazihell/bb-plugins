# Verification evidence

## Consolidated source and versions

- The linked checkout fast-forwarded from `00ee7c6` to GitHub main `203f910`,
  preserving merged PRs #18, #20, and #21 before local edits.
- BB now runs all three plugins from this checkout:
  - Taskboard `0.3.2`, sync service running.
  - Host Monitor `0.1.1`, machine-sampler service running.
  - Usage Tracker `0.1.4`, running.
- Every installed plugin reports `status: running` with no status detail.
- Taskboard, Host Monitor, and Usage Tracker development watchers are running
  from the same checkout. Taskboard’s watcher was restarted after the full
  build’s temporary staging directory caused its first watcher process to exit.

## Automated verification

- Focused typechecks passed for all three plugins.
- Focused tests passed:
  - Taskboard: 111/111.
  - Host Monitor: 146/146.
  - Usage Tracker: 23/23.
- The immutable `workspace-check` receipt runs root `npm run check` at the final
  product tree and passed every SDK check, typecheck, test, production build,
  and Taskboard build-metadata verification.
- `git diff --check` passed.
- Built metadata is coherent:
  - Taskboard server/app: `taskboard` `0.3.2`, BB `0.38.0`, SDK `0.4.6`.
  - Host Monitor server/app/host: `host-monitor` `0.1.1`, BB `0.40.0`, SDK
    `0.4.21`.
  - Usage Tracker server/app: `usage-tracker` `0.1.4`, BB `0.38.0`, SDK
    `0.4.6`.
- Only the three intended workspace version records changed in
  `package-lock.json`; dependency-version lookalikes were untouched.

## Live BB browser walkthrough

### Taskboard

- The thread-header button retained `aria-label="Pin Taskboard on the right"`
  and rendered SVG `data-icon="Ticket"`.
- With Taskboard unpinned and the right panel hidden, the browser confirmed the
  panel was outside the viewport.
- Activating the ticket shortcut reopened the panel and restored its pressed
  pin state.
- `taskboard-0.3.2-ticket-panel.png` records the live ticket shortcut surface;
  the browser interaction above proves the hide/open/pin transition.

### Host Monitor

- The live trigger was in a non-normal fleet state and retained a dynamic
  accessible fleet summary.
- `getComputedStyle(trigger, "::after").content` returned `none`; no overlaid
  dot dimensions or content existed.
- Activating the trigger opened the fleet popover with connected, attention,
  critical, and healthy rows. The evidence image replaces machine names with
  neutral Host 1–4 labels.
- `host-monitor-0.1.1-dot-free-popover.png` records the dot-free trigger and
  open popover.

### Usage Tracker

- The live compact control reported Weekly configured and showed current Codex
  weekly usage; refresh completed without a load error and updated the value.
- Expanded details showed the canonical five-hour row as unavailable and the
  current Weekly row with its reset time.
- Escape closed details and returned focus to the provider trigger.
- A reversible setting exercise changed Compact limit to Five-hour; because BB
  currently reports only Weekly, the live accessible label explicitly reported
  Weekly as the fallback. The original Weekly preference was restored and the
  plugin reloaded successfully.
- Primary-machine and current-thread-host Usage RPC calls both returned healthy
  Codex data plus provider-local Claude Code/Cursor authentication states.
- `usage-tracker-0.1.4-expanded.png` records the complete live details surface.

## Review and safety boundaries

- UI/UX review supported the Taskboard ticket and badge-free Host Monitor. Its
  proposed window-count setting was rejected because the merged capability
  intentionally selects Weekly versus Five-hour, while expansion shows all
  windows.
- Security review found no new authority or input path. Its advisory replacement
  Host Monitor color cue was rejected as an unsolicited substitute for the
  notification-like dot; resource state remains accessible through text and
  detailed surfaces.
- No commit, push, tag, publication, GitHub Release, or marketplace mutation was
  performed.

## Criteria mapping

- AC-1: source base verification plus full merged suites.
- AC-2: manifests, lock records, docs, changelog, distribution guards, live
  inventory, and metadata all agree on `0.3.2` / `0.1.1` / `0.1.4`.
- AC-3: private/Git-only distribution guards and no remote mutation.
- AC-UI-1: Taskboard DOM interaction and screenshot.
- AC-UI-2: Host Monitor computed-style/popover interaction and screenshot.
- AC-UI-3: Usage setting, compact/details/refresh/Escape/focus/RPC walkthrough
  and screenshot, backed by the 23-test merged PR #20 suite.
- AC-4: live source-path inventory and healthy services.
- AC-5: immutable root check, focused checks, metadata, diff check, browser/RPC
  evidence, and review.
