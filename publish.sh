#!/bin/bash
set -e

if [ -z "$GH_TOKEN" ]
then
  echo "You must provide the action with a GitHub Personal Access Token secret in order to deploy."
  exit 1
fi

if [ -z "$COMMIT_EMAIL" ]
then
  COMMIT_EMAIL="${GITHUB_ACTOR}@users.noreply.github.com"
fi

if [ -z "$COMMIT_NAME" ]
then
  COMMIT_NAME="${GITHUB_ACTOR}"
fi

git config --global user.email "${COMMIT_EMAIL}"
git config --global user.name "${COMMIT_NAME}"

./gradlew build || EXIT_STATUS=$?

if [[ $EXIT_STATUS -ne 0 ]]; then
    echo "Project Build failed"
    exit $EXIT_STATUS
fi

git clone https://${GH_TOKEN}@github.com/${GITHUB_SLUG}.git -b gh-pages gh-pages --single-branch > /dev/null
cd gh-pages
cp -r ../build/launch/* .
git add -A
if git diff --cached --quiet; then
  echo "No changes in Grails Forge UI"
else
  git commit -m "Updating $GITHUB_SLUG gh-pages branch for Github Actions run:$GITHUB_RUN_ID"
  git push https://oauth2:${GH_TOKEN}@github.com/${GITHUB_SLUG}.git gh-pages
fi
cd ..
rm -rf gh-pages

exit $EXIT_STATUS
