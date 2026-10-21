/// <reference types="emscripten" />

import type { OcgCoreModuleSync } from "../index.js";

declare const Module: EmscriptenModuleFactory<OcgCoreModuleSync>;
export default Module;
