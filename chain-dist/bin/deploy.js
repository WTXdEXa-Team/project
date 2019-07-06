#!/usr/bin/env node.sh
import fs from "fs"
import path from "path"
import mkdirp from "mkdirp"
import {address, waitForConnection, Web3} from "../index"
import Deployer from "../test/deployer"

const networkId = 60
const netDir = `./net/${networkId}`
const compiledContractsJsonFile = path.join(__dirname, '../out/contracts.json')

function saveContractInterfaceAs(contractName, contract) {
    const interfaceFile = `${netDir}/${contractName}.json`
    fs.writeFileSync(interfaceFile, JSON.stringify(contract.options, null, 4), 'utf-8')
    console.log(`${address(contract)} — ${contractName} (${contract.options.name}) address`)
}

async function save(contracts) {
    Object.keys(contracts).forEach((contractName) => saveContractInterfaceAs(contractName, contracts[contractName]))
}

async function deploy() {
    const web3 = new Web3('http://localhost:8545')
    await waitForConnection(web3)
    const [DEPLOYER] = await web3.eth.getAccounts()
    const deployedContracts = await Deployer.all(web3, compiledContractsJsonFile, DEPLOYER)
    await deployedContracts.foo.methods.bar().call()
    await save(deployedContracts)
}

process.on('uncaughtException', (err) => {
    console.error(err.stack)
    process.exit(1)
})

console.log('Deploying...')

mkdirp.sync(netDir)
deploy().catch((err) => console.error(err))
