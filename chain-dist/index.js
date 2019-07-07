const Web3 = require('web3')
const abi = require('web3-eth-abi')
const {fromWei, toWei, padLeft} = require('web3-utils')
const BigNumber = require('bignumber.js')

require = require("esm")(module)

const {
    now, sleep, ZERO_ADDR, ANY, address, D, D2wad, wad2D,
    sigCoords, distillEvent, txEvents,
    waitForConnection, unlockAccount, createUnlockedAccount,
    send, callAs, call, create, legacyCreate, web3Contract,
    balance, transfer, approve, allowance,
    sendNoReceipt, waitForReceipt, decodeLogs,
} = require('./es6')

global.Web3 = Web3
global.BigNumber = BigNumber
global.BN = Web3.utils.BN
global.toBN = Web3.utils.toBN
global.D = D

// Provide a more human readable representation of BigNumbers and BNs
// when they are logged via `console.log`.
BigNumber.prototype.inspect = function () {
    return "D`" + this.toString() + "`"
}

BN.prototype.inspect = function () {
    return "toBN('" + this.toString() + "')"
}

const bytes32 = (address) => padLeft(address, 64) // for ds-guard
const wad = amount => amount
const sig = (methodSig) => abi.encodeFunctionSignature(methodSig)

module.exports = {
    Web3,
    BN, toBN, fromWei, toWei, padLeft,
    BigNumber,
    now,
    sleep,
    ZERO_ADDR,
    ANY,
    bytes32,
    address,
    wad,
    D, D2wad, wad2D,
    sigCoords,
    sig,
    distillEvent,
    txEvents,
    waitForConnection,
    unlockAccount,
    createUnlockedAccount,
    send,
    callAs,
    call,
    create,
    legacyCreate,
    web3Contract,
    balance,
    transfer,
    approve,
    allowance,
    sendNoReceipt,
    waitForReceipt,
    decodeLogs,
}
