#!/usr/bin/env bash
set -euo pipefail

# OpenHands commit hard-block (immutable policy)
# Default: deny all commits.
# To allow (explicit Founder override): export OH_ALLOW_COMMIT=1

if [[ "\" == "1" ]]; then
  echo "[OpenHands] Commit allowed via OH_ALLOW_COMMIT=1 ✅"
  exit 0
fi

echo ""
echo "[OpenHands] COMMIT BLOCKED ❌"
echo "Reason: Founder-only final defense. OpenHands must NEVER auto-commit."
echo "If you really want to allow a commit for a specific run: set OH_ALLOW_COMMIT=1"
echo ""
exit 1