import { OcgOpCode } from "./opcodes";
import {
    OcgAttribute,
    OcgDuelMode,
    OcgLocation,
    OcgPosition,
    OcgRace,
    OcgRPS,
} from "./type_core";

export enum OcgEffectClientMode {
    NORMAL = 0,
    RESOLVE = 1,
    RESET = 2,
}

export enum OcgMessageCardHintType {
    TURN = 1,
    CARD = 2,
    RACE = 3,
    ATTRIBUTE = 4,
    NUMBER = 5,
    DESC_ADD = 6,
    DESC_REMOVE = 7,
}

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
    UNEQUIP = 95,
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
export interface OcgCardPos {
    code: number;
    position: OcgPosition;
}
export interface OcgLocPos {
    controller: number;
    location: OcgLocation;
    sequence: number;
    // if location & OcgCardLocation.OVERLAY, then this is actually xyz material sequence
    position: number;
}
export interface OcgCardLoc {
    code: number;
    controller: number;
    location: OcgLocation;
    sequence: number;
}
export interface OcgCardLocPos extends OcgCardLoc {
    // if location & OcgCardLocation.OVERLAY, then this is actually xyz material sequence
    position: number;
}
export interface OcgCardLocBattle extends OcgCardLoc {
    position: OcgPosition;
    attack: number;
    defense: number;
    destroyed: boolean;
}
export interface OcgCardLocActive extends OcgCardLoc {
    description: bigint;
    client_mode: OcgEffectClientMode;
}
export interface OcgCardLocTribute extends OcgCardLoc {
    release_param: number;
}
export interface OcgCardLocPosActive extends OcgCardLocPos {
    description: bigint;
    client_mode: OcgEffectClientMode;
}
export interface OcgCardLocAttack extends OcgCardLoc {
    can_direct: boolean;
}
export interface OcgCardLocCounter extends OcgCardLoc {
    count: number;
}
export interface OcgCardLocSum extends OcgCardLoc {
    amount: number;
}
export interface OcgChain extends OcgCardLocPos {
    triggering_controller: number;
    triggering_location: OcgLocation;
    triggering_sequence: number;
    description: bigint;
}

