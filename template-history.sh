#!/bin/sh
git init
git branch -M main
git config user.name "Your Name"
git config user.email "your.email@example.com"
git add .
git commit -m "first commit"
gh auth login --web --clipboard --git-protocol https
gh repo create aws-template --public --source=. --remote=origin --push
