import { parseTags, evalTemplate } from "./docx"
const omnis_calls = await globalThis.loadModule("omnis_calls")

function greet() {
    return { answer: "Hello, omnis-typescript!" }
}

async function parse_tags(param: any) {
    const tags = await parseTags(param["templatePath"])
    console.log("tags:", tags)
    return { tags: tags }
}

async function eval_template(param: any, response: any) {
    console.log(param, response)
    await evalTemplate(param["templatePath"], param["outputPath"], param["jsonData"])
    return {
        outputPath: param["outputPath"],
    }
}

type MethodMap = { [name: string]: (param: any, response: any) => {} | boolean }
const methodMap: MethodMap = {
    greet,
    parse_tags,
    eval_template,
    test_async: async function (param: any, response: any) {
        console.log(param, response)
        omnis_calls.sendResponse(
            {
                unicode: "AAA",
            },
            response
        )
        return true
    },
}

// omnis_calls.omnisModuleDefaultExport returns an object suitable for your default export.
// You must pass it your methodMap object.
export default omnis_calls.omnisModuleDefaultExport(methodMap)
