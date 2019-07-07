#!/usr/bin/env node

const solc = require('../solc')
console.log(JSON.stringify(solc.planFromSources(process.argv.slice(2)), null, 4))
