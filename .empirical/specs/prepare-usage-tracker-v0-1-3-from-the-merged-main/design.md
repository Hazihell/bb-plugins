# Design: Usage Tracker 0.1.3 Release Preparation

## Release identity

- Package: `bb-plugin-usage-tracker`
- Version: `0.1.3`
- Base commit: merged PR #20 at
  `daffcd47cb1c642774f6227df19cf8357d597f7e`
- Local release branch: `release/usage-tracker-v0.1.3`
- Proposed immutable annotated tag: `usage-tracker/v0.1.3`
- Proposed GitHub Release title: `Usage Tracker v0.1.3`
- Distribution: private Git-only workspace; no npm publication
- Marketplace range: `^0.1.3` with tag prefix `usage-tracker/`

The release commit is one local commit based on the merged fix. After separate
approval it is pushed and reviewed through a normal repository PR. The tag is
created only after that exact commit is reachable from `main`; the tag points to
the reviewed source commit, matching the existing `usage-tracker/v0.1.2`
precedent rather than a metadata-free merge parent.

## Active version surface

Use `npm version 0.1.3 --workspace bb-plugin-usage-tracker
--no-git-tag-version` so npm updates the leaf manifest and workspace lockfile
together without creating a Git commit or tag. Then align:

- root Usage Tracker direct-install command;
- plugin README direct-install command and marketplace PR link;
- root marketplace PR link for the Taskboard/Usage Tracker combined migration;
- Taskboard distribution guard's Usage Tracker version/range;
- living Empirical command context.

Do not replace unrelated `0.1.x` dependency/Host Monitor values or text inside
completed Empirical evidence. Search the active tree after editing and classify
every remaining Usage Tracker `0.1.2` occurrence as intentional history or an
error.

Promote the existing changelog `Unreleased` Compact limit entry into
`0.1.3 - 2026-08-27`, retaining Stephen Dolan's attribution, and add fixed
entries for:

- current BB provider wire keys with legacy compatibility and isolated omitted
  providers;
- every additional expanded/cached usage window plus responsive and accessible
  details behavior.

## Verification and artifact inspection

Run focused Usage Tracker check and root `npm run check`. The root suite guards
the coupled manifest/docs/test values and every plugin build. Inspect ignored
`dist/server.meta.json` and `dist/app.meta.json` for `usage-tracker` / `0.1.3`,
then prove `dist/` remains ignored and the tracked tree has no generated drift.

Confirm before approval that no public `usage-tracker/v0.1.3` ref or GitHub
Release exists and that the authenticated account is `MateoCerquetella`.

## Marketplace preparation

Use a fresh local clone of `MateoCerquetella/marketplace` at existing PR #129's
head branch `bump-taskboard-v0.3.1`, with upstream verified as
`get-bb/marketplace`. Preserve its already-reviewed Taskboard Git source and
change only `entries/usage-tracker.json` from the unpublished npm source to:

```json
{
  "git": {
    "url": "https://github.com/MateoCerquetella/bb-plugins.git",
    "subdir": "plugins/usage-tracker",
    "range": "^0.1.3",
    "tagPrefix": "usage-tracker/"
  }
}
```

Before any dependency install or explicit npm script, resolve PR #129's exact
head object id through GitHub, require the local parent to equal that object,
and compare it with the recorded upstream base. Abort unless the complete
allowlisted changed-path set is exactly:

- `entries/taskboard.json` in the existing PR commit;
- `entries/usage-tracker.json` in the new local commit;
- no change to package manifests, lockfiles, scripts, workflows, or executable
  code.

Read the current marketplace contracts and the complete declarative diff before
execution. Run install/build/check with GitHub, npm, and SSH credential variables
removed from the process environment. `npm ci --ignore-scripts` suppresses
dependency lifecycle hooks but is not itself a trust boundary for later
explicit npm scripts; the immutable object/path/code gate is.

No schema `version` field exists. Retain listing identity, author, description,
tags, and the host icon. Run `npm ci --ignore-scripts`, `npm run build`,
`npm run check`, and diff/schema inspection. The current liveness script accepts
the older prefixed release and does not prove range satisfaction, so manually
verify the exact annotated/peeled `usage-tracker/v0.1.3` refs after approved tag
publication and before the marketplace commit is pushed to the existing PR.

## Approval and remote sequence

Before the first release push, present the authenticated account, repository,
remote, exact local release and marketplace commit hashes, package/version,
tag/source/range, and every remote-changing command. Approval authorizes only
that exact sequence:

1. push the release branch and open its PR;
2. require clean-install CI, merge the exact head, and prove it is on `main`;
3. create/push the annotated tag on the approved release commit;
4. create the GitHub Release with reviewed notes and no binary assets;
5. verify public exact annotated/peeled tag/source and rerun marketplace checks;
6. push the existing marketplace head branch and update PR #129 title/body.

Upstream marketplace merge is not available to this account; a get-bb
maintainer remains responsible for merging and publishing the catalog.

## Failure handling

- Any version/reference/build mismatch stops before the local release commit.
- Any PR or main-line integration failure stops before tag creation.
- Any public tag mismatch stops the GitHub Release and marketplace sequence;
  never move or replace a tag.
- Any post-tag exact-ref or marketplace check failure stops before push.
- Any marketplace object-id, changed-path, or executable-file mismatch stops
  before dependency installation or npm script execution.
- No npm command may publish; manifests stay private and release notes contain
  no credentials or private data.
