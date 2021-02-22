import initialize, { OcgDuelHandle } from "./src/index";
import { OcgDuelMode, OcgLocation, OcgPosition } from "./src/type_core";
import path from "path";
import { readFile } from "fs/promises";

const scriptPath =
  "C:\\Users\\n1xx1\\DEV\\n1xx1\\yugioh\\ygo-test\\bin\\script";

let loadingCards = 0;
(async () => {
  const lib = await initialize();
  console.log(lib.getVersion());
  const handle = lib.createDuel({
    flags: OcgDuelMode.MODE_MR5,
    seed: 0,
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
    cardReader: (code) => {
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
    scriptReader: (script) => {
      loadingCards++;
      const filePath = script.match(/c\d+\.lua/)
        ? path.join(scriptPath, "official", script)
        : path.join(scriptPath, script);

      readFile(filePath, "utf-8")
        .then((content) => {
          lib.loadScript(handle, script, content);
          loadingCards--;
        })
        .catch((e) => {
          console.log(`error reading script "${script}", ${e}`);
          loadingCards--;
        });
      return true;
    },
    errorHandler: (type, text) => {
      console.warn(type, text);
    },
  });

  console.log("test loadScript");
  lib.loadScript(
    handle,
    "constant.lua",
    await readFile(path.join(scriptPath, "constant.lua"), "utf8")
  );
  lib.loadScript(
    handle,
    "utility.lua",
    await readFile(path.join(scriptPath, "utility.lua"), "utf8")
  );

  console.log("test addCard");
  const addCard = (
    team: number,
    code: number,
    loc: OcgLocation,
    pos: OcgPosition
  ) =>
    lib.duelNewCard(handle, {
      code,
      duelist: 0,
      team,
      con: team,
      loc,
      pos,
      seq: 0,
    });

  for (const card of deck.mainDeck) {
    addCard(0, card, OcgLocation.DECK, OcgPosition.FACEDOWN_DEFENSE);
  }
  for (const card of deck.extraDeck) {
    addCard(0, card, OcgLocation.EXTRA, OcgPosition.FACEDOWN_DEFENSE);
  }
  for (const card of deck.mainDeck) {
    addCard(1, card, OcgLocation.DECK, OcgPosition.FACEDOWN_DEFENSE);
  }
  for (const card of deck.extraDeck) {
    addCard(1, card, OcgLocation.EXTRA, OcgPosition.FACEDOWN_DEFENSE);
  }

  console.log("test startDuel");
  lib.startDuel(handle);
  console.log(handle);
})();

const deck = {
  mainDeck: [
    96005454,
    55878038,
    88774734,
    67748760,
    61901281,
    26655293,
    15381421,
    99234526,
    68464358,
    5969957,
    57143342,
    80250185,
    30227494,
    30227494,
    81035362,
    45894482,
    62957424,
    99745551,
    35272499,
    35272499,
    35272499,
    81275020,
    20758643,
    61677004,
    10802915,
    10802915,
    56410040,
    56410040,
    15981690,
    15981690,
    53932291,
    43694650,
    48686504,
    48686504,
    48686504,
    19353570,
    19353570,
    19353570,
    8972398,
    1845204,
    47325505,
    47325505,
    47325505,
    54693926,
    54693926,
    54693926,
    81439173,
    99266988,
    99266988,
    99266988,
    24224830,
    24224830,
    24224830,
    31443476,
    31443476,
    31443476,
    67723438,
    36668118,
    62265044,
    61740673,
  ],
  extraDeck: [
    17881964,
    27548199,
    63767246,
    85289965,
    65330383,
    4280258,
    23935886,
    98095162,
    38342335,
    2857636,
    11969228,
    58699500,
    13143275,
    73539069,
    86148577,
  ],
};