export interface OcgMessageRetry {
    type: OcgMessageType.RETRY;
}
export interface OcgMessageHint {
    type: OcgMessageType.HINT;
    hint_type: number;
    player: number;
    hint: bigint;
}
export interface OcgMessageWaiting {
    type: OcgMessageType.WAITING;
}
export interface OcgMessageStart {
    type: OcgMessageType.START;
}
export interface OcgMessageWin {
    type: OcgMessageType.WIN;
    player: number;
    reason: number;
}
export interface OcgMessageUpdateData {
    type: OcgMessageType.UPDATE_DATA;
}
export interface OcgMessageUpdateCard {
    type: OcgMessageType.UPDATE_CARD;
}
export interface OcgMessageRequestDeck {
    type: OcgMessageType.REQUEST_DECK;
}
export interface OcgMessageSelectBattleCMD {
    type: OcgMessageType.SELECT_BATTLECMD;
    player: number;
    chains: OcgCardLocActive[];
    attacks: OcgCardLocAttack[];
    to_m2: boolean;
    to_ep: boolean;
}
export interface OcgMessageSelectIdlecmd {
    type: OcgMessageType.SELECT_IDLECMD;
    player: number;
    summons: OcgCardLoc[];
    special_summons: OcgCardLoc[];
    pos_changes: OcgCardLoc[];
    monster_sets: OcgCardLoc[];
    spell_sets: OcgCardLoc[];
    activates: OcgCardLocActive[];
    to_bp: boolean;
    to_ep: boolean;
    shuffle: boolean;
}
export interface OcgMessageSelectEffectYN {
    type: OcgMessageType.SELECT_EFFECTYN;
    player: number;
    code: number;
    controller: number;
    location: OcgLocation;
    sequence: number;
    position: OcgPosition;
    description: bigint;
}
export interface OcgMessageSelectYesno {
    type: OcgMessageType.SELECT_YESNO;
    player: number;
    description: bigint;
}
export interface OcgMessageSelectOption {
    type: OcgMessageType.SELECT_OPTION;
    player: number;
    options: bigint[];
}
export interface OcgMessageSelectCard {
    type: OcgMessageType.SELECT_CARD;
    player: number;
    can_cancel: boolean;
    min: number;
    max: number;
    selects: OcgCardLocPos[];
}
export interface OcgMessageSelectChain {
    type: OcgMessageType.SELECT_CHAIN;
    player: number;
    spe_count: number;
    forced: boolean;
    hint_timing: number;
    hint_timing_other: number;
    selects: OcgCardLocPosActive;
}
export interface OcgMessageSelectPlace {
    type: OcgMessageType.SELECT_PLACE;
    player: number;
    count: number;
    field_mask: number;
}
export interface OcgMessageSelectPosition {
    type: OcgMessageType.SELECT_POSITION;
    player: number;
    code: number;
    positions: OcgPosition;
}
export interface OcgMessageSelectTribute {
    type: OcgMessageType.SELECT_TRIBUTE;
    player: number;
    can_cancel: boolean;
    min: number;
    max: number;
    selects: OcgCardLocTribute[];
}
export interface OcgMessageSortChain {
    type: OcgMessageType.SORT_CHAIN;
    player: number;
    cards: OcgCardLoc[];
}
export interface OcgMessageSelectCounter {
    type: OcgMessageType.SELECT_COUNTER;
    counter_type: number;
    count: number;
    cards: OcgCardLocCounter[];
}
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
export interface OcgMessageSelectDisfield {
    type: OcgMessageType.SELECT_DISFIELD;
    player: number;
    count: number;
    field_mask: number;
}
export interface OcgMessageSortCard {
    type: OcgMessageType.SORT_CARD;
    player: number;
    cards: OcgCardLoc;
}
export interface OcgMessageSelectUnselectCard {
    type: OcgMessageType.SELECT_UNSELECT_CARD;
    player: number;
    can_finish: boolean;
    can_cancel: boolean;
    min: number;
    max: number;
    select_cards: OcgCardLocPos;
}
export interface OcgMessageConfirmDeckTop {
    type: OcgMessageType.CONFIRM_DECKTOP;
    player: number;
    cards: OcgCardLoc[];
}
export interface OcgMessageConfirmCards {
    type: OcgMessageType.CONFIRM_CARDS;
    player: number;
    cards: OcgCardLoc[];
}
export interface OcgMessageShuffleDeck {
    type: OcgMessageType.SHUFFLE_DECK;
    player: number;
}
export interface OcgMessageShuffleHand {
    type: OcgMessageType.SHUFFLE_HAND;
    player: number;
    cards: number[];
}
export interface OcgMessageRefreshDeck {
    type: OcgMessageType.REFRESH_DECK;
}
export interface OcgMessageSwapGraveDeck {
    type: OcgMessageType.SWAP_GRAVE_DECK;
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
    phase: number;
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
    controller: number;
    location: OcgLocation;
    sequence: number;
    prev_position: OcgPosition;
    position: OcgPosition;
}
export interface OcgMessageSet {
    type: OcgMessageType.SET;
    code: number;
    controller: number;
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
    controller: number;
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
    controller: number;
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
    controller: number;
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
    controller: number;
    location: OcgLocation;
    sequence: number;
    position: number;
    triggering_controller: number;
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
    cards: OcgCardLoc[];
}
export interface OcgMessageRandomSelected {
    type: OcgMessageType.RANDOM_SELECTED;
    player: number;
    cards: OcgCardLoc[];
}
export interface OcgMessageBecomeTarget {
    type: OcgMessageType.BECOME_TARGET;
    cards: OcgCardLoc[];
}
export interface OcgMessageDraw {
    type: OcgMessageType.DRAW;
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
    card: OcgLocPos[];
    target: OcgLocPos[];
}
export interface OcgMessageLPUpdate {
    type: OcgMessageType.LPUPDATE;
    player: number;
    lp: number;
}
export interface OcgMessageUnequip {
    type: OcgMessageType.UNEQUIP;
}
export interface OcgMessageCardTarget {
    type: OcgMessageType.CARD_TARGET;
    card: OcgLocPos[];
    target: OcgLocPos[];
}
export interface OcgMessageCancelTarget {
    type: OcgMessageType.CANCEL_TARGET;
    card: OcgLocPos[];
    target: OcgLocPos[];
}
export interface OcgMessagePayLPCost {
    type: OcgMessageType.PAY_LPCOST;
    player: number;
    amount: number;
}
export interface OcgMessageAddCounter {
    type: OcgMessageType.ADD_COUNTER;
    counter_type: number;
    controller: number;
    location: number;
    sequence: number;
    count: number;
}
export interface OcgMessageRemoveCounter {
    type: OcgMessageType.REMOVE_COUNTER;
    counter_type: number;
    controller: number;
    location: number;
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
    controller: number;
    location: OcgLocation;
    sequence: number;
    position: number;
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
    results: boolean[];
}
export interface OcgMessageTossDice {
    type: OcgMessageType.TOSS_DICE;
    results: number[];
}
export interface OcgMessageRockPaperScissors {
    type: OcgMessageType.ROCK_PAPER_SCISSORS;
    player: number;
}
export interface OcgMessageHandRes {
    type: OcgMessageType.HAND_RES;
    results: [OcgRPS, OcgRPS];
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
    options: number[];
}
export interface OcgMessageCardHint {
    type: OcgMessageType.CARD_HINT;
    controller: number;
    location: OcgLocation;
    sequence: number;
    position: number;
    card_hint: OcgMessageCardHintType;
    description: bigint;
}
export interface OcgMessageTagSwap {
    type: OcgMessageType.TAG_SWAP;
    flags: OcgDuelMode;
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
export interface OcgMessageReloadField {
    type: OcgMessageType.RELOAD_FIELD;
    players: [OcgFieldPlayer, OcgFieldPlayer];
    chain: OcgChain[];
}
export interface OcgMessageAiName {
    type: OcgMessageType.AI_NAME;
}
export interface OcgMessageShowHint {
    type: OcgMessageType.SHOW_HINT;
}
export interface OcgMessagePlayerHint {
    type: OcgMessageType.PLAYER_HINT;
    player: number;
    player_hint: number;
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
    | OcgMessageUnequip
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

export const messageTypeStrings: { [k in OcgMessageType]: string } = {
    [OcgMessageType.RETRY]: "retry",
    [OcgMessageType.HINT]: "hint",
    [OcgMessageType.WAITING]: "waiting",
    [OcgMessageType.START]: "start",
    [OcgMessageType.WIN]: "win",
    [OcgMessageType.UPDATE_DATA]: "update_data",
    [OcgMessageType.UPDATE_CARD]: "update_card",
    [OcgMessageType.REQUEST_DECK]: "request_deck",
    [OcgMessageType.SELECT_BATTLECMD]: "select_battlecmd",
    [OcgMessageType.SELECT_IDLECMD]: "select_idlecmd",
    [OcgMessageType.SELECT_EFFECTYN]: "select_effectyn",
    [OcgMessageType.SELECT_YESNO]: "select_yesno",
    [OcgMessageType.SELECT_OPTION]: "select_option",
    [OcgMessageType.SELECT_CARD]: "select_card",
    [OcgMessageType.SELECT_CHAIN]: "select_chain",
    [OcgMessageType.SELECT_PLACE]: "select_place",
    [OcgMessageType.SELECT_POSITION]: "select_position",
    [OcgMessageType.SELECT_TRIBUTE]: "select_tribute",
    [OcgMessageType.SORT_CHAIN]: "sort_chain",
    [OcgMessageType.SELECT_COUNTER]: "select_counter",
    [OcgMessageType.SELECT_SUM]: "select_sum",
    [OcgMessageType.SELECT_DISFIELD]: "select_disfield",
    [OcgMessageType.SORT_CARD]: "sort_card",
    [OcgMessageType.SELECT_UNSELECT_CARD]: "select_unselect_card",
    [OcgMessageType.CONFIRM_DECKTOP]: "confirm_decktop",
    [OcgMessageType.CONFIRM_CARDS]: "confirm_cards",
    [OcgMessageType.SHUFFLE_DECK]: "shuffle_deck",
    [OcgMessageType.SHUFFLE_HAND]: "shuffle_hand",
    [OcgMessageType.REFRESH_DECK]: "refresh_deck",
    [OcgMessageType.SWAP_GRAVE_DECK]: "swap_grave_deck",
    [OcgMessageType.SHUFFLE_SET_CARD]: "shuffle_set_card",
    [OcgMessageType.REVERSE_DECK]: "reverse_deck",
    [OcgMessageType.DECK_TOP]: "deck_top",
    [OcgMessageType.SHUFFLE_EXTRA]: "shuffle_extra",
    [OcgMessageType.NEW_TURN]: "new_turn",
    [OcgMessageType.NEW_PHASE]: "new_phase",
    [OcgMessageType.CONFIRM_EXTRATOP]: "confirm_extratop",
    [OcgMessageType.MOVE]: "move",
    [OcgMessageType.POS_CHANGE]: "pos_change",
    [OcgMessageType.SET]: "set",
    [OcgMessageType.SWAP]: "swap",
    [OcgMessageType.FIELD_DISABLED]: "field_disabled",
    [OcgMessageType.SUMMONING]: "summoning",
    [OcgMessageType.SUMMONED]: "summoned",
    [OcgMessageType.SPSUMMONING]: "spsummoning",
    [OcgMessageType.SPSUMMONED]: "spsummoned",
    [OcgMessageType.FLIPSUMMONING]: "flipsummoning",
    [OcgMessageType.FLIPSUMMONED]: "flipsummoned",
    [OcgMessageType.CHAINING]: "chaining",
    [OcgMessageType.CHAINED]: "chained",
    [OcgMessageType.CHAIN_SOLVING]: "chain_solving",
    [OcgMessageType.CHAIN_SOLVED]: "chain_solved",
    [OcgMessageType.CHAIN_END]: "chain_end",
    [OcgMessageType.CHAIN_NEGATED]: "chain_negated",
    [OcgMessageType.CHAIN_DISABLED]: "chain_disabled",
    [OcgMessageType.CARD_SELECTED]: "card_selected",
    [OcgMessageType.RANDOM_SELECTED]: "random_selected",
    [OcgMessageType.BECOME_TARGET]: "become_target",
    [OcgMessageType.DRAW]: "draw",
    [OcgMessageType.DAMAGE]: "damage",
    [OcgMessageType.RECOVER]: "recover",
    [OcgMessageType.EQUIP]: "equip",
    [OcgMessageType.LPUPDATE]: "lpupdate",
    [OcgMessageType.UNEQUIP]: "unequip",
    [OcgMessageType.CARD_TARGET]: "card_target",
    [OcgMessageType.CANCEL_TARGET]: "cancel_target",
    [OcgMessageType.PAY_LPCOST]: "pay_lpcost",
    [OcgMessageType.ADD_COUNTER]: "add_counter",
    [OcgMessageType.REMOVE_COUNTER]: "remove_counter",
    [OcgMessageType.ATTACK]: "attack",
    [OcgMessageType.BATTLE]: "battle",
    [OcgMessageType.ATTACK_DISABLED]: "attack_disabled",
    [OcgMessageType.DAMAGE_STEP_START]: "damage_step_start",
    [OcgMessageType.DAMAGE_STEP_END]: "damage_step_end",
    [OcgMessageType.MISSED_EFFECT]: "missed_effect",
    [OcgMessageType.BE_CHAIN_TARGET]: "be_chain_target",
    [OcgMessageType.CREATE_RELATION]: "create_relation",
    [OcgMessageType.RELEASE_RELATION]: "release_relation",
    [OcgMessageType.TOSS_COIN]: "toss_coin",
    [OcgMessageType.TOSS_DICE]: "toss_dice",
    [OcgMessageType.ROCK_PAPER_SCISSORS]: "rock_paper_scissors",
    [OcgMessageType.HAND_RES]: "hand_res",
    [OcgMessageType.ANNOUNCE_RACE]: "announce_race",
    [OcgMessageType.ANNOUNCE_ATTRIB]: "announce_attrib",
    [OcgMessageType.ANNOUNCE_CARD]: "announce_card",
    [OcgMessageType.ANNOUNCE_NUMBER]: "announce_number",
    [OcgMessageType.CARD_HINT]: "card_hint",
    [OcgMessageType.TAG_SWAP]: "tag_swap",
    [OcgMessageType.RELOAD_FIELD]: "reload_field",
    [OcgMessageType.AI_NAME]: "ai_name",
    [OcgMessageType.SHOW_HINT]: "show_hint",
    [OcgMessageType.PLAYER_HINT]: "player_hint",
    [OcgMessageType.MATCH_KILL]: "match_kill",
    [OcgMessageType.CUSTOM_MSG]: "custom_msg",
    [OcgMessageType.REMOVE_CARDS]: "remove_cards",
};
