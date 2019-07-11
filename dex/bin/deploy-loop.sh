#!/usr/bin/env bash

usage() {
    echo "$0 [<RPC URL> <network ID>"
    echo ""
    echo " RPC URL:   http://localhost:8900"
    echo " network ID:    8 | 1337"
}

RPC_URL=$1; shift
EXPECTED_NET=$1; shift

if [ -z "$EXPECTED_NET" ]; then
    usage
    exit 1
fi

while true; do
    # To ensure `contracts.json` can be monitored for changes
    # wait for it to be created first successfully by the `solc` process
    if test -f out/contracts.json; then
        find src/deployer.js out/contracts.json bin/deploy.js | \
        entr bin/deploy.js $RPC_URL $EXPECTED_NET
    else
        echo 'Waiting for compiled contracts (out/contracts.json)'
        sleep 0.5
    fi
done
