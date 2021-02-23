import { BufferReader } from "./internal/buffer";
import { betterCwrap } from "./internal/cwrap";
import { CStruct } from "./internal/struct";
import { readMessage } from "./messages";
import { createResponse } from "./responses";
import { OcgCardData, OcgDuelOptions, OcgNewCardInfo } from "./types";
import { OcgProcessResult } from "./type_core";
import { OcgMessage } from "./type_message";
import { OcgResponse } from "./type_response";

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

type Initializer = Partial<
  Pick<EmscriptenModule, "locateFile" | "wasmBinary" | "print" | "printErr">
>;

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

  //void ocgapiGetVersion(int* major, int* minor)
  const ocgapiGetVersion = cwrap("ocgapiGetVersion", "void", [
    "number",
    "number",
  ] as const);

  //int ocgapiCreateDuel(OCG_Duel* duel, OCG_DuelOptions* options)
  const ocgapiCreateDuel = cwrap(
    "ocgapiCreateDuel",
    "number",
    ["number", "number"] as const,
    { async: true }
  );

  //void ocgapiDestroyDuel(OCG_Duel duel)
  const ocgapiDestroyDuel = cwrap("ocgapiDestroyDuel", "void", [
    "number",
  ] as const);

  //void ocgapiDuelNewCard(OCG_Duel duel, OCG_NewCardInfo* info)
  const ocgapiDuelNewCard = cwrap(
    "ocgapiDuelNewCard",
    "void",
    ["number", "number"] as const,
    { async: true }
  );

  //void ocgapiStartDuel(OCG_Duel duel)
  const ocgapiStartDuel = cwrap(
    "ocgapiStartDuel",
    "void",
    ["number"] as const,
    { async: true }
  );

  //int ocgapiDuelProcess(OCG_Duel duel)
  const ocgapiDuelProcess = cwrap(
    "ocgapiDuelProcess",
    "number",
    ["number"] as const,
    { async: true }
  );

  //void* ocgapiDuelGetMessage(OCG_Duel duel, uint32_t* length)
  const ocgapiDuelGetMessage = cwrap("ocgapiDuelGetMessage", "number", [
    "number",
    "number",
  ] as const);

  //void ocgapiDuelSetResponse(OCG_Duel duel, const void* buffer, uint32_t length)
  const ocgapiDuelSetResponse = cwrap("ocgapiDuelSetResponse", "void", [
    "number",
    "number",
    "number",
  ] as const);

  //int ocgapiLoadScript(OCG_Duel duel, const char* buffer, uint32_t length, const char* name)
  const ocgapiLoadScript = cwrap(
    "ocgapiLoadScript",
    "number",
    ["number", "number", "number", "number"] as const,
    { async: true }
  );

  //uint32_t ocgapiDuelQueryCount(OCG_Duel duel, uint8_t team, uint32_t loc)
  const ocgapiDuelQueryCount = cwrap(
    "ocgapiDuelQueryCount",
    "void",
    [] as const
  );

  //void* ocgapiDuelQuery(OCG_Duel duel, uint32_t* length, OCG_QueryInfo* info)
  const ocgapiDuelQuery = cwrap("ocgapiDuelQuery", "void", [] as const);

  //void* ocgapiDuelQueryLocation(OCG_Duel duel, uint32_t* length, OCG_QueryInfo* info)
  const ocgapiDuelQueryLocation = cwrap(
    "ocgapiDuelQueryLocation",
    "void",
    [] as const
  );

  //void* ocgapiDuelQueryField(OCG_Duel duel, uint32_t* length)
  const ocgapiDuelQueryField = cwrap(
    "ocgapiDuelQueryField",
    "number",
    [] as const
  );

  const OCG_DuelOptions = CStruct(m, [
    ["seed", "i32"],
    ["flags", "i64"],
    [
      "team1",
      [
        ["startingLP", "i32"],
        ["startingDrawCount", "i32"],
        ["drawCountPerTurn", "i32"],
      ],
    ],
    [
      "team2",
      [
        ["startingLP", "i32"],
        ["startingDrawCount", "i32"],
        ["drawCountPerTurn", "i32"],
      ],
    ],
    ["cardReader", "*"],
    ["cardReaderPayload", "*"],
    ["scriptReader", "*"],
    ["scriptReaderPayload", "*"],
    ["errorHandler", "*"],
    ["errorHandlerPayload", "*"],
    ["cardReaderDone", "*"],
    ["cardReaderDonePayload", "*"],
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
    (payload: number, duel: number, name: number, res: number): number => {
      const { scriptReader } = callbacks.get(payload);
      return m.Asyncify.handleAsync(async () => {
        const contents = await scriptReader(m.UTF8ToString(name));
        if (contents) {
          const contentLength = m.lengthBytesUTF8(contents);
          const contentPtr = m._malloc(contentLength + 1);
          m.stringToUTF8(contents, contentPtr, contentLength + 1);
          m.setValue(res, contentPtr, "i32");
          m.setValue(res + 4, contentLength, "i32");
        } else {
          m.setValue(res, 0, "i32");
          m.setValue(res + 4, 0, "i32");
        }
        return;
      });
    },
    "viiii"
  );
  const callbackErrorHandler = m.addFunction(
    (payload: number, message: number, type: number) => {
      const { errorHandler } = callbacks.get(payload);
      errorHandler(type, m.UTF8ToString(message));
    },
    "viii"
  );

  return {
    getVersion() {
      const majorPtr = m._malloc(8);
      const minorPtr = majorPtr + 4;
      ocgapiGetVersion(majorPtr, minorPtr);
      return [
        m.getValue(majorPtr, "i32"),
        m.getValue(minorPtr, "i32"),
      ] as const;
    },
    async createDuel(options: OcgDuelOptions): Promise<OcgDuelHandle | null> {
      const options1 = OCG_DuelOptions.new();
      options1.seed = options.seed;
      options1.flags = options.flags;
      options1.team1.drawCountPerTurn = options.team1.drawCountPerTurn;
      options1.team1.startingDrawCount = options.team1.startingDrawCount;
      options1.team1.startingLP = options.team1.startingLP;
      options1.team2.drawCountPerTurn = options.team2.drawCountPerTurn;
      options1.team2.startingDrawCount = options.team2.startingDrawCount;
      options1.team2.startingLP = options.team2.startingLP;

      lastCallbackId++;
      callbacks.set(lastCallbackId, {
        cardReader: options.cardReader,
        errorHandler: options.errorHandler,
        scriptReader: options.scriptReader,
      });
      options1.cardReader = callbackCardReader;
      options1.cardReaderPayload = lastCallbackId;
      options1.cardReaderDone = callbackCardReaderDone;
      options1.cardReaderDonePayload = lastCallbackId;
      options1.scriptReader = callbackScriptReader;
      options1.scriptReaderPayload = lastCallbackId;
      options1.errorHandler = callbackErrorHandler;
      options1.errorHandlerPayload = lastCallbackId;

      const duelPtr = m._malloc(4);
      const res = await ocgapiCreateDuel(duelPtr, options1.__ptr);
      if (res != 0) {
        m._free(duelPtr);
        return null;
      }

      const duelHandle = m.getValue(duelPtr, "i32");
      m._free(duelPtr);
      return {
        [DuelHandleSymbol]: duelHandle,
      };
    },
    destroyDuel(duelHandle: OcgDuelHandle) {
      ocgapiDestroyDuel(duelHandle[DuelHandleSymbol]);
    },
    async duelNewCard(duelHandle: OcgDuelHandle, cardInfo: OcgNewCardInfo) {
      const newCard = OCG_NewCardInfo.new();
      newCard.team = cardInfo.team;
      newCard.duelist = cardInfo.duelist;
      newCard.code = cardInfo.code;
      newCard.con = cardInfo.con;
      newCard.loc = cardInfo.loc;
      newCard.seq = cardInfo.seq;
      newCard.pos = cardInfo.pos;
      await ocgapiDuelNewCard(duelHandle[DuelHandleSymbol], newCard.__ptr);
      newCard.free();
    },
    async startDuel(duelHandle: OcgDuelHandle) {
      await ocgapiStartDuel(duelHandle[DuelHandleSymbol]);
    },
    async duelProcess(duelHandle: OcgDuelHandle): Promise<OcgProcessResult> {
      return await ocgapiDuelProcess(duelHandle[DuelHandleSymbol]);
    },
    duelGetMessage(duelHandle: OcgDuelHandle) {
      const lenPtr = m._malloc(4);
      const buffer = ocgapiDuelGetMessage(duelHandle[DuelHandleSymbol], lenPtr);
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
    duelSetResponse(duelHandle: OcgDuelHandle, response: OcgResponse) {
      const buffer = createResponse(response);
      const bufferPtr = m._malloc(buffer.length);
      m.HEAPU8.set(buffer, bufferPtr);

      ocgapiDuelSetResponse(
        duelHandle[DuelHandleSymbol],
        bufferPtr,
        buffer.length
      );
      m._free(bufferPtr);
    },
    async loadScript(duelHandle: OcgDuelHandle, name: string, content: string) {
      const contentLength = m.lengthBytesUTF8(content);
      const contentPtr = m._malloc(contentLength + 1);
      m.stringToUTF8(content, contentPtr, contentLength + 1);
      const nameLength = m.lengthBytesUTF8(name);
      const namePtr = m._malloc(nameLength + 1);
      m.stringToUTF8(name, namePtr, nameLength + 1);

      return (
        (await ocgapiLoadScript(
          duelHandle[DuelHandleSymbol],
          contentPtr,
          contentLength,
          namePtr
        )) == 1
      );
    },
    duelQueryCount() {},
    duelQuery() {},
    duelQueryLocation() {},
    duelQueryField() {},
  };
}
