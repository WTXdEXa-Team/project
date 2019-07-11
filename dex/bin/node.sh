#!/usr/bin/env bash
BROWSER_ENV="--require esm --require $(realpath $(dirname $0))/../src/index.js"
echo $BROWSER_ENV
exec direnv exec . env NODE_OPTIONS="${NODE_OPTIONS} ${BROWSER_ENV}" node "$@"
