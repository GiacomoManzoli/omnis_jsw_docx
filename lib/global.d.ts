// Omnis injects the "omnis_calls" module dynamically on import
declare module "omnis_calls"

// Omnis loads modules using globalThis.loadModule -- we can replicate this in typescript for the build system
declare function loadModule(item: string): any
