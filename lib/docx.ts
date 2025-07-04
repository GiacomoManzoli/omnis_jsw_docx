import { TemplateHandler } from "easy-template-x"
import * as fs from "fs"

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

type Tag = {
    disposition: "Open" | "SelfClosed" | "Close"
    name: string
}

type Field = {
    type: "field"
    name: string
}

type Flag = {
    type: "flag"
    name: string
}

type List = {
    type: "list"
    name: string
    cols: Field[]
}

type StructuredTag = Field | Flag | List

function parseTagsToStructured(tags: Tag[]): StructuredTag[] {
    const result: StructuredTag[] = []
    let i = 0

    while (i < tags.length) {
        const tag = tags[i]

        if (tag.disposition === "Open") {
            const name = tag.name.trim()
            const cols: Field[] = []
            i++

            while (i < tags.length && tags[i].disposition !== "Close") {
                if (tags[i].disposition === "SelfClosed") {
                    cols.push({ type: "field", name: tags[i].name.trim() })
                }
                i++
            }

            if (cols.length === 0) {
                result.push({ type: "flag", name })
            } else {
                result.push({ type: "list", name, cols })
            }

            i++ // salta il tag Close
        } else if (tag.disposition === "SelfClosed") {
            result.push({ type: "field", name: tag.name.trim() })
            i++
        } else {
            // tag.disposition === 'Close' senza Open → ignora
            i++
        }
    }
    return result
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
