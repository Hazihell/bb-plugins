#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ARCHIVE="${1:-$ROOT/build/BBTouchBar-0.1.0-universal.zip}"
CASK_SOURCE="${2:-$ROOT/../../../Casks/bb-touch-bar.rb}"
TAP="${BB_TOUCHBAR_TEST_TAP:-mateocerquetella/touchbar-local}"
CASK="bb-touch-bar"

[ "$(uname -s)" = "Darwin" ] || { printf '%s\n' 'error: macOS is required' >&2; exit 1; }
[ -f "$ARCHIVE" ] || { printf 'error: missing %s\n' "$ARCHIVE" >&2; exit 1; }
[ -f "$CASK_SOURCE" ] || { printf 'error: missing %s\n' "$CASK_SOURCE" >&2; exit 1; }

if ! brew tap | grep -Fxq "$TAP"; then
  brew tap-new "$TAP" >/dev/null
fi
TAP_DIR="$(brew --repository "$TAP")"
mkdir -p "$TAP_DIR/Casks"
sed "s#^  url \".*#  url \"file://$ARCHIVE\"#" \
  "$CASK_SOURCE" > "$TAP_DIR/Casks/$CASK.rb"

brew style --cask "$TAP/$CASK"
if brew list --cask "$CASK" >/dev/null 2>&1; then
  brew uninstall --cask "$CASK"
fi
brew install --cask "$TAP/$CASK"

APP="/Applications/BB Touch Bar.app"
[ -x "$APP/Contents/MacOS/BBTouchBar" ]
launchctl print "gui/$(id -u)/app.getbb.touchbar.native" >/dev/null
printf 'verified Homebrew cask installation at %s\n' "$APP"
