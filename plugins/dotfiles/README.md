<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg" />
  <img src="assets/logo.svg" width="72" height="72" alt="" />
</picture>

# Dotfiles

**Browse, edit, and sync one dotfiles repo from a bb panel.**

![personal](https://img.shields.io/badge/status-personal%20%C2%B7%20unsupported-E34671?style=flat-square)
![bb ≥ 0.36](https://img.shields.io/badge/bb-%E2%89%A5%200.36-88C0D0?style=flat-square)
![macOS · Linux](https://img.shields.io/badge/platform-macOS%20%C2%B7%20Linux-3FA266?style=flat-square)

</div>

> [!IMPORTANT]
> **Not published to npm. Personal tooling, unsupported for external use.**
>
> There is no `bb plugin install npm:` command for this plugin. Install it from a
> source checkout, as shown below.
>
> The plugin is written against **one specific dotfiles repository layout** — a fixed
> set of file paths and a fixed set of `mise` task names. Against a differently shaped
> repo, every row reads `missing` and every task fails. Read it as a worked example of
> the bb plugin API, or fork it and replace the registry.

Turns a git-tracked dotfiles repository into a small editing console inside bb.

It lists the repo's hand-authored config files grouped by purpose, opens any of them in
an inline **editable diff against `git HEAD`**, and saves with a hash check so a
concurrent edit on disk cannot be silently overwritten. The same panel and a
`bb dotfiles` command run the repository's own `mise` tasks — render generated files,
run validation checks, preview an apply, pull published changes, or publish local ones
— and show the combined output when each task finishes.

## Requirements

- bb ≥ 0.36
- macOS or Linux. There is no Windows path
- `git` and `mise` on `PATH` inside the bb server host's login shell
- A dotfiles repository matching the layout this plugin expects, with the matching
  `mise` task set
- `npx` and network access, only for the Remove-skill control
- Bun, to build the plugin from the checkout

## Install

```sh
git clone https://github.com/mateocerquetella/bb-plugins.git
cd bb-plugins
bun install
bun run --filter 'bb-plugin-dotfiles' build
bb plugin install ./plugins/dotfiles
```

## Configuration

| Key | Default | Meaning |
|---|---|---|
| `repoPath` | `~/git/dotfiles` | Path to the dotfiles repository **on the bb server host**. A leading `~` is expanded |

```sh
bb plugin config dotfiles set repoPath ~/path/to/your/dotfiles
bb plugin reload dotfiles
```

A settings change takes effect only after the reload. `repoPath` moves the root and the
Skills group is rediscovered underneath it, but the other five groups and every task
name are fixed, so a differently shaped repo still reads `missing`.

## Usage

Open the **Dotfiles** panel in bb, or run `bb dotfiles`.

- **File list.** Five fixed groups — agent config, settings overlays, shell, mise, repo
  policy — plus a Skills group scanned from the repo, so a new skill appears with no
  code change. Dirty files get an amber dot; absent files get a red `missing` badge.
- **Inline editable diff.** The old side is `git show HEAD:<path>`, the new side is the
  working file. Unified and Split views; unsaved edits survive a remount.
- **Compare-and-swap saves.** The sha256 recorded when the file was opened is passed to
  the write. If the file changed on disk, the save is refused instead of merged.
- **Stale-render warning.** Saving a file that feeds a generated consumer shows an amber
  line and a **Run render** button. Running render or sync clears it.
- **Task runner.** Fourteen tasks, five of them header buttons. Output is capped at
  200,000 characters, and a task is killed after 300 seconds.

Symlinked sources are live as soon as you save them. Settings overlays, MCP config, and
global agent instructions need `render` after a save.

Reads and writes are refused for any path outside the current file list, so neither the
panel nor the CLI can reach arbitrary files under the repo root.

### Commands

| Command | What it does |
|---|---|
| `bb dotfiles list` | Every tweakable file, grouped, with `[dirty]`, `[renders]`, and `[MISSING]` flags |
| `bb dotfiles status` | Branch, then porcelain git status, or `clean` |
| `bb dotfiles cat <path>` | Print one file from the list |
| `bb dotfiles render` | Run the repo's `render` task |
| `bb dotfiles check [target]` | Full validation, or one target |
| `bb dotfiles sync [--publish]` | Consume-only by default; `--publish` rebases and pushes |

> [!WARNING]
> The panel button labelled **sync** is the publishing one: it rebases and pushes. It is
> styled destructive and asks for a confirmation first.
>
> The **Remove skill** control shells out to the global `skills` CLI, which deletes the
> skill for every agent, not only inside `repoPath`.

## Troubleshooting

| Symptom | Cause |
|---|---|
| Every row reads `missing`, branch reads `missing` | `repoPath` does not exist, or the repository does not match the expected layout |
| A task exits 127 with raw shell text | `mise`, `git`, or `npx` is not on `PATH` in the login shell the plugin resolved |
| A task appears to hang, then dumps all output at once | Expected. Output is buffered until the command exits. Tasks are killed at 300 seconds |
| "File changed on disk since you opened it" | The compare-and-swap refused the save. Reload the file and apply your edit again |

The login shell is resolved once, when the plugin loads. It uses `$SHELL` only when that
ends in `/fish`, then tries `/opt/homebrew/bin/fish`, `/usr/local/bin/fish`, and
`/usr/bin/fish`. A machine with no fish falls back to `/bin/sh -lc`, which reads neither
`~/.bashrc` nor `~/.zshrc` — so `mise` activation is commonly missed there. Install fish
or change `$SHELL`, then run `bb plugin reload dotfiles`.

## Development

```sh
bun install
bun run --filter 'bb-plugin-dotfiles' typecheck
bun run --filter 'bb-plugin-dotfiles' build
bb plugin reload dotfiles
```

Build from inside this repository. `diffs-lib.ts` reaches the diff library through the
workspace root, which resolves only under Bun's hoisted linker.
