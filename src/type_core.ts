export type OcgProcessResult = number;
export const OcgProcessResult = {
  END: 0,
  WAITING: 1,
  CONTINUE: 2,
};

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
};

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
  ONFIELD: 0x0c,
  FZONE: 0x100,
  PZONE: 0x200,
  ALL: 0x3ff,
};

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
};

export type OcgAttribute = number;

export const OcgAttribute = {
  EARTH: 0x01,
  WATER: 0x02,
  FIRE: 0x04,
  WIND: 0x08,
  LIGHT: 0x10,
  DARK: 0x20,
  DIVINE: 0x40,
};

export type OcgRace = number;

export const OcgRace = {
  WARRIOR: 0x1,
  SPELLCASTER: 0x2,
  FAIRY: 0x4,
  FIEND: 0x8,
  ZOMBIE: 0x10,
  MACHINE: 0x20,
  AQUA: 0x40,
  PYRO: 0x80,
  ROCK: 0x100,
  WINGEDBEAST: 0x200,
  PLANT: 0x400,
  INSECT: 0x800,
  THUNDER: 0x1000,
  DRAGON: 0x2000,
  BEAST: 0x4000,
  BEASTWARRIOR: 0x8000,
  DINOSAUR: 0x10000,
  FISH: 0x20000,
  SEASERPENT: 0x40000,
  REPTILE: 0x80000,
  PSYCHIC: 0x100000,
  DIVINE: 0x200000,
  CREATORGOD: 0x400000,
  WYRM: 0x800000,
  CYBERSE: 0x1000000,
};
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

export type OcgRPS = number;

export const OcgRPS = {
  SCISSORS: 1,
  ROCK: 2,
  PAPER: 3,
};

export type OcgDuelMode = bigint;

const mutableDuelMode = {
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
  MODE_SPEED: 0n,
  MODE_RUSH: 0n,
  MODE_MR1: 0n,
  MODE_GOAT: 0n,
  MODE_MR2: 0n,
  MODE_MR3: 0n,
  MODE_MR4: 0n,
  MODE_MR5: 0n,
};

mutableDuelMode.MODE_SPEED =
  mutableDuelMode.THREE_COLUMNS_FIELD |
  mutableDuelMode.NO_MAIN_PHASE_2 |
  mutableDuelMode.TRIGGER_ONLY_IN_LOCATION;

mutableDuelMode.MODE_RUSH =
  mutableDuelMode.THREE_COLUMNS_FIELD |
  mutableDuelMode.NO_MAIN_PHASE_2 |
  mutableDuelMode.NO_STANDBY_PHASE |
  mutableDuelMode.FIRST_TURN_DRAW |
  mutableDuelMode.INVERTED_QUICK_PRIORITY |
  mutableDuelMode.DRAW_UNTIL_5 |
  mutableDuelMode.NO_HAND_LIMIT |
  mutableDuelMode.UNLIMITED_SUMMONS |
  mutableDuelMode.TRIGGER_ONLY_IN_LOCATION;

mutableDuelMode.MODE_MR1 =
  mutableDuelMode.OBSOLETE_IGNITION |
  mutableDuelMode.FIRST_TURN_DRAW |
  mutableDuelMode.ONE_FACEUP_FIELD |
  mutableDuelMode.SPSUMMON_ONCE_OLD_NEGATE |
  mutableDuelMode.RETURN_TO_EXTRA_DECK_TRIGGERS |
  mutableDuelMode.CANNOT_SUMMON_OATH_OLD;

mutableDuelMode.MODE_GOAT =
  mutableDuelMode.MODE_MR1 |
  mutableDuelMode.USE_TRAPS_IN_NEW_CHAIN |
  mutableDuelMode.SIX_STEP_BATLLE_STEP |
  mutableDuelMode.TRIGGER_WHEN_PRIVATE_KNOWLEDGE |
  mutableDuelMode.EQUIP_NOT_SENT_IF_MISSING_TARGET |
  mutableDuelMode.ZERO_ATK_DESTROYED |
  mutableDuelMode.STORE_ATTACK_REPLAYS |
  mutableDuelMode.SINGLE_CHAIN_IN_DAMAGE_SUBSTEP |
  mutableDuelMode.CAN_REPOS_IF_NON_SUMPLAYER |
  mutableDuelMode.TCG_SEGOC_NONPUBLIC |
  mutableDuelMode.TCG_SEGOC_FIRSTTRIGGER;

mutableDuelMode.MODE_MR2 =
  mutableDuelMode.FIRST_TURN_DRAW |
  mutableDuelMode.ONE_FACEUP_FIELD |
  mutableDuelMode.SPSUMMON_ONCE_OLD_NEGATE |
  mutableDuelMode.RETURN_TO_EXTRA_DECK_TRIGGERS |
  mutableDuelMode.CANNOT_SUMMON_OATH_OLD;

mutableDuelMode.MODE_MR3 =
  mutableDuelMode.PZONE |
  mutableDuelMode.SEPARATE_PZONE |
  mutableDuelMode.SPSUMMON_ONCE_OLD_NEGATE |
  mutableDuelMode.RETURN_TO_EXTRA_DECK_TRIGGERS |
  mutableDuelMode.CANNOT_SUMMON_OATH_OLD;

mutableDuelMode.MODE_MR4 =
  mutableDuelMode.PZONE |
  mutableDuelMode.EMZONE |
  mutableDuelMode.SPSUMMON_ONCE_OLD_NEGATE |
  mutableDuelMode.RETURN_TO_EXTRA_DECK_TRIGGERS |
  mutableDuelMode.CANNOT_SUMMON_OATH_OLD;

mutableDuelMode.MODE_MR5 =
  mutableDuelMode.PZONE |
  mutableDuelMode.EMZONE |
  mutableDuelMode.FSX_MMZONE |
  mutableDuelMode.TRAP_MONSTERS_NOT_USE_ZONE |
  mutableDuelMode.TRIGGER_ONLY_IN_LOCATION;

export const OcgDuelMode = { ...mutableDuelMode } as {
  readonly [k in keyof typeof mutableDuelMode]: OcgDuelMode;
};

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
