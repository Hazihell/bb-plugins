#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INSTALL_DIR="$HOME/Applications"
INSTALL_APP="$INSTALL_DIR/BBTouchBar.app"
SUPPORT="$HOME/Library/Application Support/BBTouchBar"
LAUNCH_AGENTS="$HOME/Library/LaunchAgents"
PLIST="$LAUNCH_AGENTS/app.getbb.touchbar.native.plist"
DOMAIN="gui/$(id -u)"
BB_BIN="${BB_TOUCHBAR_BB_BIN:-$(command -v bb || true)}"

[ "$(uname -s)" = "Darwin" ] || { printf '%s\n' 'error: macOS is required' >&2; exit 1; }
[ -n "$BB_BIN" ] && [ -x "$BB_BIN" ] || { printf '%s\n' 'error: bb executable not found' >&2; exit 1; }

mkdir -p "$INSTALL_DIR" "$SUPPORT" "$LAUNCH_AGENTS"
printf '%s\n' "$BB_BIN" > "$SUPPORT/bb-path"
chmod 600 "$SUPPORT/bb-path"

bash "$ROOT/build.sh"
BB_TOUCHBAR_APP="$INSTALL_APP" bash "$ROOT/run.sh" stop || true
rm -rf "$INSTALL_APP"
ditto "$ROOT/build/BBTouchBar.app" "$INSTALL_APP"

cat > "$PLIST" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>Label</key><string>app.getbb.touchbar.native</string>
  <key>ProgramArguments</key>
  <array><string>$INSTALL_APP/Contents/MacOS/BBTouchBar</string></array>
  <key>RunAtLoad</key><true/>
  <key>ProcessType</key><string>Interactive</string>
</dict>
</plist>
PLIST

plutil -lint "$PLIST" >/dev/null
launchctl bootout "$DOMAIN/app.getbb.touchbar.native" 2>/dev/null || true
launchctl bootstrap "$DOMAIN" "$PLIST"
BB_TOUCHBAR_APP="$INSTALL_APP" bash "$ROOT/run.sh" start

printf 'installed %s\n' "$INSTALL_APP"
printf '%s\n' 'tap the BB badge in the Control Strip, or run native/run.sh open'
