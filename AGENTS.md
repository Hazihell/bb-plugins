<!-- empirical-sdd:start -->
## Empirical repository workflow

Before any repository mutation, you MUST use the repository-local Empirical
workflow for requests to build, add, implement, change, fix, refactor, remove,
migrate, upgrade, change tests, or continue work. The user does not need to
mention Empirical. This rule applies even when a summarized skill list omits
Empirical: read the native local skill file directly.
Read-only explanation and inspection stay outside the workflow.

Read the native local workflow contract before acting: Codex, Cursor, and
Gemini use `.agents/skills/empirical/SKILL.md`; Claude Code uses
`.claude/skills/empirical/SKILL.md`; Windsurf uses
`.windsurf/skills/empirical/SKILL.md`. Then first confirm
`.empirical/config.json` has
`schemaVersion: 5` and `setupComplete: true`. Use Empirical MCP operations
first and private `empirical __internal` fallbacks only when MCP is unavailable.
If the config is missing, invalid, or incomplete, do not initialize implicitly;
tell the user to invoke `empirical-init` explicitly.
<!-- empirical-sdd:end -->

# bb-plugins

Bun-workspace monorepo of personal bb plugins under `plugins/*`. One lockfile, one hoisted `node_modules`. Keep this file accurate when conventions change.

## Development workflow

- **Default during plugin work:** run `bun run dev` once and leave it running. It watches every plugin, rebuilds and reloads only the plugin that changed, and does not create duplicate watchers when run again. Do not prefer a filtered dev command; this repo is small and the all-plugin loop is the standard path.
- **Start the watcher yourself.** Before the first edit to a plugin, start `bun run dev` in the background if it is not already running. Never close out a plugin change by telling the user to run `bb plugin build` or `bb plugin reload`, and never cite a stale git-ignored `dist/` as a reason to prescribe one — the watcher has already rebuilt and reloaded. Say what to exercise in bb instead.
- **Fast check while editing:** run `bun run --filter 'bb-plugin-<id>' typecheck` or `test` for the plugin you changed. Use this only for iteration speed.
- **Before handoff:** run root `bun run typecheck`, `bun run test`, and `bun run lint`. Also run `bun run build` when the change affects a manifest, frontend bundle, build input, dependency, or workspace tooling. A pure backend logic change with passing typecheck and tests does not need an extra build.
- **Live UI or runtime behavior:** use the existing `bun run dev` loop, exercise the affected surface in bb, and inspect `bun run logs <id> -f` when behavior or reload is unclear.
- **One-shot recovery:** use `bun run reload <id>` only when no dev watcher is running or a plugin needs manual recovery. Use `bun run build:reload` only when you explicitly want one full build-and-reload pass instead of a watcher. Do not run either after each edit.
- **Dependencies:** run `bun install` after a fresh checkout or after package or lockfile changes, not as a routine verification step.
- **Generated SDK types:** use `bun run sdk-types:check` in bb-version work. Use `bun run sdk-types:refresh` only after changing the pinned bb version; never refresh generated types to fix an ordinary type error.
- **Clean builds:** use `bun run clean` only to diagnose stale generated output or to prove a clean build. Do not delete `dist/` during the normal live loop.

The pinned bb release lives in root `package.json` → `config.bbVersion`. Locally `bb` comes from the desktop app; CI installs the same version from the `bb-app` npm package. The scripts fail if the CLI version does not match the pin. Set `BB_CLI` to an absolute path to choose between several installed bb binaries.

## Layout and invariants

