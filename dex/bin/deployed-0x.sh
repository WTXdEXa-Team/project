#!/usr/bin/env bash

ZRX_DIR=~/gitlab.com/oax/sandbox/0x-lab/node_modules/0x.js/lib/src/artifacts/

convert(){ jq '{address: .networks."4".address, name: .contract_name, jsonInterface: .abi}'; }

#ls $ZRX_DIR

OUT=$(dirname "$0")/../net/4
cat "$ZRX_DIR"/Exchange.json | convert > "$OUT"/xchg.json
cat "$ZRX_DIR"/TokenTransferProxy.json | convert > "$OUT"/proxy.json
cat "$ZRX_DIR"/EtherToken.json | convert > "$OUT"/weth.json
# `$OUT/oax.json` should be generated with `bin/deploy-rinkeby-demo-tokens.js`
