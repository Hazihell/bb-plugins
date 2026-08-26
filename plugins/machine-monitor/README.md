# Host Monitor

Host Monitor adds a bb-native host-health dashboard with live CPU, memory,
swap, system-disk, load, uptime, and receive/send network throughput for every
host enrolled in bb.

It keeps each host isolated: a failed or disconnected machine never prevents
the fleet matrix from updating, and the last successful reading stays visible
when a machine goes offline. Select a host to open that machine's telemetry in
bb's native Inspect panel. The dashboard defaults to responsive host cards;
the Cards/Rows choice is remembered per browser.

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
popover, and floating window. Network direction stays distinct independently:
downloads are blue and uploads are green.
