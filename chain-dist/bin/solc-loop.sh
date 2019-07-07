#!/usr/bin/env bash

cd $(dirname $0)/..
SRC=test/

while true; do
    (
        find $SRC -name '*.sol' # Solidity sources
        # monitor this tool's dependencies to help its own development
        ls bin/.solc-colors bin/solc.sh
    ) | \
    entr -d $(dirname $0)/solc.sh $(find $SRC -name '*.sol')
done
