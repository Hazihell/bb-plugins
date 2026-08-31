# Verification evidence

## Implemented source boundary

- Taskboard is prepared as `0.3.3`; Host Monitor remains `0.1.2` and Usage
  Tracker remains `0.1.4`.
- Exact `@get-bb/plugin-sdk@0.4.6` moved to Taskboard production dependencies;
  its lock record is non-development and the Taskboard workspace lock edge is
  production.
- Composer-assisted creation no longer registers draft-worker RPC, spawns a
  thread, uses auto approval, polls a model, or publishes draft signals. It
  derives an editable title/description from the original prompt and retains
  the existing explicit create confirmation and mention insertion.
- Activation cleans the three legacy draft-key families only after archived
  and active hidden Taskboard-owned helper threads with the exact retired title
  have been archived/stopped. A shutdown failure retains state for retry.
- Taskboard resolves `gh` to an access-checked canonical absolute path,
  rejecting relative/current-workspace search entries and probing candidates
  without credentials. Authenticated subprocesses then use fixed
  locale/non-interactive controls plus an explicit cross-platform
  auth/config/path/proxy/CA/temp/credential-store allowlist. Unlisted server
  variables are excluded.

## Automated source verification

- Focused Taskboard typecheck passed.
- All 124 Taskboard tests passed, including prompt prefill, no active agent/RPC
  path, legacy helper cleanup/retry, strict POSIX and Windows `gh` environment,
  cwd/symlink-shadow rejection and token-free discovery, recorded-only legacy
  targeting/mismatch handling, SDK production placement, versions, and
  existing provider/create behavior.
- Taskboard production build and `scripts/verify-build.mjs` passed with
  `taskboard@0.3.3`.
- Root `npm run check` passed for Host Monitor, Taskboard, and Usage Tracker.
- `npm ls --workspace bb-plugin-taskboard --depth=0` resolved the exact SDK and
  complete workspace dependencies.
- `npm pack --dry-run --workspace bb-plugin-taskboard --json` reported 67
  expected source/package files at `bb-plugin-taskboard@0.3.3` and created no
  tarball.
- Version/dependency audit and `git diff --check` passed.

## Repository-independent production install

A working-tree Taskboard-only source copy was created under thread storage,
outside the npm workspace and without node_modules/dist. With temporary and
npm cache paths also under thread storage:

1. `NODE_ENV=production npm install --ignore-scripts --omit=dev
   --omit=optional --no-audit --no-fund` installed 57 packages.
2. `npm ls @get-bb/plugin-sdk --omit=dev` resolved
   `@get-bb/plugin-sdk@0.4.6` as production.
3. BB 0.40 built server/app artifacts successfully.
4. `node scripts/verify-build.mjs` passed at `0.3.3`.

Both temporary staging directories (including the final post-security-fix
build) were moved to the desktop trash after verification and are recoverable
until trash is emptied.

## Live BB verification

- Reinstalling the same local path refreshed inventory without removing data;
  `bb plugin list --json` reports Taskboard `0.3.3`, running, with the `sync`
  service active and no status detail.
- The watcher rebuilt/reloaded every final app/server change.
- On a configured Linear project, a composer prompt opened the visible issue
  form immediately. Browser inspection observed title
  `Verify Taskboard manual issue prefill`, the complete original Markdown
  description, no retired model/repository-loading copy, and an enabled Create
  button. The form was cancelled; no tracker mutation occurred. The temporary
  composer draft and project selection were cleared afterward.
- Evidence: `manual-prefill-browser-evidence.json` and
  `taskboard-0.3.3-manual-prefill.png`.
- Taskboard logs show successful registrations. Existing background warnings
  concern the separately disabled official GitHub plugin, not this reload.

## Marketplace PR #129 local preparation

- Dedicated checkout:
  `/home/dyaus/Developer/projects/MateoCerquetella/BB/marketplace-pr-129-refresh`
- Current upstream `main` was merged normally into the existing
  `bump-taskboard-v0.3.1` branch; no force/rewrite occurred.
- Local merge commit: `8064575`.
- The upstream-base diff is exactly three additions:
  `entries/taskboard.json`, `entries/usage-tracker.json`, and
  `icons/taskboard-0b77950c.svg`.
- Taskboard uses Git range `^0.3.3`, `plugins/taskboard`, and `taskboard/` with
  explicit-review copy and no removed model claim. Usage Tracker uses `^0.1.4`
  and its reviewer-approved `ChartColumn` icon.
- The vendored SVG is 414 bytes and SHA-256
  `0b77950cec05ed35134dcc8d0c8ff96460c806106cb8e28cedeb15903ccd08ef`,
  byte-identical to Taskboard branding.
- `npm ci --ignore-scripts` passed with zero vulnerabilities; `npm run build`
  composed 89 entries.
- `npm run check` reaches the existing unrelated Ports entry and fails because
  `https://github.com/ramaaudra/bb-plugin-ports.git` returns repository not
  found. No Taskboard or Usage Tracker liveness error is reported.
- Public annotated `taskboard/v0.3.3` peels to the reviewed release commit
  `fb8c1073e78dedba177ba22ba6829938a6c0d300`; its GitHub Release is live at
  `https://github.com/MateoCerquetella/bb-plugins/releases/tag/taskboard/v0.3.3`.
  Public annotated `usage-tracker/v0.1.4` peels to `2d90bd3`.
- After publication, Marketplace `npm run build` still composes 89 entries and
  `npm run check` reports only the pre-existing Ports repository 404. It emits
  no Taskboard or Usage Tracker liveness error.
- PR #129 is live at head `8064575`, mergeable against current upstream
  `e937f46`, with exactly the three intended additions. Its title/body now
  describe the Git sources and reviewer fixes, and the re-review comment is
  `https://github.com/get-bb/marketplace/pull/129#issuecomment-5480969400`.

## Approved remote delivery

The user approved the exact authenticated commands naming account
`MateoCerquetella`, release commit `fb8c1073`, tag `taskboard/v0.3.3`, source
branch, Marketplace commit `8064575`, PR body, and re-review comment. After that
approval only:

- the source branch was fast-forward pushed;
- the new annotated tag and GitHub Release were created without moving an
  existing ref;
- the Marketplace fork branch was fast-forward pushed;
- PR #129's title/body were updated and one reviewer-ping comment was posted.

No npm publication, force push, merge, tracker issue creation, or unapproved
external mutation occurred.
