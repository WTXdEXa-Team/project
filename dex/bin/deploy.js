#!/usr/bin/env node.sh
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { address, wad2D, balance, waitForConnection } from 'chain-dsl/es6'
import Deployer from '../src/deployer'
import * as Demo from '../src/dex/Demo'

// Can't receive `process.env.DEBUG` via `env DEBUG=1 bin/deploy.js`
// so we have to manually toggle debug mode:
//
// console.debug = console.log.bind(console)

function usage () {
  console.log()
  console.log('Usage:')
  console.log('    bin/deploy.js <chain URL> <network/chain ID>')
}

function args (argv) {
  const [chainUrl, expectedNetworkIdStr] = argv
  let expectedNetworkId

  if (!chainUrl) {
    usage()
    process.exit(1)
  }

  if (!chainUrl.match(/^http/)) {
    console.error(`Chain URL "${chainUrl}" must start with "http".`)
    usage()
    process.exit(1)
  }

  try {
    expectedNetworkId = parseInt(expectedNetworkIdStr)
  } catch (e) {
    console.error(
      `Error converting "${expectedNetworkIdStr}" into a number.`,
      e.message)
    usage()
    process.exit(1)
  }

  return [chainUrl, expectedNetworkId]
}

const [chainUrl, expectedNetworkId] = args(process.argv.slice(2))
const netDir = path.join(__dirname, '..', 'net', expectedNetworkId.toString())
const compiledContractsJsonFile = path.join(__dirname, '../out/contracts.json')

const log = console.log
const log1 = (singleArgument) => log(singleArgument)
const hr = (txt) => txt.replace(/./g, '=')
const h1 = (txt) => log(['', txt, hr(txt)].join('\n'))
const h2 = (...args) => log('====', ...args)

// Pretty-print BigNumber & BN instances concisely
const PRECISION = 7

BigNumber.prototype.inspect = function () {
  return '~ D`' + this.toPrecision(PRECISION) + '`'
}

BN.prototype.inspect = function bnInspect () {
  const shortBN = D(this).div(D`1e18`).toPrecision(PRECISION)
  return `~ ${shortBN} wad`
}

function saveContractInterfaceAs (contractName, contract) {
  const interfaceFile = `${netDir}/${contractName}.json`
  fs.writeFileSync(interfaceFile, JSON.stringify(contract.options, null, 4),
    'utf-8')
  log(`${address(
    contract)} - ${contractName} (${contract.options.name}) address - ${interfaceFile}`)
}

async function saveContracts (contracts) {
  Object.keys(contracts)
    .forEach((contractName) => saveContractInterfaceAs(contractName,
      contracts[contractName]))
}

const accountInfo = async (idx, owner, web3, weth, oax, swimusd) => {
  const ETH = wad2D(await balance(web3, owner))
  const WETH = wad2D(await balance(weth, owner))
  const OAX = wad2D(await balance(oax, owner))
  const SWIMUSD = wad2D(await balance(swimusd, owner))
  return [
    `(${idx}) ${owner}`,
    `${ETH.inspect()} ETH`,
    `${WETH.inspect()} WETH`,
    `${OAX.inspect()} OAX`,
    `${SWIMUSD.inspect()} SWIMUSD`
  ].join(' | ')
}

const logAccounts = async (addresses, web3, {weth, oax, swimusd}) => {
  const balances = await Promise.all(
    addresses.map((addr, idx) => accountInfo(idx, addr, web3, weth, oax, swimusd)))
  balances.forEach(log1)
}

async function deploy (chainUrl, expectedNetworkId) {
  h2(`connecting to ${chainUrl}`)
  const web3 = new Web3(chainUrl)
  await waitForConnection(web3)
  h2(`Connected to ${chainUrl}`)

  const networkId = await web3.eth.net.getId()
  if (networkId !== expectedNetworkId) {
    throw Error(
      `Wrong network ID "${networkId}. Expected network "${expectedNetworkId}"`)
  }

  h2('Determining deployer account')
  const [DEPLOYER, ALICE, BOB] = await web3.eth.getAccounts()

  h2('Deploying contract system')
  const deployedContracts = await Deployer.all(web3,
    compiledContractsJsonFile, DEPLOYER)

  h2('Funding maker and taker with ETH, WETH & OAX and approve proxy to spend them...')
  const {contracts} = await Demo.ensure(web3, deployedContracts,
    {DEPLOYER, ALICE, BOB})

  h1('Saving deployed contract interfaces')
  await saveContracts(contracts)

  h1('Available Accounts')
  await logAccounts([DEPLOYER, ALICE, BOB], web3, deployedContracts)

  h2('Deployment done')
  fs.writeFileSync(path.join(__dirname, '..', 'test',
    `deployed-to-${expectedNetworkId}.js`),
  `// Notify mocha watcher at ${(new Date()).toLocaleString()}`, 'utf-8')
}

process.on('uncaughtException', (err) => {
  console.error(err.stack)
  process.exit(1)
})

mkdirp.sync(netDir)

log('Deploying...')
deploy(chainUrl, expectedNetworkId).catch((err) => console.error(err))
