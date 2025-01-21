import { OcgOpCode } from "./opcodes";
import {
  OcgAttribute,
  OcgDuelMode,
  OcgHintTiming,
  OcgHintType,
  OcgLocation,
  OcgPhase,
  OcgPosition,
  OcgRace,
  OcgRPS,
} from "./type_core";

export enum OcgEffectClientMode {
  NORMAL = 0,
  RESOLVE = 1,
  RESET = 2,
}

export enum OcgCardHintType {
  TURN = 1,
  CARD = 2,
  RACE = 3,
  ATTRIBUTE = 4,
  NUMBER = 5,
  DESC_ADD = 6,
  DESC_REMOVE = 7,
}

export enum OcgPlayerHintType {
  DESC_ADD = 6,
  DESC_REMOVE = 7,
}

/** Message type enum. */
export enum OcgMessageType {
  RETRY = 1,
  HINT = 2,
  WAITING = 3,
  START = 4,
  WIN = 5,
  UPDATE_DATA = 6,
  UPDATE_CARD = 7,
  REQUEST_DECK = 8,
  SELECT_BATTLECMD = 10,
  SELECT_IDLECMD = 11,
  SELECT_EFFECTYN = 12,
  SELECT_YESNO = 13,
  SELECT_OPTION = 14,
  SELECT_CARD = 15,
  SELECT_CHAIN = 16,
  SELECT_PLACE = 18,
  SELECT_POSITION = 19,
  SELECT_TRIBUTE = 20,
  SORT_CHAIN = 21,
  SELECT_COUNTER = 22,
  SELECT_SUM = 23,
  SELECT_DISFIELD = 24,
  SORT_CARD = 25,
  SELECT_UNSELECT_CARD = 26,
  CONFIRM_DECKTOP = 30,
  CONFIRM_CARDS = 31,
  SHUFFLE_DECK = 32,
  SHUFFLE_HAND = 33,
  REFRESH_DECK = 34,
  SWAP_GRAVE_DECK = 35,
  SHUFFLE_SET_CARD = 36,
  REVERSE_DECK = 37,
  DECK_TOP = 38,
  SHUFFLE_EXTRA = 39,
  NEW_TURN = 40,
  NEW_PHASE = 41,
  CONFIRM_EXTRATOP = 42,
  MOVE = 50,
  POS_CHANGE = 53,
  SET = 54,
  SWAP = 55,
  FIELD_DISABLED = 56,
  SUMMONING = 60,
  SUMMONED = 61,
  SPSUMMONING = 62,
  SPSUMMONED = 63,
  FLIPSUMMONING = 64,
  FLIPSUMMONED = 65,
  CHAINING = 70,
  CHAINED = 71,
  CHAIN_SOLVING = 72,
  CHAIN_SOLVED = 73,
  CHAIN_END = 74,
  CHAIN_NEGATED = 75,
  CHAIN_DISABLED = 76,
  CARD_SELECTED = 80,
  RANDOM_SELECTED = 81,
  BECOME_TARGET = 83,
  DRAW = 90,
  DAMAGE = 91,
  RECOVER = 92,
  EQUIP = 93,
  LPUPDATE = 94,
  CARD_TARGET = 96,
  CANCEL_TARGET = 97,
  PAY_LPCOST = 100,
  ADD_COUNTER = 101,
  REMOVE_COUNTER = 102,
  ATTACK = 110,
  BATTLE = 111,
  ATTACK_DISABLED = 112,
  DAMAGE_STEP_START = 113,
  DAMAGE_STEP_END = 114,
  MISSED_EFFECT = 120,
  BE_CHAIN_TARGET = 121,
  CREATE_RELATION = 122,
  RELEASE_RELATION = 123,
  TOSS_COIN = 130,
  TOSS_DICE = 131,
  ROCK_PAPER_SCISSORS = 132,
  HAND_RES = 133,
  ANNOUNCE_RACE = 140,
  ANNOUNCE_ATTRIB = 141,
  ANNOUNCE_CARD = 142,
  ANNOUNCE_NUMBER = 143,
  CARD_HINT = 160,
  TAG_SWAP = 161,
  RELOAD_FIELD = 162,
  AI_NAME = 163,
  SHOW_HINT = 164,
  PLAYER_HINT = 165,
  MATCH_KILL = 170,
  CUSTOM_MSG = 180,
  REMOVE_CARDS = 190,
}

