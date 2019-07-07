import fs from "fs"

function read(filename) {
    return fs.readFileSync(filename, 'utf-8')
}

/* Load a JSON file without caching and
 * preview the file if it's not a valid JSON
 * */
export function load(jsonFile) {
    let json = null
    try {
        json = read(jsonFile)
        return JSON.parse(json)
    } catch (e) {
        if (e instanceof SyntaxError) {
            throw SyntaxError([
                e.message,
                `Can not parse ${jsonFile} as JSON:`,
                `${json.slice(0, 30)}...`
            ].join('\n'))
        } else throw e
    }
}
