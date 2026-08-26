# Host Monitor

Host Monitor adds a bb-native host-health dashboard with live CPU, memory,
swap, system-disk, load, uptime, and receive/send network throughput for every
host enrolled in bb.

It keeps each host isolated: a failed or disconnected machine never prevents
the fleet matrix from updating, and the last successful reading stays visible
when a machine goes offline. Select a host to open that machine's telemetry in
bb's native Inspect panel. The dashboard defaults to responsive host cards;
the Cards/Rows choice is remembered per browser. Each card keeps host identity
and freshness prominent, groups CPU/RAM/disk into one pressure strip, and
separates download and upload into labeled network lanes.

Each sampled host can report one validated primary IP address. Host Monitor
keeps it out of the rendered page until you explicitly choose **Show IPs** (or
reveal it in Host details), and never exposes interface names, MAC addresses,
netmasks, or an address list.

## Requirements

- bb 0.40 or later
- An enrolled bb machine running macOS, Linux, or Windows

Linux and macOS expose the richest readings. Windows reports aggregate CPU,
memory, disk, uptime, and network throughput; swap is shown only where a
reliable system value is available.

## Install

```sh
bb plugin install npm:bb-plugin-machine-monitor
```

For local development from this repository:

```sh
bb plugin install ./plugins/machine-monitor
bun run dev
```

Open Host Monitor from its terminal icon in the bb sidebar. Its compact
summary provides a quick health check and a path to the full dashboard.
Drag that circular icon onto the workspace to open one movable floating fleet
window with CPU, RAM, download, and upload readings; **Float monitor** in the
popover provides the keyboard-accessible equivalent.
Readings refresh automatically, and the dashboard's refresh button forces an
immediate sample. Traffic-light threshold colors are enabled by default:
normal percentages are green, warning percentages are yellow, and critical
percentages are red. Labels, progress rails, machine status, and connected-host
counts stay neutral. Host Monitor's plugin settings let you adjust the yellow
and red cutoffs or turn threshold colors off without hiding any information.
The same cutoffs apply to health classification, the full page, sidebar
popover, and floating window. Network throughput uses destructive red for
downloads and bb's blue timeline accent for uploads independently of threshold
colors; the arrows keep receive and send readings distinct.

Select **Processes** from Host details—or use the contextual action on a CPU
or memory pressure alert—to inspect that host's current workload. The view is
loaded only while its targeted tab is open and refreshes about every five
seconds. Its compact process ledger can search the shown process names and
PIDs; the Process, CPU, and RAM headers sort the desktop ledger while equivalent
compact controls remain available in the narrow layout. It also summarizes the
top CPU and RAM consumers plus actionable and protected counts. It reports only a bounded set of safe
fields: process name, PID, CPU, resident memory, and a coarse ownership
category. Command lines, paths, environment variables, and usernames are not
collected or displayed.

Process actions are deliberately one-at-a-time. Host Monitor re-checks the
host and process identity immediately before opening a confirmation, and that
confirmation uses a short-lived, one-use token. macOS and Linux request a
graceful exit first; a separate freshly checked **Force stop** confirmation is
offered only if the process persists. Windows uses the honest **Force stop**
label because it has no equivalent graceful signal. System processes,
processes owned by another user, and processes that Host Monitor depends on
remain protected. There is no bulk kill, process-tree kill, or automatic kill.
