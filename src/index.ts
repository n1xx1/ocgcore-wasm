import { BufferReader } from "./internal/buffer";
import { betterCwrap } from "./internal/cwrap";
import { CStruct } from "./internal/struct";
import { readMessage } from "./messages";
import { createResponse } from "./responses";
import { OcgDuelOptions, OcgNewCardInfo } from "./types";
import { OcgProcessResult } from "./type_core";
import { OcgMessage } from "./type_message";
import { OcgResponse } from "./type_response";

export * from "./types";
export * from "./type_core";
export * from "./type_response";
export * from "./type_message";
export * from "./opcodes";

const DuelHandleSymbol = Symbol("duel-handle");

export interface OcgDuelHandle {
  [DuelHandleSymbol]: number;
}

interface LibraryModule extends EmscriptenModule {
  ccall: typeof ccall;
  cwrap: typeof cwrap;
  setValue: typeof setValue;
  getValue: typeof getValue;
  UTF8ToString: typeof UTF8ToString;
  stringToUTF8: typeof stringToUTF8;
  addFunction: typeof addFunction;
  removeFunction: typeof removeFunction;
  lengthBytesUTF8: typeof lengthBytesUTF8;
  Asyncify: {
    handleAsync(f: () => PromiseLike<any>): any;
    handleSleep(wakeUp: () => void): void;
  };
}

interface Initializer {
  print?(str: string): void;
  printErr?(str: string): void;
  locateFile?(url: string, scriptDirectory: string): string;
  wasmBinary?: ArrayBuffer;
}

export default async function initialize(module: Initializer) {
  const factory: EmscriptenModuleFactory<LibraryModule> = require("../lib/ocgcore.js");
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

type OcgCore = ReturnType<typeof createLibrary>;

function createLibrary(m: LibraryModule) {
  const cwrap = betterCwrap(m);

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
  const OCG_DuelQueryCount = cwrap("OCG_DuelQueryCount", "void", [] as const);

  //void* OCG_DuelQuery(OCG_Duel duel, uint32_t* length, OCG_QueryInfo info)
  const OCG_DuelQuery = cwrap("OCG_DuelQuery", "void", [
    "number",
    "number",
    "array",
  ] as const);

  //void* OCG_DuelQueryLocation(OCG_Duel duel, uint32_t* length, OCG_QueryInfo info)
  const OCG_DuelQueryLocation = cwrap("OCG_DuelQueryLocation", "void", [
    "number",
    "number",
    "array",
  ] as const);

  //void* OCG_DuelQueryField(OCG_Duel duel, uint32_t* length)
  const OCG_DuelQueryField = cwrap("OCG_DuelQueryField", "number", [
    "number",
    "number",
  ] as const);

  const OCG_CardData = CStruct(m, [
    ["code", "i32"],
    ["alias", "i32"],
    ["setcodes", "i16*"],
    ["type", "i32"],
    ["level", "i32"],
    ["attribute", "i32"],
    ["race", "i32"],
    ["attack", "i32"],
    ["defense", "i32"],
    ["lscale", "i32"],
    ["rscale", "i32"],
    ["link_marker", "i32"],
  ] as const);

  const OCG_NewCardInfo = CStruct(m, [
    ["team", "i8"],
    ["duelist", "i8"],
    ["code", "i32"],
    ["con", "i8"],
    ["loc", "i32"],
    ["seq", "i32"],
    ["pos", "i32"],
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
      const { cardReader } = callbacks.get(payload);
      const card = OCG_CardData.from(data);
      m.Asyncify.handleAsync(async () => {
        const cardData = await cardReader(code);

        card.code = cardData.code;
        card.alias = cardData.alias;
        card.type = cardData.type;
        card.level = cardData.level;
        card.attribute = cardData.attribute;
        card.race = cardData.race;
        card.attack = cardData.attack;
        card.defense = cardData.defense;
        card.lscale = cardData.lscale;
        card.rscale = cardData.rscale;
        card.link_marker = cardData.link_marker;

        const setCodes = m._malloc((cardData.setcodes.length + 1) * 2);
        for (let i = 0; i < cardData.setcodes.length; i++) {
          m.setValue(setCodes + i * 2, cardData.setcodes[i], "i16");
        }
        m.setValue(setCodes + cardData.setcodes.length * 2, 0, "i16");
        card.setcodes = setCodes;
      });
    },
    "viii"
  );
  const callbackCardReaderDone = m.addFunction(
    (payload: number, data: number) => {
      const card = OCG_CardData.from(data);
      m._free(card.setcodes);
    },
    "vii"
  );
  const callbackScriptReader = m.addFunction(
    (payload: number, duel: number, name: number): number => {
      const { scriptReader } = callbacks.get(payload);
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
      const { errorHandler } = callbacks.get(payload);
      errorHandler(type, m.UTF8ToString(message));
    },
    "viii"
  );

  return {
    //void OCG_GetVersion(int* major, int* minor)
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
      const view = new DataView(buf.buffer);

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
      view.setUint8(8, cardInfo.con);
      // uint32_t loc;
      view.setUint32(12, cardInfo.loc, true);
      // uint32_t seq;
      view.setUint32(16, cardInfo.seq, true);
      // uint32_t pos;
      view.setUint32(20, cardInfo.pos, true);

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
      const reader = BufferReader.create(m, buffer, bufferLength);

      const messages: OcgMessage[] = [];

      while (reader.avail > 0) {
        const length = reader.i32();
        const subReader = reader.sub(length);
        messages.push(readMessage(subReader));
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
    duelQueryCount() {},
    duelQuery() {},
    duelQueryLocation() {},
    duelQueryField() {},
  };
}
