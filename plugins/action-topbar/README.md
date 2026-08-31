# Action Topbar

Action Topbar moves the actions from a thread's BB **New tab** launcher into a
persistent, Orca-style strip beside the thread title.

- Click an action to open it in the focused thread's native right panel.
- Drag an action onto any existing split pane to focus that pane and open the
  action there.
- Use the trailing **+** to open BB's full New Tab launcher.
- Open New Tab once after installing or removing another plugin; Action Topbar
  learns the live action inventory and keeps it for the next app launch.

The plugin does not recreate Browser, Terminal, Recap, File Manager, Git
History, Side Chat, Taskboard, Workflows, or third-party panels. It activates
their host-rendered launcher rows, so their own state, tabs, and lifecycle stay
under BB and the owning plugin.

## Install

```sh
bb plugin install npm:bb-plugin-action-topbar
```

## Develop

From the repository root, run `bun run dev`. The workspace watcher builds and
reloads this plugin when its source changes.
