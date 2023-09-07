import { readFile } from "fs/promises";
import sqlite3 from "node-sqlite3-wasm";
import path, { join } from "path";
import initialize, { OcgResponse, OcgResponseType } from "../src/index";
import {
  OcgDuelMode,
  OcgLocation,
  OcgPosition,
  OcgProcessResult,
  OcgType,
} from "../src/type_core";
import { OcgCardData, messageTypeStrings } from "../src/types";

const scriptPath = "C:\\ProjectIgnis\\script";
const cdbPath = "C:\\ProjectIgnis\\expansions";

Error.stackTraceLimit = Infinity;

async function main() {
  const db = new sqlite3.Database(join(cdbPath, "cards.cdb"));
  const cards = loadCards(db);

  const lib = await initialize({
    wasmBinary: await readFile("./lib/ocgcore.wasm"),
  });

  const [verMaj, verMin] = lib.getVersion();
  console.log(`OCGCORE: ${verMaj}.${verMin}`);

  const handle = await lib.createDuel({
    flags: OcgDuelMode.MODE_MR5,
    seed: [1n, 1n, 1n, 1n],
    team1: {
      drawCountPerTurn: 1,
      startingDrawCount: 5,
      startingLP: 8000,
    },
    team2: {
      drawCountPerTurn: 1,
      startingDrawCount: 5,
      startingLP: 8000,
    },
    cardReader: async (code) => {
      const card = cards.get(code);
      if (!card) {
        console.warn("missing card: ", code);
      }
      return (
        card ?? {
          code,
          alias: 0,
          setcodes: [],
          type: 0,
          level: 0,
          attribute: 0,
          race: 0n,
          attack: 0,
          defense: 0,
          lscale: 0,
          rscale: 0,
          link_marker: 0,
        }
      );
    },
    scriptReader: async (script) => {
      const filePath = script.match(/c\d+\.lua/)
        ? path.join(scriptPath, "official", script)
        : path.join(scriptPath, script);

      console.log(`loading script: ${script}`);

      try {
        return await readFile(filePath, "utf-8");
      } catch (e) {
        console.log(`error reading script "${script}", ${e}`);
        throw e;
      }
    },
    errorHandler: (type, text) => {
      console.warn(type, text);
    },
  });

  if (!handle) {
    throw new Error("failed to create");
  }

  await lib.loadScript(
    handle,
    "constant.lua",
    await readFile(path.join(scriptPath, "constant.lua"), "utf8")
  );

  await lib.loadScript(
    handle,
    "utility.lua",
    await readFile(path.join(scriptPath, "utility.lua"), "utf8")
  );

  const addCard = async (
    team: number,
    code: number,
    location: OcgLocation,
    position: OcgPosition
  ) => {
    await lib.duelNewCard(handle, {
      code,
      duelist: 0,
      team,
      controller: team,
      location,
      position,
      sequence: 0,
    });
  };

  for (const card of deck.mainDeck) {
    await addCard(0, card, OcgLocation.DECK, OcgPosition.FACEDOWN_DEFENSE);
  }
  for (const card of deck.extraDeck) {
    await addCard(0, card, OcgLocation.EXTRA, OcgPosition.FACEDOWN_DEFENSE);
  }
  for (const card of deck.mainDeck) {
    await addCard(1, card, OcgLocation.DECK, OcgPosition.FACEDOWN_DEFENSE);
  }
  for (const card of deck.extraDeck) {
    await addCard(1, card, OcgLocation.EXTRA, OcgPosition.FACEDOWN_DEFENSE);
  }

  await lib.startDuel(handle);

  let messagesToSend: (OcgResponse | null)[] = [
    // activate Quick Launch
    {
      type: OcgResponseType.SELECT_CHAIN,
      index: 0,
    },
    // select place for Quick Launch
    {
      type: OcgResponseType.SELECT_PLACE,
      places: [{ player: 0, location: OcgLocation.SZONE, sequence: 2 }],
    },
    // skip select_chain
    { type: OcgResponseType.SELECT_CHAIN, cancel: true },
    { type: OcgResponseType.SELECT_CHAIN, cancel: true },
    // select Rokket Tracer
    { type: OcgResponseType.SELECT_CARD, indicies: [2] },
    // select place for Rokket Tracer
    {
      type: OcgResponseType.SELECT_PLACE,
      places: [{ player: 0, location: OcgLocation.MZONE, sequence: 2 }],
    },
    // select position for Rokket Tracer
    {
      type: OcgResponseType.SELECT_POSITION,
      position: OcgPosition.FACEUP_ATTACK,
    },
    // skip select_chain
    { type: OcgResponseType.SELECT_CHAIN, cancel: true },
    { type: OcgResponseType.SELECT_CHAIN, cancel: true },
    { type: OcgResponseType.SELECT_CHAIN, cancel: true },
    { type: OcgResponseType.SELECT_CHAIN, cancel: true },
  ];

  while (true) {
    const status = await lib.duelProcess(handle);

    const data = lib.duelGetMessage(handle);
    data
      .filter((d) => d)
      .map((d) => ({ ...d, type: messageTypeStrings[d.type] }))
      .forEach((d) => console.log(d));

    if (status === OcgProcessResult.END) {
      break;
    }
    if (status === OcgProcessResult.CONTINUE) {
      continue;
    }

    const response = messagesToSend.shift();
    if (response === undefined) {
      console.log("no more programmed responses");
      break;
    }
    if (response) {
      lib.duelSetResponse(handle, response);
    }
  }
}
const deck = {
  mainDeck: [
    96005454, 55878038, 88774734, 67748760, 61901281, 26655293, 15381421,
    99234526, 68464358, 5969957, 57143342, 80250185, 30227494, 30227494,
    81035362, 45894482, 62957424, 99745551, 35272499, 35272499, 35272499,
    81275020, 20758643, 61677004, 10802915, 10802915, 56410040, 56410040,
    15981690, 15981690, 53932291, 43694650, 48686504, 48686504, 48686504,
    19353570, 19353570, 19353570, 8972398, 1845204, 47325505, 47325505,
    47325505, 54693926, 54693926, 54693926, 81439173, 99266988, 99266988,
    99266988, 24224830, 24224830, 24224830, 31443476, 31443476, 31443476,
    67723438, 36668118, 62265044, 61740673,
  ],
  extraDeck: [
    17881964, 27548199, 63767246, 85289965, 65330383, 4280258, 23935886,
    98095162, 38342335, 2857636, 11969228, 58699500, 13143275, 73539069,
    86148577,
  ],
};

