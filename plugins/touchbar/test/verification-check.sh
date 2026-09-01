#!/bin/sh
set -eu

npm run check
node plugins/touchbar/test/package-check.mjs
node plugins/touchbar/test/live-smoke.mjs
sh plugins/touchbar/test/clean-check.sh
