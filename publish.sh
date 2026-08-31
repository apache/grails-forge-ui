#!/bin/bash
set -e

# Replaces the GitHub Pages (start.grails.org) site with a redirect to
# https://grails.apache.org/start/ after the UI has been published to
# apache/grails-website. Keeps the custom domain CNAME and the version feed
# so existing start.grails.org/grails-version-feed.json clients still work.

if [ -z "$GH_TOKEN" ]
then
  echo "You must provide the action with a GitHub Personal Access Token secret in order to deploy."
  exit 1
fi

if [ -z "$GITHUB_SLUG" ]
then
  GITHUB_SLUG="${GITHUB_REPOSITORY}"
fi

if [ -z "$GITHUB_SLUG" ]
then
  echo "You must provide GITHUB_SLUG or GITHUB_REPOSITORY."
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

git clone https://${GH_TOKEN}@github.com/${GITHUB_SLUG}.git -b gh-pages gh-pages --single-branch > /dev/null
cd gh-pages

# Drop the previously published SPA, but keep the custom domain.
find . -mindepth 1 -maxdepth 1 ! -name '.git' ! -name 'CNAME' -exec rm -rf {} +

if [ ! -f CNAME ]; then
  echo 'start.grails.org' > CNAME
fi

cp ../gh-pages-redirect/index.html .
cp ../gh-pages-redirect/404.html .
cp ../app/launch/public/grails-version-feed.json .

git add -A
if git diff --cached --quiet; then
  echo "No changes in Grails Forge UI GitHub Pages redirect"
else
  git commit -m "Redirect start.grails.org to https://grails.apache.org/start/ for Github Actions run:$GITHUB_RUN_ID"
  git push https://oauth2:${GH_TOKEN}@github.com/${GITHUB_SLUG}.git gh-pages
fi
cd ..
rm -rf gh-pages
