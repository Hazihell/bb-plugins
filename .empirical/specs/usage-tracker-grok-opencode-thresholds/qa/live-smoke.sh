#!/usr/bin/env bash
set -euo pipefail

npm run build --workspace bb-plugin-usage-tracker
bb plugin install --yes ./plugins/usage-tracker
bb plugin reload usage-tracker
