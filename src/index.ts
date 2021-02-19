import { OcgCardData, OcgDuelOptions, OcgNewCardInfo } from "./types";
import { OcgProcessResult } from "./type_core";

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
}

export default async function initialize() {
  const factory: EmscriptenModuleFactory<LibraryModule> = require("../lib/output.js");
  return createLibrary(
    await factory({
      print(str) {
        console.log(str);
      },
      printErr(str) {
        console.error(str);
      },
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
  const ocgapiCreateDuel = cwrap("ocgapiCreateDuel", "number", [
    "number",
    "number",
  ] as const);

  //void ocgapiDestroyDuel(OCG_Duel duel)
  const ocgapiDestroyDuel = cwrap("ocgapiDestroyDuel", "void", [
    "number",
  ] as const);

  //void ocgapiDuelNewCard(OCG_Duel duel, OCG_NewCardInfo* info)
  const ocgapiDuelNewCard = cwrap("ocgapiDuelNewCard", "void", [
    "number",
    "number",
  ] as const);

  //void ocgapiStartDuel(OCG_Duel duel)
  const ocgapiStartDuel = cwrap("ocgapiStartDuel", "void", ["number"] as const);

  //int ocgapiDuelProcess(OCG_Duel duel)
  const ocgapiDuelProcess = cwrap("ocgapiDuelProcess", "number", [
    "number",
  ] as const);

  //void* ocgapiDuelGetMessage(OCG_Duel duel, uint32_t* length)
  const ocgapiDuelGetMessage = cwrap(
    "ocgapiDuelGetMessage",
    "void",
    [] as const
  );

  //void ocgapiDuelSetResponse(OCG_Duel duel, const void* buffer, uint32_t length)
  const ocgapiDuelSetResponse = cwrap(
    "ocgapiDuelSetResponse",
    "void",
    [] as const
  );

  //int ocgapiLoadScript(OCG_Duel duel, const char* buffer, uint32_t length, const char* name)
  const ocgapiLoadScript = cwrap("ocgapiLoadScript", "void", [] as const);

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

  const OCG_DuelOptions = defineStruct(m, [
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

  const OCG_CardData = defineStruct(m, [
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

  const OCG_NewCardInfo = defineStruct(m, [
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
      cardReader(id: number): OcgCardData;
      scriptReader(path: string): boolean;
      errorHandler(type: number, message: string): void;
    }
  >();

  const callbackCardReader = m.addFunction(
    (payload: number, code: number, data: number) => {
      const { cardReader } = callbacks.get(payload);
      const card = OCG_CardData.from(data);
      const cardData = cardReader(code);

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
      return scriptReader(m.UTF8ToString(name)) ? 1 : 0;
    },
    "iiii"
  );
  const callbackErrorHandler = m.addFunction(
    (payload: number, message: number, type: number) => {
      const { errorHandler } = callbacks.get(payload);
      errorHandler(type, m.UTF8ToString(message));
    },
    "iiii"
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
    createDuel(options: OcgDuelOptions): OcgDuelHandle | null {
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
      console.log(duelPtr, options1.__ptr);
      const res = ocgapiCreateDuel(duelPtr, options1.__ptr);
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
    duelNewCard(duelHandle: OcgDuelHandle, cardInfo: OcgNewCardInfo) {
      const newCard = OCG_NewCardInfo.new();
      newCard.team = cardInfo.team;
      newCard.duelist = cardInfo.duelist;
      newCard.code = cardInfo.code;
      newCard.con = cardInfo.con;
      newCard.loc = cardInfo.loc;
      newCard.seq = cardInfo.seq;
      newCard.pos = cardInfo.pos;
      ocgapiDuelNewCard(duelHandle[DuelHandleSymbol], newCard.__ptr);
      newCard.free();
    },
    startDuel(duelHandle: OcgDuelHandle) {
      ocgapiDuelProcess(duelHandle[DuelHandleSymbol]);
    },
    duelProcess(duelHandle: OcgDuelHandle): OcgProcessResult {
      return ocgapiDuelProcess(duelHandle[DuelHandleSymbol]);
    },
    duelGetMessage() {},
    duelSetResponse() {},
    loadScript() {},
    duelQueryCount() {},
    duelQuery() {},
    duelQueryLocation() {},
    duelQueryField() {},
  };
}

function defineStruct<T extends readonly StructRecord[]>(
  m: LibraryModule,
  structure: T
) {
  const layout = produceStructure(structure);
  return {
    new(): StructDeclaration<T> {
      const ptr = m._malloc(layout.__size);
      return structProxy(m, ptr, layout, true);
    },
    from(ptr: number): StructDeclaration<T> {
      return structProxy(m, ptr, layout, false);
    },
  };
}

function structProxy(
  m: LibraryModule,
  ptr: number,
  layout: StructDefinition,
  owned: boolean
) {
  return new Proxy(
    {},
    {
      get(target, prop: string) {
        if (prop === "free") {
          return () => {
            if (owned) {
              m._free(ptr);
              ptr = undefined;
              owned = false;
            }
          };
        }
        if (prop.startsWith("__")) {
          return layout[prop.substr(2)];
        }
        const f = layout[prop];
        if (f === undefined || ptr === undefined) {
          return undefined;
        }
        const { type, offset } = f;
        if (typeof type === "object") {
          return structProxy(m, ptr, type, owned);
        }
        if (type === "string") {
          const sptr = m.getValue(ptr + offset, "*");
          return m.UTF8ToString(sptr);
        }
        if (type === "i64") {
          const low = m.getValue(ptr + offset, "i32");
          const high = m.getValue(ptr + offset + 4, "i32");
          return BigInt(low) | (BigInt(high) << 32n);
        }
        return m.getValue(ptr + offset, type);
      },
      set(target, prop: string, value) {
        const f = layout[prop];
        if (f === undefined || ptr === undefined) {
          return false;
        }
        const { type, offset } = f;
        if (typeof type === "object") {
          return false;
        }
        if (type === "string") {
          const s = m.lengthBytesUTF8(value);
          // TODO: cleanup
          const p = m._malloc(s);
          m.stringToUTF8(value, p);
          m.setValue(ptr + offset, p, "*");
          return true;
        }
        if (type === "i64") {
          const vb = value as bigint;
          m.setValue(ptr + offset, Number(vb & 4294967295n), "i32");
          m.setValue(ptr + offset + 4, Number(vb >> 32n), "i32");
          return true;
        }
        m.setValue(ptr + offset, value, type);
        return true;
      },
    }
  );
}

function produceStructure(
  s: readonly StructRecord[],
  offset = 0
): StructDefinition {
  const def = {} as StructDefinition;
  let size = 0;
  for (const [f, t] of s) {
    const align = getTypeAlign(t);
    const padding = (align - ((offset + size) % align)) % align;
    const aligned = offset + size + padding;

    if (Array.isArray(t)) {
      const subStructure = produceStructure(t, aligned);
      def[f] = {
        offset: aligned,
        type: subStructure,
      };
      size += subStructure.__size;
      continue;
    }

    const type = t as Exclude<StructRecord[1], readonly StructRecord[]>;
    def[f] = {
      offset: aligned,
      type,
    };
    size += padding + getTypeSize(type);
  }
  def.__size = size;
  return def;
}

function getTypeAlign(type: StructRecord[1]) {
  while (Array.isArray(type)) {
    type = type[0][1];
  }
  // @ts-ignore
  if (type.endsWith("*")) {
    return 4;
  }
  switch (type) {
    case "i8":
      return 1;
    case "i16":
      return 2;
    case "i32":
      return 4;
    case "i64":
      return 8;
    case "float":
      return 4;
    case "double":
      return 8;
  }
  console.log(type);
}

function getTypeSize(type: Emscripten.CType | "string") {
  if (type.endsWith("*")) {
    return 4;
  }
  switch (type) {
    case "i8":
      return 1;
    case "i16":
      return 2;
    case "i32":
      return 4;
    case "i64":
      return 8;
    case "float":
      return 4;
    case "double":
      return 8;
  }
}

type StructDefinition = {
  [id: string]: {
    offset: number;
    type: "string" | Emscripten.CType | StructDefinition;
  };
} & { __size: number };

type StructRecord = readonly [
  string,
  Emscripten.CType | "string" | readonly StructRecord[]
];

type Cast<X, Y> = X extends Y ? X : Y;

type implStructDeclaration<T> = T extends readonly (readonly [
  infer Key,
  unknown
])[]
  ? {
      [K in Cast<Key, string>]: ConvertC<
        Extract<T[number], readonly [K, unknown]>[1]
      >;
    }
  : never;

type StructDeclaration<T> = implStructDeclaration<T> & {
  __ptr: number;
  __layout: StructDefinition;
  __owned: boolean;
  free(): void;
};

type ConvertC<T> = T extends "string"
  ? string
  : "i64" extends T
  ? bigint
  : T extends Emscripten.CType
  ? number
  : T extends readonly StructRecord[]
  ? StructDeclaration<T>
  : never;

type TEST = [
  ["test", "i8"],
  ["test1", "string"],
  ["sub", [["test", "i8"], ["test1", "string"]]]
];
type XD = StructDeclaration<TEST>;

type JSType = "number" | "string" | "array" | "boolean";

type Convert<T> = T extends "void"
  ? void
  : "number" extends T
  ? number
  : "string" extends T
  ? string
  : "array" extends T
  ? number
  : "boolean" extends T
  ? boolean
  : never;

type ConvertArgs<Args extends readonly any[]> = Args extends readonly [
  infer T,
  ...infer Rest
]
  ? [Convert<T>, ...ConvertArgs<Rest>]
  : [];

function betterCwrap(m: { cwrap: typeof cwrap }) {
  return function <Ret extends JSType | "void", Args extends readonly JSType[]>(
    name: string,
    ret: Ret,
    args: Args
  ): (...args: ConvertArgs<Args>) => Convert<Ret> {
    return m.cwrap.apply(m, [name, ret === "void" ? null : ret, args]);
  };
}
