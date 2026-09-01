# Plan: Taskboard Git-only Distribution

## 1. Disable npm publication for both plugins

- Mark Taskboard and Usage Tracker private; remove publishConfig, files, and
  prepack from both.
- Preserve both plugin identities, dependencies, BB manifests, versions, and
  build scripts.
- Add focused distribution assertions.

## 2. Replace active npm-facing documentation

- Remove both plugins' npm badges, links, and installation language from the
  root and plugin READMEs.
- Document BB Community and direct Git semver/subdirectory/tag-prefix installs
  for both plugins.
- Preserve shared npm dependency/build tooling only.

## 3. Verify and integrate

- Run focused tests, root checks, both private-publish refusals, Git tag
  resolution, marketplace Git-source build/liveness, and immutable receipt
  audit.
- Independently review the manifest/docs boundary and integrate the distribution
  capability delta.
- Commit/push through a normal source PR only after exact remote approval.

## 4. Keep external deletion honest

- Recheck both registry package names.
- Preserve the ordered timeline: Taskboard CLI unpublish first failed with
  `EOTP`, then the user removed both packages in npm's website and registry
  queries confirmed `E404 Unpublished` for each.
