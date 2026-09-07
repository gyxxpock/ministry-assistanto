#!/usr/bin/env bash
# .claude/scripts/pr.sh — Push rama actual + crear PR hacia main
# Requiere: git, gh (autenticado), SSH key en agent (UseKeychain yes en ~/.ssh/config)
#
# Uso:
#   pr.sh push                         — empuja la rama actual a origin
#   pr.sh create "<title>" "<body>"    — crea PR hacia main con título y cuerpo dados
#   pr.sh draft  "<title>" "<body>"    — igual pero como draft
#   pr.sh status                       — muestra PR abierto de la rama actual (si existe)
#   pr.sh commits                      — commits en esta rama que no están en main

set -euo pipefail

BRANCH=$(git branch --show-current)
BASE="main"

case "${1:-}" in

  push)
    echo "Pushing $BRANCH → origin..."
    git push origin "$BRANCH"
    echo "✓ Push completado"
    ;;

  create|draft)
    TITLE="${2:-}"
    BODY="${3:-}"
    if [[ -z "$TITLE" ]]; then
      echo "Error: título requerido" >&2
      echo "Uso: pr.sh create \"<título>\" \"<cuerpo>\"" >&2
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
    echo "✓ PR creado: $URL"
    ;;

  status)
    gh pr view --head "$BRANCH" 2>/dev/null || echo "(sin PR abierto para $BRANCH)"
    ;;

  commits)
    echo "Commits en $BRANCH no presentes en $BASE:"
    git log "origin/$BASE".."$BRANCH" --oneline 2>/dev/null || \
      git log "$(git merge-base HEAD "origin/$BASE")..HEAD" --oneline
    ;;

  *)
    echo "Uso: pr.sh <push|create|draft|status|commits>" >&2
    exit 1
    ;;
esac
