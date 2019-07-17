A dex-poc Dapp deployment consist of a combination of the following few components:


Browser

Metamask browser extension
Dex UI

Web3 client to Ethereum node URL

Account addresses from node


Web3 client to Metamask


1 account address from Metamask







Dex UI server

Per-user environments

Local @ file://... (possible in theory)
Local @ http://localhost:3000/ (via browser-sync as started by overmind)
Keybase KBFS @ https://.keybase.io/dex-poc


Per-organization environments

WTX AWS S3 @ https://...

CloudFront for HTTPS

Setup Certificate Manager; needs some email confirmations, so requires some MX setup
Might require the limited WFLGroup.org CloudFlare DNS to delegate a subdomain to AWS


CloudFlare for HTTPS


Now @ https://<...>.now.sh

Supports custom domains. [Price]](https://zeit.co/pricing): 15 USD/mo


Ethereum node

Locally ran http://localhost:8900


1 specific Ethereum network
Multiple account private keys

Multiple unlocked contract addresses




Shared across company, eg.
https://rinkeby.enuma.io,
ws://rinkeby.enuma.io:8546,
http://geth.enuma.io:8545


1 specific Ethereum network
Multiple account private keys

Multiple unlocked contract addresses




Third-party


Infura https://
Metamask





Ethereum blockchain

Contracts

0x exchange
0x exchange proxy
WETH token
WTX token


Demo account

balances

ETH
WETH
WTX


EIP20 allowances for the exchange proxy contract





One challenge is to convince web3 to use specific private keys for
signing transactions, because the accounts corresponding to those
private keys must have sufficient ether/token balances and allowances.
Another challenge is the Mixed content errors thrown by browsers,
caused by trying to connect from a https web app to a plain http
web3 RPC node.

Local development

Rinkeby
Deployment and demo scenario setup requires using specific accounts
which known to have ether balance on the Rinkeby test network.
Currently the code relies on the blockchain node signing transactions,
so we need a local blockchain node connecting to Rinkeby.
To save disk space we should sync a light node which will take up "only"
less than 1GB (as of 2019-02-03).
Running the following script will fire up such a node, which will

listen for RPC commands over HTTP port 8420 & WS port 8421 & DEVP2P 30420
use the same set of keys from the keystore directory as the geth --dev chain
saves the chain data under $HOME/rinkeby-light/


bin/geth.sh rinkeby light 3
0x requires 2 different tokens to be swapped, so for experimental purposes
we can deploy a demo WTX & SWIMUSD token, which is implemented as a DSToken contract.
bin/deploy-rinkeby-demo-tokens.js
The address and JSON interface of the contract can be found under
net/4/wtx.json & net/4/swimusd.json.
