#!/bin/bash

echo "## extract version from package.json"
VERSION=$(npm pkg get version --workspaces=false | tr -d \")
echo "## checkout release branch and grab changes from main"
git checkout release && git merge main --no-commit
echo "## make a new release"
npm run build && npm run release
echo "## add all changes and push it"
git add --all
git commit -m "release: ${VERSION}"
git push origin release
echo "## create new tag and push it"
git tag v${VERSION} && git push origin release --tags
echo "## go back to main branch"
git checkout main
echo "#### script done ####"
