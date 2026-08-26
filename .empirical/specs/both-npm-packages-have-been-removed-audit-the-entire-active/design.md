# Active Git-only Distribution Audit Design

## Audit boundary

Treat a reference as stale distribution only when it advertises or automates
Taskboard or Usage Tracker through the npm registry: package badges and URLs,
`npm:` plugin sources, publish/unpublish commands, publish credentials/config,
registry-backed marketplace entries, or copy claiming the plugins ship there.

Retain package manifests, stable package names, workspace and lockfile records,
`npm install`/`npm run` contributor commands, and the pinned
`@get-bb/plugin-sdk` dependency. BB derives plugin identity from the package
name, and Git installs still install dependencies and build source.

## Active documentation cleanup

The root and plugin READMEs already lead with Git semver and conditional BB
Community installation and contain no former package badge, URL, or `npm:`
install. Remove the remaining explanatory prose that names npm as a former
distribution channel where it adds no user value, while retaining explicit
development commands. Reword Usage Tracker's changelog to describe the SDK as
a pinned development dependency rather than a "published package" so current
copy cannot be confused with plugin publication.

Generated Empirical context should describe private workspaces and Git releases
without calling either plugin an npm package. Command examples remain because
they are the verified development interface.

## Automation and manifest guard

Extend the focused distribution test to cover the Usage Tracker changelog,
active context, root manifest, and CI workflow. It should prove both plugin
manifests are private and publish-hook-free; the root is private; no active
document contains either retired package URL/source; `.npmrc.publish` is
absent; CI contains no publish command/token; and both direct Git plus
marketplace shorthand installs remain documented.

The deny-only `.npm-publish.env` ignore line remains protective hygiene for old
clones and is not a credential or publication path.

## Marketplace boundary

The narrow marketplace worktree already has both entries converted locally to
Git sources. Taskboard tracks `^0.3.0` with `taskboard/`; that compatible range
selects v0.3.1 once public. Usage Tracker tracks `^0.1.2` with
`usage-tracker/`. The live catalog and PR cannot be fully corrected until exact
remote approval permits the source PR, immutable tags, Releases, marketplace
validation, and PR update. No local cleanup pretends that deployment occurred.

## Historical boundary

Do not edit older `.empirical/specs/**` features, their receipts, or publication
artifacts. They record the true earlier npm workflow and deletion timeline.
Audit their artifact digests independently and keep current install surfaces
separate from that immutable history.

## Verification

Run the focused distribution test and root check, repeat the active-file search,
assert private publish refusals, validate historical artifact digests, and run
the marketplace schema build. Full marketplace source liveness remains a
post-tag approval gate.
