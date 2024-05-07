import type { OcgCore } from "./types";

/**
 * The result of each call to {@link OcgCore#duelProcess}.
 */
export type OcgProcessResult = number;

export const OcgProcessResult = {
  END: 0,
  WAITING: 1,
  CONTINUE: 2,
} as const;

/**
 * Position (faceup or facedown and defense or attack) of a card.
 */
export type OcgPosition = (typeof OcgPosition)[keyof typeof OcgPosition];

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

const ocgPositionMapElements = [
  OcgPosition.FACEUP_ATTACK,
  OcgPosition.FACEDOWN_ATTACK,
  OcgPosition.FACEUP_DEFENSE,
  OcgPosition.FACEDOWN_DEFENSE,
] as const;

/**
 * Parse a position mask and returns the list of actual positions it matches.
 * @param positionMask - The mask to parse
 */
export function ocgPositionParse(
  positionMask: OcgPosition
): Extract<OcgPosition, 0x1 | 0x2 | 0x4 | 0x8>[] {
  return ocgPositionMapElements.filter((x) => positionMask & x);
}

/**
 * Location of a card.
 */
export type OcgLocation = (typeof OcgLocation)[keyof typeof OcgLocation];

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

/**
 * Card type (monster/spell/trap and additional properties in case of a monster)
 */
export type OcgType = (typeof OcgType)[keyof typeof OcgType];

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

const ocgTypeMapElements = Object.values(OcgType);

/**
 * Parse a OcgType mask and return the matching types.
 * @param type - The mask to parse.
 */
export function ocgTypeParse(type: OcgType) {
  return ocgTypeMapElements.filter((x) => type & x);
}

/**
 * Monster card attribute.
 */
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

const ocgAttributeMapElements = Object.values(OcgAttribute);

/**
 * Parse a {@link (OcgAttribute:type)} mask and return the matching attributes.
 * @param attribute - The mask to parse.
 */
export function ocgAttributeParse(attribute: OcgAttribute) {
  return ocgAttributeMapElements.filter((x) => attribute & x);
}

/**
 * Monster card race.
 */
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

const ocgRaceMapElements = Object.values(OcgRace);

/**
 * Parse a {@link (OcgRace:type)} mask and return the matching races.
 * @param race - The mask to parse.
 */
export function ocgRaceParse(race: OcgRace) {
  return ocgRaceMapElements.filter((x) => race & x);
}

/**
 * Link monster markers positions.
 */
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

const ocgLinkMarkerMapElements = Object.values(OcgLinkMarker);

/**
 * Parse a {@link (OcgLinkMarker:type)} mask and return the matching markers.
 * @param marker - The mask to parse.
 */
export function ocgLinkMarkerParse(marker: OcgLinkMarker) {
  return ocgLinkMarkerMapElements.filter((x) => marker & x);
}

/**
 * Rock paper scissor.
 */
export type OcgRPS = number;

export const OcgRPS = {
  SCISSORS: 1,
  ROCK: 2,
  PAPER: 3,
};

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

/**
 * Duel creation options.
 */
export type OcgDuelMode = (typeof OcgDuelMode)[Exclude<
  keyof typeof OcgDuelMode,
  `MODE_${string}`
>];

export const OcgDuelMode = duelModeBase2;

const ocgDuelModeMapElements = Object.values(duelModeBase);

/**
 * Parse a {@link (OcgDuelMode:type)} mask and return the matching options.
 * @param mode - The mask to parse.
 */
export function ocgDuelModeParse(mode: OcgDuelMode): OcgDuelMode[] {
  return ocgDuelModeMapElements.filter((x) => mode & x);
}

export type OcgLogType = (typeof OcgLogType)[keyof typeof OcgLogType];

export const OcgLogType = {
  ERROR: 0,
  FROM_SCRIPT: 1,
  FOR_DEBUG: 2,
  UNDEFINED: 3,
} as const;

export type OcgQueryFlags = (typeof OcgQueryFlags)[keyof typeof OcgQueryFlags];

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

export type OcgScope = (typeof OcgScope)[keyof typeof OcgScope];

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

export type OcgPhase = (typeof OcgPhase)[keyof typeof OcgPhase];

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

export type OcgHintType = (typeof OcgHintType)[keyof typeof OcgHintType];

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
