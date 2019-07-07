#!/usr/bin/env bash
BROWSER_ENV="--require esm"
exec direnv exec . env NODE_OPTIONS="${NODE_OPTIONS} ${BROWSER_ENV}" node "$@"
