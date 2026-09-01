#!/usr/bin/env bash
set -euo pipefail

PLIST="$HOME/Library/LaunchAgents/app.getbb.touchbar.native.plist"
READY="$HOME/Library/Application Support/BBTouchBar/BBTouchBar.ready"
DOMAIN="gui/$(id -u)"

launchctl bootout "$DOMAIN/app.getbb.touchbar.native" 2>/dev/null || true
pkill -TERM -x BBTouchBar 2>/dev/null || true
rm -f "$PLIST" "$READY"
printf '%s\n' 'removed BB Touch Bar login agent'
