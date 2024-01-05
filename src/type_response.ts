import { makeMap } from "./internal/utils";
import { OcgAttribute, OcgLocation, OcgPosition, OcgRace } from "./type_core";

export enum OcgResponseType {
  SELECT_BATTLECMD,
  SELECT_IDLECMD,
  SELECT_EFFECTYN,
  SELECT_YESNO,
  SELECT_OPTION,
  SELECT_CARD,
  SELECT_CARD_CODES,
  SELECT_UNSELECT_CARD,
  SELECT_CHAIN,
  SELECT_DISFIELD,
  SELECT_PLACE,
  SELECT_POSITION,
  SELECT_TRIBUTE,
  SELECT_COUNTER,
  SELECT_SUM,
  SORT_CARD,
  ANNOUNCE_RACE,
  ANNOUNCE_ATTRIB,
  ANNOUNCE_CARD,
  ANNOUNCE_NUMBER,
  ROCK_PAPER_SCISSORS,
}

export enum SelectBattleCMDAction {
  SELECT_CHAIN,
  SELECT_BATTLE,
  TO_M2,
  TO_EP,
}

export type OcgResponseSelectBattleCMD = {
  type: OcgResponseType.SELECT_BATTLECMD;
  action: SelectBattleCMDAction;
  index?: number;
};

export enum SelectIdleCMDAction {
  SELECT_SUMMON,
  SELECT_SPECIAL_SUMMON,
  SELECT_POS_CHANGE,
  SELECT_MONSTER_SET,
  SELECT_SPELL_SET,
  SELECT_ACTIVATE,
  TO_BP,
  TO_EP,
  SHUFFLE,
}

export type OcgResponseSelectIdleCMD = {
  type: OcgResponseType.SELECT_IDLECMD;
  action: SelectIdleCMDAction;
  index?: number;
};

export type OcgResponseSelectEffectYN = {
  type: OcgResponseType.SELECT_EFFECTYN;
  yes: boolean;
};

export type OcgResponseSelectYesNo = {
  type: OcgResponseType.SELECT_YESNO;
  yes: boolean;
};

export type OcgResponseSelectOption = {
  type: OcgResponseType.SELECT_OPTION;
  index: number;
};

export type OcgResponseSelectCard = {
  type: OcgResponseType.SELECT_CARD;
  indicies: number[] | null;
};

export type OcgResponseSelectCardCodes = {
  type: OcgResponseType.SELECT_CARD_CODES;
  codes: number[] | null;
};

export type OcgResponseSelectUnselectCard = {
  type: OcgResponseType.SELECT_UNSELECT_CARD;
  index: number | null;
  // null means cancel,
  // represents select_cards[index] if index >= select_cards.length,
  // otherwise it's unselect_cards[index - select_cards.length]
};

export type SelectFieldPlace = {
  player: number;
  location: OcgLocation;
  sequence: number;
};

export type OcgResponseSelectChain = {
  type: OcgResponseType.SELECT_CHAIN;
} & ({ cancel: true; index?: never } | { cancel?: false; index: number });

export type OcgResponseSelectDisfield = {
  type: OcgResponseType.SELECT_DISFIELD;
  places: SelectFieldPlace[];
};

export type OcgResponseSelectPlace = {
  type: OcgResponseType.SELECT_PLACE;
  places: SelectFieldPlace[];
};

export type OcgResponseSelectPosition = {
  type: OcgResponseType.SELECT_POSITION;
  position: OcgPosition;
};

export type OcgResponseSelectTribute = {
  type: OcgResponseType.SELECT_TRIBUTE;
  indicies?: number[];
};

export type OcgResponseSelectCounter = {
  type: OcgResponseType.SELECT_COUNTER;
  counters: number[];
};

export type OcgResponseSelectSum = {
  type: OcgResponseType.SELECT_SUM;
  indicies: number[];
};

export type OcgResponseSortCard = {
  type: OcgResponseType.SORT_CARD;
  order: number[] | null;
};

export type OcgResponseAnnounceRace = {
  type: OcgResponseType.ANNOUNCE_RACE;
  races: OcgRace[];
};

export type OcgResponseAnnounceAttrib = {
  type: OcgResponseType.ANNOUNCE_ATTRIB;
  attributes: OcgAttribute[];
};

