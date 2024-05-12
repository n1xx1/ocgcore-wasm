import type { OcgCoreModule as OcgCoreModuleJspi } from "~/lib/ocgcore.jspi.mjs";
import type { OcgCoreModule as OcgCoreModuleSync } from "~/lib/ocgcore.sync.mjs";
import { writeCardData, writeDuelOptions, writeNewCardInfo } from "./data";
import { BufferReader, BufferWriter } from "./internal/buffer";
import { readMessage } from "./messages";
import { readField, readQuery, readQueryLocation } from "./queries";
import { createResponse } from "./responses";
import { OcgLocation, OcgLogType, OcgProcessResult } from "./type_core";
import { OcgMessage } from "./type_message";
import { OcgResponse } from "./type_response";
import {
  OcgCore,
  OcgCoreSync,
  OcgDuelOptions,
  OcgDuelOptionsSync,
  OcgQuery,
  OcgQueryLocation,
} from "./types";
import { DuelHandleSymbol } from "./type_handle";

/**
 * The initializer to create a core. If both {@link Initializer.locateFile} and
 * {@link Initializer.wasmBinary} are missing then it will be imported
 * automatically.
 */
export interface Initializer {
  /** Override the stdout print */
  print?(str: string): void;
  /** Override the stderr print */
  printErr?(str: string): void;
  /** {@link https://emscripten.org/docs/api_reference/module.html#Module.locateFile} */
  locateFile?(url: string, scriptDirectory: string): string;
  /** The binary of the wasm module */
  wasmBinary?: ArrayBuffer;
  sync?: boolean;
}

/** Initialize async version */
export type InitializerAsync = Omit<Initializer, "sync"> & { sync?: false };

/** Initialize sync version */
export type InitializerSync = Omit<Initializer, "sync"> & { sync: true };

/**
 * Instantiate the basic interface to use ygocore.
 * @param options - Options. sync: Whether to use the sync interface or not. Defaults to false (async).
 */
export default async function createCore(
  options?: InitializerAsync
): Promise<OcgCore>;

/**
 * Instantiate the basic interface to use ygocore.
 * @param options - Options. sync: Whether to use the sync interface or not. Defaults to false (async).
 */
export default async function createCore(
  options: InitializerSync
): Promise<OcgCoreSync>;

export default async function createCore(
  init?: Initializer
): Promise<OcgCore | OcgCoreSync> {
  const sync = init?.sync ?? false;
  return sync
    ? await createCoreSync(init ?? {})
    : await createCoreJspi(init ?? {});
}

export * from "./opcodes";

export * from "./types";

export type {
  InternalMappedMap,
  InternalDepromisifyFunction,
} from "./internal/utils";

function allocateSetCodes(
  m: Pick<OcgCoreModuleBase, "_malloc" | "HEAP8">,
  setcodes: number[]
) {
  const setCodesArr = new Uint16Array([...setcodes, 0]);
  const setCodes = m._malloc(setCodesArr.byteLength);
  copyArray(heapAt(m.HEAP8, undefined, length), setCodesArr, setCodes);
  return setCodes;
}

