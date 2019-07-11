#!/usr/bin/env bash

if [ -z $1 ]; then
    echo "ERROR: Missing username as first argument"
    exit 1
fi

if [ ! -d "/keybase/public/${1}/" ]; then
    echo "ERROR: Public folder for user '${1}' not found"
    exit 1
fi

DEPLOY_PATH="/keybase/public/${1}/dex-poc"

sync() {
    mkdir -p $(dirname "$2")
    rsync --copy-links --archive "$1" "$2"
}

echo "Deploying to ${DEPLOY_PATH}"
sync src/ "${DEPLOY_PATH}/"

