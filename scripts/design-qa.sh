#!/usr/bin/env bash
# Plan 10 §10 token gate: zero raw hex in components/ styling.
set -e
HITS=$(grep -rn --include="*.tsx" -E "#[0-9A-Fa-f]{3,8}\b" components/ || true)
if [ -n "$HITS" ]; then
  echo "Raw hex found in components/ — use tokens:"; echo "$HITS"; exit 1
fi
echo "design-qa: components/ clean (tokens only)"
