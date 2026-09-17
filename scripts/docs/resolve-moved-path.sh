#!/usr/bin/env bash
# Usage: resolve-moved-path.sh <path>
# Prints "EXISTS <path>" if it's still there, "MOVED <old> -> <new>" if git rename
# history resolves it (up to 3 hops), or "NOT_FOUND <path>" otherwise (fall back to
# `graphify query "<basename>"` in that case).
set -euo pipefail

path="$1"

if [ -e "$path" ]; then
  echo "EXISTS $path"
  exit 0
fi

current="$path"
for _ in 1 2 3; do
  new=$(git log --all --diff-filter=R --name-status --format= -- "$current" 2>/dev/null \
    | awk -v old="$current" '$1 ~ /^R/ && $2 == old {print $3; exit}')
  if [ -z "$new" ]; then
    break
  fi
  current="$new"
  if [ -e "$current" ]; then
    echo "MOVED $path -> $current"
    exit 0
  fi
done

echo "NOT_FOUND $path"
exit 1
