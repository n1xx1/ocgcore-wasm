import { BufferReader, BufferWriter } from "./internal/buffer";
import { readMessage } from "./messages";
import { readField, readQuery, readQueryLocation } from "./queries";
import { createResponse } from "./responses";
import { OcgLocation, OcgProcessResult } from "./type_core";
import { OcgMessage } from "./type_message";
import { OcgResponse } from "./type_response";
import {
  DuelHandleSymbol,
  OcgCore,
  OcgDuelHandle,
  OcgDuelOptions,
  OcgNewCardInfo,
  OcgQuery,
  OcgQueryLocation,
} from "./types";
import type { LibraryModule } from "./wasm";

export * from "./opcodes";
export * from "./type_core";
export * from "./type_message";
export * from "./type_response";
export type * from "./types";

export interface Initializer {
  print?(str: string): void;
  printErr?(str: string): void;
  locateFile?(url: string, scriptDirectory: string): string;
  wasmBinary?: ArrayBuffer;
}

export default async function initialize(
  module: Initializer
): Promise<OcgCore> {
  const factory = await import("../lib/ocgcore.mjs" as any).then(
    (m) => m.default as EmscriptenModuleFactory<OcgCoreModule>
  );

  let lastCallbackId = 0;
  const callbacks = new Map<
    number,
    {
      cardReader: OcgDuelOptions["cardReader"];
      scriptReader: OcgDuelOptions["scriptReader"];
      errorHandler: OcgDuelOptions["errorHandler"];
    }
  >();

  let m: OcgCoreModule = undefined!;

  const heap = (offset = 0, length = -1) => {
    return new DataView(
      m.HEAP8.buffer,
      m.HEAP8.byteOffset + offset,
      length < 0 ? m.HEAP8.length - offset : length
    );
  };

  m = await factory({
    print(str) {
      console.log(str);
    },
    printErr(str) {
      console.error(str);
    },
    async handleDataReader(payload: number, code: number, data: number) {
      const { cardReader } = callbacks.get(payload)!;
      const cardData = await cardReader(code);

      const setCodesArr = new Uint16Array([...cardData.setcodes, 0]);
      const setCodes = m._malloc(setCodesArr.byteLength);

      const view = heap();
      copyArray(view, setCodesArr, setCodes);

      // uint32_t code;
      view.setUint32(data + 0, cardData.code, true);
      // uint32_t alias;
      view.setUint32(data + 4, cardData.alias, true);
      // uint16_t* setcodes;
      view.setUint32(data + 8, setCodes, true);
      // uint32_t type;
      view.setUint32(data + 12, cardData.type, true);
      // uint32_t level;
      view.setUint32(data + 16, cardData.level, true);
      // uint32_t attribute;
      view.setUint32(data + 20, cardData.attribute, true);
      // uint64_t race;
      view.setBigUint64(data + 28, BigInt(cardData.race), true);
      // int32_t attack;
      view.setInt32(data + 32, cardData.attack, true);
      // int32_t defense;
      view.setInt32(data + 36, cardData.defense, true);
      // uint32_t lscale;
      view.setUint32(data + 40, cardData.lscale, true);
      // uint32_t rscale;
      view.setUint32(data + 48, cardData.rscale, true);
      // uint32_t link_marker;
      view.setUint32(data + 52, cardData.link_marker, true);
    },
    async handleScriptReader(payload: number, duel: number, name: string) {
      const { scriptReader } = callbacks.get(payload)!;
      return await scriptReader(name);
    },
    handleLogHandler(payload: number, message: string, type: number) {
      const { errorHandler } = callbacks.get(payload)!;
      errorHandler?.(type, message);
    },
    ...module,
  });

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
    async createDuel(options: OcgDuelOptions): Promise<OcgDuelHandle | null> {
      const stack = m.stackSave();
      const duelPtr = m.stackAlloc(4);
      const buf = m.stackAlloc(104);
      const view = heap(buf);

      const callback = ++lastCallbackId;

      callbacks.set(callback, {
        cardReader: options.cardReader,
        errorHandler: options.errorHandler,
        scriptReader: options.scriptReader,
      });

      // uint64_t seed[4]
      view.setBigUint64(0, options.seed[0], true);
      view.setBigUint64(8, options.seed[1], true);
      view.setBigUint64(16, options.seed[2], true);
      view.setBigUint64(24, options.seed[3], true);
      // uint64_t flags
      view.setBigUint64(32, options.flags, true);
      // OCG_Player team1 {
      //    uint32_t startingLP
      view.setUint32(40, options.team1.startingLP, true);
      //    uint32_t startingDrawCount
      view.setUint32(44, options.team1.startingDrawCount, true);
      //    uint32_t drawCountPerTurn
      view.setUint32(48, options.team1.drawCountPerTurn, true);
      // }
      // OCG_Player team2 {
      //    uint32_t startingLP
      view.setUint32(52, options.team1.startingLP, true);
      //    uint32_t startingDrawCount
      view.setUint32(56, options.team1.startingDrawCount, true);
      //    uint32_t drawCountPerTurn
      view.setUint32(60, options.team1.drawCountPerTurn, true);
      // }
      // OCG_DataReader cardReader
      view.setUint32(64, 0, true);
      // void* payload1
      view.setUint32(68, callback, true);
      // OCG_ScriptReader scriptReader
      view.setUint32(72, 0, true);
      // void* payload2
      view.setUint32(76, callback, true);
      // OCG_LogHandler logHandler
      view.setUint32(80, 0, true);
      // void* payload3
      view.setUint32(84, callback, true);
      // OCG_DataReaderDone cardReaderDone
      view.setUint32(88, 0, true);
      // void* payload4
      view.setUint32(92, callback, true);
      // uint8_t enableUnsafeLibraries
      view.setUint32(96, 1, true);

      // sizeof(OCG_Player) = 3 * 4
      // sizeof(OCG_DuelOptions) = 4 * 8 + 8 + 2 * sizeof(OCG_Player) + 8 * 4 + 1 (+7)
      // = 104

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
    destroyDuel({ [DuelHandleSymbol]: handle }: OcgDuelHandle) {
      m._ocgapiDestroyDuel(handle);
    },
    async duelNewCard(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
      cardInfo: OcgNewCardInfo
    ) {
      const stack = m.stackSave();
      const buf = m.stackAlloc(24);
      const view = heap(buf);

      // uint8_t team; /* either 0 or 1 */
      view.setUint8(0, cardInfo.team);
      // uint8_t duelist; /* index of original owner */
      view.setUint8(1, cardInfo.duelist);
      // uint32_t code;
      view.setUint32(4, cardInfo.code, true);
      // uint8_t con;
      view.setUint8(8, cardInfo.controller);
      // uint32_t loc;
      view.setUint32(12, cardInfo.location, true);
      // uint32_t seq;
      view.setUint32(16, cardInfo.sequence, true);
      // uint32_t pos;
      view.setUint32(20, cardInfo.position, true);

      try {
        await m._ocgapiDuelNewCard(handle, buf);
      } finally {
        m.stackRestore(stack);
      }
    },
    async startDuel({ [DuelHandleSymbol]: handle }: OcgDuelHandle) {
      await m._ocgapiStartDuel(handle);
    },
    async duelProcess({
      [DuelHandleSymbol]: handle,
    }: OcgDuelHandle): Promise<OcgProcessResult> {
      return await m._ocgapiDuelProcess(handle);
    },
    duelGetMessage({ [DuelHandleSymbol]: handle }: OcgDuelHandle) {
      const stack = m.stackSave();
      const lenPtr = m.stackAlloc(4);
      const buffer = m._ocgapiDuelGetMessage(handle, lenPtr);
      m.stackRestore(stack);

      const bufferLength = m.getValue(lenPtr, "i32");

      const reader = new BufferReader(
        new DataView(m.HEAP8.buffer, buffer, bufferLength)
      );

      const messages: OcgMessage[] = [];

      while (reader.avail > 0) {
        const length = reader.i32();
        const subReader = reader.sub(length);
        const message = readMessage(subReader);
        if (!message) {
          // TODO: handle parse errors?
          continue;
        }
        messages.push(message);
      }

      return messages;
    },
    duelSetResponse(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
      response: OcgResponse
    ) {
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
    async loadScript(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
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
        m.stackRestore(stack);
      }
    },
    duelQueryCount(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
      team: number,
      location: OcgLocation
    ) {
      return m._ocgapiDuelQueryCount(handle, team, location);
    },
    duelQuery({ [DuelHandleSymbol]: handle }: OcgDuelHandle, query: OcgQuery) {
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
    duelQueryLocation(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
      query: OcgQueryLocation
    ) {
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
    duelQueryField({ [DuelHandleSymbol]: handle }: OcgDuelHandle) {
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

interface OcgCoreModule extends LibraryModule {
  //void OCG_GetVersion(int* major, int* minor)
  _ocgapiGetVersion(majorPtr: number, minorPtr: number): void;

  //int OCG_CreateDuel(OCG_Duel* duel, OCG_DuelOptions options)
  _ocgapiCreateDuel(
    duelPtr: number,
    optionsData: number
  ): number | Promise<number>;

  //void OCG_DestroyDuel(OCG_Duel duel)
  _ocgapiDestroyDuel(duel: number): void;

  //void OCG_DuelNewCard(OCG_Duel duel, OCG_NewCardInfo info)
  _ocgapiDuelNewCard(duel: number, infoData: number): Promise<void>;

  //void OCG_StartDuel(OCG_Duel duel)
  _ocgapiStartDuel(duel: number): void | Promise<number>;

  //int OCG_DuelProcess(OCG_Duel duel)
  _ocgapiDuelProcess(duel: number): number | Promise<number>;

  //void* OCG_DuelGetMessage(OCG_Duel duel, uint32_t* length)
  _ocgapiDuelGetMessage(duel: number, lengthPtr: number): number;

  //void OCG_DuelSetResponse(OCG_Duel duel, const void* buffer, uint32_t length)
  _ocgapiDuelSetResponse(duel: number, bufferPtr: number, length: number): void;

  //int OCG_LoadScript(OCG_Duel duel, const char* buffer, uint32_t length, const char* name)
  _ocgapiLoadScript(
    duel: number,
    bufferPtr: number,
    length: number,
    nameString: number
  ): number | Promise<number>;

  //uint32_t OCG_DuelQueryCount(OCG_Duel duel, uint8_t team, uint32_t loc)
  _ocgapiDuelQueryCount(duel: number, team: number, loc: number): number;

  //void* OCG_DuelQuery(OCG_Duel duel, uint32_t* length, OCG_QueryInfo info)
  _ocgapiDuelQuery(duel: number, lengthPtr: number, infoData: number): number;

  //void* OCG_DuelQueryLocation(OCG_Duel duel, uint32_t* length, OCG_QueryInfo info)
  _ocgapiDuelQueryLocation(
    duel: number,
    lengthPtr: number,
    infoData: number
  ): number;

  //void* OCG_DuelQueryField(OCG_Duel duel, uint32_t* length)
  _ocgapiDuelQueryField(duel: number, lengthPtr: number): number;

  handleDataReader(payload: number, code: number, data: number): Promise<void>;

  handleScriptReader(
    payload: number,
    duel: number,
    name: string
  ): Promise<string>;

  handleLogHandler(payload: number, message: string, type: number): void;
}

/*

  //void OCG_GetVersion(int* major, int* minor)
  const OCG_GetVersion = cwrap("ocgapiGetVersion", "void", [
    "number",
    "number",
  ] as const);

  //int OCG_CreateDuel(OCG_Duel* duel, OCG_DuelOptions options)
  const OCG_CreateDuel = cwrap(
    "ocgapiCreateDuel",
    "number",
    ["number", "array"] as const,
    { async: true }
  );

  //void OCG_DestroyDuel(OCG_Duel duel)
  const OCG_DestroyDuel = cwrap("ocgapiDestroyDuel", "void", [
    "number",
  ] as const);

  //void OCG_DuelNewCard(OCG_Duel duel, OCG_NewCardInfo info)
  const OCG_DuelNewCard = cwrap(
    "ocgapiDuelNewCard",
    "void",
    ["number", "array"] as const,
    { async: true }
  );

  //void OCG_StartDuel(OCG_Duel duel)
  const OCG_StartDuel = cwrap("ocgapiStartDuel", "void", ["number"] as const, {
    async: true,
  });

  //int OCG_DuelProcess(OCG_Duel duel)
  const OCG_DuelProcess = cwrap(
    "ocgapiDuelProcess",
    "number",
    ["number"] as const,
    { async: true }
  );

  //void* OCG_DuelGetMessage(OCG_Duel duel, uint32_t* length)
  const OCG_DuelGetMessage = cwrap("ocgapiDuelGetMessage", "number", [
    "number",
    "number",
  ] as const);

  //void OCG_DuelSetResponse(OCG_Duel duel, const void* buffer, uint32_t length)
  const OCG_DuelSetResponse = cwrap("ocgapiDuelSetResponse", "void", [
    "number",
    "number",
    "number",
  ] as const);

  //int OCG_LoadScript(OCG_Duel duel, const char* buffer, uint32_t length, const char* name)
  const OCG_LoadScript = cwrap(
    "ocgapiLoadScript",
    "number",
    ["number", "number", "number", "number"] as const,
    { async: true }
  );

  //uint32_t OCG_DuelQueryCount(OCG_Duel duel, uint8_t team, uint32_t loc)
  const OCG_DuelQueryCount = cwrap("ocgapiDuelQueryCount", "number", [
    "number",
    "number",
    "number",
  ] as const);

  //void* OCG_DuelQuery(OCG_Duel duel, uint32_t* length, OCG_QueryInfo info)
  const OCG_DuelQuery = cwrap("ocgapiDuelQuery", "number", [
    "number",
    "number",
    "array",
  ] as const);

  //void* OCG_DuelQueryLocation(OCG_Duel duel, uint32_t* length, OCG_QueryInfo info)
  const OCG_DuelQueryLocation = cwrap("ocgapiDuelQueryLocation", "number", [
    "number",
    "number",
    "array",
  ] as const);

  //void* OCG_DuelQueryField(OCG_Duel duel, uint32_t* length)
  const OCG_DuelQueryField = cwrap("ocgapiDuelQueryField", "number", [
    "number",
    "number",
  ] as const);

*/
