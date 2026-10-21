/// <reference types="emscripten" />

import type { OcgCoreModuleJspi } from "../index.js";

declare const Module: EmscriptenModuleFactory<OcgCoreModuleJspi>;
export default Module;
