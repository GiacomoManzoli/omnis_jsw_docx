# `easy-template-x` for Omnis Studio Javascript Worker

Integration of `easy-template-x` with Omnis Studio using a Javascript Worker

## Usage

### Initialize Node environment

Install all node dependencies to allow for building

```bash
npm install
```

### Build the JS Worker Module

```bash
npm run build
```

### Install the JS Worker Module

1. Locate the `$OMNIS_HOME`, usually in the user directory.
2. Copy the `dist/omnis_docx` into `$OMNIS_HOME/jsworker/omnis_docx`
3. Edit `$OMNIS_HOME/jsworker/omnis_modules.mjs` to add `omnis_docx: await autoLoadModule('omnis_docx')` to the `moduleMap` import array.

Example `omnis_modules.mjs` after edit (note the `omnis_docx` entry)

```javascript
/* $Header$ */
// Contains the Omnis JavaScript worker module map
// Copyright (C) OLS Holdings Ltd 2018

// ...

import { createRequire } from "node:module" // jmg1372
const require = createRequire(import.meta.url) // jmg1372

// Map of modules that can be called
// Each member of the object is a module name that can be used as the module parameter to $callmethod
let moduleMap = {
    test: await autoLoadModule("omnis_test"),
    omnis_docx: await autoLoadModule("omnis_docx"),
    //  another: await autoLoadModule('another') // Use autoLoadModule() to try loading any module format, anywhere on the module search path
}

// caa2100b start
async function autoLoadModule(moduleName) {
    try {
        const imported = await globalThis.loadModule(moduleName) // jmg1372
        return imported.default ? imported.default : imported // jmg1372
    } catch (err) {
        return err
    }
}
// caa2100b end

const omnis_modules = {
    call: async function (module, method, param, response) {
        // jmg1372
        if (!moduleMap[module]) moduleMap[module] = await autoLoadModule(module) // caa2100b // jmg1372
        // caa2100a start
        if (moduleMap[module] instanceof Error)
            throw new Error(`Error importing module ${module}:\n${moduleMap[module].message}`)
        else return moduleMap[module].call(method, param, response)
        // caa2100a end
    },
}

export default omnis_modules
```
