#!/bin/bash

echo "## extract version from package.json"
VERSION=$(npm pkg get version --workspaces=false | tr -d \")
echo "## checkout release branch and grab changes from main"
git checkout release && git merge main --no-commit
echo "## point the README CDN snippets at this version"
# The skills pin a major range and need no bump; the README is the place the
# exact-version advice belongs, and it is the one that kept going stale - 5.0.0
# shipped with six snippets still on 4.28.0.
sed -i '' -E "s|maverick-wave@[0-9]+\.[0-9]+\.[0-9]+|maverick-wave@${VERSION}|g" README.md
echo "## make a new release"
npm run build && npm run prepack
echo "## add all changes and push it"
git add --all
git commit -m "release: ${VERSION}"
git push origin release
echo "## create new tag and push it"
git tag v${VERSION} && git push origin release --tags
echo "## publish to npm"
npm whoami 2>/dev/null || npm login
npm publish --access public
echo "## go back to main branch"
git checkout main
echo "#### script done ####"
