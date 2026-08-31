# Project Overview

## Purpose

- `bb-plugins` is a Bun workspace containing installable plugins for bb, the
  agent IDE. Each package under `plugins/*` owns one backend, frontend, host
  worker, provider integration, theme, or developer workflow.
- The repository is primarily a personal plugin collection, while individual
  non-private packages can be built and distributed independently.
- The root workspace centralizes dependency installation, build fan-out,
  verification, SDK compatibility, licensing, and publishing checks.

## Boundaries

- This repository extends bb; it does not contain the bb application itself.
- Plugin source is authoritative. Generated `dist/` bundles and dependency
  directories are local build artifacts and are not versioned.
- `plugins/dotfiles` and `plugins/pr-walkthrough` are private and excluded from
  npm publishing. Other plugin packages use the `bb-plugin-<id>` name shape.
- Vendored UI components and helpers belong to each plugin. Similar copies may
  diverge and must not be treated as a shared internal framework.

## Evidence

- Root behavior and pinned bb version: `package.json` and `bunfig.toml`.
- Repository workflow and invariants: `AGENTS.md`.
- User-facing plugin inventory and setup: `README.md`.
- Package behavior: each `plugins/<id>/package.json`, README, and declared
  `bb.server`, `bb.app`, or `bb.host` source entrypoint.
- Distribution and policy checks: `scripts/publish.ts`,
  `scripts/plugin-package.test.ts`, and `scripts/licenses.test.ts`.
