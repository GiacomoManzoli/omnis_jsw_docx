export type Tag = {
    disposition: "Open" | "SelfClosed" | "Close"
    name: string
}

export type Field = {
    type: "field"
    name: string
}

export type Flag = {
    type: "flag"
    name: string
}

export type List = {
    type: "list"
    name: string
    cols: Field[]
}

export type StructuredTag = Field | Flag | List

export function parseTagsToStructured(tags: Tag[]): StructuredTag[] {
    const result: StructuredTag[] = []
    const seenNames = new Set<string>()
    let i = 0

    while (i < tags.length) {
        const tag = tags[i]

        if (tag.disposition === "Open") {
            const name = tag.name.trim()

            if (seenNames.has(name)) {
                // Skip duplicated top-level tag
                i++
                while (i < tags.length && tags[i].disposition !== "Close") {
                    i++
                }
                i++ // skip Close
                continue
            }

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

            seenNames.add(name)
            i++ // skip Close
        } else if (tag.disposition === "SelfClosed") {
            const name = tag.name.trim()

            if (!seenNames.has(name)) {
                result.push({ type: "field", name })
                seenNames.add(name)
            }

            i++
        } else {
            // Close senza apertura → ignora
            i++
        }
    }

    return result
}
