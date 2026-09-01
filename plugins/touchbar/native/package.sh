#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VERSION="${1:-${BB_TOUCHBAR_VERSION:-0.1.0}}"
BUILD="$ROOT/build"
STAGE="$BUILD/package-$VERSION"
ARCHIVE="$BUILD/BBTouchBar-$VERSION-universal.zip"

[[ "$VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+([.-][A-Za-z0-9.-]+)?$ ]] || {
  printf 'error: invalid release version %s\n' "$VERSION" >&2
  exit 1
}

if [ "${BB_TOUCHBAR_SKIP_BUILD:-0}" = "1" ]; then
  [ -x "$BUILD/BBTouchBar.app/Contents/MacOS/BBTouchBar" ] || {
    printf '%s\n' 'error: BB_TOUCHBAR_SKIP_BUILD=1 requires an existing app build' >&2
    exit 1
  }
else
  BB_TOUCHBAR_VERSION="$VERSION" bash "$ROOT/build.sh"
fi
rm -rf "$STAGE" "$ARCHIVE"
mkdir -p "$STAGE"
ditto "$BUILD/BBTouchBar.app" "$STAGE/BBTouchBar.app"
cp "$ROOT/homebrew-install.sh" "$STAGE/homebrew-install.sh"
cp "$ROOT/homebrew-uninstall.sh" "$STAGE/homebrew-uninstall.sh"
chmod 755 "$STAGE/homebrew-install.sh" "$STAGE/homebrew-uninstall.sh"

if [ -n "${BB_TOUCHBAR_NOTARY_PROFILE:-}" ]; then
  [ "${BB_TOUCHBAR_SIGN_IDENTITY:--}" != "-" ] || {
    printf '%s\n' 'error: notarization requires BB_TOUCHBAR_SIGN_IDENTITY' >&2
    exit 1
  }
  NOTARY_ARCHIVE="$BUILD/BBTouchBar-$VERSION-notary.zip"
  rm -f "$NOTARY_ARCHIVE"
  ditto -c -k --keepParent "$STAGE/BBTouchBar.app" "$NOTARY_ARCHIVE"
  xcrun notarytool submit "$NOTARY_ARCHIVE" \
    --keychain-profile "$BB_TOUCHBAR_NOTARY_PROFILE" --wait
  xcrun stapler staple "$STAGE/BBTouchBar.app"
  rm -f "$NOTARY_ARCHIVE"
fi

find "$STAGE" -exec touch -t 202601010000 {} +
COPYFILE_DISABLE=1 ditto -c -k --norsrc --keepParent "$STAGE" "$ARCHIVE"
SHA256="$(shasum -a 256 "$ARCHIVE" | awk '{print $1}')"
printf 'archive=%s\nsha256=%s\nversion=%s\n' "$ARCHIVE" "$SHA256" "$VERSION"