/** Card passcode and position. */
export interface OcgCardPos {
  code: number;
  position: OcgPosition;
}

/** Location and position. */
export interface OcgLocPos {
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
  overlay_sequence?: number;
}

/** Card passcode, location. */
export interface OcgCardLoc {
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
}

/** Card passcode, location, position. */
export interface OcgCardLocPos extends OcgCardLoc {
  position: OcgPosition;
  overlay_sequence?: number;
}

/** Card passcode, location, battle stats. */
export interface OcgCardLocBattle extends OcgLocPos {
  attack: number;
  defense: number;
  destroyed: boolean;
}

/** Card passcode, location, effect activation info. */
export interface OcgCardLocActive extends OcgCardLoc {
  description: bigint;
  client_mode: OcgEffectClientMode;
}

/** Card passcode, location, tribute info. */
export interface OcgCardLocTribute extends OcgCardLoc {
  release_param: number;
}

/** Card passcode, location, position, activation info. */
export interface OcgCardLocPosActive extends OcgCardLocPos {
  description: bigint;
  client_mode: OcgEffectClientMode;
}

/** Card passcode, location, attack info. */
export interface OcgCardLocAttack extends OcgCardLoc {
  can_direct: boolean;
}

/** Card passcode, location, counter info. */
export interface OcgCardLocCounter extends OcgCardLoc {
  count: number;
}

/** Card passcode, location, sum info */
export interface OcgCardLocSum extends OcgCardLoc {
  amount: number;
}

/** Card passcode, location, position, chain info. */
export interface OcgChain extends OcgCardLocPos {
  triggering_controller: 0 | 1;
  triggering_location: OcgLocation;
  triggering_sequence: number;
  description: bigint;
}

/** Sent when an invalid response was provided. */
export interface OcgMessageRetry {
  type: OcgMessageType.RETRY;
}

/** Additional information, usually card specific or for things that don't belong to a specific message. */
export interface OcgMessageHint {
  type: OcgMessageType.HINT;
  hint_type: OcgHintType;
  player: number;
  hint: bigint;
}

/** Provide a response. */
export interface OcgMessageWaiting {
  type: OcgMessageType.WAITING;
}

/** Duel start. */
export interface OcgMessageStart {
  type: OcgMessageType.START;
}

/** Duel win. */
export interface OcgMessageWin {
  type: OcgMessageType.WIN;
  player: number;
  reason: number;
}

/** @deprecated Not used. */
export interface OcgMessageUpdateData {
  type: OcgMessageType.UPDATE_DATA;
}

/** @deprecated Not used. */
export interface OcgMessageUpdateCard {
  type: OcgMessageType.UPDATE_CARD;
}

/** @deprecated Not used. */
export interface OcgMessageRequestDeck {
  type: OcgMessageType.REQUEST_DECK;
}

/** Available battle step actions. */
export interface OcgMessageSelectBattleCMD {
  type: OcgMessageType.SELECT_BATTLECMD;
  player: number;
  /** Activatable cards. */
  chains: OcgCardLocActive[];
  /** Cards that can attack. */
  attacks: OcgCardLocAttack[];
  /** Can go to main phase 2. */
  to_m2: boolean;
  /** Can go to end phase. */
  to_ep: boolean;
}

/** Choose a main phase (1 or 2) action. */
export interface OcgMessageSelectIdlecmd {
  type: OcgMessageType.SELECT_IDLECMD;
  player: number;
  /** Summonable cards. */
  summons: OcgCardLoc[];
  /** Special summonable cards. */
  special_summons: OcgCardLoc[];
  /** Cards that can change battle position. */
  pos_changes: OcgCardLoc[];
  /** Settable monster cards. */
  monster_sets: OcgCardLoc[];
  /** Settable spell/trap cards. */
  spell_sets: OcgCardLoc[];
  /** Activatable cards. */
  activates: OcgCardLocActive[];
  /** Can go to battle phase. */
  to_bp: boolean;
  /** Can go to end phase. */
  to_ep: boolean;
  /** Can manually shuffle. */
  shuffle: boolean;
}

/** Select a response (yes or no) to a card effect. */
export interface OcgMessageSelectEffectYN {
  type: OcgMessageType.SELECT_EFFECTYN;
  player: number;
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
  overlay_sequence?: number;
  description: bigint;
}