async function createCoreSync({ ...init }: Initializer): Promise<OcgCoreSync> {
  const shouldImportWasm = !!init.wasmBinary || !!init.locateFile;
  const [factory, wasmBinary] = await Promise.all([
    importFactorySync(),
    shouldImportWasm ? importWasmSync() : init.wasmBinary,
  ]);

  if (wasmBinary) {
    init.wasmBinary = wasmBinary;
  }

  let lastCallbackId = 0;
  const callbacks = new Map<
    number,
    {
      cardReader: OcgDuelOptionsSync["cardReader"];
      scriptReader: OcgDuelOptionsSync["scriptReader"];
      errorHandler: OcgDuelOptionsSync["errorHandler"];
    }
  >();

  let m: OcgCoreModuleSync = undefined!;

  const heap = (offset?: number, length?: number) =>
    heapAt(m.HEAP8, offset, length);

  m = await factory({
    ...createImportMethodsBase(callbacks),
    ...init,
    handleDataReader(payload, code, data) {
      const { cardReader } = callbacks.get(payload)!;
      const cardData = cardReader(code);

      const setCodes = cardData?.setcodes
        ? allocateSetCodes(m, cardData.setcodes)
        : 0;

      writeCardData(heap(data), {
        ptrSize: 4,
        ...cardData,
        setcodes: setCodes,
      });
    },
    handleScriptReader(payload, duel, name) {
      const { scriptReader } = callbacks.get(payload)!;
      return scriptReader(name);
    },
  });

  return {
    ...createMethodsBase(m),
    createDuel(options) {
      const callback = ++lastCallbackId;
      callbacks.set(callback, {
        cardReader: options.cardReader,
        errorHandler: options.errorHandler,
        scriptReader: options.scriptReader,
      });

      const stack = m.stackSave();

      const duelPtr = m.stackAlloc(4);

      const buf = m.stackAlloc(104);
      writeDuelOptions(heap(buf), {
        ...options,
        ptrSize: 4,
        cardReader: 0,
        cardReaderPayload: callback,
        cardReaderDone: 0,
        cardReaderDonePayload: 0,
        errorHandler: 0,
        errorHandlerPayload: callback,
        scriptReader: 0,
        scriptReaderPayload: callback,
        enableUnsafeLibraries: true,
      });

      const res = m._ocgapiCreateDuel(duelPtr, buf);
      if (res != 0) {
        return null;
      }
      const duelHandle = m.getValue(duelPtr, "i32");
      m.stackRestore(stack);
      return { [DuelHandleSymbol]: duelHandle };
    },
    duelNewCard({ [DuelHandleSymbol]: handle }, cardInfo) {
      const stack = m.stackSave();
      const buf = m.stackAlloc(24);

      writeNewCardInfo(heap(buf), cardInfo);

      m._ocgapiDuelNewCard(handle, buf);
      m.stackRestore(stack);
    },
    startDuel({ [DuelHandleSymbol]: handle }) {
      m._ocgapiStartDuel(handle);
    },
    duelProcess({ [DuelHandleSymbol]: handle }) {
      return m._ocgapiDuelProcess(handle) as OcgProcessResult;
    },
    loadScript({ [DuelHandleSymbol]: handle }, name, content) {
      const stack = m.stackSave();

      const contentLength = m.lengthBytesUTF8(content);
      const contentPtr = m._malloc(contentLength + 1);
      m.stringToUTF8(content, contentPtr, contentLength + 1);

      const nameLength = m.lengthBytesUTF8(name);
      const namePtr = m.stackAlloc(nameLength + 1);
      m.stringToUTF8(name, namePtr, nameLength + 1);

      try {
        return (
          m._ocgapiLoadScript(handle, contentPtr, contentLength, namePtr) == 1
        );
      } finally {
        m._free(contentPtr);
        m.stackRestore(stack);
      }
    },
  };
}

async function createCoreJspi({ ...init }: Initializer): Promise<OcgCore> {
  if (!("Suspender" in WebAssembly) || !("Function" in WebAssembly)) {
    throw new Error("jspi not supported");
  }

  const shouldImportWasm = !!init.wasmBinary || !!init.locateFile;
  const [factory, wasmBinary] = await Promise.all([
    importFactoryJspi(),
    shouldImportWasm ? importWasmJspi() : init.wasmBinary,
  ]);

  if (wasmBinary) {
    init.wasmBinary = wasmBinary;
  }

  let lastCallbackId = 0;
  const callbacks = new Map<
    number,
    {
      cardReader: OcgDuelOptions["cardReader"];
      scriptReader: OcgDuelOptions["scriptReader"];
      errorHandler: OcgDuelOptions["errorHandler"];
    }
  >();

  let m: OcgCoreModuleJspi = undefined!;

  const heap = (offset?: number, length?: number) =>
    heapAt(m.HEAP8, offset, length);

  m = await factory({
    ...createImportMethodsBase(callbacks),
    ...init,
    async handleDataReader(payload, code, data) {
      const { cardReader } = callbacks.get(payload)!;
      const cardData = await cardReader(code);

      const setCodes = cardData?.setcodes
        ? allocateSetCodes(m, cardData.setcodes)
        : 0;

      writeCardData(heap(data), {
        ...cardData,
        ptrSize: 4,
        setcodes: setCodes,
      });
    },
    async handleScriptReader(payload, duel, name) {
      const { scriptReader } = callbacks.get(payload)!;
      return await scriptReader(name);
    },
  });

  return {
    ...createMethodsBase(m),
    async createDuel(options) {
      const callback = ++lastCallbackId;
      callbacks.set(callback, {
        cardReader: options.cardReader,
        errorHandler: options.errorHandler,
        scriptReader: options.scriptReader,
      });

      const stack = m.stackSave();

      const duelPtr = m.stackAlloc(4);

      const buf = m.stackAlloc(104);
      writeDuelOptions(heap(buf), {
        ...options,
        ptrSize: 4,
        cardReader: 0,
        cardReaderPayload: callback,
        cardReaderDone: 0,
        cardReaderDonePayload: 0,
        errorHandler: 0,
        errorHandlerPayload: callback,
        scriptReader: 0,
        scriptReaderPayload: callback,
        enableUnsafeLibraries: true,
      });

      try {
        const res = await m._ocgapiCreateDuel(duelPtr, buf);
        if (res != 0) {
          return null;
        }
        const duelHandle = m.getValue(duelPtr, "i32");
        return { [DuelHandleSymbol]: duelHandle };
      } finally {
        m.stackRestore(stack);
      }
    },
    async duelNewCard({ [DuelHandleSymbol]: handle }, cardInfo) {
      const stack = m.stackSave();
      const buf = m.stackAlloc(24);

      writeNewCardInfo(heap(buf), cardInfo);

      try {
        await m._ocgapiDuelNewCard(handle, buf);
      } finally {
        m.stackRestore(stack);
      }
    },
    async startDuel({ [DuelHandleSymbol]: handle }) {
      await m._ocgapiStartDuel(handle);
    },
    async duelProcess({ [DuelHandleSymbol]: handle }) {
      return (await m._ocgapiDuelProcess(handle)) as OcgProcessResult;
    },
    async loadScript(
      { [DuelHandleSymbol]: handle },
      name: string,
      content: string
    ) {
      const stack = m.stackSave();

      const contentLength = m.lengthBytesUTF8(content);
      const contentPtr = m._malloc(contentLength + 1);
      m.stringToUTF8(content, contentPtr, contentLength + 1);

      const nameLength = m.lengthBytesUTF8(name);
      const namePtr = m.stackAlloc(nameLength + 1);
      m.stringToUTF8(name, namePtr, nameLength + 1);

      try {
        return (
          (await m._ocgapiLoadScript(
            handle,
            contentPtr,
            contentLength,
            namePtr
          )) == 1
        );
      } finally {
        m._free(contentPtr);
        m.stackRestore(stack);
      }
    },
  };
}

