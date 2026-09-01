#!/bin/sh
set -eu

if [ "$(uname -s)" != "Darwin" ]; then
  printf '%s\n' 'The BetterTouchTool companion installer must run on macOS.' >&2
  exit 1
fi

touchbar_script_dir=$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)
touchbar_bb_bin=${BB_TOUCHBAR_BB_BIN:-$(command -v bb || true)}

if [ -z "$touchbar_bb_bin" ] || [ ! -x "$touchbar_bb_bin" ]; then
  printf '%s\n' 'Could not find the bb executable. Set BB_TOUCHBAR_BB_BIN and retry.' >&2
  exit 1
fi

touchbar_target_dir="$HOME/Library/Application Support/BBTouchBar"
touchbar_target="$touchbar_target_dir/bb-touchbar"
touchbar_temp="$touchbar_target.tmp"
touchbar_path_file="$touchbar_target_dir/bb-path"
touchbar_path_temp="$touchbar_path_file.tmp"
touchbar_btt_app="/Applications/BetterTouchTool.app"
touchbar_btt_plugins="$HOME/Library/Application Support/BetterTouchTool/Plugins"
touchbar_swift_target="$touchbar_btt_plugins/BBTouchBar.swift"
touchbar_swift_temp="$touchbar_swift_target.tmp"

mkdir -p "$touchbar_target_dir"
cp "$touchbar_script_dir/bb-touchbar.sh" "$touchbar_temp"
printf '%s\n' "$touchbar_bb_bin" > "$touchbar_path_temp"
chmod 700 "$touchbar_temp"
chmod 600 "$touchbar_path_temp"
mv "$touchbar_temp" "$touchbar_target"
mv "$touchbar_path_temp" "$touchbar_path_file"

printf 'Installed the BB wrapper at %s\n' "$touchbar_target"
if [ ! -d "$touchbar_btt_app" ]; then
  printf '%s\n' 'BetterTouchTool is not installed at /Applications/BetterTouchTool.app.' >&2
  printf '%s\n' 'Install it, then rerun this installer.' >&2
  exit 1
fi

mkdir -p "$touchbar_btt_plugins"
cp "$touchbar_script_dir/BBTouchBar.swift" "$touchbar_swift_temp"
chmod 600 "$touchbar_swift_temp"
mv "$touchbar_swift_temp" "$touchbar_swift_target"

printf 'Installed the native BB card renderer at %s\n' "$touchbar_swift_target"
printf '%s\n' 'Opening BetterTouchTool. Approve Compile & Load when prompted.'
open "$touchbar_btt_app"

if [ "${1:-}" = "--preset" ]; then
  printf '%s\n' 'Opening the text-only fallback preset.'
  open -a "$touchbar_btt_app" "$touchbar_script_dir/BB-Agent-Monitor.bttpreset"
else
  printf '%s\n' 'In All Apps → Touch Bar, add one BB Agent Monitor plugin widget.'
  printf '%s\n' 'Disable the old BB Agent Monitor preset to remove its four text widgets.'
fi
