#!/bin/bash
# scripts/update-changelog.sh

NEW_VERSION="$1"
CURRENT_DATE=$(date +%Y-%m-%d)

if [ -z "$NEW_VERSION" ]; then
  NEW_VERSION=$(node -p "require('./package.json').version")
fi

sed -i "s/^## \[Unreleased\]/## [$NEW_VERSION] - $CURRENT_DATE/" CHANGELOG.md