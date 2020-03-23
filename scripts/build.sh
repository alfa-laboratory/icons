#!/bin/bash

lerna exec --parallel -- rm -rf dist

lerna exec --parallel -- rollup -c ../../rollup.config.js

lerna exec --parallel -- cp package.json dist/package.json

rm -rf dist

mkdir dist

lerna exec --parallel -- $(pwd)/scripts/build-root-package.sh \$LERNA_PACKAGE_NAME

cp package.json dist/package.json
