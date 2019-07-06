#!/usr/bin/env bash

while true; do
    # To ensure `contracts.json` can be monitored for changes
    # wait for it to be created first successfully by the `solc` process
    if test -f out/contracts.json; then
        find test/deployer.js out/contracts.json bin/deploy.js | \
        entr bin/deploy.js
    else
        echo 'Waiting for complied contracts (out/contracts.json)'
        sleep 0.5
    fi
done