export type OcgResponseAnnounceCard = {
  type: OcgResponseType.ANNOUNCE_CARD;
  card: number;
};

export type OcgResponseAnnounceNumber = {
  type: OcgResponseType.ANNOUNCE_NUMBER;
  value: number;
};

export type OcgResponseRockPaperScissors = {
  type: OcgResponseType.ROCK_PAPER_SCISSORS;
  value: 1 | 2 | 3;
};

export type OcgResponse =
  | OcgResponseSelectBattleCMD
  | OcgResponseSelectIdleCMD
  | OcgResponseSelectEffectYN
  | OcgResponseSelectYesNo
  | OcgResponseSelectOption
  | OcgResponseSelectCard
  | OcgResponseSelectCardCodes
  | OcgResponseSelectUnselectCard
  | OcgResponseSelectChain
  | OcgResponseSelectDisfield
  | OcgResponseSelectPlace
  | OcgResponseSelectPosition
  | OcgResponseSelectCounter
  | OcgResponseSelectSum
  | OcgResponseSelectTribute
  | OcgResponseSortCard
  | OcgResponseAnnounceRace
  | OcgResponseAnnounceAttrib
  | OcgResponseAnnounceCard
  | OcgResponseAnnounceNumber
  | OcgResponseRockPaperScissors;

export const responseTypeStrings = makeMap([
  [OcgResponseType.SELECT_BATTLECMD, "select_battlecmd"],
  [OcgResponseType.SELECT_IDLECMD, "select_idlecmd"],
  [OcgResponseType.SELECT_EFFECTYN, "select_effectyn"],
  [OcgResponseType.SELECT_YESNO, "select_yesno"],
  [OcgResponseType.SELECT_OPTION, "select_option"],
  [OcgResponseType.SELECT_CARD, "select_card"],
  [OcgResponseType.SELECT_CARD_CODES, "select_card_codes"],
  [OcgResponseType.SELECT_UNSELECT_CARD, "select_unselect_card"],
  [OcgResponseType.SELECT_CHAIN, "select_chain"],
  [OcgResponseType.SELECT_DISFIELD, "select_disfield"],
  [OcgResponseType.SELECT_PLACE, "select_place"],
  [OcgResponseType.SELECT_POSITION, "select_position"],
  [OcgResponseType.SELECT_TRIBUTE, "select_tribute"],
  [OcgResponseType.SELECT_COUNTER, "select_counter"],
  [OcgResponseType.SELECT_SUM, "select_sum"],
  [OcgResponseType.SORT_CARD, "sort_card"],
  [OcgResponseType.ANNOUNCE_RACE, "announce_race"],
  [OcgResponseType.ANNOUNCE_ATTRIB, "announce_attrib"],
  [OcgResponseType.ANNOUNCE_CARD, "announce_card"],
  [OcgResponseType.ANNOUNCE_NUMBER, "announce_number"],
  [OcgResponseType.ROCK_PAPER_SCISSORS, "rock_paper_scissors"],
]);

export const selectBattleCMDActionStrings = makeMap([
  [SelectBattleCMDAction.SELECT_CHAIN, "select_chain"],
  [SelectBattleCMDAction.SELECT_BATTLE, "select_battle"],
  [SelectBattleCMDAction.TO_M2, "to_m2"],
  [SelectBattleCMDAction.TO_EP, "to_ep"],
]);

export const selectIdleCMDActionStrings = makeMap([
  [SelectIdleCMDAction.SELECT_SUMMON, "select_summon"],
  [SelectIdleCMDAction.SELECT_SPECIAL_SUMMON, "select_special_summon"],
  [SelectIdleCMDAction.SELECT_POS_CHANGE, "select_pos_change"],
  [SelectIdleCMDAction.SELECT_MONSTER_SET, "select_monster_set"],
  [SelectIdleCMDAction.SELECT_SPELL_SET, "select_spell_set"],
  [SelectIdleCMDAction.SELECT_ACTIVATE, "select_activate"],
  [SelectIdleCMDAction.TO_BP, "to_bp"],
  [SelectIdleCMDAction.TO_EP, "to_ep"],
  [SelectIdleCMDAction.SHUFFLE, "shuffle"],
]);
