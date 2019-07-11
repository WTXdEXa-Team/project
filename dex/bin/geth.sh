#!/usr/bin/env bash

usage() {
    echo "$0 [<network> <syncmode> [<verbosity>]]"
    echo ""
    echo "  network:    main (1) | ropsten (3) | rinkeby (4) | dev2 (8) | dev (9)"
    echo "  syncmode:   none (0) | full (1) | fast (2) | light (3)"
    echo "  verbosity:  0 | 1 | 2 | 3 | 4 | 5"
    echo ""
    echo "Example:"
    echo "  $0 rinkeby light 3"
    echo ""
    echo "  tpc://[::]:30430 - DEVP2P"
    echo "  http://xxx.local:8430 - RPC"
    echo "  ws://xxx.local:8431 - RPC"
}

NET=$1; shift
SYNCMODE=$1; shift
VERBOSITY=$1; shift

PRJ="$(dirname $(realpath "$0"))/.."

if [ -z "${NET}" ]; then NET=dev; fi

case $NET in
  main)
    NETWORK_CODE=${NETWORK_CODE:-1}
    OPTS="";;

  ropsten)
    NETWORK_CODE=${NETWORK_CODE:-3}
    OPTS="--testnet";;

  rinkeby)
    NETWORK_CODE=${NETWORK_CODE:-4}
    OPTS="--rinkeby";;

  dev2)
    NETWORK_CODE=${NETWORK_CODE:-8}
    SYNCMODE=none
    # This chain doesn't work with MetaMask because the default chain ID
    # on --dev chains is 1337 and MetaMask doesn't like it to be different from
    # the network ID. However we are picking up our contract addresses based
    # on the network ID, so to avoid confusion the `dev2` chain's network ID
    # is different from the `dev` chain's
    OPTS="--dev --networkid ${NETWORK_CODE}";;

  dev)
    NETWORK_CODE=${NETWORK_CODE:-9}
    SYNCMODE=none
    OPTS="--dev --networkid 1337";;

  *) echo "Invalid network"; usage; exit 1;;
esac

# SYNCMODE_CODE and NETWORK_CODE
# must be 1 digit, because it's used in port number calculation
case $SYNCMODE in
    none) SYNCMODE_CODE=0;;
    full) SYNCMODE_CODE=1;;
    fast) SYNCMODE_CODE=2;;
    light) SYNCMODE_CODE=3;;
    *) echo "Invalid syncmode: $SYNCMODE"; usage; exit 1;;
esac

if [ -n "${VERBOSITY}" ]; then
    OPTS="${OPTS} --verbosity ${VERBOSITY}"
fi

if [ "${SYNCMODE}" = "none" ]; then
    OPTS="${OPTS}
      --datadir ${PRJ}/${NET}-chain/"
else
    OPTS="${OPTS}
      --syncmode ${SYNCMODE}
      --datadir ${HOME}/${NET}-${SYNCMODE}/"
fi

PORT="30${NETWORK_CODE}${SYNCMODE_CODE}0"
HTTP_RPC_PORT="8${NETWORK_CODE}${SYNCMODE_CODE}0"
WS_RPC_PORT="8${NETWORK_CODE}${SYNCMODE_CODE}1"
KEYSTORE=$(dirname $(realpath "$0"))/../keystore

while [ ! -d "$KEYSTORE" ]; do
  echo "Waiting for $KEYSTORE being created..."
  sleep 1
done

ACCOUNTS=$($(dirname "$0")/keys.sh "$KEYSTORE")

RPC_HOST="$(hostname)"

echo "Listening on:"
echo ""
echo "    tpc://[::]:${PORT} - DEVP2P"
echo "    http://${RPC_HOST}:${HTTP_RPC_PORT} - RPC"
echo "    ws://${RPC_HOST}:${WS_RPC_PORT} - RPC"
echo ""

set -x

geth ${OPTS} \
    --port "${PORT}" \
    --keystore "${KEYSTORE}" \
    --unlock "${ACCOUNTS}" \
    --password /dev/null \
    --nousb \
    --ipcdisable \
    --rpc \
    --rpcport "${HTTP_RPC_PORT}" \
    --rpcaddr 0.0.0.0 \
    --rpccorsdomain "*" \
    --rpcvhosts "*" \
    --rpcapi admin,shh,personal,net,eth,web3,txpool \
    --ws \
    --wsport "${WS_RPC_PORT}" \
    --wsaddr 0.0.0.0 \
    --wsorigins "*" \
    --wsapi admin,shh,personal,net,eth,web3,txpool \
    --shh
