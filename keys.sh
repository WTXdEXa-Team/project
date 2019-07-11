#!/usr/bin/env bash

if [ -z "$1" ]; then
    KEYSTORE_DIR=$(dirname $(realpath "$0"))/../keystore
else
    KEYSTORE_DIR="$1"
fi

NUMBER_OF_ACCOUNTS=3

# Print comma separated account list for `geth --unlock ...`
echo $(ls "$KEYSTORE_DIR" | sort | head -n $NUMBER_OF_ACCOUNTS | awk -F '--' '{print $3}') | tr ' ' ,
