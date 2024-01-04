import { makeMap } from "./internal/utils";

export type OcgProcessResult = number;
export const OcgProcessResult = {
  END: 0,
  WAITING: 1,
  CONTINUE: 2,
} as const;

export const ocgProcessResultString = makeMap([
  [OcgProcessResult.END, "end"],
  [OcgProcessResult.WAITING, "waiting"],
  [OcgProcessResult.CONTINUE, "continue"],
]);

export type OcgPosition = number;

export const OcgPosition = {
  FACEUP_ATTACK: 0x1,
  FACEDOWN_ATTACK: 0x2,
  FACEUP_DEFENSE: 0x4,
  FACEDOWN_DEFENSE: 0x8,
  FACEUP: 0x5,
  FACEDOWN: 0xa,
  ATTACK: 0x3,
  DEFENSE: 0xc,
} as const;

export const ocgPositionString = makeMap([
  [OcgPosition.FACEUP_ATTACK, "faceup_attack"],
  [OcgPosition.FACEDOWN_ATTACK, "facedown_attack"],
  [OcgPosition.FACEUP_DEFENSE, "faceup_defense"],
  [OcgPosition.FACEDOWN_DEFENSE, "facedown_defense"],
  [OcgPosition.FACEUP, "faceup"],
  [OcgPosition.FACEDOWN, "facedown"],
  [OcgPosition.ATTACK, "attack"],
  [OcgPosition.DEFENSE, "defense"],
]);

const ocgPositionMapElements = [
  OcgPosition.FACEUP_ATTACK,
  OcgPosition.FACEDOWN_ATTACK,
  OcgPosition.FACEUP_DEFENSE,
  OcgPosition.FACEDOWN_DEFENSE,
];

export function ocgPositionParse(position: OcgPosition) {
  return ocgPositionMapElements.filter((x) => position & x);
}

export type OcgLocation = number;

export const OcgLocation = {
  DECK: 0x01,
  HAND: 0x02,
  MZONE: 0x04,
  SZONE: 0x08,
  GRAVE: 0x10,
  REMOVED: 0x20,
  EXTRA: 0x40,
  OVERLAY: 0x80,
  FZONE: 0x100,
  PZONE: 0x200,
  ONFIELD: 0x0c,
  ALL: 0x3ff,
} as const;

export const ocgLocationString = makeMap([
  [OcgLocation.DECK, "deck"],
  [OcgLocation.HAND, "hand"],
  [OcgLocation.MZONE, "mzone"],
  [OcgLocation.SZONE, "szone"],
  [OcgLocation.GRAVE, "grave"],
  [OcgLocation.REMOVED, "removed"],
  [OcgLocation.EXTRA, "extra"],
  [OcgLocation.OVERLAY, "overlay"],
  [OcgLocation.FZONE, "fzone"],
  [OcgLocation.PZONE, "pzone"],
  [OcgLocation.ONFIELD, "onfield"],
  [OcgLocation.ALL, "all"],
]);

const ocgLocationMapElements = [
  OcgLocation.DECK,
  OcgLocation.HAND,
  OcgLocation.MZONE,
  OcgLocation.SZONE,
  OcgLocation.GRAVE,
  OcgLocation.REMOVED,
  OcgLocation.EXTRA,
  OcgLocation.OVERLAY,
  OcgLocation.FZONE,
  OcgLocation.PZONE,
] as const;

export function ocgLocationParse(location: OcgLocation) {
  return ocgLocationMapElements.filter((x) => location & x);
}

export type OcgType = number;

export const OcgType = {
  MONSTER: 0x1,
  SPELL: 0x2,
  TRAP: 0x4,
  NORMAL: 0x10,
  EFFECT: 0x20,
  FUSION: 0x40,
  RITUAL: 0x80,
  TRAPMONSTER: 0x100,
  SPIRIT: 0x200,
  UNION: 0x400,
  GEMINI: 0x800,
  TUNER: 0x1000,
  SYNCHRO: 0x2000,
  TOKEN: 0x4000,
  MAXIMUM: 0x8000,
  QUICKPLAY: 0x10000,
  CONTINUOUS: 0x20000,
  EQUIP: 0x40000,
  FIELD: 0x80000,
  COUNTER: 0x100000,
  FLIP: 0x200000,
  TOON: 0x400000,
  XYZ: 0x800000,
  PENDULUM: 0x1000000,
  SPSUMMON: 0x2000000,
  LINK: 0x4000000,
} as const;

