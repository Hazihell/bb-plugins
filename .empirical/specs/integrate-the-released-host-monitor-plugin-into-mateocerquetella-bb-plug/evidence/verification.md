# Verification evidence

Collected: 2026-08-26T23:11:46-03:00  
Branch: `feat/host-monitor`  
Base commit: `21876eddd7aef9161e2d91e1f6cf41298c77815a`

## Release provenance

- The public annotated tag `machine-monitor/v0.1.0` still peels to release
  commit `9db09cc35553493113f31e5352a44911ae92bc73`.
- An isolated shallow fetch and checksum comparison proved the transplanted
  product tree byte-identical to that commit after excluding only generated
  `dist/` and `node_modules/` output.
- The complete main-line adaptation allowlist is four paths:
  `README.md`, `package.json`, `test/css-loader.mjs`, and
  `test/register-css.mjs`. A second checksum dry run excluding those paths had
  no output.
- Marketplace PR #128 remains open on `submit-machine-monitor`, still changes
  only `entries/machine-monitor.json` and
  `icons/machine-monitor-11256331.svg`, and still references the immutable
  release range. No marketplace file or PR content was changed by this work.

## Automated checks

- `npm install` — PASS with zero vulnerabilities.
- Focused Host Monitor check — PASS: SDK declaration check, TypeScript, 144/144
  tests, and server/app/host build.
- Generated metadata inspection — PASS: server, app, and host artifacts all
  report BB `0.40.0` and plugin SDK `0.4.21`.
- Root `npm run check` — PASS across Host Monitor, Taskboard, and Usage Tracker.
- `git diff --check` — PASS.
- Lockfile semantic audit found 117 expected added records and no changed or
  removed pre-existing package records. Existing plugins retain BB 0.38 / SDK
  0.4.6 while Host Monitor resolves BB 0.40 / SDK 0.4.21 in its workspace.

## Live BB walkthrough

BB installed the branch's local `plugins/machine-monitor` path and reported the
plugin running with its sampler service. Existing settings were retained. The
original development-path installation was restored after verification.

- Dashboard: four connected enrolled hosts rendered in the default card view.
  CPU/RAM/disk percentages used threshold tones, download was red, upload was
  blue, RAM showed used/total capacity, and every IP remained masked.
- Layout: switching to Rows set its native pressed state and the fleet had no
  horizontal overflow at the exercised compact panel width
  (`scrollWidth === clientWidth`). Switching back restored cards.
- Inspector: selecting a host opened populated telemetry with CPU, memory,
  disk, load, swap, uptime, processor, kernel, network, and a masked IP.
- Processes: the explicitly targeted ledger loaded a bounded populated list,
  exposed the search box and Process/CPU/RAM sort controls, filtered live, and
  changed the selected sort to RAM. Protected and available actions were
  labeled. No process action or confirmation was invoked.
- Sidebar summary: the circular utility control opened a compact populated
  summary. Clicking the dashboard outside it changed the trigger from expanded
  to collapsed and removed the visible popover. The trigger is a native
  keyboard-focusable button.
- Floating monitor: `Float monitor` opened the four-host CPU/RAM/download/upload
  window. Its titlebar accepted focus; an `ArrowLeft` key interaction moved the
  window exactly 10px, and the close control dismissed it.
- Sidebar shell: the control remained available in the expanded compact shell;
  collapsing the shell hid its utility area consistently with BB's compact
  responsive behavior, and re-expanding restored it.

The live capture masks machine names as `Host 1` through `Host 4`; it contains
no IP address, username, process name, PID, credential, or project/thread data.

## Screenshot artifacts

- `evidence/live-dashboard.png` — sanitized live browser capture of the
  locally installed branch build.
- `plugins/machine-monitor/assets/screenshots/dashboard.png` — reviewed release
  dashboard/inspector capture with fictional hosts.
- `plugins/machine-monitor/assets/screenshots/processes.png` — reviewed release
  process-ledger capture with fictional process data.
- `plugins/machine-monitor/assets/screenshots/floating-monitor.png` — reviewed
  release floating-monitor capture with fictional hosts.

## Review and security

- Independent integration audit: pass; manifest, collection index, docs,
  notices, lockfile, and generated-file exclusions are focused and correct.
- Independent privacy/package audit: pass after rebuilding all three artifact
  metadata files at SDK 0.4.21. Source contracts exclude usernames, command
  lines, paths, environment data, interface inventory, and credentials.
- Required security specialist verdict: advisory. Its sole high-severity
  provenance concern is closed by the isolated tag fetch, exact tree
  comparison, and four-path adaptation allowlist documented above.

## Acceptance coverage

- AC-1: immutable release/tag and byte-for-byte tree comparison, with generated
  output excluded and the four intentional adaptations isolated.
- AC-2: private Git-only manifest, independent BB 0.40 / SDK 0.4.21 toolchain,
  complete focused check, and verified artifact metadata.
- AC-3: collection index, root catalog/quick start/source workflow, notices,
  BB 0.40 requirement, and marketplace-pending caveat.
- AC-4: clean npm install plus semantic lockfile audit.
- AC-5: focused and root checks, immutable test receipt, and diff hygiene.
- AC-UI-1: real local-path install, browser walkthrough, sanitized live capture,
  and the three reviewed release screenshots.
- AC-6: release tag and marketplace PR invariants verified before delivery;
  main-based review branch remains unmerged.
