<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg" />
  <img src="assets/logo.svg" width="72" height="72" alt="" />
</picture>

# Dockside

**Stable projects, clear attention, inline agents.**

![bb ≥ 0.36](https://img.shields.io/badge/bb-%E2%89%A5%200.36-88C0D0?style=flat-square)
![any platform](https://img.shields.io/badge/platform-any-3FA266?style=flat-square)
![experimental slot](https://img.shields.io/badge/uses-experimental%20SDK%20slot-F1B467?style=flat-square)

</div>

Dockside replaces the scrolling thread list in bb's left sidebar with a
project-first inbox inspired by Orca's compact navigation.

Projects keep bb's own order. Inside each project, root threads sort by creation
time, newest first, and **hold that place until you park them**. Status lives inside
each row instead of in its position, so the sidebar only moves when *you* act — no
row slides away under your cursor because an agent finished something.

Working is animated and labeled. Unread is a separate ring plus title weight, so a
thread can be visibly working and unread at the same time. When a root has child
threads, active or attention-bearing child work expands inline as an agent stack.

You clear the list with two email verbs: **snooze** a thread until a wake time, or
**settle** it when you are done. Both shelves collapse to one counted header.

## Install

**Dockside is not published to npm yet.** The `bb-plugin-dockside` name is
currently unclaimed, so do not install a bare npm package with that name. Until
the maintainer controls the namespace, install only from this trusted source
checkout.

**From source** — clone the repo and install the plugin as a local path source:

```sh
git clone https://github.com/mateocerquetella/bb-plugins.git
cd bb-plugins
bun install
bun run --filter 'bb-plugin-dockside' build
bb plugin install ./plugins/dockside
```

The source path needs Bun and the `bb` CLI. Note that
`bb plugin install git:<url>@<ref>` does not work for these plugins: bb reads
the manifest at the repository root, so it cannot see `plugins/<id>`.

## Requirements

- bb ≥ 0.36
- Nothing else. No accounts, keys, or external services.

## Usage

Installing does not change your sidebar by itself. Open **Settings → Appearance →
Sidebar** and choose **Dockside (projects)**.

<picture><img src="docs/media/enable.png" alt="bb's Appearance settings where a sidebar replacement can be selected" width="100%" /></picture>

bb's own list stays the default, and comes back the moment you switch away or
disable the plugin.

### Projects and parked shelves

- **Projects** — bb's project order, with pinned roots first inside each project.
  Drag a family's semantic status icon, or focus it and press Alt+Up/Alt+Down, to move
  a complete root/child family inside its pinned or unpinned partition. The
  browser-local order survives reloads. Clear search, choose the All filter, and
  exit bulk selection before sorting so hidden rows are never moved implicitly.
- **Snoozed** — hidden until the wake time you chose. A snoozed thread comes back early if it starts working or asks you something.
- **Settled** — work you are done with, collapsed to one line and shown for 24 hours. Settling also **archives the thread in bb**, so every other surface agrees, and new attention un-settles and unarchives it. After a day the row stops being drawn but stays archived.

An empty shelf disappears.

### Cards

Root rows always use exactly two compact lines. The first has a distinct semantic
icon, truncated title, and elapsed time. The second has a truncated branch and a
non-wrapping cluster with a readable status badge, parent-only PR metadata, and
child/provider controls. **Failed**, **Needs you**, **Working**, **Unread**,
**Inactive**, and seven-day **Stale** states have separate shapes, labels,
tooltips, and customizable colors. Inactive and stale work recede; Dockside never
calls ordinary idle work Done. A Working family keeps the actual activity type
visible: runtime, workflow, background agent, command, plan, and goal each use a
different animated shape and customizable color. PR ticks and other PR icons use
their semantic color as a tinted background, so a ready tick is visibly green.
Hovering a quiet root swaps its elapsed time for the two park buttons without
adding a row.

### A working thread can never be parked

Workflows, background agents, background commands, plan mode, and goals all count as
live work. Any of them blocks parking and wakes a parked thread, so running work is
never hidden.

### Snoozing

The hover button snoozes until **09:00 tomorrow**.

### Inline agents

A root with child threads gets an agent count and disclosure. The stack opens by
default when the family is selected or a child is working, unread, or waiting for
you. Child rows keep their own provider, branch, age, working state, unread ring,
context menu, split drag, and keyboard target. A parent chip in the thread header
still gives a focused child a direct route back up.

### The rest

- Collapsible project and agent groups.
- Right-click for open in split, mark read/unread, pin, archive, delete.
- Drag a card to a split pane, or Cmd/Ctrl-click to open one.
- Status-icon reordering is separate from BB's card-to-split drag target and
  adds no extra row icon.
- bb's search, its thread shortcuts, and modifier-click split-open all keep working.

## Switching from t3sidebar

Dockside is a new plugin identity, not an in-place release of t3sidebar. It
uses a separate bb database and separate `dockside:v1:*` browser keys, so it
starts with an empty Snoozed and Settled state. It does **not** migrate or
delete the old plugin's parked threads.

Keep t3sidebar installed but disabled until you no longer need its snoozed or
settled rows. You can re-enable it temporarily to inspect that state. Removing
the old plugin may remove its private database; Dockside never performs that
removal for you.

Sidebar selection is per client. Choose **Dockside (projects)** on each desktop,
browser, or remote client where you want to use it.

## Configuration

There is nothing to configure. The snooze presets assume a 09:00 morning, an 18:00
evening, and a week starting Monday, in your local timezone. The settled shelf
reaches back 24 hours. None of these are settings.

## Troubleshooting

**My sidebar looks the same after installing.** Choose Dockside in Settings →
Appearance → Sidebar. Installing alone changes nothing.

**A thread I settled is not on the Settled shelf.** The shelf only reaches back 24
hours. Older work is still settled and still archived — look for it in bb's archived
view.

**A snoozed thread came back early.** That is the design: a snoozed thread wakes when
it starts working or asks you a question.

**Un-settling did not bring the thread back.** Archive and unarchive run on the
thread's host, which can be offline. When an unarchive fails, bb keeps the thread
archived and the thread leaves the sidebar until you unarchive it in bb yourself.

**Uninstalling left data behind.** The shelves live in the plugin's own database,
which bb removes with the plugin — but a copy of them is cached in the browser's
`localStorage` under `dockside:v1:*` (thread ids, park timestamps, and legacy
provider metadata). bb's uninstall does not clear web storage. Clear site data
if that matters to you. The separate `t3sidebar:v1:*` keys belong to the old
plugin and are not claimed by Dockside.

## Credits

Forked from bb's own example.

| | |
|---|---|
| Upstream | [`get-bb/bb` → `examples/plugins/t3sidebar`](https://github.com/get-bb/bb/tree/main/examples/plugins/t3sidebar) |
| Commit | `f13c2d35f96540012b305f3b555839b30e1b6163` (2026-08-07) |

The provider brand marks are vendored SVG geometry from `get-bb/bb` and depict
third-party brands. A host-served logo always wins over them, rendered as a muted
silhouette rather than in brand color — by design.

## Develop from source

Install from source as shown under [Install](#install), then check a change
with:

```sh
bun run --filter 'bb-plugin-dockside' typecheck
bun run --filter 'bb-plugin-dockside' test
```

The test script needs Node 22.6+.
