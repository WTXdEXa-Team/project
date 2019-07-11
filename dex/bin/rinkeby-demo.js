#!/usr/bin/env node.sh
import mkdirp from 'mkdirp'
import { NodejsContractLoader } from '../src/NodejsContractLoader'
import * as Contracts from '../src/dex/Contracts'
import { Web3, balance, waitForConnection } from 'chain-dsl'
import * as Demo from '../src/dex/Demo'

console.debug = console.log.bind(console)

// const networkId = 1337
const networkId = 4
const netDir = `./net/${networkId}`
let chainUrl

const log = console.log
const log1 = (singleArgument) => log(singleArgument)
const hr = (txt) => txt.replace(/./g, '=')
const h1 = (txt) => log(['', txt, hr(txt)].join('\n')) // eslint-disable-line no-unused-vars
const h2 = (...args) => log('====', ...args)

switch (networkId) {
  case 4: // Port 8430 is opened by the `bin/geth.sh rinkeby light` node
    chainUrl = 'http://localhost:8430'
    break
  case 1337:
    chainUrl = devChainUrl
    break
  default:
    console.error(`Unexpected network ID: ${networkId}`)
    process.exit(1)
}

const accountInfo = async (idx, owner, web3, weth, oax) => {
  const ETH = await balance(web3, owner)
  const WETH = await balance(weth, owner)
  const OAX = await balance(oax, owner)
  return `(${idx}) ${owner} | ${ETH} ETH | ${WETH} WETH | ${OAX} OAX |`
}

const logAccounts = async (addresses, web3, weth, oax) => {
  const balances = await Promise.all(
    addresses.map((addr, idx) => accountInfo(idx, addr, web3, weth, oax)))
  balances.forEach(log1)
}

async function ensureDemo () {
  h2(`Connecting to ${chainUrl}...`)
  const web3 = new Web3(chainUrl)
  await waitForConnection(web3)
  h2(`Connected`)

  const loader = NodejsContractLoader(await web3.eth.net.getId())
  const deployedContracts = await Contracts.load(loader, web3)

  h2('Current account balances')
  const [DEPLOYER, ALICE, BOB] = await web3.eth.getAccounts()
  await logAccounts([DEPLOYER, ALICE, BOB], web3, deployedContracts.weth,
    deployedContracts.oax)

  h2('Funding alice and bob with ETH, WETH & BOB and approve proxy to spend them...')
  await Demo.ensure(web3, deployedContracts, {DEPLOYER, ALICE, BOB})
  await logAccounts([DEPLOYER, ALICE, BOB], web3, deployedContracts.weth,
    deployedContracts.oax)

  h2('Deployment done\n')
}

process.on('uncaughtException', (err) => {
  console.error(err.stack)
  process.exit(1)
})

mkdirp.sync(netDir)
ensureDemo().catch((err) => console.error(err))
