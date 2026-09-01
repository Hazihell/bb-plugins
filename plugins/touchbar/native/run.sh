#!/usr/bin/env bash
set -euo pipefail

APP="${BB_TOUCHBAR_APP:-$HOME/Applications/BBTouchBar.app}"
BIN="$APP/Contents/MacOS/BBTouchBar"
READY="$HOME/Library/Application Support/BBTouchBar/BBTouchBar.ready"

running_pids() {
  local pid command
  while read -r pid command; do
    if [ "$command" = "$BIN" ]; then printf '%s\n' "$pid"; fi
  done < <(ps -axo pid=,command=)
}

running() { [ -n "$(running_pids)" ]; }

ready() {
  local pid
  [ -r "$READY" ] || return 1
  IFS= read -r pid < "$READY"
  [ -n "$pid" ] && running_pids | grep -Fxq "$pid"
}

wait_ready() {
  local attempt
  for attempt in {1..50}; do ready && return 0; sleep 0.1; done
  printf '%s\n' 'error: BBTouchBar.app did not become ready' >&2
  return 1
}

signal_app() {
  local signal_name="$1" pid
  while IFS= read -r pid; do [ -n "$pid" ] && kill "-$signal_name" "$pid"; done < <(running_pids)
}

start() {
  [ -x "$BIN" ] || { printf 'error: missing %s\n' "$BIN" >&2; exit 1; }
  if ! running; then
    rm -f "$READY"
    open -g "$APP"
  fi
  wait_ready
}

stop() {
  if running; then
    signal_app USR2
    sleep 0.2
    signal_app TERM
    for _ in {1..30}; do running || break; sleep 0.1; done
    if running; then
      printf '%s\n' 'warning: escalating to KILL after modal teardown' >&2
      signal_app KILL
    fi
  fi
  rm -f "$READY"
}

case "${1:-status}" in
  start) start ;;
  restart) stop; start ;;
  stop) stop ;;
  open) start; signal_app USR1 ;;
  close) running && signal_app USR2 || true ;;
  status)
    if running; then printf 'running (pid %s)\n' "$(running_pids | paste -sd ' ' -)"; else printf '%s\n' 'not running'; fi
    ;;
  *) printf '%s\n' 'usage: run.sh start|restart|stop|open|close|status' >&2; exit 2 ;;
esac
