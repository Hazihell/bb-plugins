#!/bin/sh
set -eu

bb_touchbar_config_dir=${BB_TOUCHBAR_CONFIG_DIR:-"$HOME/Library/Application Support/BBTouchBar"}
bb_touchbar_bin=${BB_TOUCHBAR_BB_BIN:-}

if [ -z "$bb_touchbar_bin" ] && [ -r "$bb_touchbar_config_dir/bb-path" ]; then
  IFS= read -r bb_touchbar_bin < "$bb_touchbar_config_dir/bb-path"
fi

if [ -z "$bb_touchbar_bin" ] || [ ! -x "$bb_touchbar_bin" ]; then
  printf '%s\n' 'BB offline'
  exit 1
fi

exec "$bb_touchbar_bin" touchbar "$@"
