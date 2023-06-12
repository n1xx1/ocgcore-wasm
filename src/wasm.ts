export interface LibraryModule extends EmscriptenModule {
  ccall<
    I extends Array<Emscripten.JSType | null> | [],
    R extends Emscripten.JSType | null
  >(
    ident: string,
    returnType: R,
    argTypes: I,
    args: ArgsToType<I>,
    opts?: Emscripten.CCallOpts
  ): ReturnToType<R>;
  cwrap<
    I extends Array<Emscripten.JSType | null> | [],
    R extends Emscripten.JSType | null
  >(
    ident: string,
    returnType: R,
    argTypes: I,
    opts?: Emscripten.CCallOpts
  ): (...arg: ArgsToType<I>) => ReturnToType<R>;

  setValue(
    ptr: number,
    value: any,
    type: Emscripten.CType,
    noSafe?: boolean
  ): void;
  getValue(ptr: number, type: Emscripten.CType, noSafe?: boolean): number;

  UTF8ToString(ptr: number, maxBytesToRead?: number): string;
  stringToUTF8(str: string, outPtr: number, maxBytesToRead?: number): void;
  lengthBytesUTF8(str: string): number;

  addFunction(func: (...args: any[]) => any, signature?: string): number;
  removeFunction(funcPtr: number): void;

  Asyncify: {
    handleAsync(f: () => PromiseLike<any>): any;
    handleSleep(wakeUp: () => void): void;
  };
}

export type LibraryModuleFactory = EmscriptenModuleFactory<LibraryModule>;

type EmscriptenModuleFactory<T extends EmscriptenModule = EmscriptenModule> = (
  moduleOverrides?: Partial<T>
) => Promise<T>;

declare namespace Emscripten {
  interface FileSystemType {}
  type EnvironmentType = "WEB" | "NODE" | "SHELL" | "WORKER";

  type JSType = "number" | "string" | "array" | "boolean";
  type TypeCompatibleWithC = number | string | any[] | boolean;

  type CIntType = "i8" | "i16" | "i32" | "i64";
  type CFloatType = "float" | "double";
  type CPointerType =
    | "i8*"
    | "i16*"
    | "i32*"
    | "i64*"
    | "float*"
    | "double*"
    | "*";
  type CType = CIntType | CFloatType | CPointerType;

  type WebAssemblyImports = Array<{
    name: string;
    kind: string;
  }>;

  type WebAssemblyExports = Array<{
    module: string;
    name: string;
    kind: string;
  }>;

  interface CCallOpts {
    async?: boolean | undefined;
  }
}

// https://emscripten.org/docs/porting/connecting_cpp_and_javascript/Interacting-with-code.html
type StringToType<R extends any> = R extends Emscripten.JSType
  ? {
      number: number;
      string: string;
      array: number[] | string[] | boolean[] | Uint8Array | Int8Array;
      boolean: boolean;
      null: null;
    }[R]
  : never;

type ArgsToType<T extends Array<Emscripten.JSType | null>> = Extract<
  {
    [P in keyof T]: StringToType<T[P]>;
  },
  any[]
>;

type ReturnToType<R extends Emscripten.JSType | null> = R extends null
  ? null
  : StringToType<Exclude<R, null>>;

interface EmscriptenModule {
  print(str: string): void;
  printErr(str: string): void;
  arguments: string[];
  environment: Emscripten.EnvironmentType;
  preInit: Array<{ (): void }>;
  preRun: Array<{ (): void }>;
  postRun: Array<{ (): void }>;
  onAbort: { (what: any): void };
  onRuntimeInitialized: { (): void };
  preinitializedWebGLContext: WebGLRenderingContext;
  noInitialRun: boolean;
  noExitRuntime: boolean;
  logReadFiles: boolean;
  filePackagePrefixURL: string;
  wasmBinary: ArrayBuffer;

  destroy(object: object): void;
  getPreloadedPackage(
    remotePackageName: string,
    remotePackageSize: number
  ): ArrayBuffer;
  instantiateWasm(
    imports: Emscripten.WebAssemblyImports,
    successCallback: (module: WebAssembly.Module) => void
  ): Emscripten.WebAssemblyExports;
  locateFile(url: string, scriptDirectory: string): string;
  onCustomMessage(event: MessageEvent): void;

  // USE_TYPED_ARRAYS == 1
  HEAP: Int32Array;
  IHEAP: Int32Array;
  FHEAP: Float64Array;

  // USE_TYPED_ARRAYS == 2
  HEAP8: Int8Array;
  HEAP16: Int16Array;
  HEAP32: Int32Array;
  HEAPU8: Uint8Array;
  HEAPU16: Uint16Array;
  HEAPU32: Uint32Array;
  HEAPF32: Float32Array;
  HEAPF64: Float64Array;

  TOTAL_STACK: number;
  TOTAL_MEMORY: number;
  FAST_MEMORY: number;

  addOnPreRun(cb: () => any): void;
  addOnInit(cb: () => any): void;
  addOnPreMain(cb: () => any): void;
  addOnExit(cb: () => any): void;
  addOnPostRun(cb: () => any): void;

  preloadedImages: any;
  preloadedAudios: any;

  _malloc(size: number): number;
  _free(ptr: number): void;
}