export const ocgTypeString = makeMap([
  [OcgType.MONSTER, "monster"],
  [OcgType.SPELL, "spell"],
  [OcgType.TRAP, "trap"],
  [OcgType.NORMAL, "normal"],
  [OcgType.EFFECT, "effect"],
  [OcgType.FUSION, "fusion"],
  [OcgType.RITUAL, "ritual"],
  [OcgType.TRAPMONSTER, "trapmonster"],
  [OcgType.SPIRIT, "spirit"],
  [OcgType.UNION, "union"],
  [OcgType.GEMINI, "gemini"],
  [OcgType.TUNER, "tuner"],
  [OcgType.SYNCHRO, "synchro"],
  [OcgType.TOKEN, "token"],
  [OcgType.MAXIMUM, "maximum"],
  [OcgType.QUICKPLAY, "quickplay"],
  [OcgType.CONTINUOUS, "continuous"],
  [OcgType.EQUIP, "equip"],
  [OcgType.FIELD, "field"],
  [OcgType.COUNTER, "counter"],
  [OcgType.FLIP, "flip"],
  [OcgType.TOON, "toon"],
  [OcgType.XYZ, "xyz"],
  [OcgType.PENDULUM, "pendulum"],
  [OcgType.SPSUMMON, "spsummon"],
  [OcgType.LINK, "link"],
]);

const ocgTypeMapElements = Object.values(OcgType);

export function ocgTypeParse(type: OcgType) {
  return ocgTypeMapElements.filter((x) => type & x);
}

export type OcgAttribute = number;

export const OcgAttribute = {
  EARTH: 0x01,
  WATER: 0x02,
  FIRE: 0x04,
  WIND: 0x08,
  LIGHT: 0x10,
  DARK: 0x20,
  DIVINE: 0x40,
} as const;

export const ocgAttributeString = makeMap([
  [OcgAttribute.EARTH, "earth"],
  [OcgAttribute.WATER, "water"],
  [OcgAttribute.FIRE, "fire"],
  [OcgAttribute.WIND, "wind"],
  [OcgAttribute.LIGHT, "light"],
  [OcgAttribute.DARK, "dark"],
  [OcgAttribute.DIVINE, "divine"],
]);

export type OcgRace = bigint;

export const OcgRace = {
  WARRIOR: 0x1n,
  SPELLCASTER: 0x2n,
  FAIRY: 0x4n,
  FIEND: 0x8n,
  ZOMBIE: 0x10n,
  MACHINE: 0x20n,
  AQUA: 0x40n,
  PYRO: 0x80n,
  ROCK: 0x100n,
  WINGEDBEAST: 0x200n,
  PLANT: 0x400n,
  INSECT: 0x800n,
  THUNDER: 0x1000n,
  DRAGON: 0x2000n,
  BEAST: 0x4000n,
  BEASTWARRIOR: 0x8000n,
  DINOSAUR: 0x10000n,
  FISH: 0x20000n,
  SEASERPENT: 0x40000n,
  REPTILE: 0x80000n,
  PSYCHIC: 0x100000n,
  DIVINE: 0x200000n,
  CREATORGOD: 0x400000n,
  WYRM: 0x800000n,
  CYBERSE: 0x1000000n,
  ILLUSION: 0x2000000n,
  CYBORG: 0x4000000n,
  MAGICALKNIGHT: 0x8000000n,
  HIGHDRAGON: 0x10000000n,
  OMEGAPSYCHIC: 0x20000000n,
  CELESTIALWARRIOR: 0x40000000n,
  GALAXY: 0x80000000n,
} as const;