function createImportMethodsBase(
  callbacks: Map<number, { errorHandler: OcgDuelOptions["errorHandler"] }>
): Pick<
  OcgCoreModuleJspi & OcgCoreModuleSync,
  "print" | "printErr" | "handleLogHandler"
> {
  return {
    print(str) {
      console.log(str);
    },
    printErr(str) {
      console.error(str);
    },
    handleLogHandler(payload: number, message: string, type: number) {
      const { errorHandler } = callbacks.get(payload)!;
      errorHandler?.(type as OcgLogType, message);
    },
  };
}

function createMethodsBase(
  m: OcgCoreModuleJspi | OcgCoreModuleSync
): Pick<
  OcgCore & OcgCoreSync,
  | "getVersion"
  | "destroyDuel"
  | "duelGetMessage"
  | "duelSetResponse"
  | "duelQueryCount"
  | "duelQuery"
  | "duelQueryLocation"
  | "duelQueryField"
> {
  const heap = (offset?: number, length?: number) =>
    heapAt(m.HEAP8, offset, length);

  return {
    getVersion() {
      const stack = m.stackSave();
      const majorPtr = m.stackAlloc(4);
      const minorPtr = m.stackAlloc(4);
      try {
        m._ocgapiGetVersion(majorPtr, minorPtr);
        return [
          m.getValue(majorPtr, "i32"),
          m.getValue(minorPtr, "i32"),
        ] as const;
      } finally {
        m.stackRestore(stack);
      }
    },
    destroyDuel({ [DuelHandleSymbol]: handle }) {
      m._ocgapiDestroyDuel(handle);
    },
    duelGetMessage({ [DuelHandleSymbol]: handle }) {
      const stack = m.stackSave();

      const lenPtr = m.stackAlloc(4);
      const buffer = m._ocgapiDuelGetMessage(handle, lenPtr);
      const bufferLength = m.getValue(lenPtr, "i32");

      m.stackRestore(stack);

      const reader = new BufferReader(
        new DataView(m.HEAP8.buffer, buffer, bufferLength)
      );

      const messages: OcgMessage[] = [];

      while (reader.avail > 0) {
        const length = reader.i32();
        const subReader = reader.sub(length);
        const message = readMessage(subReader);
        if (!message) {
          subReader.reset();
          console.warn(`failed to parse a message: ${subReader.u8()}`);
          // TODO: handle parse errors?
          continue;
        }
        messages.push(message);
      }

      return messages;
    },
    duelSetResponse({ [DuelHandleSymbol]: handle }, response: OcgResponse) {
      const buffer = createResponse(response);

      const stack = m.stackSave();
      const bufferPtr = m.stackAlloc(buffer.length);
      m.HEAPU8.set(buffer, bufferPtr);

      try {
        m._ocgapiDuelSetResponse(handle, bufferPtr, buffer.length);
      } finally {
        m.stackRestore(stack);
      }
    },
    duelQueryCount(
      { [DuelHandleSymbol]: handle },
      team: number,
      location: OcgLocation
    ) {
      return m._ocgapiDuelQueryCount(handle, team, location);
    },
    duelQuery({ [DuelHandleSymbol]: handle }, query: OcgQuery) {
      const queryBuffer = new BufferWriter(6 * 4, true);
      // uint32_t flags;
      queryBuffer.u32(query.flags);
      // uint8_t con;
      queryBuffer.u8(query.controller);
      // uint32_t loc;
      queryBuffer.u32(query.location);
      // uint32_t seq;
      queryBuffer.u32(query.sequence);
      // uint32_t overlay_seq;
      queryBuffer.u32(query.overlaySequence ?? 0);

      const stack = m.stackSave();

      try {
        const queryData = queryBuffer.get(4);
        const queryPtr = m.stackAlloc(queryData.byteLength);
        m.HEAP8.set(queryData, queryPtr);

        const lenPtr = m.stackAlloc(4);

        const buffer = m._ocgapiDuelQuery(handle, lenPtr, queryPtr);

        const bufferLength = m.getValue(lenPtr, "i32");

        const reader = new BufferReader(heap(buffer, bufferLength));
        return readQuery(reader);
      } finally {
        m.stackRestore(stack);
      }
    },
    duelQueryLocation({ [DuelHandleSymbol]: handle }, query: OcgQueryLocation) {
      const queryBuffer = new BufferWriter(6 * 4, true);
      // uint32_t flags;
      queryBuffer.u32(query.flags);
      // uint8_t con;
      queryBuffer.u8(query.controller);
      // uint32_t loc;
      queryBuffer.u32(query.location);
      // uint32_t seq;
      queryBuffer.u32(0);
      // uint32_t overlay_seq;
      queryBuffer.u32(0);

      const stack = m.stackSave();

      try {
        const queryData = queryBuffer.get(4);
        const queryPtr = m.stackAlloc(queryData.byteLength);
        m.HEAP8.set(queryData, queryPtr);

        const lenPtr = m.stackAlloc(4);

        const buffer = m._ocgapiDuelQueryLocation(handle, lenPtr, queryPtr);

        const bufferLength = m.getValue(lenPtr, "i32");

        const reader = new BufferReader(heap(buffer, bufferLength));
        return readQueryLocation(reader);
      } finally {
        m.stackRestore(stack);
      }
    },
    duelQueryField({ [DuelHandleSymbol]: handle }) {
      const stack = m.stackSave();

      try {
        const lenPtr = m.stackAlloc(4);

        const buffer = m._ocgapiDuelQueryField(handle, lenPtr);

        const bufferLength = m.getValue(lenPtr, "i32");

        const reader = new BufferReader(heap(buffer, bufferLength));
        return readField(reader);
      } finally {
        m.stackRestore(stack);
      }
    },
  };
}

