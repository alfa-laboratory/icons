#!/bin/bash

changed_packages=`lerna changed`;

if [ -z "$changed_packages" ]
then
    echo "No new icons added"
else
    echo "Publish root package"
    npm version minor --git-tag-version false
    cp package.json dist/package.json
    npm publish dist    
fi
