#!/usr/bin/env node.sh
import { NodejsContractLoader as ContractLoader } from '../src/NodejsContractLoader'

import * as Order from '../src/dex/Order'
import * as Dex from '../src/Dex.js'
import Storage from 'dom-storage'

function usage () {
  console.log()
  console.log('Usage:')
  console.log('    bin/order-bot.js <chain URL>')
}

function start (chainUrl) {
  const mmProvider = null
  const storage = new Storage(null, { strict: true })
  let dex = new Dex.System({
    chainUrl,
    mmProvider,
    storage,
    ContractLoader: ContractLoader
  })
  return dex.start()
}

function randomAmount () {
  return (Math.random() * 0.01 + 0.0001).toString().substring(0, 7)
}

async function postOrder (dex) {
  const amountOAX = randomAmount()
  const amountWETH = randomAmount()
  const { WETH, OAX } = dex.tokens
  const order = Order.create({
    address: dex.accounts.BOB,
    orderType: 'sell',
    buy: { amount: amountWETH, token: WETH },
    sell: { amount: amountOAX, token: OAX }
  })
  console.log('posting', 'buy', amountWETH, 'WETH sell', amountOAX, 'OAX')
  return Dex.placeOrder(dex, order)
}

async function postRandomOrders (dex) {
  await postOrder(dex)
  await postOrder(dex)
  await postOrder(dex)
  setInterval(() => postOrder(dex), 30 * 1000)
}

function parseArgs (argv) {
  const chainUrl = argv[1]

  if (!chainUrl) {
    usage()
    process.exit(1)
  }

  if (!chainUrl.match(/^http/)) {
    console.error(`Chain URL "${chainUrl}" must start with "http".`)
    usage()
    process.exit(1)
  }
  return chainUrl
}

const log = console.log

async function main () {
  const parsedArgs = parseArgs(process.argv.slice(1))
  log('Starting dex...')
  const dex = await start(parsedArgs)

  log('Creating orders...')
  await postRandomOrders(dex)
}

main().then(log)
