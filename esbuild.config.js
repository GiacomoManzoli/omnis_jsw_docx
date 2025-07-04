import { build } from "esbuild"
import { copyFileSync, mkdirSync } from "fs"
import { dirname, resolve } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))

const entryFile = resolve(__dirname, "lib/main.ts")
const outDir = resolve(__dirname, "dist/omnis_docx")
const outFile = resolve(outDir, "omnis_docx.mjs")

// 1. Esegui build con esbuild
await build({
    entryPoints: [entryFile],
    outfile: outFile,
    bundle: true,
    format: "esm",
    target: "esnext",
    platform: "node",
    splitting: false, // evita code splitting, un solo file
    minify: false,
})

// 2. Copia file statico (equivalente a vite-plugin-static-copy)
mkdirSync(outDir, { recursive: true })
copyFileSync(resolve(__dirname, "omnis-package/package.json"), resolve(outDir, "package.json"))

const now = new Date().toLocaleString("it-IT")
console.log(`✅ Build eseguita con successo! (${now})`)