/** Select a response (yes or no). */
export interface OcgMessageSelectYesno {
  type: OcgMessageType.SELECT_YESNO;
  player: number;
  description: bigint;
}

/** Select an option. */
export interface OcgMessageSelectOption {
  type: OcgMessageType.SELECT_OPTION;
  player: number;
  options: bigint[];
}

/** Select a card. */
export interface OcgMessageSelectCard {
  type: OcgMessageType.SELECT_CARD;
  player: number;
  can_cancel: boolean;
  min: number;
  max: number;
  selects: OcgCardLocPos[];
}

/** Select to chain in response (if possible). */
export interface OcgMessageSelectChain {
  type: OcgMessageType.SELECT_CHAIN;
  player: number;
  spe_count: number;
  forced: boolean;
  hint_timing: OcgHintTiming;
  hint_timing_other: OcgHintTiming;
  selects: OcgCardLocPosActive[];
}

/** Select a place on the field. */
export interface OcgMessageSelectPlace {
  type: OcgMessageType.SELECT_PLACE;
  player: number;
  count: number;
  field_mask: number;
}

/** Select a possible position from the mask. */
export interface OcgMessageSelectPosition {
  type: OcgMessageType.SELECT_POSITION;
  player: number;
  code: number;
  positions: OcgPosition;
}

/** Select a list of tributes. */
export interface OcgMessageSelectTribute {
  type: OcgMessageType.SELECT_TRIBUTE;
  player: number;
  can_cancel: boolean;
  min: number;
  max: number;
  selects: OcgCardLocTribute[];
}

/** Select how to sort the chain. */
export interface OcgMessageSortChain {
  type: OcgMessageType.SORT_CHAIN;
  player: number;
  cards: OcgCardLoc[];
}

/** Select counters from cards on the field. */
export interface OcgMessageSelectCounter {
  type: OcgMessageType.SELECT_COUNTER;
  player: number;
  counter_type: number;
  count: number;
  cards: OcgCardLocCounter[];
}

/** Select a specific amount from cards. */
export interface OcgMessageSelectSum {
  type: OcgMessageType.SELECT_SUM;
  player: number;
  select_max: number;
  amount: number;
  min: number;
  max: number;
  selects_must: OcgCardLocSum[];
  selects: OcgCardLocSum[];
}

/** Select a place on the field to disable. */
export interface OcgMessageSelectDisfield {
  type: OcgMessageType.SELECT_DISFIELD;
  player: number;
  count: number;
  field_mask: number;
}

/** Select an order for the list of cards. */
export interface OcgMessageSortCard {
  type: OcgMessageType.SORT_CARD;
  player: number;
  cards: OcgCardLoc[];
}

/** Select or unselect cards until the condition is satisfied. */
export interface OcgMessageSelectUnselectCard {
  type: OcgMessageType.SELECT_UNSELECT_CARD;
  player: number;
  can_finish: boolean;
  can_cancel: boolean;
  min: number;
  max: number;
  select_cards: OcgCardLocPos[];
  unselect_cards: OcgCardLocPos[];
}

/** Confirm the list of excavated cards. */
export interface OcgMessageConfirmDeckTop {
  type: OcgMessageType.CONFIRM_DECKTOP;
  player: number;
  cards: OcgCardLoc[];
}

/** Confirm the list of cards before they go into unknown locations. */
export interface OcgMessageConfirmCards {
  type: OcgMessageType.CONFIRM_CARDS;
  player: number;
  cards: OcgCardLoc[];
}

/** Deck of player was shuffled. */
export interface OcgMessageShuffleDeck {
  type: OcgMessageType.SHUFFLE_DECK;
  player: number;
}

/** Hand of player was shuffled. */
export interface OcgMessageShuffleHand {
  type: OcgMessageType.SHUFFLE_HAND;
  player: number;
  cards: number[];
}

/** @deprecated Not used. */
export interface OcgMessageRefreshDeck {
  type: OcgMessageType.REFRESH_DECK;
}

/** Deck and grave of player were swapped. */
export interface OcgMessageSwapGraveDeck {
  type: OcgMessageType.SWAP_GRAVE_DECK;
  player: number;
  deck_size: number;
  returned_to_extra: number[];
}

