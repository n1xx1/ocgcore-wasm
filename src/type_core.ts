import type { OcgCore } from "./types";

/** The result of each call to {@link OcgCore#duelProcess}. */
export type OcgProcessResult =
  (typeof OcgProcessResult)[keyof typeof OcgProcessResult];

/** The result of each call to {@link OcgCore#duelProcess}. */
export const OcgProcessResult = {
  /**
   * Duel ended, you can't no longer call {@link OcgCore#duelProcess}.
   */
  END: 0,
  /**
   * Waiting for a player action, provide a response with {@link OcgCore#duelSetResponse}
   * before calling {@link OcgCore#duelProcess} again.
   */
  WAITING: 1,
  /**
   * Intermidate processing step, you should call {@link OcgCore#duelProcess} again.
   */
  CONTINUE: 2,
} as const;

/** Position (faceup or facedown and defense or attack) of a card. */
export type OcgPosition = (typeof OcgPosition)[keyof typeof OcgPosition];

/** Position (faceup or facedown and defense or attack) of a card. */
export const OcgPosition = {
  /** FACEUP_ATTACK */
  FACEUP_ATTACK: 0x1,
  /** FACEDOWN_ATTACK */
  FACEDOWN_ATTACK: 0x2,
  /** FACEUP_DEFENSE */
  FACEUP_DEFENSE: 0x4,
  /** FACEDOWN_DEFENSE */
  FACEDOWN_DEFENSE: 0x8,
  /** FACEUP_ATTACK | FACEUP_DEFENSE */
  FACEUP: 0x5,
  /** FACEDOWN_ATTACK | FACEDOWN_DEFENSE */
  FACEDOWN: 0xa,
  /** FACEUP_ATTACK | FACEDOWN_ATTACK */
  ATTACK: 0x3,
  /** FACEUP_DEFENSE | FACEDOWN_DEFENSE */
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

/** Location of a card. */
export type OcgLocation = (typeof OcgLocation)[keyof typeof OcgLocation];

/** Location of a card. */
export const OcgLocation = {
  /** Main deck. */
  DECK: 0x01,
  /** Hand. */
  HAND: 0x02,
  /** Monster zone. */
  MZONE: 0x04,
  /** Spell/Trap zone. */
  SZONE: 0x08,
  /** Graveyard. */
  GRAVE: 0x10,
  /** Banished (removed from play). */
  REMOVED: 0x20,
  /** Extra deck. */
  EXTRA: 0x40,
  /** Xyz material. */
  OVERLAY: 0x80,
  /** Field spell zone. */
  FZONE: 0x100,
  /** Pendulum zone. */
  PZONE: 0x200,
  /** Onfield mask. */
  ONFIELD: 0x0c,
  /** All possible locations mask. */
  ALL: 0x3ff,
} as const;

/** Card type (monster/spell/trap and additional properties in case of a monster). */
export type OcgType = (typeof OcgType)[keyof typeof OcgType];

/** Card type (monster/spell/trap and additional properties in case of a monster). */
export const OcgType = {
  /** Monster. */
  MONSTER: 0x1,
  /** Spell. */
  SPELL: 0x2,
  /** Trap. */
  TRAP: 0x4,
  /** Normal monster. */
  NORMAL: 0x10,
  /** Effect monster. */
  EFFECT: 0x20,
  /** Fusion monster. */
  FUSION: 0x40,
  /** Ritual monster. */
  RITUAL: 0x80,
  /** Trap monster trap. */
  TRAPMONSTER: 0x100,
  /** Spirit monster. */
  SPIRIT: 0x200,
  /** Union monster. */
  UNION: 0x400,
  /** Gemini monster. */
  GEMINI: 0x800,
  /** Tuner monster. */
  TUNER: 0x1000,
  /** Synchro monster. */
  SYNCHRO: 0x2000,
  /** Token monster. */
  TOKEN: 0x4000,
  /** Maximum monster. */
  MAXIMUM: 0x8000,
  /** Quickplay spell. */
  QUICKPLAY: 0x10000,
  /** Continuous spell or trap. */
  CONTINUOUS: 0x20000,
  /** Equip spell. */
  EQUIP: 0x40000,
  /** Field spell. */
  FIELD: 0x80000,
  /** Counter trap. */
  COUNTER: 0x100000,
  /** Flip monster. */
  FLIP: 0x200000,
  /** Toon monster. */
  TOON: 0x400000,
  /** Xyz monster. */
  XYZ: 0x800000,
  /** Pendulum monster. */
  PENDULUM: 0x1000000,
  /** Special summonable monster. */
  SPSUMMON: 0x2000000,
  /** Link monster. */
  LINK: 0x4000000,
} as const;

const ocgTypeMapElements = Object.values(OcgType);

/**
 * Parse a OcgType mask and return the matching types.
 * @param type - The mask to parse.
 */
export function ocgTypeParse(type: OcgType): OcgType[] {
  return ocgTypeMapElements.filter((x) => type & x);
}

/** Monster card attribute. */
export type OcgAttribute = (typeof OcgAttribute)[keyof typeof OcgAttribute];

/** Monster card attribute. */
export const OcgAttribute = {
  /** Earth. */
  EARTH: 0x01,
  /** Water. */
  WATER: 0x02,
  /** Fire. */
  FIRE: 0x04,
  /** Wind. */
  WIND: 0x08,
  /** Light. */
  LIGHT: 0x10,
  /** Dark. */
  DARK: 0x20,
  /** Divine. */
  DIVINE: 0x40,
} as const;

const ocgAttributeMapElements = Object.values(OcgAttribute);

/**
 * Parse a {@link (OcgAttribute:type)} mask and return the matching attributes.
 * @param attribute - The mask to parse.
 */
export function ocgAttributeParse(attribute: OcgAttribute): OcgAttribute[] {
  return ocgAttributeMapElements.filter((x) => attribute & x);
}

/** Monster card race. */
export type OcgRace = (typeof OcgRace)[keyof typeof OcgRace];

/** Monster card race. */
export const OcgRace = {
  /** Warrior. */
  WARRIOR: 0x1n,
  /** Spellcaster. */
  SPELLCASTER: 0x2n,
  /** Fairy. */
  FAIRY: 0x4n,
  /** Fiend. */
  FIEND: 0x8n,
  /** Zombie. */
  ZOMBIE: 0x10n,
  /** Machine. */
  MACHINE: 0x20n,
  /** Aqua. */
  AQUA: 0x40n,
  /** Pyro. */
  PYRO: 0x80n,
  /** Rock. */
  ROCK: 0x100n,
  /** Winged beast. */
  WINGEDBEAST: 0x200n,
  /** Plant. */
  PLANT: 0x400n,
  /** Insect. */
  INSECT: 0x800n,
  /** Thunder. */
  THUNDER: 0x1000n,
  /** Dragon. */
  DRAGON: 0x2000n,
  /** Beast. */
  BEAST: 0x4000n,
  /** Beast-warrior. */
  BEASTWARRIOR: 0x8000n,
  /** Dinosaur. */
  DINOSAUR: 0x10000n,
  /** Fish. */
  FISH: 0x20000n,
  /** Seaserpent. */
  SEASERPENT: 0x40000n,
  /** Reptile. */
  REPTILE: 0x80000n,
  /** Psychic. */
  PSYCHIC: 0x100000n,
  /** Divine. */
  DIVINE: 0x200000n,
  /** Creator god. */
  CREATORGOD: 0x400000n,
  /** Wyrm. */
  WYRM: 0x800000n,
  /** Cyberse. */
  CYBERSE: 0x1000000n,
  /** Illusion. */
  ILLUSION: 0x2000000n,
  /** Cyborg. */
  CYBORG: 0x4000000n,
  /** Magical knight. */
  MAGICALKNIGHT: 0x8000000n,
  /** High dragon. */
  HIGHDRAGON: 0x10000000n,
  /** Omega psychic. */
  OMEGAPSYCHIC: 0x20000000n,
  /** Celestial warrior. */
  CELESTIALWARRIOR: 0x40000000n,
  /** Galaxy. */
  GALAXY: 0x80000000n,
} as const;

const ocgRaceMapElements = Object.values(OcgRace);

/**
 * Parse a {@link (OcgRace:type)} mask and return the matching races.
 * @param race - The mask to parse.
 */
export function ocgRaceParse(race: OcgRace): OcgRace[] {
  return ocgRaceMapElements.filter((x) => race & x);
}

/** Link monster markers positions. */
export type OcgLinkMarker = number;

/** Link monster markers positions. */
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
export function ocgLinkMarkerParse(marker: OcgLinkMarker): OcgLinkMarker[] {
  return ocgLinkMarkerMapElements.filter((x) => marker & x);
}

/** Rock paper scissor. */
export type OcgRPS = number;

/** Rock paper scissor. */
export const OcgRPS = {
  /** Scissors. */
  SCISSORS: 1,
  /** Rock. */
  ROCK: 2,
  /** Paper. */
  PAPER: 3,
};

const duelModeBase = {
  /** @deprecated Unused. */
  TEST_MODE: 0x01n,
  /** Allow battle phase in the first turn. */
  ATTACK_FIRST_TURN: 0x02n,
  /** Continuous traps effects cannot be activated until the end of the chain they're flipped in. */
  USE_TRAPS_IN_NEW_CHAIN: 0x04n,
  /** After damage calculation substep actually separated sub steps. */
  SIX_STEP_BATLLE_STEP: 0x08n,
  /** Disable decks shuffling. */
  PSEUDO_SHUFFLE: 0x10n,
  /** Searching the deck doesn't require knowledge checking. */
  TRIGGER_WHEN_PRIVATE_KNOWLEDGE: 0x20n,
  /** Automate some responses with a simple AI. */
  SIMPLE_AI: 0x40n,
  /** Is tag duel. */
  RELAY: 0x80n,
  /** Master Rule 1 obsolete ignition effects. */
  OBSOLETE_IGNITION: 0x100n,
  /** Draw on the first turn. */
  FIRST_TURN_DRAW: 0x200n,
  /** Only allow a single face-up field spell. */
  ONE_FACEUP_FIELD: 0x400n,
  /** Enable pendulum zones. */
  PZONE: 0x800n,
  /** Pendulum zones are separated from S/T zones. */
  SEPARATE_PZONE: 0x1000n,
  /** Enable extra monster zone. */
  EMZONE: 0x2000n,
  /** Fusion, synchro and xyz from the extra deck can go into the main monster zones. */
  FSX_MMZONE: 0x4000n,
  /** Trap monsters do not take a spell/trap zone aswell as a main monster zone. */
  TRAP_MONSTERS_NOT_USE_ZONE: 0x8000n,
  /** Return to main deck or extra deck do not trigger "leaving the field" effects. */
  RETURN_TO_DECK_TRIGGERS: 0x10000n,
  /** Trigger effect cannot be activated if the card is moved to other place. */
  TRIGGER_ONLY_IN_LOCATION: 0x20000n,
  /** Negated summons and special summons count towards any limit. */
  SPSUMMON_ONCE_OLD_NEGATE: 0x40000n,
  /** Negated summons and special summons count towards any limit. */
  CANNOT_SUMMON_OATH_OLD: 0x80000n,
  /** Disable standby phase (rush duels). */
  NO_STANDBY_PHASE: 0x100000n,
  /** Disable main phase 2 (rush and speed duels). */
  NO_MAIN_PHASE_2: 0x200000n,
  /** Only 3 main monster zones and spell/trap zones (rush and speed duels). */
  THREE_COLUMNS_FIELD: 0x400000n,
  /** In draw phase draw until 5 cards in hand (rush duels). */
  DRAW_UNTIL_5: 0x800000n,
  /** Disable hand limit checks. */
  NO_HAND_LIMIT: 0x1000000n,
  /** Remove limit of 1 normal summon per turn (rush duels). */
  UNLIMITED_SUMMONS: 0x2000000n,
  /** Inverted quick effects priority (rush duels). */
  INVERTED_QUICK_PRIORITY: 0x4000000n,
  /** The to be equipped monster is not sent to the grave if the equip target is no longer valid (goat duels). */
  EQUIP_NOT_SENT_IF_MISSING_TARGET: 0x8000000n,
  /** If a 0 atk monster attacks a 0 atk monster, both get destroyed (goat duels). */
  ZERO_ATK_DESTROYED: 0x10000000n,
  /** Attack replays can be used later (goat duels). */
  STORE_ATTACK_REPLAYS: 0x20000000n,
  /** One chain per damage sub step (goat duels). */
  SINGLE_CHAIN_IN_DAMAGE_SUBSTEP: 0x40000000n,
  /** Cards can be repositioned if the control changed (goat duels). */
  CAN_REPOS_IF_NON_SUMPLAYER: 0x80000000n,
  /** TCG Simultaneous Effects Go On Chain for non public knowledge. */
  TCG_SEGOC_NONPUBLIC: 0x100000000n,
  /** TCG Simultaneous Effects Go On Chain. */
  TCG_SEGOC_FIRSTTRIGGER: 0x200000000n,
} as const;

const duelModeBase1 = {
  ...duelModeBase,
  /** Master Rule 1 ruleset. */
  MODE_MR1:
    duelModeBase.OBSOLETE_IGNITION |
    duelModeBase.FIRST_TURN_DRAW |
    duelModeBase.ONE_FACEUP_FIELD |
    duelModeBase.SPSUMMON_ONCE_OLD_NEGATE |
    duelModeBase.RETURN_TO_DECK_TRIGGERS |
    duelModeBase.CANNOT_SUMMON_OATH_OLD,
} as const;

const duelModeBase2 = {
  ...duelModeBase1,
  /** Speed duel ruleset. */
  MODE_SPEED:
    duelModeBase.THREE_COLUMNS_FIELD |
    duelModeBase.NO_MAIN_PHASE_2 |
    duelModeBase.TRIGGER_ONLY_IN_LOCATION,
  /** Rush duel ruleset. */
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
  /** Goat ruleset. */
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
  /** Master Rule 2 ruleset */
  MODE_MR2:
    duelModeBase.FIRST_TURN_DRAW |
    duelModeBase.ONE_FACEUP_FIELD |
    duelModeBase.SPSUMMON_ONCE_OLD_NEGATE |
    duelModeBase.RETURN_TO_DECK_TRIGGERS |
    duelModeBase.CANNOT_SUMMON_OATH_OLD,
  /** Master Rule 3 ruleset */
  MODE_MR3:
    duelModeBase.PZONE |
    duelModeBase.SEPARATE_PZONE |
    duelModeBase.SPSUMMON_ONCE_OLD_NEGATE |
    duelModeBase.RETURN_TO_DECK_TRIGGERS |
    duelModeBase.CANNOT_SUMMON_OATH_OLD,
  /** New Master Rule ruleset */
  MODE_MR4:
    duelModeBase.PZONE |
    duelModeBase.EMZONE |
    duelModeBase.SPSUMMON_ONCE_OLD_NEGATE |
    duelModeBase.RETURN_TO_DECK_TRIGGERS |
    duelModeBase.CANNOT_SUMMON_OATH_OLD,
  /** New Master Rule (April 2020) ruleset */
  MODE_MR5:
    duelModeBase.PZONE |
    duelModeBase.EMZONE |
    duelModeBase.FSX_MMZONE |
    duelModeBase.TRAP_MONSTERS_NOT_USE_ZONE |
    duelModeBase.TRIGGER_ONLY_IN_LOCATION,
} as const;

/** Duel creation options. */
export type OcgDuelMode = (typeof OcgDuelMode)[Exclude<
  keyof typeof OcgDuelMode,
  `MODE_${string}`
>];

/** Duel creation options. */
export const OcgDuelMode = duelModeBase2;

const ocgDuelModeMapElements = Object.values(duelModeBase);

/**
 * Parse a {@link (OcgDuelMode:type)} mask and return the matching options.
 * @param mode - The mask to parse.
 */
export function ocgDuelModeParse(mode: OcgDuelMode): OcgDuelMode[] {
  return ocgDuelModeMapElements.filter((x) => mode & x);
}

/** Log type. */
export type OcgLogType = (typeof OcgLogType)[keyof typeof OcgLogType];

/** Log type. */
export const OcgLogType = {
  /** Error. */
  ERROR: 0,
  /** From script. */
  FROM_SCRIPT: 1,
  /** Debug. */
  FOR_DEBUG: 2,
  /** Undefined. */
  UNDEFINED: 3,
} as const;

/** Requested card properties, used when querying. */
export type OcgQueryFlags = (typeof OcgQueryFlags)[keyof typeof OcgQueryFlags];

/** Requested card properties, used when querying. */
export const OcgQueryFlags = {
  /** Code. */
  CODE: 0x1,
  /** Position. */
  POSITION: 0x2,
  /** Aliases. */
  ALIAS: 0x4,
  /** Type. */
  TYPE: 0x8,
  /** Level. */
  LEVEL: 0x10,
  /** Rank. */
  RANK: 0x20,
  /** Attribute. */
  ATTRIBUTE: 0x40,
  /** Race. */
  RACE: 0x80,
  /** Attack. */
  ATTACK: 0x100,
  /** Defense. */
  DEFENSE: 0x200,
  /** Base attack. */
  BASE_ATTACK: 0x400,
  /** Base defense. */
  BASE_DEFENSE: 0x800,
  /** Reason. */
  REASON: 0x1000,
  /** Reason card. */
  REASON_CARD: 0x2000,
  /** Equipped to card. */
  EQUIP_CARD: 0x4000,
  /** Targeted card. */
  TARGET_CARD: 0x8000,
  /** Overlayed card. */
  OVERLAY_CARD: 0x10000,
  /** Counters. */
  COUNTERS: 0x20000,
  /** Owner. */
  OWNER: 0x40000,
  /** Status. */
  STATUS: 0x80000,
  /** Is public knowledge. */
  IS_PUBLIC: 0x100000,
  /** Left pendulum scale. */
  LSCALE: 0x200000,
  /** Right pendulum scale. */
  RSCALE: 0x400000,
  /** Link arrows. */
  LINK: 0x800000,
  /** Is hidden. */
  IS_HIDDEN: 0x1000000,
  /** Cover. */
  COVER: 0x2000000,
} as const;

/** Legality scope of a card. */
export type OcgScope = (typeof OcgScope)[keyof typeof OcgScope];

/** Legality scope of a card. */
export const OcgScope = {
  /** OCG legal. */
  OCG: 0x1,
  /** TCG legal.*/
  TCG: 0x2,
  /** Anime card.*/
  ANIME: 0x4,
  /** Cannot be used in a duel.*/
  ILLEGAL: 0x8,
  /** Video game card.*/
  VIDEO_GAME: 0x10,
  /** Custom card.*/
  CUSTOM: 0x20,
  /** Speed duel card.*/
  SPEED: 0x40,
  /** Prerelease.*/
  PRERELEASE: 0x100,
  /** Rush duel card.*/
  RUSH: 0x200,
  /** Rush duel legend card.*/
  LEGEND: 0x400,
  /** Hidden.*/
  HIDDEN: 0x1000,
} as const;

/** Turn phase. */
export type OcgPhase = (typeof OcgPhase)[keyof typeof OcgPhase];

/** Turn phase. */
export const OcgPhase = {
  /** Draw phase. */
  DRAW: 0x01,
  /** Stand-by phase. */
  STANDBY: 0x02,
  /** Main phase 1. */
  MAIN1: 0x04,
  /** Battle phase: start step */
  BATTLE_START: 0x08,
  /** Battle phase: battle step */
  BATTLE_STEP: 0x10,
  /** Battle phase: damage step */
  DAMAGE: 0x20,
  /** Battle phase: damage calculation */
  DAMAGE_CAL: 0x40,
  /** Battle phase: end step */
  BATTLE: 0x80,
  /** Main phase 2. */
  MAIN2: 0x100,
  /** End phase. */
  END: 0x200,
} as const;

/** Hint type. */
export type OcgHintType = (typeof OcgHintType)[keyof typeof OcgHintType];

/** Hint type. */
export const OcgHintType = {
  /** Event. */
  EVENT: 1,
  /** Message. */
  MESSAGE: 2,
  /** Select message. */
  SELECTMSG: 3,
  /** Operation selected. */
  OPSELECTED: 4,
  /** Effect. */
  EFFECT: 5,
  /** Race. */
  RACE: 6,
  /** Attribute. */
  ATTRIB: 7,
  /** Card code. */
  CODE: 8,
  /** Number. */
  NUMBER: 9,
  /** Card. */
  CARD: 10,
  /** Zone. */
  ZONE: 11,
} as const;

/** Timing hints */
export type OcgHintTiming = (typeof OcgHintTiming)[keyof typeof OcgHintTiming];

/** Timing hints */
export const OcgHintTiming = {
  /** In draw phase */
  DRAW_PHASE: 0x1,
  /** In standby phase */
  STANDBY_PHASE: 0x2,
  /** Before end of main */
  MAIN_END: 0x4,
  /** In battle phase */
  BATTLE_START: 0x8,
  /** After battle */
  BATTLE_END: 0x10,
  /** In end phase */
  END_PHASE: 0x20,
  /** After summon */
  SUMMON: 0x40,
  /** After special summon */
  SPSUMMON: 0x80,
  /** After flip summon */
  FLIPSUMMON: 0x100,
  /** After monster set */
  MSET: 0x200,
  /** After spell set */
  SSET: 0x400,
  /** After pos change */
  POS_CHANGE: 0x800,
  /** In attack declaration */
  ATTACK: 0x1000,
  /** In damage step */
  DAMAGE_STEP: 0x2000,
  /** In damage calculation */
  DAMAGE_CAL: 0x4000,
  /** After chain resolved */
  CHAIN_END: 0x8000,
  /** After card draw */
  DRAW: 0x10000,
  /** After damage */
  DAMAGE: 0x20000,
  /** After recover */
  RECOVER: 0x40000,
  /** After destroy */
  DESTROY: 0x80000,
  /** After banis */
  REMOVE: 0x100000,
  /** After card added to the hand */
  TOHAND: 0x200000,
  /** After card sent to the deck */
  TODECK: 0x400000,
  /** After card sent to the graveyard */
  TOGRAVE: 0x800000,
  /** Battle phase */
  BATTLE_PHASE: 0x1000000,
  /** After equip */
  EQUIP: 0x2000000,
  /** Battle step end */
  BATTLE_STEP_END: 0x4000000,
  /** Battled */
  BATTLED: 0x8000000,
} as const;

const ocgHintTimingMapElements = Object.values(OcgHintTiming);

/**
 * Parse a {@link (OcgHintTiming:type)} mask and return the matching timings.
 * @param timing - The mask to parse.
 */
export function ocgHintTimingParse(timing: OcgHintTiming): OcgHintTiming[] {
  return ocgHintTimingMapElements.filter((x) => timing & x);
}
