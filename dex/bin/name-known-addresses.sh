#!/usr/bin/env bash

sed -E -e "
s/(0x)+d124b979f746be85706daa1180227e716eafcc5c/DEPLOYER/Ig
s/(0x)+a49aad37c34e92236690b93e291ae5f10daf7cbe/ALICE/Ig
s/(0x)+b357fc3dbd4cdb7cbd96aa0a0bd905dbe56cab77/BOB/Ig
"
