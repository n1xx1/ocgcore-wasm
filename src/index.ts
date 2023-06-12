import { LibraryModule } from "@ocgcore";
import { BufferReader, BufferWriter } from "./internal/buffer";
import { betterCwrap } from "./internal/cwrap";
import { readMessage } from "./messages";
import { readField, readQuery, readQueryLocation } from "./queries";
import { createResponse } from "./responses";
import { OcgLocation, OcgProcessResult } from "./type_core";
import { OcgMessage } from "./type_message";
import { OcgResponse } from "./type_response";
import {
  OcgDuelOptions,
  OcgNewCardInfo,
  OcgQuery,
  OcgQueryLocation,
} from "./types";

export * from "./opcodes";
export * from "./type_core";
export * from "./type_message";
export * from "./type_response";
export * from "./types";

const DuelHandleSymbol = Symbol("duel-handle");

export interface OcgDuelHandle {
  [DuelHandleSymbol]: number;
}

interface Initializer {
  print?(str: string): void;
  printErr?(str: string): void;
  locateFile?(url: string, scriptDirectory: string): string;
  wasmBinary?: ArrayBuffer;
}

export default async function initialize(module: Initializer) {
  const factory = await import("@ocgcore").then((m) => m.default);
  return createLibrary(
    await factory({
      print(str) {
        console.log(str);
      },
      printErr(str) {
        console.error(str);
      },
      ...module,
    })
  );
}

export type OcgCore = ReturnType<typeof createLibrary>;

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

