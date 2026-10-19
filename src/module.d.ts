declare module "~/lib/ocgcore.jspi.mjs" {
  const Module: EmscriptenModuleFactory;
  export default Module;
}

declare module "~/lib/ocgcore.jspi.wasm" {
  const wasm: Uint8Array<ArrayBuffer>;
  export default wasm;
}

declare module "~/lib/ocgcore.sync.mjs" {
  const Module: EmscriptenModuleFactory;
  export default Module;
}

declare module "~/lib/ocgcore.sync.wasm" {
  const wasm: Uint8Array<ArrayBuffer>;
  export default wasm;
}