export const ocgRaceString = makeMap([
  [OcgRace.WARRIOR, "warrior"],
  [OcgRace.SPELLCASTER, "spellcaster"],
  [OcgRace.FAIRY, "fairy"],
  [OcgRace.FIEND, "fiend"],
  [OcgRace.ZOMBIE, "zombie"],
  [OcgRace.MACHINE, "machine"],
  [OcgRace.AQUA, "aqua"],
  [OcgRace.PYRO, "pyro"],
  [OcgRace.ROCK, "rock"],
  [OcgRace.WINGEDBEAST, "winged_beast"],
  [OcgRace.PLANT, "plant"],
  [OcgRace.INSECT, "insect"],
  [OcgRace.THUNDER, "thunder"],
  [OcgRace.DRAGON, "dragon"],
  [OcgRace.BEAST, "beast"],
  [OcgRace.BEASTWARRIOR, "beast_warrior"],
  [OcgRace.DINOSAUR, "dinosaur"],
  [OcgRace.FISH, "fish"],
  [OcgRace.SEASERPENT, "sea_serpent"],
  [OcgRace.REPTILE, "reptile"],
  [OcgRace.PSYCHIC, "psychic"],
  [OcgRace.DIVINE, "divine"],
  [OcgRace.CREATORGOD, "creator_god"],
  [OcgRace.WYRM, "wyrm"],
  [OcgRace.CYBERSE, "cyberse"],
  [OcgRace.ILLUSION, "illusion"],
  [OcgRace.CYBORG, "cyborg"],
  [OcgRace.MAGICALKNIGHT, "magical_knight"],
  [OcgRace.HIGHDRAGON, "high_dragon"],
  [OcgRace.OMEGAPSYCHIC, "omega_psychic"],
  [OcgRace.CELESTIALWARRIOR, "celestial_warrior"],
  [OcgRace.GALAXY, "galaxy"],
]);

export type OcgLinkMarker = number;

export const OcgLinkMarker = {
  BOTTOM_LEFT: 0o001,
  BOTTOM: 0o002,
  BOTTOM_RIGHT: 0o004,
  LEFT: 0o010,
  RIGHT: 0o040,
  TOP_LEFT: 0o100,
  TOP: 0o200,
  TOP_RIGHT: 0o400,
};

export const ocgLinkMarkerString = makeMap([
  [OcgLinkMarker.BOTTOM_LEFT, "bottom_left"],
  [OcgLinkMarker.BOTTOM, "bottom"],
  [OcgLinkMarker.BOTTOM_RIGHT, "bottom_right"],
  [OcgLinkMarker.LEFT, "left"],
  [OcgLinkMarker.RIGHT, "right"],
  [OcgLinkMarker.TOP_LEFT, "top_left"],
  [OcgLinkMarker.TOP, "top"],
  [OcgLinkMarker.TOP_RIGHT, "top_right"],
]);

const ocgLinkMarkerMapElements = Object.values(OcgLinkMarker);

export function ocgLinkMarkerParse(marker: OcgLinkMarker) {
  return ocgLinkMarkerMapElements.filter((x) => marker & x);
}

export type OcgRPS = number;

export const OcgRPS = {
  SCISSORS: 1,
  ROCK: 2,
  PAPER: 3,
};

export const ocgRPSString = makeMap([
  [OcgRPS.SCISSORS, "scissors"],
  [OcgRPS.ROCK, "rock"],
  [OcgRPS.PAPER, "paper"],
]);

const duelModeBase = {
  TEST_MODE: 0x01n,
  ATTACK_FIRST_TURN: 0x02n,
  USE_TRAPS_IN_NEW_CHAIN: 0x04n,
  SIX_STEP_BATLLE_STEP: 0x08n,
  PSEUDO_SHUFFLE: 0x10n,
  TRIGGER_WHEN_PRIVATE_KNOWLEDGE: 0x20n,
  SIMPLE_AI: 0x40n,
  RELAY: 0x80n,
  OBSOLETE_IGNITION: 0x100n,
  FIRST_TURN_DRAW: 0x200n,
  ONE_FACEUP_FIELD: 0x400n,
  PZONE: 0x800n,
  SEPARATE_PZONE: 0x1000n,
  EMZONE: 0x2000n,
  FSX_MMZONE: 0x4000n,
  TRAP_MONSTERS_NOT_USE_ZONE: 0x8000n,
  RETURN_TO_EXTRA_DECK_TRIGGERS: 0x10000n,
  TRIGGER_ONLY_IN_LOCATION: 0x20000n,
  SPSUMMON_ONCE_OLD_NEGATE: 0x40000n,
  CANNOT_SUMMON_OATH_OLD: 0x80000n,
  NO_STANDBY_PHASE: 0x100000n,
  NO_MAIN_PHASE_2: 0x200000n,
  THREE_COLUMNS_FIELD: 0x400000n,
  DRAW_UNTIL_5: 0x800000n,
  NO_HAND_LIMIT: 0x1000000n,
  UNLIMITED_SUMMONS: 0x2000000n,
  INVERTED_QUICK_PRIORITY: 0x4000000n,
  EQUIP_NOT_SENT_IF_MISSING_TARGET: 0x8000000n,
  ZERO_ATK_DESTROYED: 0x10000000n,
  STORE_ATTACK_REPLAYS: 0x20000000n,
  SINGLE_CHAIN_IN_DAMAGE_SUBSTEP: 0x40000000n,
  CAN_REPOS_IF_NON_SUMPLAYER: 0x80000000n,
  TCG_SEGOC_NONPUBLIC: 0x100000000n,
  TCG_SEGOC_FIRSTTRIGGER: 0x200000000n,
} as const;

