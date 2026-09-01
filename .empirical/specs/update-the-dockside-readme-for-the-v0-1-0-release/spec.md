# Update The Dockside Readme For The V0 1 0 Release

## Request

> Update the Dockside README for the v0.1.0 release and add the final compact light, dark, and expanded-subagent screenshots under plugins/dockside/docs/media. Preserve all existing content and accurately describe the shipped semantic states, subagent provider marks, project/family sorting, and marketplace release.

## Goal

Present the released Dockside experience accurately from its package README,
using the final compact light, dark, and expanded-subagent captures and an
install path that resolves the immutable v0.1.0 Git release.

## Acceptance Criteria

- [ ] [AC-1] The Dockside README identifies v0.1.0 as an immutable Git release,
  gives a correct direct-install command for the monorepo subdirectory/tag
  prefix, and distinguishes the validated marketplace submission from a merged
  marketplace listing.
- [ ] [AC-2] The README describes the shipped six-state presentation,
  provider-marked inline subagents, parent-only PR metadata, and persistent
  project/family drag and keyboard sorting without contradicting runtime
  behavior.
- [ ] [AC-UI-1] [UI] The README embeds final compact light and dark sidebar
  captures plus a dedicated expanded-subagent capture, all from
  `plugins/dockside/docs/media` with useful alt text.
- [ ] [AC-3] Existing usage, safety, migration, troubleshooting, credit, and
  source-development guidance remains available and no generated build output
  is committed.

## Scope

- `plugins/dockside/README.md`
- Three final PNG files under `plugins/dockside/docs/media/`
- Empirical workflow artifacts for this documentation release

## Non-goals

- No runtime, package-version, status palette, marketplace entry, or release-tag
  change.
- No new screenshot generation or visual redesign.
- No npm publication claim.

## Verification

- Confirm all three images are valid PNGs and resolve from the README.
- Check the direct Git install syntax against current `bb plugin install` flags.
- Search the README for obsolete unpublished-release guidance and broken image
  paths.
- Run Markdown/path contract checks and `git diff --check`.

## Capability Deltas

- `deltas/plugin-git-distribution.md`
