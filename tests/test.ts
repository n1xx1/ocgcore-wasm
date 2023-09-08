import { readFile } from "fs/promises";
import sqlite3 from "node-sqlite3-wasm";
import path, { join } from "path";
import createCore, { OcgResponse, OcgResponseType } from "../src/index";
import {
  OcgDuelMode,
  OcgHintType,
  OcgLocation,
  OcgPhase,
  OcgPosition,
  OcgProcessResult,
  OcgType,
  ocgPositionParse,
} from "../src/type_core";
import {
  OcgCardData,
  OcgCardLoc,
  OcgLocPos,
  OcgMessage,
  OcgMessageCardHintType,
  OcgMessageType,
  messageTypeStrings,
} from "../src/types";

const scriptPath = "C:\\ProjectIgnis\\script";
const cdbPath = "C:\\ProjectIgnis\\expansions";
const stringsPath = "C:\\ProjectIgnis\\config\\strings.conf";

Error.stackTraceLimit = Infinity;

async function main() {
  const db = new sqlite3.Database(join(cdbPath, "cards.cdb"));
  const cards = loadCards(db);
  const cardTexts = loadTexts(db);
  db.close();

  const lang: LangData = {
    texts: cardTexts,
    ...(await loadStrings()),
  };

  const lib = await createCore();

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

      // console.log(`loading script: ${script}`);

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
    data.filter((d) => d).forEach((d) => printMessage(lang, d));

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

function stringPositionShort(l: OcgPosition) {
  switch (l) {
    case OcgPosition.FACEUP_ATTACK:
      return "FU-ATK";
    case OcgPosition.FACEDOWN_ATTACK:
      return "FD-ATK";
    case OcgPosition.FACEUP_DEFENSE:
      return "FU-DEF";
    case OcgPosition.FACEDOWN_DEFENSE:
      return "FD-DEF";
    case OcgPosition.FACEUP:
      return "FU";
    case OcgPosition.FACEDOWN:
      return "FD";
    case OcgPosition.ATTACK:
      return "ATK";
    case OcgPosition.DEFENSE:
      return "DEF";
  }
  return "?";
}

function stringPosition(l: OcgPosition) {
  switch (l) {
    case OcgPosition.FACEUP_ATTACK:
      return "Face-up Attack";
    case OcgPosition.FACEDOWN_ATTACK:
      return "Face-down Attack";
    case OcgPosition.FACEUP_DEFENSE:
      return "Face-up Defense";
    case OcgPosition.FACEDOWN_DEFENSE:
      return "Face-down Defense";
    case OcgPosition.FACEUP:
      return "Face-up";
    case OcgPosition.FACEDOWN:
      return "Face-down";
    case OcgPosition.ATTACK:
      return "Attack";
    case OcgPosition.DEFENSE:
      return "Defense";
  }
  return "?";
}

function stringPhase(p: OcgPhase) {
  switch (p) {
    case OcgPhase.DRAW:
      return "Draw Phase";
    case OcgPhase.STANDBY:
      return "Standby Phase";
    case OcgPhase.MAIN1:
      return "Main Phase 1";
    case OcgPhase.BATTLE_START:
      return "Battle Phase (Start Step)";
    case OcgPhase.BATTLE_STEP:
      return "Battle Phase (Battle Step)";
    case OcgPhase.DAMAGE:
      return "Battle Phase (Damage Step)";
    case OcgPhase.DAMAGE_CAL:
      return "Battle Phase (Damage Step, Damage Calculation)";
    case OcgPhase.BATTLE:
      return "Battle Phase (End Step)";
    case OcgPhase.MAIN2:
      return "Main Phase 2";
    case OcgPhase.END:
      return "End Phase";
  }
  return "?";
}

function stringLocationField({
  location,
  sequence,
}: Omit<OcgLocPos, "position" | "controller">) {
  if (location & OcgLocation.MZONE) {
    if (sequence == 5) {
      return `Extra Monster Zone Left`;
    }
    if (sequence == 6) {
      return `Extra Monster Zone Left`;
    }
    return `Monster Zone ${sequence + 1}`;
  }
  if (location & OcgLocation.SZONE) {
    if (sequence == 5) {
      return `Field Spell Zone`;
    } else if (sequence == 6) {
      return `Left Pendulum Zone`;
    } else if (sequence == 7) {
      return `Right Pendulum Zone`;
    }
    return `Spell Zone ${sequence + 1}`;
  }
  return "?";
}

function stringLocation({
  location,
  position,
  sequence,
}: Omit<OcgLocPos, "position" | "controller"> &
  Partial<Pick<OcgLocPos, "position">>) {
  function realZone() {
    if (location & OcgLocation.DECK) {
      return `Deck (${sequence + 1})`;
    }
    if (location & OcgLocation.HAND) {
      return `Hand (${sequence + 1})`;
    }
    if (location & OcgLocation.MZONE || location & OcgLocation.SZONE) {
      return `Field (${stringLocationField({ location, sequence })})`;
    }
    if (location & OcgLocation.GRAVE) {
      return `Grave (${sequence + 1})`;
    }
    if (location & OcgLocation.EXTRA) {
      return `Extra Deck (${sequence + 1})`;
    }
    if (location & OcgLocation.REMOVED) {
      return `Banished (${sequence + 1})`;
    }
    return "?";
  }
  if (!!(location & OcgLocation.OVERLAY) && position !== undefined) {
    return `Overlayed (${position + 1}), ${realZone()}`;
  }
  return realZone();
}

function stringLoc(loc: Omit<OcgLocPos, "position">) {
  const location = stringLocation(loc);
  return `P${loc.controller + 1}'s ${location}`;
}

function stringLocPos(locpos: OcgLocPos) {
  const position = stringPositionShort(locpos.position);
  const location = stringLocation(locpos);
  return `P${locpos.controller + 1}'s ${location} (${position})`;
}

function stringCardName(lang: LangData, code: number) {
  return lang.texts.get(code)?.name ?? `Card<${code}>`;
}

function stringDescription(lang: LangData, description: bigint) {
  const card = Number(description >> 20n);
  const index = Number(description & 0xfffffn);
  if (card !== 0) {
    const description = lang.texts.get(card)?.strings[index] ?? "???";
    return description;
  }
  if (index != 0) {
    const description = lang.system.get(index) ?? "???";
    return description;
  }
  return "";
}

function printMessage(lang: LangData, m: OcgMessage) {
  switch (m.type) {
    case OcgMessageType.DRAW:
      console.log(`\nP${m.player + 1} is drawing ${m.drawn.length} card(s).`);
      console.log(
        `Drawn: ${m.drawn
          .map((d) => {
            const name = stringCardName(lang, d.code);
            return `${name} (${stringPosition(d.position)})`;
          })
          .join("; ")}`
      );
      return;
    case OcgMessageType.SELECT_CHAIN: {
      if (m.spe_count == 0x7f) {
        console.log(
          `\nP${m.player + 1} is selecting a trigger effect to chain.`
        );
      } else if (m.selects.length == 0) {
        console.log(`\nP${m.player + 1} has nothing to chain.`);
      } else {
        console.log(`\nP${m.player + 1} is selecting an effect to chain.`);
      }
      if (m.selects.length > 0) {
        console.log(
          `Cards: ${m.selects
            .map((c) => {
              const name = stringCardName(lang, c.code);
              const locpos = stringLocPos(c);
              return `${name} [${locpos}]`;
            })
            .join("; ")}`
        );
      }
      return;
    }
    case OcgMessageType.SELECT_IDLECMD: {
      const mapCard = (c: OcgCardLoc) => {
        const name = stringCardName(lang, c.code);
        const locpos = stringLoc(c);
        return `${name} [${locpos}]`;
      };

      const summons = m.summons.map(mapCard);
      const special_summons = m.special_summons.map(mapCard);
      const monster_sets = m.monster_sets.map(mapCard);
      const pos_changes = m.pos_changes.map(mapCard);
      const spell_sets = m.spell_sets.map(mapCard);
      const activates = m.activates.map((c) => {
        const c1 = mapCard(c);
        const desc = stringDescription(lang, c.description);
        if (desc) {
          return `${c1} - "${desc}"`;
        }
        return c1;
      });

      console.log(`\nP${m.player + 1} is selecting an idle command.`);
      if (summons.length > 0) {
        console.log(`Normal Summon: ${summons.join("; ")}`);
      }
      if (special_summons.length > 0) {
        console.log(`Special Summon: ${special_summons.join("; ")}`);
      }
      if (monster_sets.length > 0) {
        console.log(`Set Monster: ${monster_sets.join("; ")}`);
      }
      if (pos_changes.length > 0) {
        console.log(`Change Battle Position: ${pos_changes.join("; ")}`);
      }
      if (spell_sets.length > 0) {
        console.log(`Set Spell/Trap: ${spell_sets.join("; ")}`);
      }
      if (activates.length > 0) {
        console.log(`Activate: ${activates.join("; ")}`);
      }

      return;
    }
    case OcgMessageType.SELECT_PLACE: {
      const options = parseFieldMask(m.field_mask);
      console.log(`\nP${m.player + 1} is selecting a zone.`);
      console.log(
        `Options: ${options.map((o) => stringLocationField(o)).join("; ")}`
      );
      return;
    }
    case OcgMessageType.SELECT_CARD: {
      console.log(`\nP${m.player + 1} is selecting ${m.min} to ${m.max} cards`);
      console.log(`Can cancel: ${m.can_cancel}`);
      console.log(
        `Options: ${m.selects
          .map((s) => {
            const name = stringCardName(lang, s.code);
            const locpos = stringLocPos(s);
            return `${name} [${locpos}]`;
          })
          .join("; ")}`
      );
      return;
    }
    case OcgMessageType.SELECT_POSITION: {
      const positions = ocgPositionParse(m.positions).map((x) =>
        stringPosition(x)
      );
      const name = stringCardName(lang, m.code);
      console.log(`\nP${m.player + 1} is selecting a position for ${name}`);
      console.log(`Options: ${positions.join(", ")}`);
      return;
    }
    case OcgMessageType.MOVE: {
      const name = stringCardName(lang, m.card);
      const from = stringLocPos(m.from);
      const to = stringLocPos(m.to);
      console.log(`\nCard ${name} moved from ${from} to ${to}`);
      return;
    }
    case OcgMessageType.CHAINING: {
      const name = stringCardName(lang, m.code);
      const location = stringLocPos(m);
      const triggerLocation = stringLoc({
        controller: m.triggering_controller,
        location: m.triggering_location,
        sequence: m.triggering_sequence,
      });
      console.log(`\nChaining ${name} at ${location}`);
      console.log(`Trigger location: ${triggerLocation}`);
      console.log(`Chain size: ${m.chain_size}`);
      return;
    }
    case OcgMessageType.CHAINED: {
      console.log(`\nChained; chain size: ${m.chain_size}`);
      return;
    }
    case OcgMessageType.CHAIN_SOLVING: {
      console.log(`\nChain-link is now resolving; chain size: ${m.chain_size}`);
      return;
    }
    case OcgMessageType.CHAIN_SOLVED: {
      console.log(`\nChain-link resolved; chain size: ${m.chain_size}`);
      return;
    }
    case OcgMessageType.CHAIN_END: {
      console.log(`\nChain ended`);
      return;
    }
    case OcgMessageType.SPSUMMONING: {
      const name = stringCardName(lang, m.code);
      const locpos = stringLocPos(m);
      console.log(`\nSpecial Summoning ${name} at ${locpos}`);
      return;
    }
    case OcgMessageType.SPSUMMONED: {
      console.log(`\nSpecial Summon Completed`);
      return;
    }
    case OcgMessageType.NEW_TURN: {
      console.log(`\nChange Turn, Player ${m.player + 1}`);
      return;
    }
    case OcgMessageType.NEW_PHASE: {
      console.log(`\nChange Phase, ${stringPhase(m.phase)}`);
      return;
    }
    case OcgMessageType.SHUFFLE_DECK: {
      console.log(`\nP${m.player + 1}'s Deck was shuffled`);
      return;
    }
    case OcgMessageType.CARD_HINT: {
      switch (m.card_hint) {
        case OcgMessageCardHintType.DESC_ADD: {
          const locpos = stringLocPos(m);
          const hint = lang.system.get(Number(m.description));
          console.log(`\nCard Hint, Description Added for card at ${locpos}`);
          console.log(`Hint: ${hint}`);
          return;
        }
        default:
          console.log(`\n${messageTypeStrings[m.type]}: unknown`);
          console.log(m);
          throw "stop";
      }
      return;
    }
    case OcgMessageType.HINT: {
      switch (m.hint_type) {
        case OcgHintType.EVENT: {
          const hint = lang.system.get(Number(m.hint));
          console.log(`\nHint for Player ${m.player + 1} (event): ${hint}`);
          return;
        }
        case OcgHintType.SELECTMSG: {
          console.log(
            `\nHint for Player ${m.player + 1} (select message): ${m.hint}`
          );
          return;
        }
        default:
          console.log(`\n${messageTypeStrings[m.type]}: unknown`);
          console.log(m);
          throw "stop";
      }
    }
    default: {
      console.log(`\n${messageTypeStrings[m.type]}: unknown`);
      console.log(m);
      throw "stop";
    }
  }
}

function asBigInt(v: number | bigint) {
  return typeof v === "bigint" ? v : BigInt(v);
}
function asNumber(v: number | bigint) {
  return typeof v === "number" ? v : Number(v);
}

function parseFieldMask(mask: number) {
  type OcgLoc = Omit<OcgLocPos, "position">;
  function parseFieldMaskPlayer(
    m: number,
    controller: number,
    places: OcgLoc[]
  ) {
    for (let i = 0; i < 7; i++) {
      // 5 mm, 2 em
      if ((m & 1) === 0) {
        places.push({ controller, location: OcgLocation.MZONE, sequence: i });
      }
      m >>= 1;
    }
    m >>= 1;
    for (let i = 0; i < 8; i++) {
      // 5 st, 1 fs, 2 p
      if ((m & 1) === 0) {
        places.push({ controller, location: OcgLocation.SZONE, sequence: i });
      }
      m >>= 1;
    }
  }

  const places: OcgLoc[] = [];
  parseFieldMaskPlayer(mask & 0xffff, 0, places);
  parseFieldMaskPlayer(mask >> 16, 0, places);
  return places;
}

type CardTextEntry = { name: string; strings: string[] };

function loadTexts(db: sqlite3.Database) {
  type CardText = {
    id: number;
    name: string;
    desc: string;
    str1: string;
    str2: string;
    str3: string;
    str4: string;
    str5: string;
    str6: string;
    str7: string;
    str8: string;
    str9: string;
    str10: string;
    str11: string;
    str12: string;
    str13: string;
    str14: string;
    str15: string;
    str16: string;
  };

  type Indexes = keyof {
    [K in keyof CardText as K extends `str${number}` ? K : never]: 1;
  };

  const cardTexts = new Map<number, CardTextEntry>();

  const data = db.all("SELECT * FROM texts");

  for (const d of data) {
    const datum = d as CardText;
    cardTexts.set(datum.id, {
      name: datum.name,
      strings: Array.from(
        { length: 16 },
        (_, i) => datum[`str${i + 1}` as Indexes]
      ),
    });
  }

  return cardTexts;
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

async function loadStrings() {
  const strings = (await readFile(stringsPath, "utf-8")).split(/[\r\n]+/g);

  const systemStrings = strings
    .map((x) => x.match(/^!system (\d+) (.*)$/))
    .filter((x): x is Exclude<typeof x, null> => !!x);

  return {
    system: new Map(systemStrings.map((s) => [+s[1], s[2]])),
  };
}

type LangData = { texts: ReturnType<typeof loadTexts> } & Awaited<
  ReturnType<typeof loadStrings>
>;

main().catch((e) => console.log(e));
