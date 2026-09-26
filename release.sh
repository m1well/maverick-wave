#!/bin/bash

if [ -n "$(git status --porcelain)" ]; then
  echo "## working tree not clean - commit to main first, nothing released"
  exit 1
fi
echo "## checkout release branch and take main as it is"
# Release only adds the README pin and the bundles, both rebuilt below - so main
# wins every file, and a release never stops on a merge conflict
git checkout release || exit 1
git merge main --no-commit -s ours
git read-tree -u --reset main
echo "## extract version from package.json"
VERSION=$(npm pkg get version --workspaces=false | tr -d \")
echo "## point the README CDN snippets at this version"
# The skills pin a major range and need no bump; the README is the place the
# exact-version advice belongs, and it is the one that kept going stale - 5.0.0
# shipped with six snippets still on 4.28.0.
sed -i '' -E "s|maverick-wave@[0-9]+\.[0-9]+\.[0-9]+|maverick-wave@${VERSION}|g" README.md
echo "## make a new release"
npm run build && npm run prepack
echo "## verify the release state - bundles and CDN pin, which only exist here"
if ! npm run verify:release; then
  echo "## verify failed - nothing pushed, nothing published"
  git checkout main
  exit 1
fi
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
