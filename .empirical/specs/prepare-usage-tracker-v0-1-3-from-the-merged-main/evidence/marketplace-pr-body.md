## Summary

Migrate both MateoCerquetella marketplace entries from unpublished npm packages
to their immutable monorepo Git releases.

- Taskboard: `plugins/taskboard`, range `^0.3.1`, tag prefix `taskboard/`
- Usage Tracker: `plugins/usage-tracker`, range `^0.1.3`, tag prefix
  `usage-tracker/`

The combined change is required because leaving either legacy npm entry in the
catalog makes repository-wide source validation fail.

## Verification

- marketplace `npm ci --ignore-scripts`
- `npm run build`
- `npm run check`
- exact public `taskboard/v0.3.1` and `usage-tracker/v0.1.3` annotated/peeled
  refs verified before push
- composed entries preserve existing listing identity, author, tags, and icons
