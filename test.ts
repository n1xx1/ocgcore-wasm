import initialize from "./src/index";
import { OcgDuelMode } from "./src/type_core";

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
      return false;
    },
    errorHandler: (type, text) => {
      console.warn(type, text);
    },
  });
  console.log(handle);
})();
