#!/bin/bash

# название подпакета => @alfalab/icons-website => website = package_name
package_name=$(echo $1 | awk -F- '{print $2}')

LATEST_TAG=$(git describe --tags --abbrev=0)
DELETED_ICONS=$(git diff --name-only $LATEST_TAG HEAD --diff-filter=D | grep "$package_name/")

if [ -z "$DELETED_ICONS" ]
then
    lerna version minor --no-push --yes
else
    lerna version major --no-push --yes
fi
