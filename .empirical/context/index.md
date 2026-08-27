# Repository Knowledge Index

Curated repository knowledge for the `bb-plugins` multi-plugin workspace.

The root owns orchestration and one lockfile; Taskboard, Usage Tracker, and Host
Monitor remain independent private plugin packages under `plugins/`. Usage
Tracker preserves stable frontend/provider IDs while adapting current and legacy
BB usage response keys, and its expanded card is the complete usage-window view.

## Topics

- [Overview](overview.md)
- [Architecture](architecture.md)
- [Commands](commands.md)
- [Conventions](conventions.md)

Source dependencies, page digests, and freshness are recorded in
[manifest.json](manifest.json). This is a compact file-backed context set, not
an embedding or vector database.
