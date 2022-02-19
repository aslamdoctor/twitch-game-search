#!/usr/bin/env sh

set -e

npm run build

cd dist

git init 
git add -A
git commit -m 'New Deployment'
git push -f https://github.com/aslamdoctor/twitch-game-search master:gh-pages

cd -