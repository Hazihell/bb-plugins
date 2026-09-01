# Remove Prominent V0 1 0 Branding From The Dockside Readme

## Request

> Remove prominent v0.1.0 branding from the Dockside README: remove the release badge, version from the introduction and screenshot heading, and version branding from screenshot alt text. Keep the technically required semver range and immutable tag only in the install instructions. Do not add the Discord/download announcement to the README.

## Goal

Keep the Dockside README product-led rather than version-led while preserving
the exact release coordinates users need to install safely.

## Acceptance Criteria

- [ ] [AC-1] The release badge, introduction, screenshot heading, and screenshot
  alt text contain no `v0.1.0` branding.
- [ ] [AC-2] The install section retains the technically required `^0.1.0`
  range, `dockside/` tag prefix, and immutable release-tag reference.
- [ ] [AC-3] The Discord/download announcement is not added to the README and
  the existing screenshots and operational guidance remain intact.

## Scope

- `plugins/dockside/README.md`
- Empirical workflow artifacts for the copy correction

## Non-goals

- No image, runtime, package, release-tag, marketplace, or install-source change.
- No Discord announcement inside repository documentation.

## Verification

- Search promotional README regions for `v0.1.0`.
- Confirm install coordinates still contain `^0.1.0` and `dockside/`.
- Confirm all three screenshot references resolve and `git diff --check` passes.

## Capability Deltas

- `deltas/plugin-git-distribution.md`