function asBigInt(v: number | bigint) {
  return typeof v === "bigint" ? v : BigInt(v);
}
function asNumber(v: number | bigint) {
  return typeof v === "number" ? v : Number(v);
}

function loadCards(db: sqlite3.Database) {
  type Card = {
    id: number | bigint;
    ot: number | bigint;
    alias: number | bigint;
    setcode: number | bigint;
    type: number | bigint;
    atk: number | bigint;
    def: number | bigint;
    level: number | bigint;
    race: number | bigint;
    attribute: number | bigint;
    category: number | bigint;
  };

  const cards = new Map<number, OcgCardData>();

  const data = db.all("SELECT * FROM datas");
  for (const d of data) {
    const datum = d as Card;
    const setcode = asBigInt(datum.setcode);
    const setcodes = [...new Int16Array(BigInt64Array.from([setcode]).buffer)];
    const type = asNumber(datum.type);

    const card: OcgCardData = {
      code: asNumber(datum.id),
      alias: asNumber(datum.alias),
      setcodes,
      type,
      attack: asNumber(datum.atk),
      defense: type & OcgType.LINK ? 0 : asNumber(datum.def),
      link_marker: type & OcgType.LINK ? asNumber(datum.def) : 0,
      level: asNumber(datum.level) & 0xff,
      lscale: (asNumber(datum.level) >> 24) & 0xff,
      rscale: (asNumber(datum.level) >> 16) & 0xff,
      race: asBigInt(datum.race),
      attribute: asNumber(datum.attribute),
    };

    cards.set(card.code, card);
  }

  return cards;
}

// CREATE TABLE "texts" (
//     "id"    INTEGER,
//     "name"  TEXT,
//     "desc"  TEXT,
//     "str1"  TEXT,
//     "str2"  TEXT,
//     "str3"  TEXT,
//     "str4"  TEXT,
//     "str5"  TEXT,
//     "str6"  TEXT,
//     "str7"  TEXT,
//     "str8"  TEXT,
//     "str9"  TEXT,
//     "str10" TEXT,
//     "str11" TEXT,
//     "str12" TEXT,
//     "str13" TEXT,
//     "str14" TEXT,
//     "str15" TEXT,
//     "str16" TEXT,
//     PRIMARY KEY("id")
// )

main().catch((e) => console.log(e));
