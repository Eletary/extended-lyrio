#!/bin/bash
# scripts/update-changelog.sh

NEW_VERSION=$(node -p "require('./package.json').version")
CURRENT_DATE=$(date +%Y-%m-%d)

sed -i "s/^## \[Unreleased\]/## [$NEW_VERSION] - $CURRENT_DATE/" CHANGELOG.md