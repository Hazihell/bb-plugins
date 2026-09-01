## What changed

- Added the Compact limit setting contributed by Stephen Dolan, letting the
  collapsed sidebar reading prefer the weekly or five-hour window.
- Fixed Claude Code and Cursor usage on current BB releases while retaining
  compatibility with legacy provider keys; one omitted provider no longer
  fails the complete snapshot.
- Expanded details now show and retain every provider-defined usage window
  after the canonical five-hour and weekly rows, including windows such as
  Fable.
- Improved details-card scrolling, focus restoration, accessible popup state,
  refresh focus, and Escape handling in narrow/tall sidebars.

## Compatibility

Usage Tracker 0.1.3 remains compatible with BB 0.38 or newer and plugin SDK
0.4.6 or newer. It remains a private Git-only plugin; there is no npm release.

Install or update through the BB Community marketplace after its entry is live,
or use the plugin-specific Git range:

```sh
bb plugin install git:https://github.com/MateoCerquetella/bb-plugins.git@^0.1.3 --subdirectory plugins/usage-tracker --tag-prefix usage-tracker/
```

Full changelog:
https://github.com/MateoCerquetella/bb-plugins/compare/usage-tracker/v0.1.2...usage-tracker/v0.1.3
