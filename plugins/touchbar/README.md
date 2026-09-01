# BB Touch Bar Agent Monitor

An open-source native macOS companion that keeps BB agent activity available on
the Touch Bar across every application.

The BB plugin owns the bounded thread snapshot and guarded commands. A small
Swift/AppKit background app owns the physical Touch Bar:

- an always-present BB badge in the Control Strip;
- tap the badge to expand a fullscreen, horizontally scrollable agent panel;
- one outlined two-line card per thread with provider, project, status colour,
  badge and activity spinner;
- tap a card to open that exact BB thread;
- tap ✕ to collapse to the ordinary Control Strip;
- automatic restoration after login and wake.

No subscription, developer account, external runtime, telemetry, or proprietary
companion is required. The source builds and ad-hoc signs locally.

## Requirements

- BB 0.40 or newer.
- A MacBook Pro with Touch Bar, Intel or Apple silicon.
- macOS 11 or newer.
- Xcode Command Line Tools (`xcode-select --install`).

The persistent Control Strip and fullscreen system-modal modes rely on Apple's
private `DFRFoundation` Touch Bar entry points. They are not App Store APIs and
may require adaptation after a macOS update. The app tears down modal state
before termination so it does not strand a black Touch Bar.

## Install the BB plugin

Install this package on the machine running the BB server—not from a remote
Mac filesystem path:

```sh
bb plugin install ./plugins/touchbar
bb plugin reload touchbar
bb touchbar snapshot --pretty
```

The managed Git form after a tagged release is:

```sh
bb plugin install git:https://github.com/MateoCerquetella/bb-plugins.git@^0.1.0 --subdirectory plugins/touchbar --tag-prefix touchbar/
```

## Install the native app

On the Touch Bar Mac, from the extracted package:

```sh
cd ~/Downloads/touchbar
chmod +x native/*.sh
./native/install.sh
```

The installer:

1. builds `BBTouchBar.app` from the committed Swift source;
2. emits Intel and Apple-silicon slices when the local toolchain supports them;
3. links the private Touch Bar framework and ad-hoc signs the real app bundle;
4. installs it at `~/Applications/BBTouchBar.app`;
5. pins the current `bb` executable path in owner-only configuration;
6. installs a user LaunchAgent for login startup;
7. launches the app and waits for its readiness file.

The app has no Dock icon. Its BB badge appears in the Touch Bar's Control Strip.

## Controls

```sh
./native/run.sh status
./native/run.sh open
./native/run.sh close
./native/run.sh restart
./native/run.sh stop
```

`open` and `close` signal the running app, exercising the same panel path as a
physical tap. Logs are written to `~/Library/Logs/bb-touchbar.log`.

## BB commands

```sh
bb touchbar snapshot [--pretty]
bb touchbar card <summary|0|1|2|3|4|5>
bb touchbar open <thread-id>
bb touchbar open-card <0|1|2|3|4|5>
bb touchbar stop <thread-id>
```

The native app uses `snapshot` and exact-id `open`. `stop` is deliberately not
bound to a physical tap.

The snapshot contains only stable, bounded card fields: id, short title,
lifecycle status, provider id, project label, update time, unread state and a
small attention enum. It never exposes prompts, messages, tool output,
credentials, or filesystem paths. Hidden worker threads are excluded by
default.

Configure card count and hidden-worker visibility through BB:

```sh
bb plugin config touchbar set cardLimit 24
bb plugin config touchbar set includeHidden false
```

## Remove

```sh
cd ~/Downloads/touchbar
./native/uninstall.sh
bb plugin remove touchbar
```

The native uninstaller first collapses/dismisses the modal Touch Bar, then
stops the process, unloads its user LaunchAgent, and removes only the installed
app and launch plist. BB plugin removal is separate because the server may live
on another machine.

## Development and verification

From the repository root:

```sh
npm install
npm run check --workspace bb-plugin-touchbar
```

On a Touch Bar Mac:

```sh
./plugins/touchbar/native/build.sh
BB_TOUCHBAR_APP="$PWD/plugins/touchbar/native/build/BBTouchBar.app" \
  ./plugins/touchbar/native/run.sh start
```

Generated `build/`, `dist/`, and `node_modules/` directories remain untracked.

## License

The plugin and native companion are MIT licensed. Required upstream license
and asset attribution remain alongside the reused material in
[`native/LICENSE.upstream`](./native/LICENSE.upstream) and
[`native/Assets/NOTICE.md`](./native/Assets/NOTICE.md).
