import { OcgCardData, OcgDuelOptions, OcgNewCardInfo } from "./types";

type OcgCardDataPointers =
  | { ptrSize: 8; setcodes: bigint }
  | { ptrSize: 4; setcodes: number };

// | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 32BIT
// | ----------------------------- |
// | code          | alias         |
// | setcodes      | type          |
// | level         | attribute     |
// | race                          |
// | attack        | defense       |
// | lscale        | rscale        |
// | link_marker   | -             |

// | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 64BIT
// | ----------------------------- |
// | code          | alias         |
// | setcodes                      |
// | type          | level         |
// | attribute     | -             |
// | race                          |
// | attack        | defense       |
// | lscale        | rscale        |
// | link_marker   | -             |

export function writeCardData(
  view: DataView,
  data: Omit<OcgCardData, "setcodes"> & OcgCardDataPointers
) {
  // uint32_t code;
  view.setUint32(0, data.code, true);
  // uint32_t alias;
  view.setUint32(4, data.alias, true);
  if (data.ptrSize === 4) {
    // uint16_t* setcodes;
    view.setUint32(8, data.setcodes, true);
    // uint32_t type;
    view.setUint32(12, data.type, true);
    // uint32_t level;
    view.setUint32(16, data.level, true);
    // uint32_t attribute;
    view.setUint32(20, data.attribute, true);
    // uint64_t race;
    view.setBigUint64(24, data.race, true);
    // int32_t attack;
    view.setInt32(32, data.attack, true);
    // int32_t defense;
    view.setInt32(36, data.defense, true);
    // uint32_t lscale;
    view.setUint32(40, data.lscale, true);
    // uint32_t rscale;
    view.setUint32(48, data.rscale, true);
    // uint32_t link_marker;
    view.setUint32(52, data.link_marker, true);
  } else {
    // uint16_t* setcodes;
    view.setBigUint64(8, data.setcodes, true);
    // uint32_t type;
    view.setUint32(16, data.type, true);
    // uint32_t level;
    view.setUint32(20, data.level, true);
    // uint32_t attribute;
    view.setUint32(24, data.attribute, true);
    // uint64_t race;
    view.setBigUint64(32, data.race, true);
    // int32_t attack;
    view.setInt32(36, data.attack, true);
    // int32_t defense;
    view.setInt32(40, data.defense, true);
    // uint32_t lscale;
    view.setUint32(44, data.lscale, true);
    // uint32_t rscale;
    view.setUint32(48, data.rscale, true);
    // uint32_t link_marker;
    view.setUint32(52, data.link_marker, true);
  }
}

type OcgDuelCallbackOptions =
  | {
      ptrSize: 8;
      cardReader: bigint;
      cardReaderPayload: bigint;
      scriptReader: bigint;
      scriptReaderPayload: bigint;
      errorHandler: bigint;
      errorHandlerPayload: bigint;
      cardReaderDone: bigint;
      cardReaderDonePayload: bigint;
    }
  | {
      ptrSize: 4;
      cardReader: number;
      cardReaderPayload: number;
      scriptReader: number;
      scriptReaderPayload: number;
      errorHandler: number;
      errorHandlerPayload: number;
      cardReaderDone: number;
      cardReaderDonePayload: number;
    };

export function writeDuelOptions(
  view: DataView,
  options: Omit<
    OcgDuelOptions,
    "cardReader" | "scriptReader" | "errorHandler"
  > & {
    enableUnsafeLibraries: boolean;
  } & OcgDuelCallbackOptions
) {
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

  if (options.ptrSize === 4) {
    // OCG_DataReader cardReader
    view.setUint32(64, options.cardReader, true);
    // void* payload1
    view.setUint32(68, options.cardReaderPayload, true);
    // OCG_ScriptReader scriptReader
    view.setUint32(72, options.scriptReader, true);
    // void* payload2
    view.setUint32(76, options.scriptReaderPayload, true);
    // OCG_LogHandler logHandler
    view.setUint32(80, options.errorHandler, true);
    // void* payload3
    view.setUint32(84, options.errorHandlerPayload, true);
    // OCG_DataReaderDone cardReaderDone
    view.setUint32(88, options.cardReaderDone, true);
    // void* payload4
    view.setUint32(92, options.cardReaderDonePayload, true);
    // uint8_t enableUnsafeLibraries
    view.setUint8(96, options.enableUnsafeLibraries ? 1 : 0);
  } else {
    // OCG_DataReader cardReader
    view.setBigUint64(64, options.cardReader, true);
    // void* payload1
    view.setBigUint64(72, options.cardReaderPayload, true);
    // OCG_ScriptReader scriptReader
    view.setBigUint64(80, options.scriptReader, true);
    // void* payload2
    view.setBigUint64(88, options.scriptReaderPayload, true);
    // OCG_LogHandler logHandler
    view.setBigUint64(96, options.errorHandler, true);
    // void* payload3
    view.setBigUint64(104, options.errorHandlerPayload, true);
    // OCG_DataReaderDone cardReaderDone
    view.setBigUint64(112, options.cardReaderDone, true);
    // void* payload4
    view.setBigUint64(120, options.cardReaderDonePayload, true);
    // uint8_t enableUnsafeLibraries
    view.setUint8(128, options.enableUnsafeLibraries ? 1 : 0);
  }
}

export function writeNewCardInfo(view: DataView, data: OcgNewCardInfo) {
  // uint8_t team; /* either 0 or 1 */
  view.setUint8(0, data.team);
  // uint8_t duelist; /* index of original owner */
  view.setUint8(1, data.duelist);
  // uint32_t code;
  view.setUint32(4, data.code, true);
  // uint8_t con;
  view.setUint8(8, data.controller);
  // uint32_t loc;
  view.setUint32(12, data.location, true);
  // uint32_t seq;
  view.setUint32(16, data.sequence, true);
  // uint32_t pos;
  view.setUint32(20, data.position, true);
}