const duelModeBase1 = {
  ...duelModeBase,
  MODE_MR1:
    duelModeBase.OBSOLETE_IGNITION |
    duelModeBase.FIRST_TURN_DRAW |
    duelModeBase.ONE_FACEUP_FIELD |
    duelModeBase.SPSUMMON_ONCE_OLD_NEGATE |
    duelModeBase.RETURN_TO_EXTRA_DECK_TRIGGERS |
    duelModeBase.CANNOT_SUMMON_OATH_OLD,
} as const;

const duelModeBase2 = {
  ...duelModeBase1,
  MODE_SPEED:
    duelModeBase.THREE_COLUMNS_FIELD |
    duelModeBase.NO_MAIN_PHASE_2 |
    duelModeBase.TRIGGER_ONLY_IN_LOCATION,
  MODE_RUSH:
    duelModeBase.THREE_COLUMNS_FIELD |
    duelModeBase.NO_MAIN_PHASE_2 |
    duelModeBase.NO_STANDBY_PHASE |
    duelModeBase.FIRST_TURN_DRAW |
    duelModeBase.INVERTED_QUICK_PRIORITY |
    duelModeBase.DRAW_UNTIL_5 |
    duelModeBase.NO_HAND_LIMIT |
    duelModeBase.UNLIMITED_SUMMONS |
    duelModeBase.TRIGGER_ONLY_IN_LOCATION,
  MODE_GOAT:
    duelModeBase1.MODE_MR1 |
    duelModeBase.USE_TRAPS_IN_NEW_CHAIN |
    duelModeBase.SIX_STEP_BATLLE_STEP |
    duelModeBase.TRIGGER_WHEN_PRIVATE_KNOWLEDGE |
    duelModeBase.EQUIP_NOT_SENT_IF_MISSING_TARGET |
    duelModeBase.ZERO_ATK_DESTROYED |
    duelModeBase.STORE_ATTACK_REPLAYS |
    duelModeBase.SINGLE_CHAIN_IN_DAMAGE_SUBSTEP |
    duelModeBase.CAN_REPOS_IF_NON_SUMPLAYER |
    duelModeBase.TCG_SEGOC_NONPUBLIC |
    duelModeBase.TCG_SEGOC_FIRSTTRIGGER,
  MODE_MR2:
    duelModeBase.FIRST_TURN_DRAW |
    duelModeBase.ONE_FACEUP_FIELD |
    duelModeBase.SPSUMMON_ONCE_OLD_NEGATE |
    duelModeBase.RETURN_TO_EXTRA_DECK_TRIGGERS |
    duelModeBase.CANNOT_SUMMON_OATH_OLD,
  MODE_MR3:
    duelModeBase.PZONE |
    duelModeBase.SEPARATE_PZONE |
    duelModeBase.SPSUMMON_ONCE_OLD_NEGATE |
    duelModeBase.RETURN_TO_EXTRA_DECK_TRIGGERS |
    duelModeBase.CANNOT_SUMMON_OATH_OLD,
  MODE_MR4:
    duelModeBase.PZONE |
    duelModeBase.EMZONE |
    duelModeBase.SPSUMMON_ONCE_OLD_NEGATE |
    duelModeBase.RETURN_TO_EXTRA_DECK_TRIGGERS |
    duelModeBase.CANNOT_SUMMON_OATH_OLD,
  MODE_MR5:
    duelModeBase.PZONE |
    duelModeBase.EMZONE |
    duelModeBase.FSX_MMZONE |
    duelModeBase.TRAP_MONSTERS_NOT_USE_ZONE |
    duelModeBase.TRIGGER_ONLY_IN_LOCATION,
} as const;

