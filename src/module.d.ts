declare module "~/lib/ocgcore.jspi.mjs" {
  export type OcgCoreModule = _OcgCoreModule;

  const Module: EmscriptenModuleFactory<OcgCoreModule>;
  export default Module;
}

declare module "~/lib/ocgcore.jspi.wasm" {
  const wasm: Uint8Array;
  export default wasm;
}

interface _OcgCoreModule extends EmscriptenModule {
  stackAlloc: typeof stackAlloc;
  stackSave: typeof stackSave;
  stackRestore: typeof stackRestore;
  getValue: typeof getValue;
  lengthBytesUTF8: typeof lengthBytesUTF8;
  stringToUTF8: typeof stringToUTF8;

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
