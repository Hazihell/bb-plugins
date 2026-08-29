# Repository Knowledge Index

Curated repository knowledge for the `bb-plugins` multi-plugin workspace.

The root owns orchestration and one lockfile; Taskboard, Usage Tracker, and Host
Monitor remain independent private plugin packages under `plugins/`. Usage
Tracker preserves stable frontend/provider IDs while adapting current and legacy
BB usage response keys, and its expanded card is the complete usage-window view.
Host Monitor carries one text-first status vocabulary across compact and full
fleet surfaces: connected health uses success/warning/destructive orbs, while
offline, disconnected, loading, and unavailable states remain neutral. The
Host Monitor page and compact popover use borderless inline status, underline
filters, and neutral host containers rather than pills, boxed status cells, or
colored rails. Critical and Needs attention keep semantic text emphasis;
hovering or focusing a host reveals a privacy-safe reason for its state. BB's
global Host Monitor icon stays neutral and notification-dot free.

## Topics

- [Overview](overview.md)
- [Architecture](architecture.md)
- [Commands](commands.md)
- [Conventions](conventions.md)

Source dependencies, page digests, and freshness are recorded in
[manifest.json](manifest.json). This is a compact file-backed context set, not
an embedding or vector database.