function heapAt(heap: Int8Array, offset = 0, length = -1) {
  return new DataView(
    heap.buffer,
    heap.byteOffset + offset,
    length < 0 ? heap.length - offset : length
  );
}

function copyArray(
  view: DataView,
  x:
    | Uint16Array
    | Uint32Array
    | BigUint64Array
    | Int16Array
    | Int32Array
    | BigInt64Array,
  off: number
) {
  if (x instanceof Uint16Array) {
    x.forEach((v, i) => view.setUint16(off + i * 2, v, true));
  } else if (x instanceof Uint32Array) {
    x.forEach((v, i) => view.setUint32(off + i * 4, v, true));
  } else if (x instanceof BigUint64Array) {
    x.forEach((v, i) => view.setBigUint64(off + i * 4, v, true));
  } else if (x instanceof Int16Array) {
    x.forEach((v, i) => view.setInt16(off + i * 2, v, true));
  } else if (x instanceof Int32Array) {
    x.forEach((v, i) => view.setInt32(off + i * 4, v, true));
  } else if (x instanceof BigInt64Array) {
    x.forEach((v, i) => view.setBigInt64(off + i * 4, v, true));
  }
}

async function importFactoryJspi() {
  return (await import("~/lib/ocgcore.jspi.mjs")).default;
}

async function importWasmJspi() {
  return (await import("~/lib/ocgcore.jspi.wasm")).default;
}

async function importFactorySync() {
  return (await import("~/lib/ocgcore.sync.mjs")).default;
}

async function importWasmSync() {
  return (await import("~/lib/ocgcore.sync.wasm")).default;
}
