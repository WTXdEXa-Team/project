#!/usr/bin/env bash

if [ -z "$1" ]; then
    KEYSTORE_DIR=$(dirname $(realpath "$0"))/../keystore
else
    KEYSTORE_DIR="$1"
fi

MNEMONIC="turn nest wrestle cushion wash anchor judge column convince vault cactus decorate"

DEPLOYER_PK=5DA624C57F00359974EFD324152D6EDAC399786614A78A1B239609B5443CA269
ALICE_PK=200BA53BD08BD60B6FAAC4C9CE6E7F2EE50922C4F6B808BC2D0A6D4045E7903B
BOB_PK=A60A45E8CD5543BECBCCAED309B77D1DB6F4BB1F8AC7403F1D124AE846860A9A

DEPLOYER=D8E5a736d78641F9af4E9128896d3cB23e82bB32
ALICE=a76Ab817a8A07b37DfE33D57cd357C76B88BB970
BOB=2b2BE0526318B8d53E5A9aF88Bce44F7b1CD1FB6

if [ ! -d "$KEYSTORE_DIR" ]; then
  for PK in DEPLOYER_PK ALICE_PK BOB_PK; do
      echo Importing private key: $PK > /dev/stderr
      geth --verbosity 2 \
          account import \
          --keystore "$KEYSTORE_DIR.tmp" \
          --password /dev/null \
          --lightkdf \
          <(echo ${!PK}) \
          >/dev/null
  done
  mv "$KEYSTORE_DIR.tmp" "$KEYSTORE_DIR"
fi
