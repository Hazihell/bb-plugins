#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP="$HOME/Applications/BBTouchBar.app"
PLIST="$HOME/Library/LaunchAgents/app.getbb.touchbar.native.plist"
DOMAIN="gui/$(id -u)"

BB_TOUCHBAR_APP="$APP" bash "$ROOT/run.sh" stop || true
launchctl bootout "$DOMAIN/app.getbb.touchbar.native" 2>/dev/null || true
rm -f "$PLIST"
rm -rf "$APP"
printf '%s\n' 'removed BB Touch Bar native app and login agent'
