declare module "~/lib/ocgcore.jspi.mjs" {
  const Module: typeof import("./lib/ocgcore.jspi.mjs").default;
  export default Module;
}

declare module "~/lib/ocgcore.jspi.wasm" {
  const wasm: Uint8Array<ArrayBuffer>;
  export default wasm;
}

declare module "~/lib/ocgcore.sync.mjs" {
  const Module: typeof import("./lib/ocgcore.sync.mjs").default;
  export default Module;
}

declare module "~/lib/ocgcore.sync.wasm" {
  const wasm: Uint8Array<ArrayBuffer>;
  export default wasm;
}
