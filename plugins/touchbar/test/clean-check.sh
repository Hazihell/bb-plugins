#!/bin/sh
set -eu

touchbar_clean_base=${BB_THREAD_STORAGE:-${TMPDIR:-/tmp}}
touchbar_clean=$(mktemp -d "$touchbar_clean_base/touchbar-clean.XXXXXX")
cleanup() {
  find "$touchbar_clean" -depth -delete
}
trap cleanup EXIT HUP INT TERM

tar --exclude=.git --exclude=node_modules --exclude=dist -cf - . |
  tar -xf - -C "$touchbar_clean"

cd "$touchbar_clean"
npm ci --ignore-scripts >/dev/null
npm run check --workspace bb-plugin-touchbar
