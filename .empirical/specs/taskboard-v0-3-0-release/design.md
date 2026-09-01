# Taskboard 0.3.0 Release Design

## Release identity

- Package: `bb-plugin-taskboard`
- Version: `0.3.0`
- Repository: `https://github.com/MateoCerquetella/bb-plugins.git`
- Plugin subdirectory: `plugins/taskboard`
- Release branch: `agent/taskboard-v0.3.0`
- Annotated tag: `taskboard/v0.3.0`
- npm source: `bb-plugin-taskboard@0.3.0`
- Marketplace source: npm range `^0.3.0`

`0.3.0` is a pre-1.0 minor release because the accumulated milestone adds
durable project views, provider-native direct capture, safety boundaries, and a
substantial responsive List/detail/filter presentation—not a patch-only fix.

## Local preparation

1. Advance only `plugins/taskboard/package.json` and Taskboard's root lockfile
   workspace version to `0.3.0` without creating a tag.
2. Rebuild so `dist/*.meta.json` carries the new version.
3. Run the signed root workspace check and `git diff --check`.
4. Run `npm pack --ignore-scripts --json` in the Taskboard package into a
   release-only artifact directory; verify the real archive's version,
   declared sources, `dist`, license/notices, and absence of secrets, then
   record its SHA-256 digest.
5. Confirm npm and Git do not already expose `0.3.0`.
6. Commit the complete reviewed source plus release metadata locally as
   `release: Taskboard v0.3.0`; create the local release branch at that commit.

## Credential boundary

BB writes `NPM_TOKEN` to ignored `.npm-publish.env`. A temporary npm config
contains only `${NPM_TOKEN}`. The publication subshell loads the token only for
one `npm publish <verified-archive> --ignore-scripts` process, then exits so the
credential is no longer present. Never print/read the dotenv, place the token
in argv, commit the config, expose it to lifecycle hooks, or include either file
in artifacts or tarballs.

## Marketplace preparation

Use a new local clone of `MateoCerquetella/marketplace`, add/verify upstream
`get-bb/marketplace`, and create `taskboard-v0.3.0-marketplace` from current
`upstream/main`. Change only:

```json
"range": "^0.1.2" → "range": "^0.3.0"
```

Keep the existing `taskboard-0b77950c.svg`, listing identity, author, text,
tags, and npm package. Run `npm ci --ignore-scripts`, `npm run build`, and
`npm run check` locally, then rerun `npm run check` after npm publicly exposes
`0.3.0` and before the marketplace branch is pushed.

## Remote approval boundary

After local commits exist, present the authenticated GitHub/npm accounts,
repository, exact release and marketplace commit hashes, package/version, tag,
source/range, and every remote-changing command. Only explicit approval permits:

1. pushing the release branch and opening/merging its repository PR;
2. creating/pushing the immutable tag;
3. rechecking the approved archive SHA-256, publishing that exact `.tgz` with
   lifecycle scripts disabled and the token scoped to one process, then
   confirming npm;
4. creating the GitHub release;
5. running marketplace source verification;
6. pushing the marketplace branch and opening its PR.

No tag is moved, no version is republished, and no marketplace PR is opened
before public npm confirmation.

## Failure handling

- Any build/test/pack mismatch stops before commit or publication.
- If remote repository integration fails, do not tag or publish.
- If the archive digest changes, stop and repeat package review and approval.
- If npm publication is uncertain, query the exact version before retrying.
- If marketplace source verification fails, do not push/open its PR.
- Never delete or replace an existing version/tag to recover.
