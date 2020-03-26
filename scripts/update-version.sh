#!/bin/bash

yarn version --patch --no-commit-hooks --no-git-tag-version
version=$(grep '"version"' package.json | cut -d '"' -f 4)
echo $version
yarn publish dist --new-version $version
