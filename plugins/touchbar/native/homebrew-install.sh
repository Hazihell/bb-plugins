#!/usr/bin/env bash
set -euo pipefail

APP="${1:?usage: homebrew-install.sh /path/to/BBTouchBar.app}"
BIN="$APP/Contents/MacOS/BBTouchBar"
SUPPORT="$HOME/Library/Application Support/BBTouchBar"
LAUNCH_AGENTS="$HOME/Library/LaunchAgents"
PLIST="$LAUNCH_AGENTS/app.getbb.touchbar.native.plist"
DOMAIN="gui/$(id -u)"
BB_BIN="${BB_TOUCHBAR_BB_BIN:-}"
if [ -z "$BB_BIN" ]; then
  for candidate in "$(command -v bb 2>/dev/null || true)" /usr/local/bin/bb /opt/homebrew/bin/bb; do
    if [ -n "$candidate" ] && [ -x "$candidate" ]; then
      BB_BIN="$candidate"
      break
    fi
  done
fi

[ "$(uname -s)" = "Darwin" ] || { printf '%s\n' 'error: macOS is required' >&2; exit 1; }
[ -x "$BIN" ] || { printf 'error: missing %s\n' "$BIN" >&2; exit 1; }
[ -n "$BB_BIN" ] && [ -x "$BB_BIN" ] || {
  printf '%s\n' 'error: bb executable not found; install the BB CLI first' >&2
  exit 1
}

mkdir -p "$SUPPORT" "$LAUNCH_AGENTS"
printf '%s\n' "$BB_BIN" > "$SUPPORT/bb-path"
chmod 600 "$SUPPORT/bb-path"

plutil -create xml1 "$PLIST"
plutil -insert Label -string app.getbb.touchbar.native "$PLIST"
plutil -insert ProgramArguments -json "[\"$BIN\"]" "$PLIST"
plutil -insert RunAtLoad -bool true "$PLIST"
plutil -insert ProcessType -string Interactive "$PLIST"
plutil -lint "$PLIST" >/dev/null

launchctl bootout "$DOMAIN/app.getbb.touchbar.native" 2>/dev/null || true
pkill -TERM -x BBTouchBar 2>/dev/null || true
launchctl bootstrap "$DOMAIN" "$PLIST"
printf 'configured %s for login startup\n' "$APP"