export interface OcgMessageShuffleSetCard {
  type: OcgMessageType.SHUFFLE_SET_CARD;
  location: OcgLocation;
  cards: {
    from: OcgLocPos;
    to: OcgLocPos;
  }[];
}

export interface OcgMessageReverseDeck {
  type: OcgMessageType.REVERSE_DECK;
}

export interface OcgMessageDeckTop {
  type: OcgMessageType.DECK_TOP;
  player: number;
  count: number;
  code: number;
  position: OcgPosition;
  overlay_sequence?: number;
}

export interface OcgMessageShuffleExtra {
  type: OcgMessageType.SHUFFLE_EXTRA;
  player: number;
  cards: number[];
}

export interface OcgMessageNewTurn {
  type: OcgMessageType.NEW_TURN;
  player: number;
}

export interface OcgMessageNewPhase {
  type: OcgMessageType.NEW_PHASE;
  phase: OcgPhase;
}

export interface OcgMessageConfirmExtratop {
  type: OcgMessageType.CONFIRM_EXTRATOP;
  player: number;
  cards: OcgCardLoc[];
}

export interface OcgMessageMove {
  type: OcgMessageType.MOVE;
  card: number;
  from: OcgLocPos;
  to: OcgLocPos;
}

export interface OcgMessagePosChange {
  type: OcgMessageType.POS_CHANGE;
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  prev_position: OcgPosition;
  position: OcgPosition;
}

export interface OcgMessageSet {
  type: OcgMessageType.SET;
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
}

export interface OcgMessageSwap {
  type: OcgMessageType.SWAP;
  card1: OcgCardLocPos;
  card2: OcgCardLocPos;
}

export interface OcgMessageFieldDisabled {
  type: OcgMessageType.FIELD_DISABLED;
  field_mask: number;
}

export interface OcgMessageSummoning {
  type: OcgMessageType.SUMMONING;
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
}

export interface OcgMessageSummoned {
  type: OcgMessageType.SUMMONED;
}

export interface OcgMessageSpsummoning {
  type: OcgMessageType.SPSUMMONING;
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
}

export interface OcgMessageSpsummoned {
  type: OcgMessageType.SPSUMMONED;
}

export interface OcgMessageFlipsummoning {
  type: OcgMessageType.FLIPSUMMONING;
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
}

export interface OcgMessageFlipsummoned {
  type: OcgMessageType.FLIPSUMMONED;
}

export interface OcgMessageChaining {
  type: OcgMessageType.CHAINING;
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
  overlay_sequence?: number;
  triggering_controller: 0 | 1;
  triggering_location: OcgLocation;
  triggering_sequence: number;
  description: bigint;
  chain_size: number;
}

export interface OcgMessageChained {
  type: OcgMessageType.CHAINED;
  chain_size: number;
}

export interface OcgMessageChainSolving {
  type: OcgMessageType.CHAIN_SOLVING;
  chain_size: number;
}

export interface OcgMessageChainSolved {
  type: OcgMessageType.CHAIN_SOLVED;
  chain_size: number;
}

export interface OcgMessageChainEnd {
  type: OcgMessageType.CHAIN_END;
}

export interface OcgMessageChainNegated {
  type: OcgMessageType.CHAIN_NEGATED;
  chain_size: number;
}

export interface OcgMessageChainDisabled {
  type: OcgMessageType.CHAIN_DISABLED;
  chain_size: number;
}

export interface OcgMessageCardSelected {
  type: OcgMessageType.CARD_SELECTED;
  cards: OcgLocPos[];
}

export interface OcgMessageRandomSelected {
  type: OcgMessageType.RANDOM_SELECTED;
  player: number;
  cards: OcgLocPos[];
}

export interface OcgMessageBecomeTarget {
  type: OcgMessageType.BECOME_TARGET;
  cards: OcgLocPos[];
}

export interface OcgMessageDraw {
  type: OcgMessageType.DRAW;
  player: number;
  drawn: {
    code: number;
    position: OcgPosition;
  }[];
}

export interface OcgMessageDamage {
  type: OcgMessageType.DAMAGE;
  player: number;
  amount: number;
}

export interface OcgMessageRecover {
  type: OcgMessageType.RECOVER;
  player: number;
  amount: number;
}

export interface OcgMessageEquip {
  type: OcgMessageType.EQUIP;
  card: OcgLocPos;
  target: OcgLocPos;
}

