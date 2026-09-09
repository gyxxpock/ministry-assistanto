#!/usr/bin/env bash
# .claude/scripts/pr.sh — Push current branch + create PR toward main
# Requires: git, gh (authenticated), SSH key in agent (UseKeychain yes in ~/.ssh/config)
#
# Usage:
#   pr.sh push                         — push the current branch to origin
#   pr.sh create "<title>" "<body>"    — create PR toward main with given title and body
#   pr.sh draft  "<title>" "<body>"    — same but as a draft
#   pr.sh status                       — show open PR for the current branch (if any)
#   pr.sh commits                      — commits in this branch not present in main

set -euo pipefail

BRANCH=$(git branch --show-current)
BASE="main"

case "${1:-}" in

  push)
    echo "Pushing $BRANCH → origin..."
    git push origin "$BRANCH"
    echo "✓ Push completed"
    ;;

  create|draft)
    TITLE="${2:-}"
    BODY="${3:-}"
    if [[ -z "$TITLE" ]]; then
      echo "Error: title is required" >&2
      echo "Usage: pr.sh create \"<title>\" \"<body>\"" >&2
      exit 1
    fi
    FLAGS=""
    [[ "$1" == "draft" ]] && FLAGS="--draft"
    URL=$(gh pr create \
      --base "$BASE" \
      --head "$BRANCH" \
      --title "$TITLE" \
      --body "$BODY" \
      $FLAGS)
    echo "✓ PR created: $URL"
    ;;

  status)
    gh pr view --head "$BRANCH" 2>/dev/null || echo "(no open PR for $BRANCH)"
    ;;

  commits)
    echo "Commits in $BRANCH not present in $BASE:"
    git log "origin/$BASE".."$BRANCH" --oneline 2>/dev/null || \
      git log "$(git merge-base HEAD "origin/$BASE")..HEAD" --oneline
    ;;

  *)
    echo "Usage: pr.sh <push|create|draft|status|commits>" >&2
    exit 1
    ;;
esac
