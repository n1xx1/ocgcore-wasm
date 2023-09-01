import { readFile } from "fs/promises";
import path from "path";
import initialize from "../src/index";
import {
  OcgDuelMode,
  OcgLocation,
  OcgPosition,
  OcgProcessResult,
} from "../src/type_core";
import { messageTypeStrings } from "../src/types";

const scriptPath = "C:\\ProjectIgnis\\script";

Error.stackTraceLimit = Infinity;

async function main() {
  const lib = await initialize({
    wasmBinary: await readFile("./lib/ocgcore.wasm"),
  });

  const [verMaj, verMin] = lib.getVersion();
  console.log(`OCGCORE: ${verMaj}.${verMin}`);

  const handle = await lib.createDuel({
    flags: OcgDuelMode.MODE_MR5,
    seed: [0n, 0n, 0n, 0n],
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
      return {
        code,
        alias: 0,
        setcodes: [],
        type: 0,
        level: 0,
        attribute: 0,
        race: 0,
        attack: 0,
        defense: 0,
        lscale: 0,
        rscale: 0,
        link_marker: 0,
      };
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

  while (true) {
    const status = await lib.duelProcess(handle);

    const data = lib.duelGetMessage(handle);
    data
      .filter((d) => d)
      .map((d) => ({ ...d, type: messageTypeStrings[d.type] }))
      .forEach((d) => console.log(d));

    if (status == OcgProcessResult.END) {
      break;
    }
    if (status != OcgProcessResult.CONTINUE) {
      console.log("waiting response");
      break;
    }
  }
  console.log(await lib.duelProcess(handle));
  console.log(handle);
  return;
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

main().catch((e) => console.log(e));
