#!/bin/bash

git fetch --prune --unshallow
git fetch --tags

npm set registry https://registry.npmjs.org

yarn install
yarn add --dev alfa-ui-primitives@latest
yarn generate

git config --local user.email "ds@alfabank.ru"
git config --local user.name "alfa-bot"
git add .
git commit -m "feat(*): add new icons"

changed_packages=`lerna changed`;

lerna version minor --no-push --yes

## build subpackages

lerna exec --parallel -- rm -rf dist

lerna exec --parallel -- rollup -c ../../rollup.config.js

lerna exec --parallel -- cp package.json dist/package.json

rm -rf dist

mkdir dist

lerna exec --parallel -- $(pwd)/bin/build-root-package.sh \$LERNA_PACKAGE_NAME

cp package.json dist/package.json

## build root

yarn generate-json

if [ -z "$changed_packages" ]
then
    echo "No new icons added"
else
    echo "Publish root package"
    npm version minor --git-tag-version false
    cp package.json dist/package.json
    # npm publish dist    
fi

# lerna publish from-git --contents dist --yes
