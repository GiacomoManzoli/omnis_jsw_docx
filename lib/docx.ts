import { TemplateHandler } from "easy-template-x"
import * as fs from "fs"
import { parseTagsToStructured } from "./utils/parseTagsToStructured"

export async function evalTemplate(templatePath: string, outputPath: string, data: string) {
    let templateParams = {}
    if (data) {
        try {
            templateParams = JSON.parse(data)
        } catch (e) {
            console.error(e)
        }
    }

    const templateFile = fs.readFileSync(templatePath)
    const handler = new TemplateHandler()

    const doc = await handler.process(templateFile, templateParams)

    try {
        fs.writeFileSync(outputPath, doc)
    } catch (err) {
        console.error(err)
        return ""
    }

    return outputPath
}

export async function parseTags(templatePath: string) {
    try {
        const templateFile = fs.readFileSync(templatePath)
        const handler = new TemplateHandler()
        const tags = await handler.parseTags(templateFile)
        const dataStructure = parseTagsToStructured(tags)
        return dataStructure
    } catch (error) {
        console.error(error)
        return {}
    }
}

// type DataObject = { [key: string]: any }
// function buildStructure(tags: Tag[]): DataObject {
//     const stack: { name: string; obj: DataObject }[] = []
//     let current: DataObject = {}
//     const root = current

//     for (const tag of tags) {
//         const trimmedName = tag.name.trim()

//         if (tag.disposition === "Open") {
//             const newObj: DataObject = {}
//             stack.push({ name: trimmedName, obj: current })
//             current[trimmedName] = newObj
//             current = newObj
//         } else if (tag.disposition === "SelfClosed") {
//             current[trimmedName] = trimmedName
//         } else if (tag.disposition === "Close") {
//             const popped = stack.pop()
//             if (popped) {
//                 current = popped.obj
//             }
//         }
//     }

//     return root
// }