function createLibrary(m: LibraryModule) {
  const cwrap = betterCwrap(m);

  const heap = () => {
    return new DataView(m.HEAP8.buffer, m.HEAP8.byteOffset, m.HEAP8.length);
  };

  //void OCG_GetVersion(int* major, int* minor)
  const OCG_GetVersion = cwrap("OCG_GetVersion", "void", [
    "number",
    "number",
  ] as const);

  //int OCG_CreateDuel(OCG_Duel* duel, OCG_DuelOptions options)
  const OCG_CreateDuel = cwrap(
    "OCG_CreateDuel",
    "number",
    ["number", "array"] as const,
    { async: true }
  );

  //void OCG_DestroyDuel(OCG_Duel duel)
  const OCG_DestroyDuel = cwrap("OCG_DestroyDuel", "void", ["number"] as const);

  //void OCG_DuelNewCard(OCG_Duel duel, OCG_NewCardInfo info)
  const OCG_DuelNewCard = cwrap(
    "OCG_DuelNewCard",
    "void",
    ["number", "array"] as const,
    { async: true }
  );

  //void OCG_StartDuel(OCG_Duel duel)
  const OCG_StartDuel = cwrap("OCG_StartDuel", "void", ["number"] as const, {
    async: true,
  });

  //int OCG_DuelProcess(OCG_Duel duel)
  const OCG_DuelProcess = cwrap(
    "OCG_DuelProcess",
    "number",
    ["number"] as const,
    { async: true }
  );

  //void* OCG_DuelGetMessage(OCG_Duel duel, uint32_t* length)
  const OCG_DuelGetMessage = cwrap("OCG_DuelGetMessage", "number", [
    "number",
    "number",
  ] as const);

  //void OCG_DuelSetResponse(OCG_Duel duel, const void* buffer, uint32_t length)
  const OCG_DuelSetResponse = cwrap("OCG_DuelSetResponse", "void", [
    "number",
    "number",
    "number",
  ] as const);

  //int OCG_LoadScript(OCG_Duel duel, const char* buffer, uint32_t length, const char* name)
  const OCG_LoadScript = cwrap(
    "OCG_LoadScript",
    "number",
    ["number", "number", "number", "number"] as const,
    { async: true }
  );

  //uint32_t OCG_DuelQueryCount(OCG_Duel duel, uint8_t team, uint32_t loc)
  const OCG_DuelQueryCount = cwrap("OCG_DuelQueryCount", "number", [
    "number",
    "number",
    "number",
  ] as const);

  //void* OCG_DuelQuery(OCG_Duel duel, uint32_t* length, OCG_QueryInfo info)
  const OCG_DuelQuery = cwrap("OCG_DuelQuery", "number", [
    "number",
    "number",
    "array",
  ] as const);

  //void* OCG_DuelQueryLocation(OCG_Duel duel, uint32_t* length, OCG_QueryInfo info)
  const OCG_DuelQueryLocation = cwrap("OCG_DuelQueryLocation", "number", [
    "number",
    "number",
    "array",
  ] as const);

  //void* OCG_DuelQueryField(OCG_Duel duel, uint32_t* length)
  const OCG_DuelQueryField = cwrap("OCG_DuelQueryField", "number", [
    "number",
    "number",
  ] as const);

  let lastCallbackId = 0;
  const callbacks = new Map<
    number,
    {
      cardReader: OcgDuelOptions["cardReader"];
      scriptReader: OcgDuelOptions["scriptReader"];
      errorHandler: OcgDuelOptions["errorHandler"];
    }
  >();

  const callbackCardReader = m.addFunction(
    (payload: number, code: number, data: number) => {
      const { cardReader } = callbacks.get(payload)!;
      m.Asyncify.handleAsync(async () => {
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
      });
    },
    "viii"
  );
  const callbackCardReaderDone = m.addFunction(
    (payload: number, data: number) => {
      const view = heap();
      const setCodes = view.getUint32(data + 8, true);
      if (setCodes != 0) {
        m._free(setCodes);
      }
    },
    "vii"
  );
  const callbackScriptReader = m.addFunction(
    (payload: number, duel: number, name: number): number => {
      const { scriptReader } = callbacks.get(payload)!;
      return m.Asyncify.handleAsync(async () => {
        const nameString = m.UTF8ToString(name);
        const contents = await scriptReader(nameString);
        if (!contents) {
          return 0;
        }
        const contentLength = m.lengthBytesUTF8(contents);
        const contentPtr = m._malloc(contentLength + 1);
        m.stringToUTF8(contents, contentPtr, contentLength + 1);
        const nameLength = m.lengthBytesUTF8(nameString);
        const namePtr = m._malloc(nameLength + 1);
        m.stringToUTF8(nameString, namePtr, nameLength + 1);

        await OCG_LoadScript(duel, contentPtr, contentLength, namePtr);

        m._free(contentPtr);
        m._free(namePtr);
        return 1;
      });
    },
    "iiii"
  );
  const callbackErrorHandler = m.addFunction(
    (payload: number, message: number, type: number) => {
      const { errorHandler } = callbacks.get(payload)!;
      errorHandler?.(type, m.UTF8ToString(message));
    },
    "viii"
  );

  return {
    getVersion() {
      const majorPtr = m._malloc(8);
      const minorPtr = majorPtr + 4;
      OCG_GetVersion(majorPtr, minorPtr);
      return [
        m.getValue(majorPtr, "i32"),
        m.getValue(minorPtr, "i32"),
      ] as const;
    },
    async createDuel(options: OcgDuelOptions): Promise<OcgDuelHandle | null> {
      const buf = new Uint8Array(104);
      const view = heap();

      lastCallbackId++;
      callbacks.set(lastCallbackId, {
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
      view.setUint32(64, callbackCardReader, true);
      // void* payload1
      view.setUint32(68, lastCallbackId, true);
      // OCG_ScriptReader scriptReader
      view.setUint32(72, callbackScriptReader, true);
      // void* payload2
      view.setUint32(76, lastCallbackId, true);
      // OCG_LogHandler logHandler
      view.setUint32(80, callbackErrorHandler, true);
      // void* payload3
      view.setUint32(84, lastCallbackId, true);
      // OCG_DataReaderDone cardReaderDone
      view.setUint32(88, callbackCardReaderDone, true);
      // void* payload4
      view.setUint32(92, lastCallbackId, true);
      // uint8_t enableUnsafeLibraries
      view.setUint32(96, 0, true);

      // sizeof(OCG_Player) = 3 * 4
      // sizeof(OCG_DuelOptions) = 4 * 8 + 8 + 2 * sizeof(OCG_Player) + 8 * 4 + 1 (+7)
      // = 104

      const duelPtr = m._malloc(4);
      try {
        const res = await OCG_CreateDuel(duelPtr, buf);
        if (res != 0) {
          return null;
        }
        const duelHandle = m.getValue(duelPtr, "i32");
        return { [DuelHandleSymbol]: duelHandle };
      } finally {
        m._free(duelPtr);
      }
    },
    destroyDuel({ [DuelHandleSymbol]: handle }: OcgDuelHandle) {
      OCG_DestroyDuel(handle);
    },
    async duelNewCard(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
      cardInfo: OcgNewCardInfo
    ) {
      const buf = new Uint8Array(24);
      const view = new DataView(buf.buffer);

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

      await OCG_DuelNewCard(handle, buf);
    },
    async startDuel({ [DuelHandleSymbol]: handle }: OcgDuelHandle) {
      await OCG_StartDuel(handle);
    },
    async duelProcess({
      [DuelHandleSymbol]: handle,
    }: OcgDuelHandle): Promise<OcgProcessResult> {
      return await OCG_DuelProcess(handle);
    },
    duelGetMessage({ [DuelHandleSymbol]: handle }: OcgDuelHandle) {
      const lenPtr = m._malloc(4);

      const buffer = OCG_DuelGetMessage(handle, lenPtr);

      const bufferLength = m.getValue(lenPtr, "i32");

      const reader = BufferReader.from(
        new Uint8Array(m.HEAP8.slice(buffer, buffer + bufferLength))
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
      const bufferPtr = m._malloc(buffer.length);
      m.HEAPU8.set(buffer, bufferPtr);

      OCG_DuelSetResponse(handle, bufferPtr, buffer.length);
      m._free(bufferPtr);
    },
    async loadScript(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
      name: string,
      content: string
    ) {
      const contentLength = m.lengthBytesUTF8(content);
      const contentPtr = m._malloc(contentLength + 1);
      m.stringToUTF8(content, contentPtr, contentLength + 1);
      const nameLength = m.lengthBytesUTF8(name);
      const namePtr = m._malloc(nameLength + 1);
      m.stringToUTF8(name, namePtr, nameLength + 1);

      return (
        (await OCG_LoadScript(handle, contentPtr, contentLength, namePtr)) == 1
      );
    },
    duelQueryCount(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
      team: number,
      location: OcgLocation
    ) {
      return OCG_DuelQueryCount(handle, team, location);
    },
    duelQuery({ [DuelHandleSymbol]: handle }: OcgDuelHandle, query: OcgQuery) {
      const buf = new BufferWriter(6 * 4, true);
      // uint32_t flags;
      buf.u32(query.flags);
      // uint8_t con;
      buf.u8(query.controller);
      // uint32_t loc;
      buf.u32(query.location);
      // uint32_t seq;
      buf.u32(query.sequence);
      // uint32_t overlay_seq;
      buf.u32(query.overlaySequence ?? 0);

      const lenPtr = m._malloc(4);

      const buffer = OCG_DuelQuery(handle, lenPtr, buf.get(4));

      const bufferLength = m.getValue(lenPtr, "i32");

      const reader = BufferReader.from(
        new Uint8Array(m.HEAP8.slice(buffer, buffer + bufferLength))
      );
      return readQuery(reader);
    },
    duelQueryLocation(
      { [DuelHandleSymbol]: handle }: OcgDuelHandle,
      query: OcgQueryLocation
    ) {
      const buf = new BufferWriter(6 * 4, true);
      // uint32_t flags;
      buf.u32(query.flags);
      // uint8_t con;
      buf.u8(query.controller);
      // uint32_t loc;
      buf.u32(query.location);
      // uint32_t seq;
      buf.u32(0);
      // uint32_t overlay_seq;
      buf.u32(0);

      const lenPtr = m._malloc(4);

      const buffer = OCG_DuelQueryLocation(handle, lenPtr, buf.get(4));

      const bufferLength = m.getValue(lenPtr, "i32");

      const reader = BufferReader.from(
        new Uint8Array(m.HEAP8.slice(buffer, buffer + bufferLength))
      );
      return readQueryLocation(reader);
    },
    duelQueryField({ [DuelHandleSymbol]: handle }: OcgDuelHandle) {
      const lenPtr = m._malloc(4);

      const buffer = OCG_DuelQueryField(handle, lenPtr);

      const bufferLength = m.getValue(lenPtr, "i32");

      const reader = BufferReader.from(
        new Uint8Array(m.HEAP8.slice(buffer, buffer + bufferLength))
      );
      return readField(reader);
    },
  };
}
