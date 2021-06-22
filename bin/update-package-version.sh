#!/bin/bash

# название подпакета => @alfalab/icons-website => website = package_name
package_name=$(echo $1 | awk -F- '{print $2}')

PACKAGE_CHANGED=$(lerna changed | grep "$package_name")

LATEST_TAG=$(git describe --tags --abbrev=0)
DELETED_ICONS=$(git diff --name-only $LATEST_TAG HEAD --diff-filter=D | grep "$package_name/")

if [ -z "$PACKAGE_CHANGED" ]
then
    # Если не было изменений в пакете, то ничего не делаем
else
    if [ -z "$DELETED_ICONS" ]
    then
        npm version minor
    else
        npm version major
    fi

    git add .
    git commit --amend -m "feat(*): add new icons"
fi