export interface OcgMessageLPUpdate {
  type: OcgMessageType.LPUPDATE;
  player: number;
  lp: number;
}

export interface OcgMessageCardTarget {
  type: OcgMessageType.CARD_TARGET;
  card: OcgLocPos;
  target: OcgLocPos;
}

export interface OcgMessageCancelTarget {
  type: OcgMessageType.CANCEL_TARGET;
  card: OcgLocPos;
  target: OcgLocPos;
}

export interface OcgMessagePayLPCost {
  type: OcgMessageType.PAY_LPCOST;
  player: number;
  amount: number;
}

export interface OcgMessageAddCounter {
  type: OcgMessageType.ADD_COUNTER;
  counter_type: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  count: number;
}

export interface OcgMessageRemoveCounter {
  type: OcgMessageType.REMOVE_COUNTER;
  counter_type: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  count: number;
}

export interface OcgMessageAttack {
  type: OcgMessageType.ATTACK;
  card: OcgLocPos;
  target: OcgLocPos | null;
}

export interface OcgMessageBattle {
  type: OcgMessageType.BATTLE;
  card: OcgCardLocBattle;
  target: OcgCardLocBattle | null;
}

export interface OcgMessageAttackDisabled {
  type: OcgMessageType.ATTACK_DISABLED;
}

export interface OcgMessageDamageStepStart {
  type: OcgMessageType.DAMAGE_STEP_START;
}

export interface OcgMessageDamageStepEnd {
  type: OcgMessageType.DAMAGE_STEP_END;
}

export interface OcgMessageMissedEffect {
  type: OcgMessageType.MISSED_EFFECT;
  code: number;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
  overlay_sequence?: number;
}

export interface OcgMessageBeChainTarget {
  type: OcgMessageType.BE_CHAIN_TARGET;
}

export interface OcgMessageCreateRelation {
  type: OcgMessageType.CREATE_RELATION;
}

export interface OcgMessageReleaseRelation {
  type: OcgMessageType.RELEASE_RELATION;
}

export interface OcgMessageTossCoin {
  type: OcgMessageType.TOSS_COIN;
  player: number;
  results: boolean[];
}

export interface OcgMessageTossDice {
  type: OcgMessageType.TOSS_DICE;
  player: number;
  results: number[];
}

export interface OcgMessageRockPaperScissors {
  type: OcgMessageType.ROCK_PAPER_SCISSORS;
  player: number;
}

export interface OcgMessageHandRes {
  type: OcgMessageType.HAND_RES;
  results: readonly [OcgRPS, OcgRPS];
}

export interface OcgMessageAnnounceRace {
  type: OcgMessageType.ANNOUNCE_RACE;
  player: number;
  count: number;
  available: OcgRace;
}

export interface OcgMessageAnnounceAttrib {
  type: OcgMessageType.ANNOUNCE_ATTRIB;
  player: number;
  count: number;
  available: OcgAttribute;
}

export interface OcgMessageAnnounceCard {
  type: OcgMessageType.ANNOUNCE_CARD;
  player: number;
  opcodes: OcgOpCode[];
}

export interface OcgMessageAnnounceNumber {
  type: OcgMessageType.ANNOUNCE_NUMBER;
  player: number;
  options: bigint[];
}

export interface OcgMessageCardHint {
  type: OcgMessageType.CARD_HINT;
  controller: 0 | 1;
  location: OcgLocation;
  sequence: number;
  position: OcgPosition;
  overlay_sequence?: number;
  card_hint: OcgCardHintType;
  description: bigint;
}

export interface OcgMessageTagSwap {
  type: OcgMessageType.TAG_SWAP;
  player: number;
  deck_size: number;
  extra_faceup_count: number;
  deck_top_card: number | null;
  hand: OcgCardPos[];
  extra: OcgCardPos[];
}

export interface OcgFieldCard {
  position: OcgPosition;
  materials: number;
}

export interface OcgFieldPlayer {
  monsters: [
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard
  ];
  spells: [
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard,
    OcgFieldCard
  ];
  deck_size: number;
  hand_size: number;
  grave_size: number;
  banish_size: number;
  extra_size: number;
  extra_faceup_count: number;
}

export type OcgFieldState = {
  flags: OcgDuelMode;
  players: [OcgFieldPlayer, OcgFieldPlayer];
  chain: OcgChain[];
};