export type OcgDuelMode = bigint;

export const OcgDuelMode = duelModeBase2;

export enum OcgLogType {
  ERROR,
  FROM_SCRIPT,
  FOR_DEBUG,
  UNDEFINED,
}

export type OcgQueryFlags = number;

export const OcgQueryFlags = {
  CODE: 0x1,
  POSITION: 0x2,
  ALIAS: 0x4,
  TYPE: 0x8,
  LEVEL: 0x10,
  RANK: 0x20,
  ATTRIBUTE: 0x40,
  RACE: 0x80,
  ATTACK: 0x100,
  DEFENSE: 0x200,
  BASE_ATTACK: 0x400,
  BASE_DEFENSE: 0x800,
  REASON: 0x1000,
  REASON_CARD: 0x2000,
  EQUIP_CARD: 0x4000,
  TARGET_CARD: 0x8000,
  OVERLAY_CARD: 0x10000,
  COUNTERS: 0x20000,
  OWNER: 0x40000,
  STATUS: 0x80000,
  IS_PUBLIC: 0x100000,
  LSCALE: 0x200000,
  RSCALE: 0x400000,
  LINK: 0x800000,
  IS_HIDDEN: 0x1000000,
  COVER: 0x2000000,
};

export type OcgScope = number;

export const OcgScope = {
  OCG: 0x1,
  TCG: 0x2,
  ANIME: 0x4,
  ILLEGAL: 0x8,
  VIDEO_GAME: 0x10,
  CUSTOM: 0x20,
  SPEED: 0x40,
  PRERELEASE: 0x100,
  RUSH: 0x200,
  LEGEND: 0x400,
  HIDDEN: 0x1000,
} as const;

export type OcgPhase = number;

export const OcgPhase = {
  DRAW: 0x01,
  STANDBY: 0x02,
  MAIN1: 0x04,
  BATTLE_START: 0x08,
  BATTLE_STEP: 0x10,
  DAMAGE: 0x20,
  DAMAGE_CAL: 0x40,
  BATTLE: 0x80,
  MAIN2: 0x100,
  END: 0x200,
} as const;

export const ocgPhaseString = makeMap([
  [OcgPhase.DRAW, "draw"],
  [OcgPhase.STANDBY, "standby"],
  [OcgPhase.MAIN1, "main1"],
  [OcgPhase.BATTLE_START, "battle_start"],
  [OcgPhase.BATTLE_STEP, "battle_step"],
  [OcgPhase.DAMAGE, "damage"],
  [OcgPhase.DAMAGE_CAL, "damage_cal"],
  [OcgPhase.BATTLE, "battle"],
  [OcgPhase.MAIN2, "main2"],
  [OcgPhase.END, "end"],
]);

export type OcgHintType = number;

export const OcgHintType = {
  EVENT: 1,
  MESSAGE: 2,
  SELECTMSG: 3,
  OPSELECTED: 4,
  EFFECT: 5,
  RACE: 6,
  ATTRIB: 7,
  CODE: 8,
  NUMBER: 9,
  CARD: 10,
  ZONE: 11,
} as const;

export const ocgHintString = makeMap([
  [OcgHintType.EVENT, "event"],
  [OcgHintType.MESSAGE, "message"],
  [OcgHintType.SELECTMSG, "selectmsg"],
  [OcgHintType.OPSELECTED, "opselected"],
  [OcgHintType.EFFECT, "effect"],
  [OcgHintType.RACE, "race"],
  [OcgHintType.ATTRIB, "attrib"],
  [OcgHintType.CODE, "code"],
  [OcgHintType.NUMBER, "number"],
  [OcgHintType.CARD, "card"],
  [OcgHintType.ZONE, "zone"],
]);
