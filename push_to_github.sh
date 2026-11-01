#!/bin/bash
# Push to GitHub helper script

set -e

if [ -z "$1" ]; then
  echo "Usage: ./push_to_github.sh <GITHUB_REPO_URL>"
  echo "Example: ./push_to_github.sh https://github.com/YOUR_USERNAME/YOUR_REPO.git"
  echo "Or with token: ./push_to_github.sh https://YOUR_TOKEN@github.com/YOUR_USERNAME/YOUR_REPO.git"
  exit 1
fi

REPO_URL="$1"

# Check if origin already exists
if git remote | grep -q 'origin'; then
  git remote set-url origin "$REPO_URL"
else
  git remote add origin "$REPO_URL"
fi

git branch -M main
echo "Pushing branch 'main' to $REPO_URL..."
git push -u origin main

echo "✓ Successfully pushed to GitHub!"
