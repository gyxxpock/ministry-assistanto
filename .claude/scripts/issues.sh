#!/usr/bin/env bash
# issues.sh — GitHub Issues wrapper for Claude Code sessions
# Usage: issues.sh <command> [args]
#
# Commands:
#   list                          List open issues (number, title, labels)
#   view   <number>               Full issue details (title, body, comments)
#   create <title> <labels> <body>  Create a new issue (labels comma-separated)
#   comment <number> <body>       Add a comment to an issue
#   start   <number>              Mark issue as in-progress (comment)
#   close   <number> <comment>    Close issue with a summary comment
#   help                          Show this help

set -euo pipefail

REPO="gyxxpock/ministry-assistanto"

cmd="${1:-help}"
shift || true

case "$cmd" in

  list)
    echo "=== OPEN ISSUES ==="
    gh issue list \
      --repo "$REPO" \
      --state open \
      --json number,title,labels,createdAt \
      --limit 30 \
      --jq '.[] | "[\(.number)] \(.title)  [\(.labels | map(.name) | join(", "))]"'
    ;;

  view)
    number="${1:?'Usage: issues.sh view <number>'}"
    echo "=== ISSUE #$number ==="
    gh issue view "$number" --repo "$REPO" --json number,title,body,labels,state,comments \
      --jq '"Title : \(.title)\nState : \(.state)\nLabels: \(.labels | map(.name) | join(", "))\n\nBody\n----\n\(.body)\n\nComments (\(.comments | length))\n--------\n\(.comments | map("@\(.author.login): \(.body)") | join("\n\n"))"'
    ;;

  create)
    title="${1:?'Usage: issues.sh create <title> <labels> <body>'}"
    labels="${2:?'Provide comma-separated labels, e.g. bug,ios'}"
    body="${3:?'Provide issue body'}"
    echo "=== CREATING ISSUE ==="
    gh issue create \
      --repo "$REPO" \
      --title "$title" \
      --label "$labels" \
      --body "$body"
    ;;

  comment)
    number="${1:?'Usage: issues.sh comment <number> <body>'}"
    body="${2:?'Provide comment body'}"
    gh issue comment "$number" --repo "$REPO" --body "$body"
    echo "Comment added to #$number"
    ;;

  start)
    number="${1:?'Usage: issues.sh start <number>'}"
    gh issue comment "$number" --repo "$REPO" \
      --body "🚧 **In progress** — Claude Code started working on this issue."
    echo "Issue #$number marked as in progress"
    ;;

  close)
    number="${1:?'Usage: issues.sh close <number> <comment>'}"
    comment="${2:-Implemented and verified with successful build.}"

    # Include coverage report if summary exists
    COVERAGE_REPORT=""
    if [ -f "coverage/coverage-summary.json" ]; then
      COVERAGE_REPORT=$(.claude/scripts/check-coverage.sh --report-only 2>/dev/null || true)
    fi

    FULL_BODY="✅ **Completado** — $comment"
    if [ -n "$COVERAGE_REPORT" ]; then
      FULL_BODY="$FULL_BODY

---
$COVERAGE_REPORT"
    fi

    gh issue comment "$number" --repo "$REPO" --body "$FULL_BODY"
    gh issue close "$number" --repo "$REPO"
    echo "Issue #$number closed"
    ;;

  help|*)
    echo "Usage: issues.sh <command> [args]"
    echo ""
    echo "  list                          List open issues"
    echo "  view   <number>               Full issue details"
    echo "  create <title> <labels> <body>  Create a new issue"
    echo "  comment <number> <body>       Add a comment"
    echo "  start   <number>              Mark as in progress"
    echo "  close   <number> <comment>    Close with summary"
    ;;

esac
