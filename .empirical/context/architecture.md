# Architecture

## Components and ownership

- The root package is a private Bun workspace whose `plugins/*` packages are
  the installable units. Root scripts fan out over the `bb-plugin-*` workspace
  naming convention.
- A plugin manifest declares source entrypoints such as `server.ts`, `app.tsx`,
  and `host.ts`. Server code registers bb RPC, services, tools, commands, or
  integrations; app code contributes bb UI; host code runs on the enrolled
  machine when host-level access is required.
- A plugin owns its components, hooks, libraries, tests, assets, SDK typing
  strategy, notices, and package metadata. Pure behavior is kept in plain
  modules so it can be tested without a live bb server.
- `scripts/` owns repository-wide build, SDK, packaging, publishing, icon,
  licensing, dev-watch, and optional review-stack automation.

## Data and control flow

- bb installs local packages by path during development and reads their source
  manifests in place. `bun run dev` starts one polling watcher per plugin,
  rebuilds only the plugin that changed, and reloads it in the running bb.
- `bb plugin build` bundles declared server, app, and host closures into the
  ignored `dist/` directory and stamps SDK metadata. Managed Git/npm installs
  conventionally load those bundles, with declared source remaining the
  compatibility fallback.
- Frontends communicate through the bb plugin SDK with server registrations.
  Host workers are separately bundled and downloaded to their targeted enrolled
  machine when a plugin declares host functionality.
- Runtime imports must be declared by the leaf plugin. Workspace-level tooling
  and exact SDK compatibility are coordinated from the root.

## External dependencies

- Bun provides the hoisted workspace package manager and task runner.
- The locally installed `bb` CLI is the authoritative plugin builder, reloader,
  type generator, and live runtime used in development.
- `@get-bb/plugin-sdk` supplies the current server, app, host, and testing
  contracts; legacy plugins may instead carry generated declarations.
- TypeScript, oxlint, and each plugin's selected test runner provide static and
  automated verification. Some plugins integrate external CLIs or services and
  document those dependencies in their own package and README.
