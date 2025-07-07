import { parseTagsToStructured } from "./parseTagsToStructured"

type Tag = {
    disposition: "Open" | "SelfClosed" | "Close"
    name: string
}

describe("parseTagsToStructured", () => {
    test("parsa un field singolo", () => {
        const tags: Tag[] = [{ disposition: "SelfClosed", name: "address" }]

        const result = parseTagsToStructured(tags)

        expect(result).toEqual([{ type: "field", name: "address" }])
    })

    test("parsa una lista con due campi", () => {
        const tags: Tag[] = [
            { disposition: "Open", name: "clients" },
            { disposition: "SelfClosed", name: "name" },
            { disposition: "SelfClosed", name: "phone" },
            { disposition: "Close", name: "" },
        ]

        const result = parseTagsToStructured(tags)

        expect(result).toEqual([
            {
                type: "list",
                name: "clients",
                cols: [
                    { type: "field", name: "name" },
                    { type: "field", name: "phone" },
                ],
            },
        ])
    })

    test("parsa un flag senza contenuto", () => {
        const tags: Tag[] = [
            { disposition: "Open", name: "flagStatus" },
            { disposition: "Close", name: "" },
        ]

        const result = parseTagsToStructured(tags)

        expect(result).toEqual([{ type: "flag", name: "flagStatus" }])
    })

    test("ignora tag duplicati di primo livello", () => {
        const tags: Tag[] = [
            { disposition: "SelfClosed", name: "address" },
            { disposition: "SelfClosed", name: "address" },
            { disposition: "Open", name: "clients" },
            { disposition: "SelfClosed", name: "name" },
            { disposition: "SelfClosed", name: "phone" },
            { disposition: "Close", name: "" },
            { disposition: "Open", name: "clients" },
            { disposition: "SelfClosed", name: "name2" },
            { disposition: "Close", name: "" },
        ]

        const result = parseTagsToStructured(tags)

        expect(result).toEqual([
            { type: "field", name: "address" },
            {
                type: "list",
                name: "clients",
                cols: [
                    { type: "field", name: "name" },
                    { type: "field", name: "phone" },
                ],
            },
        ])
    })

    test("ignora tag Close senza Open", () => {
        const tags: Tag[] = [
            { disposition: "Close", name: "" },
            { disposition: "SelfClosed", name: "x" },
        ]

        const result = parseTagsToStructured(tags)

        expect(result).toEqual([{ type: "field", name: "x" }])
    })
})