- Every installable plugin package uses the unscoped name `bb-plugin-<id>`. Shared non-plugin packages, if added under `packages/<name>`, should use a deliberate project-specific name rather than inheriting a personal npm scope.
- Plugin id = manifest `name` with the scope dropped and the `bb-plugin-` prefix stripped, so `bb-plugin-notify` yields `notify`. bb's `derivePluginId()` splits on `/` and keeps the last segment, so the scope is harmless — but the `bb-plugin-` segment after it is load-bearing and must stay. Keep the directory at `plugins/<id>` for navigation, although bb does not use the directory name as identity.
- Root `build`, `dev`, `typecheck`, `test`, and `clean` fan out through the `--filter 'bb-plugin-*'` workspace glob. A filter that matches nothing exits 0 and looks like a successful no-op, so any change to package names must be re-proved against these five scripts.
- `bb plugin build` is the authoritative build. `dist/` is generated and git-ignored — never edit or commit it, and run `bun run build` after a fresh clone.
- `bb.server`, `bb.app`, and optional `bb.host` point at **source** (`./server.ts`, `./app.tsx`, `./host.ts`), and `files` ships each declared source closure alongside `dist/`. This is bb's own plugin shape — see `bb/plugins/{docs,github,memory,tasks}` for server/app and `bb/plugins/keep-awake` for a host worker. Do not repoint them at `dist/`. For a managed (`npm:`/`git:`) install bb finds `dist/server.js` **by convention** and never reads `bb.server` to load it (`plugin-runtime.ts` `resolveServerEntry`); `bb.server` is the FALLBACK, used when no bundle ships and when `dist/server.meta.json` records a different SDK version than the running one. The SDK is pre-1.0, so minor bumps are breaking and that fallback is a live path. Declaring `dist/server.js` as the manifest entry is the packaged-**builtin** shape (`isPackagedBuiltinServerEntry` gates on `kind === "builtin"`); in an npm tarball it also makes the stale-SDK branch return the same incompatible bundle it just rejected, and it forces the build entry and the load entry to fight over one field. A declared host entry must ship `dist/host.js` and `dist/host.meta.json`; the daemon downloads that verified bundle lazily on the targeted enrolled machine.
- Because the manifest entries are source, `bb plugin build .` is the build command directly — no wrapper. The tarball must carry the source closure, or the fallback has nothing to load: `scripts/publish.ts` fails the publish if any `bb.*` target, or any file it transitively imports, is missing from the packed tarball.
- Plugins are installed into bb as local **path sources**: bb reads files in place. Anything a plugin imports at build time must resolve from the plugin directory via the workspace `node_modules`.
- SDK declarations come in two supported layouts. Older plugins keep generated `types/bb-plugin-sdk.d.ts` / `types/bb-plugin-sdk-app.d.ts`; current plugins depend on the exact published `@get-bb/plugin-sdk` version and read `bundled-types/` from that package. Never hand-edit generated declarations. After a bb upgrade: bump `config.bbVersion`, run `bun run sdk-types:refresh` (which delegates each layout to `bb plugin types`), run `bun install` if package pins changed, and keep each manifest's `engines.bb` / `engines.bbPluginSdk` honest. `types/css-modules.d.ts` is hand-maintained.
- `components/ui/`, `lib/`, and `hooks/` are vendored shadcn-model source each plugin owns. Edit them freely; the copies are currently identical across plugins but divergence is allowed and deliberate — do not build machinery that assumes byte equality.
- The root `package.json` `overrides` entry replacing `@ampcode/cli` with the stub in `plugins/amp/vendor/` is load-bearing (rationale in the root `comments` field). Never remove or relocate it; `plugins/amp/test/cli-stub.test.ts` guards it.
- `bunfig.toml` pins Bun's **hoisted** linker on purpose. The isolated linker breaks workspace-root subpath imports.
- `plugins/pr-walkthrough/skills/pr-walkthrough/assets/site-template` is a payload template with its own nested `.gitignore`; its build output is not tracked.
- `scripts/split-layers.ts` builds stacked review branches from a manifest and a snapshot of finished work, byte-comparing the top of the stack against the snapshot when it is done. It is a tool that is available, not a workflow that is required — see Conduct.
- Declare runtime imports (for example `zod` in `server.ts`) in `dependencies`, not `devDependencies`. Repo-wide tools (`typescript`, `oxlint`) stay at the root.
- `plugins/amp` pins zod v3 to match its ACP/`@ampcode/sdk` stack. Do not "align" it with the other plugins' zod v4.
- The repo is MIT. Every `plugins/<id>/LICENSE` is a byte-identical copy of the root `LICENSE`, because a root file is not inside a leaf npm tarball — edit the root and re-copy, never one plugin alone. `scripts/licenses.test.ts` fails on drift, on a missing `license` field, and on a `files` array that omits `LICENSE`. Third-party terms live in the root `THIRD_PARTY_NOTICES.md`, which covers the whole tree, and in a per-plugin `plugins/<id>/THIRD_PARTY_NOTICES.md` that covers only what that package's tarball actually ships. Add to both whenever code or artwork arrives from elsewhere.
- Not everything here is published. `plugins/dotfiles` and `plugins/pr-walkthrough` are `private: true` and must stay out of the `publish:npm` target list (`scripts/publish.ts` → `EXCLUDED`). They remain in the workspace and in the build fan-out. The root README lists `dotfiles` with a "not published to npm" note and omits `pr-walkthrough` entirely; keep that in step with `EXCLUDED`.

## Testing and verification

- Root build, dev, typecheck, and clean scripts fan out through Bun's `bb-plugin-*` workspace filter. Root tests cover workspace scripts before the plugin suites. Dev scripts use `scripts/dev-plugin.ts` for one polling watcher per plugin directory and stale-lock recovery. Amp uses `node --test` and that is fine — do not rewrite it for runner uniformity.
- bb 0.40 publishes `@get-bb/plugin-sdk` (currently 0.4.21), including `/testing`, `/testing/app`, and `/testing/host`. New plugins may use those harnesses after declaring the exact SDK dev dependency and their optional test peers. Existing legacy plugins do not gain that runtime merely because they vendor declarations; add the package deliberately when a test needs it, and do not migrate an existing plugin unless the task calls for migration. The frontend harness does not reproduce bb layout/CSS, so UI work still requires the live loop plus a real surface check; build success alone is insufficient.
- Keep pure logic in plain modules so it stays unit-testable without a bb server.

## Conduct

- Do not commit or push unless asked. Preserve unrelated changes.
- Do not split work into a stack unless asked. One branch and one commit is the default, and a single commit covering a whole session's work is a fine answer. Reach for `gh-stack` or `scripts/split-layers.ts` only when the user asks for a stack, or when a change is genuinely too large to review in one pass — and say so before splitting rather than assuming. Splitting after the fact costs more than it returns: hunk-level surgery on interleaved edits is slow and error-prone, and a mechanical rename that touches every package is one concern, not twenty.
- Nested `AGENTS.md` files (for example `plugins/pr-walkthrough/AGENTS.md`) add plugin-specific rules and take precedence within their scope.
