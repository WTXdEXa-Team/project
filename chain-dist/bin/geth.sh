#!/usr/bin/env bash
set -x

geth \
    --dev \
    --networkid 60 \
    --verbosity 2 \
    --nousb \
    --ipcdisable \
    --rpc \
    --rpcaddr 0.0.0.0 \
    --rpccorsdomain "*" \
    --rpcapi shh,personal,net,eth,web3 \
    --ws \
    --wsaddr 0.0.0.0 \
    --wsorigins "*" \
    --wsapi shh,personal,net,eth,web3,txpool \
    --shh
