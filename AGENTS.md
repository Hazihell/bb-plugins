# Repository guide

This is a multi-plugin workspace for BB. Keep every independently installable
plugin under `plugins/<id>` with its own manifest, source, tests, SDK types, and
README.

## Conventions

- Treat the root as orchestration only; it must not contain a BB plugin
  manifest.
- Use `bb plugin new <id> --app` when a new plugin needs a frontend, then move
  the scaffold under `plugins/<id>` and add it to the root README catalog.
- Keep plugin IDs, package names, CLI commands, realtime channels, persisted
  keys, tests, and docs aligned during a rename.
- Keep app UI components vendored inside the owning plugin so packages remain
  independent.
- Do not commit generated `dist/` or `node_modules/` directories.
- Store shared screenshots and repository media under `docs/media/`.

## Verification

Run all plugin checks from the workspace root:

```sh
npm install
npm run check
```

Before handing off a new plugin, install its local path in BB and verify its
human UI and CLI surface:

```sh
bb plugin install ./plugins/<id>
bb plugin reload <id>
```