export interface OcgMessageReloadField extends OcgFieldState {
  type: OcgMessageType.RELOAD_FIELD;
}

export interface OcgMessageAiName {
  type: OcgMessageType.AI_NAME;
  name: string;
}

export interface OcgMessageShowHint {
  type: OcgMessageType.SHOW_HINT;
  hint: string;
}

export interface OcgMessagePlayerHint {
  type: OcgMessageType.PLAYER_HINT;
  player: number;
  player_hint: OcgPlayerHintType;
  description: bigint;
}

export interface OcgMessageMatchKill {
  type: OcgMessageType.MATCH_KILL;
  card: number;
}

export interface OcgMessageCustomMsg {
  type: OcgMessageType.CUSTOM_MSG;
}

export interface OcgMessageRemoveCards {
  type: OcgMessageType.REMOVE_CARDS;
  cards: OcgLocPos[];
}

export type OcgMessage =
  | OcgMessageRetry
  | OcgMessageHint
  | OcgMessageWaiting
  | OcgMessageStart
  | OcgMessageWin
  | OcgMessageUpdateData
  | OcgMessageUpdateCard
  | OcgMessageRequestDeck
  | OcgMessageSelectBattleCMD
  | OcgMessageSelectIdlecmd
  | OcgMessageSelectEffectYN
  | OcgMessageSelectYesno
  | OcgMessageSelectOption
  | OcgMessageSelectCard
  | OcgMessageSelectChain
  | OcgMessageSelectPlace
  | OcgMessageSelectPosition
  | OcgMessageSelectTribute
  | OcgMessageSortChain
  | OcgMessageSelectCounter
  | OcgMessageSelectSum
  | OcgMessageSelectDisfield
  | OcgMessageSortCard
  | OcgMessageSelectUnselectCard
  | OcgMessageConfirmDeckTop
  | OcgMessageConfirmCards
  | OcgMessageShuffleDeck
  | OcgMessageShuffleHand
  | OcgMessageRefreshDeck
  | OcgMessageSwapGraveDeck
  | OcgMessageShuffleSetCard
  | OcgMessageReverseDeck
  | OcgMessageDeckTop
  | OcgMessageShuffleExtra
  | OcgMessageNewTurn
  | OcgMessageNewPhase
  | OcgMessageConfirmExtratop
  | OcgMessageMove
  | OcgMessagePosChange
  | OcgMessageSet
  | OcgMessageSwap
  | OcgMessageFieldDisabled
  | OcgMessageSummoning
  | OcgMessageSummoned
  | OcgMessageSpsummoning
  | OcgMessageSpsummoned
  | OcgMessageFlipsummoning
  | OcgMessageFlipsummoned
  | OcgMessageChaining
  | OcgMessageChained
  | OcgMessageChainSolving
  | OcgMessageChainSolved
  | OcgMessageChainEnd
  | OcgMessageChainNegated
  | OcgMessageChainDisabled
  | OcgMessageCardSelected
  | OcgMessageRandomSelected
  | OcgMessageBecomeTarget
  | OcgMessageDraw
  | OcgMessageDamage
  | OcgMessageRecover
  | OcgMessageEquip
  | OcgMessageLPUpdate
  | OcgMessageCardTarget
  | OcgMessageCancelTarget
  | OcgMessagePayLPCost
  | OcgMessageAddCounter
  | OcgMessageRemoveCounter
  | OcgMessageAttack
  | OcgMessageBattle
  | OcgMessageAttackDisabled
  | OcgMessageDamageStepStart
  | OcgMessageDamageStepEnd
  | OcgMessageMissedEffect
  | OcgMessageBeChainTarget
  | OcgMessageCreateRelation
  | OcgMessageReleaseRelation
  | OcgMessageTossCoin
  | OcgMessageTossDice
  | OcgMessageRockPaperScissors
  | OcgMessageHandRes
  | OcgMessageAnnounceRace
  | OcgMessageAnnounceAttrib
  | OcgMessageAnnounceCard
  | OcgMessageAnnounceNumber
  | OcgMessageCardHint
  | OcgMessageTagSwap
  | OcgMessageReloadField
  | OcgMessageAiName
  | OcgMessageShowHint
  | OcgMessagePlayerHint
  | OcgMessageMatchKill
  | OcgMessageCustomMsg
  | OcgMessageRemoveCards;
