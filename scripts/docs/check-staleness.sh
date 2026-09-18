#!/usr/bin/env bash
# Usage: check-staleness.sh <source_commit> <path> [path ...]
# Prints CURRENT/STALE/MISSING per path, then a RESULT: CURRENT|STALE summary line.
# Exit 0 if RESULT is CURRENT, 1 if STALE, 2 on a bad source_commit.
set -uo pipefail

source_commit="$1"
shift

if ! git cat-file -e "${source_commit}^{commit}" 2>/dev/null; then
  echo "RESULT: ERROR unknown source_commit $source_commit"
  exit 2
fi

stale=0
for path in "$@"; do
  if [ ! -e "$path" ]; then
    echo "MISSING $path"
    stale=1
    continue
  fi
  if git diff --quiet "$source_commit" HEAD -- "$path" 2>/dev/null; then
    echo "CURRENT $path"
  else
    echo "STALE $path"
    stale=1
  fi
done

if [ "$stale" -eq 1 ]; then
  echo "RESULT: STALE"
  exit 1
else
  echo "RESULT: CURRENT"
  exit 0
fi
