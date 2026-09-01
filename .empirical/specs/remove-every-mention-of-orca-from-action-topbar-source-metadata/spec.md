# Remove Every Mention Of Orca From Action Topbar Source Metadata

## Request

> Remove every mention of Orca from Action Topbar source, metadata, tests, and documentation; capture real light-mode and dark-mode Action Topbar screenshots in BB; add those screenshots to the plugin documentation; verify the plugin and integrate the result into main.

## Goal

Present Action Topbar entirely under its own product identity and document its
real appearance in both supported BB color modes.

## Acceptance Criteria

- [ ] [AC-1] A case-insensitive repository search outside generated and
  dependency directories finds no reference to the removed third-party name.
- [ ] [AC-2] Action Topbar package metadata and repository catalog describe the
  plugin in product-owned language without changing its compatibility warning.
- [ ] [AC-UI-1] [UI] The Action Topbar README displays a real BB light-mode
  screenshot with the topbar and searchable Action launcher visible.
- [ ] [AC-UI-2] [UI] The Action Topbar README displays a real BB dark-mode
  screenshot with the topbar and searchable Action launcher visible.
- [ ] [AC-3] Screenshot assets use stable repository paths under `docs/media/`
  and descriptive accessible alt text.
- [ ] [AC-4] Action Topbar tests, typechecking, build, and repository checks pass.

## Scope

- Remove all case-insensitive references to the third-party product name across
  authored repository files, including Dockside copy discovered by the audit.
- Capture the installed Action Topbar in a real BB browser session in light and
  dark mode.
- Add both screenshots to Action Topbar documentation.
- Integrate the verified documentation and assets into `main`.

## Non-goals

- Change Action Topbar behavior, layout, persistence, or SDK requirements.
- Submit Action Topbar to the marketplace.
- Rebrand BB itself or alter unrelated plugin functionality.

## Verification

- Run a case-insensitive repository search excluding generated/dependency paths.
- Inspect both captured screenshots.
- Run Action Topbar tests, typechecking, and build.
- Run the repository check contract.

## Capability Deltas

- `deltas/action-topbar-distribution.md`
