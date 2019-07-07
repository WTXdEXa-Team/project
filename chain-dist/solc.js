const path = require('path')

const defaultPlan = {
    language: "Solidity",
    settings: {
        remappings: [],
        optimizer: {
            enabled: false,
            runs: 500
        },
        outputSelection: {}
    },
    sources: {}
}

const defaultOutputSelection = [
    "metadata",
    "abi",
    "evm.bytecode",
    "evm.sourceMap"
]

function sourceToOptions(sourceFilename) {
    return {[path.basename(sourceFilename)]: {urls: [sourceFilename]}}
}

function sourceToOutputSelection(sourceFilename) {
    return {
        [path.basename(sourceFilename)]: {
            "*": defaultOutputSelection
        }
    }
}

function planFromSources(sources) {
    const opts = Object.assign({}, defaultPlan)
    Object.assign(opts.sources, ...sources.map(sourceToOptions))
    Object.assign(opts.settings.outputSelection, ...sources.map(sourceToOutputSelection))
    return opts
}

function jsonPlan(sources) {
    return JSON.stringify(planFromSources(sources), null, 4)
}

/*
* Convenience layer on top of solc standard JSON output,
* to allow simpler access to contract JSON interfaces and
* bytecodes compiled from different files and graft
* contract names into the JSON interface for better error reporting
* */
function flattenJsonOutput(solcJsonOutput) {
    // Merge all contracts across all files into one registry
    const contractRegistry = Object.assign({}, ...Object.values(solcJsonOutput.contracts))

    // Preserve contract names in compilation output
    Object.keys(contractRegistry)
        .forEach((name) => contractRegistry[name].contractType = name)

    // Preserve compilation errors
    const {errors} = solcJsonOutput
    if (errors) contractRegistry.errors = errors
    return contractRegistry
}

module.exports = {
    defaultPlan,
    planFromSources,
    jsonPlan,
    flattenJsonOutput
}
