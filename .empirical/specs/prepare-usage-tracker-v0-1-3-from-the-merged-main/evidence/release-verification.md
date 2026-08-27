# Usage Tracker 0.1.3 local release verification

- Authenticated account: `MateoCerquetella`
- Repository: `https://github.com/MateoCerquetella/bb-plugins.git`
- Base/main merge: `daffcd47cb1c642774f6227df19cf8357d597f7e`
- Local release commit: `3555def9bda20f096fdc9e72a5bcd8d2f3c744fc`
- Package/id/version: `bb-plugin-usage-tracker` / `usage-tracker` / `0.1.3`
- Proposed tag: `usage-tracker/v0.1.3`
- Existing exact remote tag: absent
- Existing exact GitHub Release: absent
- Distribution: Git-only (`private: true`), no npm publication hooks

## Active alignment

- Manifest and workspace lockfile report `0.1.3`.
- Root/plugin Git install commands and living command context use `^0.1.3` with
  subdirectory `plugins/usage-tracker` and tag prefix `usage-tracker/`.
- Taskboard distribution tests assert the same version/range.
- The changelog contains `0.1.3 - 2026-08-27`; the sole remaining active-tree
  `0.1.2` literal is the immutable prior changelog heading.
- Marketplace links point to the existing combined PR #129.

## Checks

- Focused Usage Tracker check: passed (23/23 tests plus SDK/type/build).
- Root workspace check: passed again at exact clean release commit `3555def`.
- `dist/server.meta.json`: `usage-tracker` / `0.1.3` / SDK `0.4.6`.
- `dist/app.meta.json`: `usage-tracker` / `0.1.3` / SDK `0.4.6`.
- Generated `dist/` files are ignored and untracked.
