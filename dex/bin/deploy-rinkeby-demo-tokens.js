#!/usr/bin/env node.sh
import fs from 'fs'
import path from 'path'
import mkdirp from 'mkdirp'
import { Web3, waitForConnection, address, create } from 'chain-dsl'

import { load } from 'chain-dsl/json'
import solc from 'chain-dsl/solc'

// const networkId = 1337
const networkId = 4
const netDir = `./net/${networkId}`
let chainUrl
const compiledContractsJsonFile = path.join(__dirname, '../out/contracts.json')

const log = console.log
const log1 = (singleArgument) => log(singleArgument) // eslint-disable-line no-unused-vars
const hr = (txt) => txt.replace(/./g, '=')
const h1 = (txt) => log(['', txt, hr(txt)].join('\n'))
const h2 = (...args) => log('====', ...args)

switch (networkId) {
  case 4: // Port 8430 is served by `bin/geth.sh rinkeby light`
    chainUrl = 'http://localhost:8430'
    break
  case 1337:
    chainUrl = devChainUrl
    break
  default:
    console.error(`Unexpected network ID: ${networkId}`)
    process.exit(1)
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

async function deployOAX () {
  h2(`Connecting to ${chainUrl}...`)
  const web3 = new Web3(chainUrl)
  await waitForConnection(web3)
  h2(`Connected`)

  const {DemoOAX, DemoSWIMUSD} = solc.flattenJsonOutput(load(compiledContractsJsonFile))
  const [DEPLOYER] = await web3.eth.getAccounts()

  h2('Deploying contract...')
  const deploy = (contract, ...args) => create(web3, DEPLOYER, contract, ...args)

  // FIXME Copied from `depolyer.js` manually, so the logic can diverge
  const oax = await deploy(DemoOAX)
  const swimusd = await deploy(DemoSWIMUSD)

  h1('Saving deployed contract interfaces')
  await saveContracts({oax, swimusd})

  h2('Deployment done\n')
}

process.on('uncaughtException', (err) => {
  console.error(err.stack)
  process.exit(1)
})

mkdirp.sync(netDir)
deployOAX().catch((err) => console.error(err))
