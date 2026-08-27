## Summary

- release Usage Tracker 0.1.3 from the merged provider/window fixes
- include the previously unreleased Compact limit setting and contributor credit
- align manifest, lockfile, changelog, Git install commands, marketplace links,
  distribution guards, and living command context
- keep BB 0.38 / plugin SDK 0.4.6 compatibility and Git-only distribution

## Verification

- focused Usage Tracker SDK/type/test/build check
- repository-root `npm run check`
- server/app build metadata report `usage-tracker` / `0.1.3`
- generated `dist/` remains ignored
- proposed `usage-tracker/v0.1.3` tag and GitHub Release are absent

The annotated tag and GitHub Release are created only after this exact release
commit passes clean-install CI and becomes reachable from `main`.
