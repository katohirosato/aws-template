#!/bin/sh
# usage: ./startup.sh [repo-name]
set -ue

REPO="${1:-aws-app}"
REPO_DIR="${REPO##*/}"
TEMPLATE_REPO="katohirosato/aws-template"

gh auth status > /dev/null 2>&1 || gh auth login --web --clipboard --git-protocol https
gh repo clone "$TEMPLATE_REPO" "$REPO_DIR" -- --depth 1

cd "$REPO_DIR"
rm -rf .git
git init -b main
rm .github/workflows/template.yaml
rm devcontainer-template.json
rm history.sh
rm startup.sh
git add .
git commit -m "Initialize repository from template"
gh repo create "$REPO" --private --source=. --remote=origin --push
